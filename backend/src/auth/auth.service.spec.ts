import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing'; // Bị thiếu dòng này
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service'; // Bị thiếu dòng này

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    otp: {
      findUnique: jest.fn(),
      delete: jest.fn(),
      upsert: jest.fn(),
    },
  };

  const mockJwt = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  // Xóa sạch các vạch đỏ bằng cách reset mock sau mỗi test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('nên được khởi tạo thành công', () => {
    expect(service).toBeDefined();
  });

  it('nên ném ra lỗi nếu email đã tồn tại khi đăng ký', async () => {
    const dto = {
      email: 'test@gmail.com',
      password: 'password123',
      fullName: 'Phong',
      role: 'CANDIDATE',
    };

    // Giả lập: Database tìm thấy user đã tồn tại (findUnique trả về 1 object)
    (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: '1',
      email: 'test@gmail.com',
    });

    await expect(service.register(dto)).rejects.toThrow(BadRequestException);
    await expect(service.register(dto)).rejects.toThrow(
      'Email này đã được sử dụng!',
    );
  });

  // Một ví dụ đơn giản về kịch bản test cho hàm Verify
  it('nên kích hoạt tài khoản thành công khi nhập đúng OTP', async () => {
    // 1. Giả lập (Mock) là trong DB đang có mã OTP đúng
    mockPrisma.otp.findUnique.mockResolvedValue({
      code: '123456',
      expiresAt: new Date(Date.now() + 10000),
    });

    // 2. Gọi hàm verify
    const result = await service.verifyRegister({
      email: 'test@gmail.com',
      otp: '123456',
    });

    // 3. Khẳng định (Expect) kết quả trả về phải đúng như mong đợi
    expect(result.message).toContain('Kích hoạt tài khoản thành công');
  });
});
