import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';

// Tạo mock object cho các hàm Prisma tương tác trong Service của sếp
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  candidateProfile: {
    update: jest.fn(),
  },
  employerProfile: {
    update: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfileMe', () => {
    it('should return user profile successfully if user exists', async () => {
      const mockResult = { id: 'user-1', email: 'p@g.com', fullName: 'Phong' };
      mockPrismaService.user.findUnique.mockResolvedValue(mockResult);

      const result = await service.getProfileMe('user-1', 'Candidate');

      expect(result).toEqual(mockResult);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        select: {
          id: true,
          email: true,
          fullName: true,
          roleId: true,
          candidateProfile: true,
          employerProfile: false,
        },
      });
    });

    it('should throw BadRequestException if user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.getProfileMe('user-unknown', 'Candidate'),
      ).rejects.toThrow(
        new BadRequestException(
          'Không tìm thấy thông tin người dùng trong hệ thống.',
        ),
      );
    });
  });

  describe('updateProfile', () => {
    const userId = 'user-1';

    it('should update user fullName and candidateProfile if role is Candidate', async () => {
      const dto = {
        fullName: 'Phong Candidate',
        phone: '0905',
        dob: '1995-05-15',
        address: 'Da Nang',
      };
      mockPrismaService.user.update.mockResolvedValue({});
      mockPrismaService.candidateProfile.update.mockResolvedValue({
        id: 'profile-1',
      });

      const result = await service.updateProfile(userId, 'Candidate', dto);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { fullName: 'Phong Candidate' },
      });
      expect(prisma.candidateProfile.update).toHaveBeenCalledWith({
        where: { userId: userId },
        data: {
          dob: new Date('1995-05-15'),
          phone: '0905',
          address: 'Da Nang',
        },
      });
      expect(result).toHaveProperty('id', 'profile-1');
    });

    it('should update user fullName and employerProfile if role is Employer', async () => {
      const dto = {
        fullName: 'Phong Employer',
        companyName: 'Novaha',
        taxCode: '123',
        address: 'HN',
      };
      mockPrismaService.user.update.mockResolvedValue({});
      mockPrismaService.employerProfile.update.mockResolvedValue({
        id: 'employer-1',
      });

      const result = await service.updateProfile(userId, 'Employer', dto);

      expect(prisma.employerProfile.update).toHaveBeenCalledWith({
        where: { userId: userId },
        data: {
          companyName: 'Novaha',
          taxCode: '123',
          address: 'HN',
          description: undefined,
          accessibilityFeatures: undefined,
        },
      });
      expect(result).toHaveProperty('id', 'employer-1');
    });

    it('should throw BadRequestException if role is invalid', async () => {
      const dto = { fullName: 'Ghost' };
      await expect(
        service.updateProfile(userId, 'INVALID_ROLE', dto),
      ).rejects.toThrow(
        new BadRequestException(
          'Vai trò người dùng không hợp lệ để thực hiện cập nhật hồ sơ.',
        ),
      );
    });
  });
});
