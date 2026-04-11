import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService, // Tiêm JwtService vào đây
  ) {}
  async register(dto: RegisterDto) {
    const { email, password, fullName, role } = dto;

    // 1. Kiểm tra Email tồn tại
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email này đã được sử dụng!');
    }

    // 2. Băm mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Tạm thời quy ước Role
    const mappedRoleId = role === 'EMPLOYER' ? 1 : 2;

    // 4. Lưu toàn bộ xuống bảng users
    const newUser = await this.prisma.user.create({
      data: {
        email: email,
        passwordHash: hashedPassword,
        fullName: fullName,
        roleId: mappedRoleId,
      },
    });

    return {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      message: 'Đăng ký tài khoản thành công!',
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

    // 3. Kiểm tra mật khẩu (So sánh pass thô với pass đã băm trong DB)
    const isPasswordMatching = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    // 4. Tạo "Thẻ bài" (JWT Token)
    const payload = { sub: user.id, email: user.email, role: user.roleId };
    const accessToken = await this.jwtService.signAsync(payload);

    const { passwordHash, ...result } = user;

    return {
      user: result,
      access_token: accessToken, // Trả thêm cái thẻ này về cho Client
      message: 'Đăng nhập thành công!',
    };
  }
}
