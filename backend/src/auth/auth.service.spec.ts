import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing'; // Bị thiếu dòng này
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service'; // Bị thiếu dòng này

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  // Khởi tạo mock đơn giản
  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
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
});
