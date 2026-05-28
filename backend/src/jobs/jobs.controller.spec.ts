import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';

const mockJob = {
  id: 'job-uuid-111',
  title: 'Lập trình viên ReactJS',
  employerId: 'employer-uuid-123',
  categoryId: 1,
  suitableDisabilities: [{ id: 1, name: 'Khuyết tật vận động' }],
};

const mockCategory = {
  id: 1,
  name: 'Công nghệ thông tin',
};

const mockJobsService = {
  findAllCategories: jest.fn(),
  createJob: jest.fn(),
  findAllJobs: jest.fn(),
  findJobById: jest.fn(),
};

describe('JobsController', () => {
  let controller: JobsController;
  let service: JobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [{ provide: JobsService, useValue: mockJobsService }],
    }).compile();

    controller = module.get<JobsController>(JobsController);
    service = module.get<JobsService>(JobsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCategories', () => {
    it('should return all categories', async () => {
      mockJobsService.findAllCategories.mockResolvedValue([mockCategory]);

      const result = await controller.getCategories();

      expect(result).toEqual([mockCategory]);
      expect(service.findAllCategories).toHaveBeenCalled();
    });
  });

  describe('createJob', () => {
    const mockDto = {
      title: 'Lập trình viên ReactJS',
      categoryId: 1,
      type: 'FULL_TIME',
      location: 'Da Nang',
      salaryMin: 15000000,
      salaryMax: 25000000,
      description: 'Phát triển giao diện web trợ năng',
      requirements: 'Thành thạo React, HTML/CSS',
      suitableDisabilityIds: [1], // Đồng bộ DTO chứa mảng lọc khuyết tật của Controller
    };

    it('should successfully create a job if role is Employer', async () => {
      const mockReq = { user: { id: 'user-uuid-999', role: 'Employer' } };
      mockJobsService.createJob.mockResolvedValue(mockJob);

      const result = await controller.createJob(mockReq, mockDto as any);

      expect(result).toEqual(mockJob);
      expect(service.createJob).toHaveBeenCalledWith('user-uuid-999', mockDto);
    });

    it('should successfully use sub field if id is empty', async () => {
      const mockReq = { user: { sub: 'user-uuid-sub', role: 'Employer' } };
      mockJobsService.createJob.mockResolvedValue(mockJob);

      await controller.createJob(mockReq, mockDto as any);

      expect(service.createJob).toHaveBeenCalledWith('user-uuid-sub', mockDto);
    });

    it('should throw ForbiddenException if user role is not Employer', async () => {
      const mockReq = { user: { id: 'user-uuid-999', role: 'Candidate' } };

      await expect(
        controller.createJob(mockReq, mockDto as any),
      ).rejects.toThrow(
        new ForbiddenException(
          'Chỉ tài khoản Nhà tuyển dụng mới có quyền thực hiện chức năng này.',
        ),
      );

      expect(service.createJob).not.toHaveBeenCalled();
    });
  });

  describe('findAllJobs', () => {
    it('should return a list of filtered jobs', async () => {
      mockJobsService.findAllJobs.mockResolvedValue([mockJob]);

      const result = await controller.findAllJobs('React', 'Da Nang', 1);

      expect(result).toEqual([mockJob]);
      expect(service.findAllJobs).toHaveBeenCalledWith({
        search: 'React',
        location: 'Da Nang',
        categoryId: 1,
      });
    });
  });

  describe('findJobById', () => {
    it('should return job detail by id', async () => {
      mockJobsService.findJobById.mockResolvedValue(mockJob);

      const result = await controller.findJobById('job-uuid-111');

      expect(result).toEqual(mockJob);
      expect(service.findJobById).toHaveBeenCalledWith('job-uuid-111');
    });
  });
});
