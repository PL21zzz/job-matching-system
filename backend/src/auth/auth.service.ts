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
import { RoleName } from './constants/role.enum';
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

  // 1. ĐĂNG KÝ (Tìm Role động)
  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser)
      throw new BadRequestException('Email này đã được sử dụng!');

    const role = await this.prisma.role.findUnique({
      where: { name: dto.role },
    });

    if (!role) throw new BadRequestException('Vai trò không hợp lệ!');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hashedPassword,
        fullName: dto.fullName,
        status: 'PENDING',
        roleId: role.id,
      },
    });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.otp.upsert({
      where: { email: user.email },
      update: { code: otpCode, expiresAt },
      create: { email: user.email, code: otpCode, expiresAt },
    });

    await this.sendOtpMail(
      user.email,
      otpCode,
      'Xác thực đăng ký tài khoản',
      'Cảm ơn bạn đã đăng ký. Đây là mã OTP để kích hoạt tài khoản của bạn:',
    );

    return {
      message: 'Đăng ký thành công! Vui lòng kiểm tra email để lấy mã OTP.',
      email: user.email,
    };
  }

  // 2. XÁC THỰC OTP & TẠO PROFILE
  async verifyRegister(dto: VerifyRegisterDto) {
    const { email, otp } = dto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) throw new NotFoundException('Người dùng không tồn tại!');

    const otpRecord = await this.prisma.otp.findUnique({ where: { email } });
    if (
      !otpRecord ||
      otpRecord.code !== otp ||
      otpRecord.expiresAt < new Date()
    ) {
      throw new BadRequestException('Mã OTP không chính xác hoặc đã hết hạn!');
    }

    // Update ACTIVE
    await this.prisma.user.update({
      where: { email },
      data: { status: 'ACTIVE' },
    });

    // Tạo Profile dựa trên Role Name (Dùng Enum)
    if (user.role?.name === RoleName.EMPLOYER) {
      await this.prisma.employerProfile.create({
        data: { userId: user.id, companyName: `Công ty của ${user.fullName}` },
      });
    } else if (user.role?.name === RoleName.CANDIDATE) {
      await this.prisma.candidateProfile.create({
        data: { userId: user.id, fullName: user.fullName },
      });
    }

    await this.prisma.otp.delete({ where: { email } });

    return {
      message: 'Kích hoạt tài khoản thành công! Hồ sơ đã được khởi tạo.',
    };
  }

  // 3. ĐĂNG NHẬP (Fix Payload Role Name)
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { role: true },
    });

    // 1. Check user tồn tại
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    // 2. PHẢI CÓ ĐOẠN NÀY: Check tài khoản kích hoạt chưa
    // Đây chính là chỗ làm con test của bạn bị FAIL
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

  // 4. GOOGLE LOGIN (Cũng phải ném Role Name vào payload)
  async googleLogin(reqUser: any) {
    let user = await this.prisma.user.findUnique({
      where: { email: reqUser.email },
      include: { role: true },
    });

    if (!user) {
      // Tìm role Candidate động
      const candidateRole = await this.prisma.role.findUnique({
        where: { name: RoleName.CANDIDATE },
      });

      user = await this.prisma.user.create({
        data: {
          email: reqUser.email,
          fullName: reqUser.fullName,
          provider: 'google',
          providerId: reqUser.providerId,
          status: 'ACTIVE',
          roleId: candidateRole?.id || 3,
        },
        include: { role: true },
      });

      await this.prisma.candidateProfile.create({
        data: { userId: user.id, fullName: user.fullName },
      });
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role?.name || RoleName.CANDIDATE,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: { email: user.email, fullName: user.fullName },
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

  // HELPER: GỬI MAIL
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
}
