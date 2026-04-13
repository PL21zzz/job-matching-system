import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

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
    // --- PHẢI THÊM CÁI NÀY ĐỂ KHÔNG LỖI ---
    candidateProfile: {
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ... (Giữ nguyên các test register và verify cũ của bạn) ...

  describe('login (Email truyền thống)', () => {
    it('nên ném lỗi nếu tài khoản đăng ký bằng Google cố tình login bằng mật khẩu', async () => {
      const loginDto = { email: 'google-user@gmail.com', password: '123' };

      // Giả lập user tìm thấy nhưng passwordHash là null (do dùng Google)
      mockPrisma.user.findUnique.mockResolvedValue({
        email: 'google-user@gmail.com',
        passwordHash: null,
        status: 'ACTIVE',
      });

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Tài khoản này được đăng ký bằng Google. Vui lòng đăng nhập bằng Google!',
      );
    });
  });

  describe('googleLogin', () => {
    const googleProfile = {
      email: 'phong@gmail.com',
      fullName: 'Nguyễn Phong',
      providerId: '12345',
    };

    it('nên đăng nhập luôn nếu user đã tồn tại', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        email: 'phong@gmail.com',
        roleId: 3,
      });
      mockJwt.signAsync.mockResolvedValue('fake-jwt-token');

      const result = await service.googleLogin(googleProfile);

      expect(result).toHaveProperty('access_token');
      expect(mockPrisma.user.create).not.toHaveBeenCalled(); // Không được tạo mới
    });

    it('nên tạo user mới và profile mới nếu user chưa tồn tại', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null); // User chưa có
      mockPrisma.user.create.mockResolvedValue({
        id: 'new-user-id',
        email: 'phong@gmail.com',
        fullName: 'Nguyễn Phong',
        roleId: 3,
      });
      mockJwt.signAsync.mockResolvedValue('new-jwt-token');

      const result = await service.googleLogin(googleProfile);

      expect(mockPrisma.user.create).toHaveBeenCalled();
      expect(mockPrisma.candidateProfile.create).toHaveBeenCalled(); // Quan trọng: Phải tạo profile
      expect(result.access_token).toBe('new-jwt-token');
    });
  });
});
