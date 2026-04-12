import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';
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
  async register(dto: RegisterDto) {
    // 1. Kiểm tra email đã tồn tại chưa
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser)
      throw new BadRequestException('Email này đã được sử dụng!');

    // 2. Hash mật khẩu
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. Tạo User với trạng thái PENDING
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hashedPassword,
        fullName: dto.fullName,
        status: 'PENDING', // Chưa cho phép login
        roleId: dto.role === 'EMPLOYER' ? 1 : 2, // Giả định roleId
      },
    });

    // 4. Tạo và Gửi OTP (Dùng lại logic OTP đã viết)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.otp.upsert({
      where: { email: user.email },
      update: { code: otpCode, expiresAt },
      create: { email: user.email, code: otpCode, expiresAt },
    });

    await this.sendOtpMail(user.email, otpCode); // Hàm gửi mail hôm qua

    return {
      message:
        'Đăng ký thành công! Vui lòng kiểm tra email để lấy mã kích hoạt tài khoản.',
      email: user.email,
    };
  }

  async verifyRegister(dto: VerifyRegisterDto) {
    const { email, otp } = dto;
    const otpRecord = await this.prisma.otp.findUnique({ where: { email } });

    if (
      !otpRecord ||
      otpRecord.code !== otp ||
      otpRecord.expiresAt < new Date()
    ) {
      throw new BadRequestException('Mã OTP không chính xác hoặc đã hết hạn!');
    }

    // Cập nhật trạng thái User thành ACTIVE
    await this.prisma.user.update({
      where: { email },
      data: { status: 'ACTIVE' },
    });

    // Xóa OTP
    await this.prisma.otp.delete({ where: { email } });

    return {
      message: 'Kích hoạt tài khoản thành công! Bây giờ bạn có thể đăng nhập.',
    };
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    // 1. Tìm user theo email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // 2. Nếu không thấy user -> Chặn luôn
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    // 3. Kiểm tra trạng thái tài khoản trước khi đi tiếp
    if (user.status === 'PENDING') {
      throw new UnauthorizedException(
        'Tài khoản chưa được kích hoạt. Vui lòng xác thực email!',
      );
    }

    // 4. Kiểm tra mật khẩu (So sánh pass thô với pass đã băm trong DB)
    const isPasswordMatching = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    if (user.status === 'PENDING') {
      throw new UnauthorizedException(
        'Tài khoản chưa được kích hoạt. Vui lòng xác thực email!',
      );
    }

    // 5. Tạo "Thẻ bài" (JWT Token)
    const payload = { sub: user.id, email: user.email, role: user.roleId };
    const accessToken = await this.jwtService.signAsync(payload);

    const { passwordHash, ...result } = user;

    return {
      user: result,
      access_token: accessToken, // Trả thêm cái thẻ này về cho Client
      message: 'Đăng nhập thành công!',
    };
  }

  async forgotPassword(email: string) {
    // 1. Kiểm tra user có tồn tại không
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Email không tồn tại!');

    // 2. Tạo mã OTP 6 số ngẫu nhiên
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Hết hạn sau 10 phút

    // 3. Lưu hoặc cập nhật OTP vào bảng Otp
    await this.prisma.otp.upsert({
      where: { email },
      update: { code: otpCode, expiresAt },
      create: { email, code: otpCode, expiresAt },
    });

    // 4. Gửi mail
    await this.sendOtpMail(email, otpCode);

    return { message: 'Mã OTP đã được gửi vào email của bạn!' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { email, otp, newPassword } = dto;

    // 1. Kiểm tra OTP có khớp và còn hạn không
    const otpRecord = await this.prisma.otp.findUnique({ where: { email } });
    if (
      !otpRecord ||
      otpRecord.code !== otp ||
      otpRecord.expiresAt < new Date()
    ) {
      throw new BadRequestException('Mã OTP không hợp lệ hoặc đã hết hạn!');
    }

    // 2. Hash mật khẩu mới và cập nhật User
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { email },
      data: { passwordHash: hashedPassword },
    });

    // 3. Xóa OTP sau khi dùng xong (Bảo mật)
    await this.prisma.otp.delete({ where: { email } });

    return { message: 'Đổi mật khẩu thành công!' };
  }

  private async sendOtpMail(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: '"Job Matching System" <no-reply@jobmatching.com>',
      to: email,
      subject: 'Mã xác thực OTP - Reset mật khẩu',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">Mã xác thực của bạn</h2>
        <p>Chào bạn,</p>
        <p>Bạn đã yêu cầu đặt lại mật khẩu. Mã OTP của bạn là:</p>
        <h1 style="background: #f4f4f4; padding: 10px; text-align: center; letter-spacing: 5px; color: #333;">${otp}</h1>
        <p>Mã này sẽ hết hạn trong 10 phút. Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
        <hr />
        <p style="font-size: 12px; color: #888;">Trân trọng, Đội ngũ Job Matching System</p>
      </div>
    `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Lỗi gửi mail: ', error);
      throw new BadRequestException(
        'Không thể gửi mail lúc này, vui lòng thử lại sau!',
      );
    }
  }
}
