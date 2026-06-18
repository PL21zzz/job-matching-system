import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
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
   * Cổng 1: Lấy số liệu cho 4 khối màu + Biểu đồ
   * Cổng gọi từ Frontend: GET /admin/stats
   */
  @Get('stats')
  async getStats() {
    return this.adminService.getDashboardStats();
  }

  /**
   * Cổng 2: Lấy danh sách doanh nghiệp đang xếp hàng chờ duyệt tài khoản
   * Cổng gọi từ Frontend: GET /admin/employers/pending
   */
  @Get('employers/pending')
  async getPendingEmployers() {
    return this.adminService.getPendingEmployers();
  }

  /**
   * Cổng 3: Ra lệnh Phê duyệt (ACTIVE) hoặc Ban/Khóa (BANNED) một User
   * Cổng gọi từ Frontend: PATCH /admin/users/:id/status
   */
  @Patch('users/:id/status')
  async updateUserStatus(
    @Param('id') id: string,
    @Body('status') status: 'ACTIVE' | 'BANNED' | 'PENDING',
  ) {
    return this.adminService.updateUserStatus(id, status);
  }
}
