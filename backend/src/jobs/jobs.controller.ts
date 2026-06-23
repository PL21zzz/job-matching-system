import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApplyJobDto } from './dto/apply-job.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { InterviewPracticeDto } from './dto/interview-practice.dto';
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Employer')
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Candidate')
  async generateCover(@Req() req: any, @Param('jobId') jobId: string) {
    // Giải mã JWT token lấy đi UserId (req.user.sub hoặc id tùy thuộc vào cách cấu hình chiến lược Passport của sếp)
    const userId = req.user.id || req.user.sub;
    return this.jobsService.generateCoverLetterAi(userId, jobId);
  }

  @Post(':id/interview-practice')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Candidate')
  async practiceInterview(
    @Req() req: any,
    @Param('id') jobId: string,
    @Body() dto: InterviewPracticeDto,
  ) {
    const userId = req.user.id || req.user.sub;
    return this.jobsService.practiceInterview(userId, jobId, dto);
  }

  @Post('apply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Candidate')
  @UseInterceptors(FileInterceptor('file')) // 🌟 BẮT BUỘC: Mở cổng Multer interceptor bắt biến 'file' từ FE gửi lên
  async applyJob(
    @Req() req: any,
    @Body() dto: ApplyJobDto,
    @UploadedFile() file: Express.Multer.File, // 🌟 BẮT BUỘC: Khai báo để nhận file vật lý thô từ bộ nhớ đệm
  ) {
    const userId = req.user.id || req.user.sub; //

    if (!file) {
      throw new BadRequestException(
        'Hệ thống không tìm thấy file CV đính kèm của bạn.',
      );
    }

    // Ném cả userId, dữ liệu chữ (dto), và file vật lý xuống cho tầng Service xử lý
    return this.jobsService.applyJob(userId, dto, file);
  }

  @Get('employer/applications')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Employer')
  async getEmployerApplications(@Req() req: any) {
    const userId = req.user.id || req.user.sub;
    return this.jobsService.findEmployerApplications(userId);
  }

  @Patch('applications/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Employer')
  async updateStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.jobsService.updateApplicationStatus(req.user.sub, id, status);
  }
}
