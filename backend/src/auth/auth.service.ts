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
        status: 'PENDING',
        roleId: dto.role === 'EMPLOYER' ? 2 : 3,
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

    await this.sendOtpMail(
      user.email,
      otpCode,
      'Xác thực đăng ký tài khoản',
      'Cảm ơn bạn đã đăng ký. Đây là mã OTP để kích hoạt tài khoản của bạn:',
    );

    return {
      message:
        'Đăng ký thành công! Vui lòng kiểm tra email để lấy mã kích hoạt tài khoản.',
      email: user.email,
    };
  }

  async verifyRegister(dto: VerifyRegisterDto) {
    const { email, otp } = dto;

    // 1. Tìm OTP và User
    const otpRecord = await this.prisma.otp.findUnique({ where: { email } });
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new NotFoundException('User không tồn tại');
    if (
      !otpRecord ||
      otpRecord.code !== otp ||
      otpRecord.expiresAt < new Date()
    ) {
      throw new BadRequestException('Mã OTP không chính xác hoặc đã hết hạn!');
    }

    // 2. Cập nhật trạng thái User thành ACTIVE
    await this.prisma.user.update({
      where: { email },
      data: { status: 'ACTIVE' },
    });

    // 3. --- FIX BUG Ở ĐÂY: TỰ ĐỘNG TẠO PROFILE DỰA TRÊN ROLE ---
    // Giả sử: Role 2 là Employer, Role 3 là Candidate (theo đúng bảng roles bạn nạp)
    if (user.roleId === 2) {
      await this.prisma.employerProfile.create({
        data: { userId: user.id, companyName: 'Tên công ty mặc định' },
      });
    } else if (user.roleId === 3) {
      await this.prisma.candidateProfile.create({
        data: { userId: user.id, fullName: user.fullName },
      });
    }

    // 4. Xóa OTP
    await this.prisma.otp.delete({ where: { email } });

    return {
      message: 'Kích hoạt tài khoản thành công! Profile đã được khởi tạo.',
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

    // Kiểm tra xem user có mật khẩu không
    if (!user.passwordHash) {
      throw new UnauthorizedException(
        'Tài khoản này được đăng ký bằng Google. Vui lòng đăng nhập bằng Google!',
      );
    }

    // 4. Kiểm tra mật khẩu (So sánh pass thô với pass đã băm trong DB)
    const isPasswordMatching = await bcrypt.compare(
      dto.password,
      user.passwordHash!,
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

  async googleLogin(reqUser: any) {
    // 1. Tìm xem user đã tồn tại chưa
    let user = await this.prisma.user.findUnique({
      where: { email: reqUser.email },
    });

    // 2. Nếu chưa có, tạo mới luôn (vì Google đã verify email rồi)
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: reqUser.email,
          fullName: reqUser.fullName,
          provider: 'google',
          providerId: reqUser.providerId,
          status: 'ACTIVE', // Kích hoạt luôn
          roleId: 3, // Mặc định là Candidate (bạn đã nạp role 3 lúc nãy)
        },
      });

      // 3. Tự động tạo Profile ứng viên trống
      await this.prisma.candidateProfile.create({
        data: { userId: user.id, fullName: user.fullName },
      });
    }

    // 4. Trả về JWT Token như đăng nhập bình thường
    const payload = { sub: user.id, email: user.email, role: user.roleId };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        email: user.email,
        fullName: user.fullName,
      },
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
    await this.sendOtpMail(
      email,
      otpCode,
      'Khôi phục mật khẩu',
      'Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng sử dụng mã OTP dưới đây:',
    );

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

  private async sendOtpMail(
    email: string,
    otp: string,
    subject: string,
    message: string,
  ) {
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
      subject: subject, // Dùng tham số subject
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #4CAF50;">Mã xác thực OTP</h2>
        <p>Chào bạn,</p>
        <p>${message}</p> <h1 style="background: #f4f4f4; padding: 15px; text-align: center; letter-spacing: 10px; color: #333; border-radius: 5px;">${otp}</h1>
        <p>Mã này sẽ hết hạn trong 10 phút. Nếu bạn không yêu cầu, vui lòng bảo mật email này.</p>
        <hr style="border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #888;">Trân trọng,<br/>Đội ngũ Job Matching System</p>
      </div>
    `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Lỗi gửi mail: ', error);
      throw new BadRequestException('Không thể gửi mail lúc này!');
    }
  }
}
