import { NotFoundException } from '@nestjs/common';
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
};

const mockPrismaService = {
  employerProfile: {
    findUnique: jest.fn(),
  },
  category: {
    findUnique: jest.fn(),
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
        }),
      );
    });
  });

  describe('findJobById', () => {
    it('should return detailed job info if job exists', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(mockJob);

      const result = await service.findJobById('job-uuid-111');
      expect(result).toEqual(mockJob);
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
