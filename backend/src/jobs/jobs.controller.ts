import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApplyJobDto } from './dto/apply-job.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get('categories')
  async getCategories() {
    return await this.jobsService.findAllCategories();
  }

  @Get('disability-types')
  async getDisabilityTypes() {
    return await this.jobsService.findAllDisabilityTypes();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createJob(@Req() req: any, @Body() createJobDto: CreateJobDto) {
    const userId = req.user?.sub || req.user?.id;
    const userRole = req.user?.role;

    if (userRole !== 'Employer') {
      throw new ForbiddenException(
        'Chỉ tài khoản Nhà tuyển dụng mới có quyền thực hiện chức năng này.',
      );
    }

    return this.jobsService.createJob(userId, createJobDto);
  }

  @Get()
  async findAllJobs(
    @Query('search') search?: string,
    @Query('location') location?: string,
    @Query('categoryId') categoryId?: number,
  ) {
    return this.jobsService.findAllJobs({ search, location, categoryId });
  }

  @Get(':id')
  async findJobById(@Param('id') id: string) {
    return this.jobsService.findJobById(id);
  }

  @Get('generate-cover/:jobId')
  @UseGuards(JwtAuthGuard)
  async generateCover(@Req() req: any, @Param('jobId') jobId: string) {
    // Giải mã JWT token lấy đi UserId (req.user.sub hoặc id tùy thuộc vào cách cấu hình chiến lược Passport của sếp)
    const userId = req.user.id || req.user.sub;
    return this.jobsService.generateCoverLetterAi(userId, jobId);
  }

  /**
   * 🚀 CỔNG 2: Bấm nút chính thức nộp đơn ứng tuyển xuống Docker Postgres (Phương thức POST)
   */
  @Post('apply')
  @UseGuards(JwtAuthGuard)
  async applyJob(@Req() req: any, @Body() dto: ApplyJobDto) {
    const userId = req.user.id || req.user.sub;
    return this.jobsService.applyJob(userId, dto);
  }
}
