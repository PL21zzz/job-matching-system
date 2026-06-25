import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  async getStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('employers')
  async getAllEmployers() {
    return this.adminService.getAllEmployers();
  }

  @Get('candidates')
  async getAllCandidates() {
    return this.adminService.getAllCandidates();
  }

  @Get('jobs')
  async getAllJobs() {
    return this.adminService.getAllJobs();
  }

  @Get('applications')
  async getAllApplications() {
    return this.adminService.getAllApplications();
  }

  @Get('categories')
  async getAllCategories() {
    return this.adminService.getAllCategories();
  }

  @Get('stories')
  async getAllStories() {
    return this.adminService.getAllStories();
  }

  @Post('categories')
  async createCategory(@Body('name') name: string) {
    return this.adminService.createCategory(name);
  }

  @Patch('categories/:id')
  async updateCategory(@Param('id') categoryId: string, @Body('name') name: string) {
    return this.adminService.updateCategory(Number(categoryId), name);
  }

  @Delete('categories/:id')
  async deleteCategory(@Param('id') categoryId: string) {
    return this.adminService.deleteCategory(Number(categoryId));
  }

  @Patch('users/:id/status')
  async updateUserStatus(
    @Param('id') userId: string,
    @Body('status') status: 'ACTIVE' | 'BANNED' | 'PENDING',
  ) {
    return this.adminService.updateUserStatus(userId, status);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') userId: string) {
    return this.adminService.deleteUser(userId);
  }

  @Delete('jobs/:id')
  async deleteJob(@Param('id') jobId: string) {
    return this.adminService.deleteJob(jobId);
  }

  @Delete('applications/:id')
  async deleteApplication(@Param('id') applicationId: string) {
    return this.adminService.deleteApplication(applicationId);
  }

  @Delete('stories/:id')
  async deleteStory(@Param('id') storyId: string) {
    return this.adminService.deleteStory(storyId);
  }
}
