import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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

  /**
   * 📊 1. GET: Lấy số liệu 4 ô màu thống kê
   * Endpoint: GET http://localhost:3000/admin/stats
   */
  @Get('stats')
  async getStats() {
    return this.adminService.getDashboardStats();
  }

  /**
   * 🏢 2. GET: Lấy danh sách toàn bộ Doanh nghiệp
   * Endpoint: GET http://localhost:3000/admin/employers
   */
  @Get('employers')
  async getAllEmployers() {
    return this.adminService.getAllEmployers();
  }

  /**
   * 🎓 3. GET: Lấy danh sách toàn bộ Ứng viên
   * Endpoint: GET http://localhost:3000/admin/candidates
   */
  @Get('candidates')
  async getAllCandidates() {
    return this.adminService.getAllCandidates();
  }

  /**
   * 💼 4. GET: Lấy danh sách toàn bộ Tin tuyển dụng
   * Endpoint: GET http://localhost:3000/admin/jobs
   */
  @Get('jobs')
  async getAllJobs() {
    return this.adminService.getAllJobs();
  }

  /**
   * 📄 5. GET: Lấy danh sách toàn bộ Đơn ứng tuyển (Hành chính / Giám sát)
   * Endpoint: GET http://localhost:3000/admin/applications
   */
  @Get('applications')
  async getAllApplications() {
    return this.adminService.getAllApplications();
  }

  /**
   * 🚀 6. PATCH: Cập nhật trạng thái User (Phê duyệt ACTIVE / Khóa BANNED)
   * Endpoint: PATCH http://localhost:3000/admin/users/:id/status
   */
  @Patch('users/:id/status')
  async updateUserStatus(
    @Param('id') userId: string,
    @Body('status') status: 'ACTIVE' | 'BANNED' | 'PENDING',
  ) {
    return this.adminService.updateUserStatus(userId, status);
  }

  /**
   * 🗑️ 7. DELETE: Xóa tin tuyển dụng rác
   * Endpoint: DELETE http://localhost:3000/admin/jobs/:id
   */
  @Delete('jobs/:id')
  async deleteJob(@Param('id') jobId: string) {
    return this.adminService.deleteJob(jobId);
  }

  /**
   * 🗑️ 8. DELETE: Xóa đơn ứng tuyển rác / spam khỏi hệ thống
   * Endpoint: DELETE http://localhost:3000/admin/applications/:id
   */
  @Delete('applications/:id')
  async deleteApplication(@Param('id') applicationId: string) {
    return this.adminService.deleteApplication(applicationId);
  }
}
