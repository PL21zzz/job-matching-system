import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto'; // <-- Import DTO

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  // Sửa lại tham số đầu vào: Hứng trọn bộ RegisterDto
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

    // 3. Tạm thời quy ước Role (Vì bảng Role hiện tại chưa có data)
    // Giả sử: EMPLOYER là 1, CANDIDATE là 2
    const mappedRoleId = role === 'EMPLOYER' ? 1 : 2;

    // 4. Lưu toàn bộ xuống bảng users
    const newUser = await this.prisma.user.create({
      data: {
        email: email,
        passwordHash: hashedPassword,
        fullName: fullName, // <-- Đã có thể lưu fullName
        roleId: mappedRoleId, // <-- Ánh xạ vai trò vào cột role_id
      },
    });

    return {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      message: 'Đăng ký tài khoản thành công!',
    };
  }
}
