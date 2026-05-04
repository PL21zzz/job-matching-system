import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { RoleName } from './constants/role.enum';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwt: JwtService;

  // 1. CẬP NHẬT MOCK PRISMA (Thêm $transaction)
  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    otp: {
      findUnique: jest.fn(),
      delete: jest.fn(),
      upsert: jest.fn(),
    },
    role: {
      findUnique: jest.fn(),
    },
    candidateProfile: { create: jest.fn() },
    employerProfile: { create: jest.fn() },
    // Cực kỳ quan trọng: Mock transaction để chạy callback
    $transaction: jest.fn(),
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
    jwt = module.get<JwtService>(JwtService);

    jest.spyOn(service as any, 'sendOtpMail').mockResolvedValue(undefined);

    // Mặc định cho $transaction chạy callback ngay lập tức
    mockPrisma.$transaction.mockImplementation((callback) =>
      callback(mockPrisma),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  // --- 1. TEST REGISTER ---
  describe('register', () => {
    it('nên đăng ký thành công cho Candidate và tạo luôn Profile', async () => {
      const dto = {
        email: 'candidate@g.com',
        password: '123',
        fullName: 'Phong Candidate',
        role: RoleName.CANDIDATE,
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.role.findUnique.mockResolvedValue({
        id: 3,
        name: RoleName.CANDIDATE,
      });
      mockPrisma.user.create.mockResolvedValue({ id: 'u1', ...dto });

      const result = await service.register(dto);

      expect(result.message).toContain('Đăng ký thành công');
      // Kiểm tra xem có tạo Profile không
      expect(mockPrisma.candidateProfile.create).toHaveBeenCalledWith({
        data: { userId: 'u1' },
      });
      expect(mockPrisma.otp.upsert).toHaveBeenCalled();
    });

    it('nên đăng ký thành công cho Employer và lưu companyName', async () => {
      const dto = {
        email: 'employer@g.com',
        password: '123',
        fullName: 'Phong Boss',
        role: RoleName.EMPLOYER,
        companyName: 'Equitas AI Corp',
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.role.findUnique.mockResolvedValue({
        id: 2,
        name: RoleName.EMPLOYER,
      });
      mockPrisma.user.create.mockResolvedValue({ id: 'u2', ...dto });

      await service.register(dto);

      expect(mockPrisma.employerProfile.create).toHaveBeenCalledWith({
        data: {
          userId: 'u2',
          companyName: 'Equitas AI Corp',
        },
      });
    });

    it('nên ném lỗi nếu email đã tồn tại', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: '1' });
      await expect(
        service.register({ email: 'ex@g.com' } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // --- 2. TEST VERIFY REGISTER (LOGIC MỚI: CHỈ KÍCH HOẠT STATUS) ---
  describe('verifyRegister', () => {
    const dto = { email: 'p@g.com', code: '123456' };

    it('nên kích hoạt tài khoản ACTIVE và KHÔNG tạo lại Profile', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: '1',
        status: 'PENDING',
      });
      mockPrisma.otp.findUnique.mockResolvedValue({
        code: '123456',
        expiresAt: new Date(Date.now() + 10000),
      });

      const result = await service.verifyRegister(dto);

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { email: dto.email },
        data: { status: 'ACTIVE' },
      });

      // Đảm bảo không tạo lại Profile ở bước này
      expect(mockPrisma.employerProfile.create).not.toHaveBeenCalled();
      expect(mockPrisma.candidateProfile.create).not.toHaveBeenCalled();
      expect(mockPrisma.otp.delete).toHaveBeenCalled();
      expect(result.message).toContain('thành công');
    });

    it('nên ném lỗi nếu OTP sai', async () => {
      mockPrisma.otp.findUnique.mockResolvedValue({ code: 'wrong' });
      await expect(service.verifyRegister(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // --- 3. TEST LOGIN ---
  describe('login', () => {
    it('nên trả về cặp token khi login thành công', async () => {
      const user = {
        id: '1',
        email: 'p@g.com',
        passwordHash: 'h',
        status: 'ACTIVE',
        role: { name: 'Admin' },
      };
      mockPrisma.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwt.signAsync.mockResolvedValue('token');

      const result = await service.login({ email: 'p@g.com', password: 'p' });
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
    });

    it('nên ném lỗi nếu tài khoản chưa kích hoạt (PENDING)', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        status: 'PENDING',
        passwordHash: 'h',
      });
      await expect(
        service.login({ email: 'a@g.com', password: 'p' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // --- 4. TEST GOOGLE LOGIN ---
  describe('googleLogin', () => {
    it('nên tạo mới user và trả về isNewUser=true nếu là lần đầu', async () => {
      const googleUser = {
        email: 'new@gmail.com',
        fullName: 'New User',
        providerId: '123',
      };

      // 1. Mock chưa có user trong DB
      mockPrisma.user.findUnique.mockResolvedValue(null);

      // 2. Mock kết quả sau khi create (KHÔNG CÒN TRANSACTION NỮA)
      const createdUser = { id: 'user-id', email: googleUser.email };
      mockPrisma.user.create.mockResolvedValue(createdUser);

      // 3. Mock jwtService
      jest
        .spyOn((service as any).jwtService, 'signAsync')
        .mockResolvedValue('mock-token');

      // 4. Chạy hàm service
      const result = await service.googleLogin(googleUser);

      // 5. Kiểm tra kỳ vọng (Kỳ vọng gọi create thay vì transaction)
      expect(mockPrisma.user.create).toHaveBeenCalled();
      expect(result).toEqual({
        access_token: 'mock-token',
        isNewUser: true,
      });
    });
  });

  // --- 5. TEST FORGOT & RESET PASSWORD ---
  describe('forgot/reset password', () => {
    it('forgotPassword: nên tạo OTP khi email đúng', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ email: 'p@g.com' });
      const result = await service.forgotPassword('p@g.com');
      expect(mockPrisma.otp.upsert).toHaveBeenCalled();
      expect(result.message).toContain('đã được gửi');
    });

    it('resetPassword: nên đổi mật khẩu thành công', async () => {
      mockPrisma.otp.findUnique.mockResolvedValue({
        code: '123',
        expiresAt: new Date(Date.now() + 10000),
      });
      (bcrypt.hash as jest.Mock).mockResolvedValue('new-hash');

      await service.resetPassword({
        email: 'p@g.com',
        otp: '123',
        newPassword: 'new',
      });
      expect(mockPrisma.user.update).toHaveBeenCalled();
      expect(mockPrisma.otp.delete).toHaveBeenCalled();
    });
  });

  // --- 6. TEST REFRESH TOKENS ---
  describe('refreshTokens', () => {
    it('nên xoay vòng token thành công', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: '1',
        refreshTokenHash: 'h',
        role: { name: 'Candidate' },
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwt.signAsync.mockResolvedValue('new');

      const result = await service.refreshTokens('1', 'rt');
      expect(result).toHaveProperty('access_token');
      expect(mockPrisma.user.update).toHaveBeenCalled();
    });
  });

  // --- 7. TEST GET ME & LOGOUT ---
  describe('getMe & logout', () => {
    it('getMe: nên trả về thông tin user không kèm password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: '1',
        passwordHash: 'h',
        email: 'p@g.com',
      });
      const result = await service.getMe('1');
      expect(result).not.toHaveProperty('passwordHash');
      expect(result.email).toBe('p@g.com');
    });

    it('logout: nên xóa refreshTokenHash', async () => {
      await service.logout('123');
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: '123' },
        data: { refreshTokenHash: null },
      });
    });
  });
});
