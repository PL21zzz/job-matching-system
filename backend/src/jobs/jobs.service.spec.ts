import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { JobsService } from './jobs.service';

const mockJob = {
  id: 'job-uuid-111',
  title: 'Lập trình viên ReactJS',
  description: 'Phát triển giao diện web trợ năng',
  requirements: 'Thành thạo React, HTML/CSS',
  salaryMin: 15000000,
  salaryMax: 25000000,
  location: 'Da Nang',
  status: 'OPEN',
  employerId: 'employer-uuid-123',
  categoryId: 1,
  // Bổ sung dữ liệu mảng quan hệ trả về từ DB
  suitableDisabilities: [{ id: 1, name: 'Khuyết tật vận động' }],
};

const mockCategory = {
  id: 1,
  name: 'Công nghệ thông tin',
};

const mockEmployerProfile = {
  id: 'employer-uuid-123',
  userId: 'user-uuid-999',
  companyName: 'Equitas Lab',
};

const mockPrismaService = {
  employerProfile: {
    findUnique: jest.fn(),
  },

  category: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },

  job: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
};

describe('JobsService', () => {
  let service: JobsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createJob', () => {
    const mockDto = {
      title: 'Lập trình viên ReactJS',
      categoryId: 1,
      type: 'FULL_TIME',
      location: 'Da Nang',
      salaryMin: 15000000,
      salaryMax: 25000000,
      salaryText: '15-25tr',
      description: 'Phát triển giao diện web trợ năng',
      requirements: 'Thành thạo React, HTML/CSS',
      accessibilityFeatures: 'Lối đi xe lăn',
      suitableDisabilityIds: [1], // Thêm mảng ID khuyết tật đầu vào theo đúng workflow
    };

    it('should successfully create a job when profile and category are valid', async () => {
      mockPrismaService.employerProfile.findUnique.mockResolvedValue(
        mockEmployerProfile,
      );
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);
      mockPrismaService.job.create.mockResolvedValue({
        ...mockJob,
        ...mockDto,
        employerId: mockEmployerProfile.id,
      });

      const result = await service.createJob('user-uuid-999', mockDto as any);

      expect(result).toBeDefined();
      expect(result.title).toEqual(mockDto.title);
      expect(prisma.employerProfile.findUnique).toHaveBeenCalledWith({
        where: { userId: 'user-uuid-999' },
      });
      expect(prisma.category.findUnique).toHaveBeenCalledWith({
        where: { id: mockDto.categoryId },
      });

      // Kiểm tra xem cấu trúc lưu data có truyền connect mảng ID chính xác hay không
      expect(prisma.job.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          suitableDisabilities: {
            connect: [{ id: 1 }],
          },
        }),
        include: expect.any(Object),
      });
    });

    it('should throw BadRequestException if employer profile does not exist', async () => {
      mockPrismaService.employerProfile.findUnique.mockResolvedValue(null);

      await expect(
        service.createJob('user-uuid-999', mockDto as any),
      ).rejects.toThrow(
        new BadRequestException(
          'Tài khoản của bạn chưa hoàn thiện hồ sơ nhà tuyển dụng để có thể đăng tin.',
        ),
      );

      expect(prisma.category.findUnique).not.toHaveBeenCalled();
      expect(prisma.job.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if selected category does not exist', async () => {
      mockPrismaService.employerProfile.findUnique.mockResolvedValue(
        mockEmployerProfile,
      );
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      await expect(
        service.createJob('user-uuid-999', mockDto as any),
      ).rejects.toThrow(
        new NotFoundException('Ngành nghề tuyển dụng được chọn không tồn tại.'),
      );

      expect(prisma.job.create).not.toHaveBeenCalled();
    });
  });

  describe('findAllCategories', () => {
    it('should return an array of categories ordered by id', async () => {
      const mockCategories = [mockCategory];
      mockPrismaService.category.findMany.mockResolvedValue(mockCategories);

      const result = await service.findAllCategories();

      expect(result).toEqual(mockCategories);
      expect(prisma.category.findMany).toHaveBeenCalledWith({
        orderBy: { id: 'asc' },
      });
    });
  });

  describe('findAllJobs', () => {
    it('should return a list of open jobs based on dynamic filters', async () => {
      mockPrismaService.job.findMany.mockResolvedValue([mockJob]);

      const filters = { search: 'React', location: 'Da Nang', categoryId: 1 };
      const result = await service.findAllJobs(filters);

      expect(result).toEqual([mockJob]);
      expect(prisma.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'OPEN',
            categoryId: 1,
          }),
          include: expect.objectContaining({
            suitableDisabilities: true, // Kiểm tra bắt buộc bốc kèm tag ở danh sách
          }),
        }),
      );
    });
  });

  describe('findJobById', () => {
    it('should return detailed job info if job exists', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(mockJob);

      const result = await service.findJobById('job-uuid-111');
      expect(result).toEqual(mockJob);
      expect(prisma.job.findUnique).toHaveBeenCalledWith({
        where: { id: 'job-uuid-111' },
        include: expect.objectContaining({
          suitableDisabilities: true, // Kiểm tra bắt buộc bốc kèm tag ở chi tiết
        }),
      });
    });

    it('should throw NotFoundException if job does not exist', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(null);

      await expect(service.findJobById('invalid-id')).rejects.toThrow(
        new NotFoundException(
          'Không tìm thấy bài đăng tuyển dụng này hoặc tin đã bị đóng.',
        ),
      );
    });
  });
});
