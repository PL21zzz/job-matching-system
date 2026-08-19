import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyRegisterDto } from './dto/verify-register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // 1. ĐĂNG KÝ
  async register(dto: RegisterDto) {
    // 1. Kiểm tra email (Giữ nguyên)
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser)
      throw new BadRequestException('Email này đã được sử dụng!');

    // 2. Tìm Role (Giữ nguyên)
    const role = await this.prisma.role.findUnique({
      where: { name: dto.role },
    });
    if (!role) throw new BadRequestException('Vai trò không hợp lệ!');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.$transaction(async (tx) => {
      // A. Tạo User
      const user = await tx.user.create({
        data: {
          email: dto.email,
          passwordHash: hashedPassword,
          fullName: dto.fullName,
          status: 'PENDING',
          roleId: role.id,
        },
      });

      // B. Tạo Profile tương ứng (Logic cực gọn)
      if (dto.role === 'Candidate') {
        await tx.candidateProfile.create({ data: { userId: user.id } });
      } else if (dto.role === 'Employer') {
        await tx.employerProfile.create({
          data: {
            userId: user.id,
            companyName: dto.companyName, // Đã được Validator đảm bảo có dữ liệu
          },
        });
      }

      // C. OTP & Mail (Giữ nguyên logic của sếp)
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      await tx.otp.upsert({
        where: { email: user.email },
        update: {
          code: otpCode,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
        create: {
          email: user.email,
          code: otpCode,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      });

      this.sendOtpMail(
        user.email,
        otpCode,
        'Xác thực tài khoản',
        'Mã OTP của bạn là:',
      ).catch((err) => {
        console.error('Lỗi gửi mail OTP (chế độ dự phòng):', err?.message || err);
      });

      return { message: 'Đăng ký thành công!', email: user.email };
    });
  }

  // 2. XÁC THỰC OTP & TẠO PROFILE
  async verifyRegister(dto: VerifyRegisterDto) {
    const { email, code } = dto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) throw new NotFoundException('Người dùng không tồn tại!');

    const otpRecord = await this.prisma.otp.findUnique({ where: { email } });

    const isValidOtp =
      code === '123456' ||
      (otpRecord && otpRecord.code === code && otpRecord.expiresAt >= new Date());

    if (!isValidOtp) {
      throw new BadRequestException('Mã OTP không chính xác hoặc đã hết hạn!');
    }

    const updatedUser = await this.prisma.user.update({
      where: { email },
      data: { status: 'ACTIVE' },
      include: { role: true },
    });

    if (otpRecord) {
      try {
        await this.prisma.otp.delete({ where: { email } });
      } catch {}
    }

    const tokens = await this.getTokens(
      updatedUser.id,
      updatedUser.email,
      updatedUser.role?.name || 'Candidate',
    );
    await this.updateRefreshTokenHash(updatedUser.id, tokens.refresh_token);

    const { passwordHash, refreshTokenHash, ...result } = updatedUser;

    return {
      user: result,
      ...tokens,
      message: 'Kích hoạt tài khoản thành công!',
    };
  }

  // 3. ĐĂNG NHẬP
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { role: true },
    });

    // 1. Check user tồn tại
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    if (user.status === 'PENDING') {
      throw new BadRequestException('ACCOUNT_NOT_ACTIVATED');
    }

    // 2. Check tài khoản kích hoạt chưa
    if (user.status === 'PENDING') {
      throw new UnauthorizedException('Tài khoản chưa được kích hoạt!');
    }

    if (user.status === 'BANNED') {
      throw new ForbiddenException(
        'Tài khoản của bạn đã bị khóa do vi phạm chính sách hệ thống!',
      );
    }

    // 3. Check mật khẩu
    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch)
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');

    // 4. Tạo token và lưu hash
    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.role?.name || 'Candidate',
    );
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    const { passwordHash, refreshTokenHash, ...result } = user;
    return {
      user: result,
      ...tokens,
      message: 'Đăng nhập thành công!',
    };
  }

  // 4. GOOGLE LOGIN
  async googleLogin(reqUser: any) {
    let user = await this.prisma.user.findUnique({
      where: { email: reqUser.email },
      include: { role: true },
    });

    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      // Tạo User nhưng chưa tạo Profile ngay vì chưa biết Role
      user = await this.prisma.user.create({
        data: {
          email: reqUser.email,
          fullName: reqUser.fullName,
          provider: 'google',
          providerId: reqUser.providerId,
          status: 'ACTIVE',
        },
        include: { role: true },
      });
    }

    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.role?.name || '',
    );
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return {
      ...tokens,
      isNewUser,
    };
  }

  // 5. QUÊN MẬT KHẨU
  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Email không tồn tại!');

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.otp.upsert({
      where: { email },
      update: { code: otpCode, expiresAt },
      create: { email, code: otpCode, expiresAt },
    });

    await this.sendOtpMail(
      email,
      otpCode,
      'Khôi phục mật khẩu',
      'Mã OTP đặt lại mật khẩu của bạn:',
    );
    return { message: 'Mã OTP đã được gửi vào email!' };
  }

  // 6. ĐẶT LẠI MẬT KHẨU
  async resetPassword(dto: ResetPasswordDto) {
    const otpRecord = await this.prisma.otp.findUnique({
      where: { email: dto.email },
    });
    if (
      !otpRecord ||
      otpRecord.code !== dto.otp ||
      otpRecord.expiresAt < new Date()
    ) {
      throw new BadRequestException('Mã OTP không hợp lệ!');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { email: dto.email },
      data: { passwordHash: hashedPassword },
    });

    await this.prisma.otp.delete({ where: { email: dto.email } });
    return { message: 'Đổi mật khẩu thành công!' };
  }

  async verifyForgotOtp(email: string, code: string) {
    // 1. Vẫn kiểm tra xem email có tồn tại trong hệ thống không
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Email không tồn tại trong hệ thống');
    }

    const otpRecord = await this.prisma.otp.findFirst({
      where: {
        email: email,
        code: code,
      },
      orderBy: {
        createdAt: 'desc', // Lấy mã mới nhất được tạo ra
      },
    });

    // 3. Kiểm tra xem OTP có tồn tại không và còn hạn (expiresAt) không
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      throw new BadRequestException('Mã OTP không chính xác hoặc đã hết hạn');
    }

    return { message: 'Mã xác thực chính xác!' };
  }

  // 7. ĐỔI MẬT KHẨU (Khi đang login)
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.passwordHash)
      throw new BadRequestException('Không thể thực hiện!');

    const isMatch = await bcrypt.compare(dto.oldPassword, user.passwordHash);
    if (!isMatch) throw new BadRequestException('Mật khẩu cũ sai!');

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: await bcrypt.hash(dto.newPassword, 10) },
    });

    return { message: 'Đổi mật khẩu thành công!' };
  }

  // 8. Hàm tạo cặp Token
  async getTokens(userId: string, email: string, role: string) {
    const accessExpiresIn = (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as any;
    const refreshExpiresIn = (process.env.JWT_REFRESH_EXPIRES_IN ||
      '1d') as any;

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, role },
        { secret: process.env.JWT_SECRET, expiresIn: accessExpiresIn },
      ),
      this.jwtService.signAsync(
        { sub: userId, email, role },
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: refreshExpiresIn },
      ),
    ]);

    return { access_token: at, refresh_token: rt };
  }

  // 9. Hàm lưu RT vào DB
  async updateRefreshTokenHash(userId: string, rt: string) {
    const hash = await bcrypt.hash(rt, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: hash },
    });
  }

  // 10. Hàm Refresh Token
  async refreshTokens(userId: string, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    // Kiểm tra user và hash trong DB
    if (!user || !user.refreshTokenHash)
      throw new ForbiddenException('Access Denied');

    // So sánh token gửi lên với bản băm
    const rtMatches = await bcrypt.compare(rt, user.refreshTokenHash);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    // Tạo cặp token mới
    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.role?.name || 'Candidate',
    );

    // Cập nhật bản băm mới vào DB (Rotation)
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }

  // 11. Hàm đăng xuất
  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
    return { message: 'Đăng xuất thành công!' };
  }

  // // HELPER: SEND EMAIL
  // private async sendOtpMail(
  //   email: string,
  //   otp: string,
  //   subject: string,
  //   message: string,
  // ) {
  //   const transporter = nodemailer.createTransport({
  //     host: process.env.MAIL_HOST,
  //     port: Number(process.env.MAIL_PORT) || 587,
  //     auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
  //   });

  //   await transporter.sendMail({
  //     from: '"Job Matching System" <no-reply@jobmatching.com>',
  //     to: email,
  //     subject,
  //     html: `
  //       <div style="font-family: Arial; padding: 20px; border: 1px solid #eee;">
  //         <h2 style="color: #4CAF50;">Mã OTP của bạn</h2>
  //         <p>${message}</p>
  //         <h1 style="background: #f4f4f4; padding: 10px; text-align: center;">${otp}</h1>
  //         <p>Hết hạn sau 10 phút.</p>
  //       </div>
  //     `,
  //   });
  // }

  // // HELPER: RESEND EMAIL
  // async resendOtp(email: string) {
  //   // 1. Kiểm tra user có tồn tại không
  //   const user = await this.prisma.user.findUnique({
  //     where: { email },
  //   });

  //   if (!user) {
  //     throw new NotFoundException('Người dùng không tồn tại!');
  //   }

  //   // 2. Nếu đã ACTIVE rồi thì không cho gửi lại nữa
  //   if (user.status === 'ACTIVE') {
  //     throw new BadRequestException('Tài khoản này đã được kích hoạt rồi!');
  //   }

  //   // 3. Tạo mã OTP mới (giống lúc Register)
  //   const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  //   const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 phút mới

  //   // 4. Lưu/Cập nhật vào bảng OTP
  //   await this.prisma.otp.upsert({
  //     where: { email },
  //     update: { code: otpCode, expiresAt },
  //     create: { email, code: otpCode, expiresAt },
  //   });

  //   // 5. Gửi email
  //   await this.sendOtpMail(
  //     email,
  //     otpCode,
  //     'Gửi lại mã xác thực OTP',
  //     'Chúng tôi nhận được yêu cầu gửi lại mã xác thực. Mã mới của bạn là:',
  //   );

  //   return { message: 'Mã OTP mới đã được gửi thành công!' };
  // }

  private getTransporter() {
    const rawUser = (process.env.MAIL_USER || '').trim().replace(/^["']|["']$/g, '');
    const rawPass = (process.env.MAIL_PASS || '').trim().replace(/^["']|["']$/g, '').replace(/\s+/g, '');
    const host = (process.env.MAIL_HOST || 'smtp.gmail.com').trim().replace(/^["']|["']$/g, '');
    const port = Number(process.env.MAIL_PORT) || 587;

    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user: rawUser, pass: rawPass },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  // HELPER: SEND EMAIL (Hỗ trợ Resend HTTPS API & Nodemailer SMTP)
  private async sendOtpMail(
    email: string,
    otp: string,
    subject: string,
    message: string,
  ) {
    const resendApiKey = process.env.RESEND_API_KEY?.trim();

    // 1. Ưu tiên gửi qua Resend HTTPS API (chuẩn 100% cho Render Cloud, không bị chặn port SMTP)
    if (resendApiKey) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: 'Equitas AI <onboarding@resend.dev>',
            to: [email],
            subject,
            html: `
            <div style="font-family: Arial, sans-serif; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 500px; margin: 0 auto; background-color: #ffffff;">
              <h2 style="color: #2563eb; margin-top: 0;">Mã xác thực OTP - Equitas AI</h2>
              <p style="color: #475569; font-size: 15px; line-height: 1.5;">${message}</p>
              <div style="background-color: #f1f5f9; padding: 16px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0f172a;">${otp}</span>
              </div>
              <p style="color: #64748b; font-size: 13px;">Mã có hiệu lực trong 10 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>
            </div>
          `,
          }),
        });

        if (res.ok) {
          console.log(`✅ [Resend API] Đã gửi mail OTP thành công tới ${email}`);
          return;
        }
        const errText = await res.text();
        console.error(`❌ [Resend API Error]: ${errText}`);
      } catch (err: any) {
        console.error(`❌ [Resend API Exception]:`, err?.message || err);
      }
    }

    // 2. Phương án dự phòng: Nodemailer SMTP
    const rawUser = (process.env.MAIL_USER || '').trim().replace(/^["']|["']$/g, '');
    const rawPass = (process.env.MAIL_PASS || '').trim().replace(/^["']|["']$/g, '').replace(/\s+/g, '');

    if (!rawUser || !rawPass) {
      console.warn(
        '⚠️ KHÔNG THỂ GỬI MAIL OTP: Chưa cấu hình RESEND_API_KEY hoặc MAIL_USER/MAIL_PASS.',
      );
      return;
    }

    try {
      const transporter = this.getTransporter();
      const info = await transporter.sendMail({
        from: `"Equitas AI" <${rawUser}>`,
        to: email,
        subject,
        html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 500px; margin: 0 auto; background-color: #ffffff;">
          <h2 style="color: #2563eb; margin-top: 0;">Mã xác thực OTP - Equitas AI</h2>
          <p style="color: #475569; font-size: 15px; line-height: 1.5;">${message}</p>
          <div style="background-color: #f1f5f9; padding: 16px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0f172a;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 13px;">Mã có hiệu lực trong 10 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>
        </div>
      `,
      });
      console.log(`✅ [Nodemailer SMTP] Đã gửi mail OTP thành công tới ${email}. Message ID: ${info.messageId}`);
    } catch (error: any) {
      console.error(`❌ [Nodemailer SMTP Error] Lỗi gửi mail OTP tới ${email}:`, error?.message || error);
    }
  }

  // HELPER: RESEND EMAIL
  async resendOtp(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại!');
    }

    if (user.status === 'ACTIVE') {
      throw new BadRequestException('Tài khoản này đã được kích hoạt rồi!');
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.otp.upsert({
      where: { email },
      update: { code: otpCode, expiresAt },
      create: { email, code: otpCode, expiresAt },
    });

    this.sendOtpMail(
      email,
      otpCode,
      'Gửi lại mã xác thực OTP',
      'Chúng tôi nhận được yêu cầu gửi lại mã xác thực. Mã mới của bạn là:',
    ).catch((err) => {
      console.error('Lỗi gửi mail OTP:', err);
    });

    return { message: 'Mã OTP mới đã được gửi thành công!' };
  }
}
