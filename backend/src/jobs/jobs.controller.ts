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
import { CreateJobDto } from './dto/create-job.dto';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

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
}
