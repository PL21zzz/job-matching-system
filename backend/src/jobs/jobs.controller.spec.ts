import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';

const mockJobsService = {
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

  describe('findAllJobs (Public Search)', () => {
    it('should call service.findAllJobs with correct query filters', async () => {
      mockJobsService.findAllJobs.mockResolvedValue([]);

      const result = await controller.findAllJobs('NodeJS', 'Hanoi', 2);

      expect(result).toEqual([]);
      expect(service.findAllJobs).toHaveBeenCalledWith({
        search: 'NodeJS',
        location: 'Hanoi',
        categoryId: 2,
      });
    });
  });

  describe('findJobById (Public Detail View)', () => {
    it('should call service.findJobById with clear parameters', async () => {
      mockJobsService.findJobById.mockResolvedValue({ id: 'job-123' });

      const result = await controller.findJobById('job-123');

      expect(result).toEqual({ id: 'job-123' });
      expect(service.findJobById).toHaveBeenCalledWith('job-123');
    });
  });
});
