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

      await this.sendOtpMail(
        user.email,
        otpCode,
        'Xác thực tài khoản',
        'Mã OTP của bạn là:',
      );

      return { message: 'Đăng ký thành công!', email: user.email };
    });
  }

  // 2. XÁC THỰC OTP & TẠO PROFILE
  async verifyRegister(dto: VerifyRegisterDto) {
    // 1. Đảm bảo dto có trường 'code' (hoặc sếp sửa DTO thành 'otp' cho khớp)
    const { email, code } = dto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw new NotFoundException('Người dùng không tồn tại!');

    // 2. Kiểm tra OTP
    const otpRecord = await this.prisma.otp.findUnique({ where: { email } });

    if (
      !otpRecord ||
      otpRecord.code !== code ||
      otpRecord.expiresAt < new Date()
    ) {
      throw new BadRequestException('Mã OTP không chính xác hoặc đã hết hạn!');
    }

    // 3. Update trạng thái ACTIVE (Hồ sơ đã được tạo ở bước Register rồi)
    await this.prisma.user.update({
      where: { email },
      data: { status: 'ACTIVE' },
    });

    // 4. Xóa OTP sau khi dùng xong
    await this.prisma.otp.delete({ where: { email } });

    return {
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

    const payload = { sub: user.id, email: user.email, role: user.role?.name };

    return {
      access_token: await this.jwtService.signAsync(payload),
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

  // 8. LẤY THÔNG TIN CÁ NHÂN
  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true, candidateProfile: true, employerProfile: true },
    });
    if (!user) throw new NotFoundException('User không tồn tại!');
    const { passwordHash, ...result } = user;
    return result;
  }

  // 9. Hàm tạo cặp Token
  async getTokens(userId: string, email: string, role: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, role },
        { secret: process.env.JWT_SECRET, expiresIn: '15m' }, // AT sống 15p
      ),
      this.jwtService.signAsync(
        { sub: userId, email, role },
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' }, // RT sống 7 ngày
      ),
    ]);

    return { access_token: at, refresh_token: rt };
  }

  // 10. Hàm lưu RT vào DB
  async updateRefreshTokenHash(userId: string, rt: string) {
    const hash = await bcrypt.hash(rt, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: hash },
    });
  }

  // 11. Hàm Refresh Token
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

  // 12. Hàm đăng xuất
  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
    return { message: 'Đăng xuất thành công!' };
  }

  // HELPER: SEND EMAIL
  private async sendOtpMail(
    email: string,
    otp: string,
    subject: string,
    message: string,
  ) {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT) || 587,
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
    });

    await transporter.sendMail({
      from: '"Job Matching System" <no-reply@jobmatching.com>',
      to: email,
      subject,
      html: `
        <div style="font-family: Arial; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #4CAF50;">Mã OTP của bạn</h2>
          <p>${message}</p>
          <h1 style="background: #f4f4f4; padding: 10px; text-align: center;">${otp}</h1>
          <p>Hết hạn sau 10 phút.</p>
        </div>
      `,
    });
  }

  // HELPER: RESEND EMAIL
  async resendOtp(email: string) {
    // 1. Kiểm tra user có tồn tại không
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại!');
    }

    // 2. Nếu đã ACTIVE rồi thì không cho gửi lại nữa
    if (user.status === 'ACTIVE') {
      throw new BadRequestException('Tài khoản này đã được kích hoạt rồi!');
    }

    // 3. Tạo mã OTP mới (giống lúc Register)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 phút mới

    // 4. Lưu/Cập nhật vào bảng OTP
    await this.prisma.otp.upsert({
      where: { email },
      update: { code: otpCode, expiresAt },
      create: { email, code: otpCode, expiresAt },
    });

    // 5. Gửi email
    await this.sendOtpMail(
      email,
      otpCode,
      'Gửi lại mã xác thực OTP',
      'Chúng tôi nhận được yêu cầu gửi lại mã xác thực. Mã mới của bạn là:',
    );

    return { message: 'Mã OTP mới đã được gửi thành công!' };
  }
}
