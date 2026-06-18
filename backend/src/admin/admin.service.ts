// backend/src/admin/admin.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 📊 1. BỐC SỐ LIỆU THỐNG KÊ TỔNG QUAN (Đổ vào 4 ô màu Dashboard)
   */
  async getDashboardStats() {
    // Chạy song song tất cả các lệnh đếm để tối ưu hiệu năng Database
    const [totalCandidates, pendingEmployers, openJobs, rejectedApplications] =
      await Promise.all([
        // Thẻ 1: Tổng số Ứng viên
        this.prisma.candidateProfile.count(),

        // Thẻ 2: Nhà tuyển dụng đang chờ duyệt tài khoản (PENDING)
        this.prisma.user.count({
          where: {
            role: { name: 'Employer' },
            status: 'PENDING',
          },
        }),

        // Thẻ 3: Tin tuyển dụng đang mở public
        this.prisma.job.count({
          where: { status: 'OPEN' },
        }),

        // Thẻ 4: Đơn ứng tuyển bị từ chối
        this.prisma.application.count({
          where: { status: 'REJECTED' },
        }),
      ]);

    return {
      totalCandidates,
      pendingEmployers,
      openJobs,
      rejectedApplications,
    };
  }

  /**
   * 👥 2. LẤY DANH SÁCH DOANH NGHIỆP ĐANG CHỜ DUYỆT (PENDING)
   */
  async getPendingEmployers() {
    return await this.prisma.user.findMany({
      where: {
        role: { name: 'Employer' },
        status: 'PENDING',
      },
      include: {
        employerProfile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * 🚀 3. HÀNH ĐỘNG: PHÊ DUYỆT HOẶC KHÓA TÀI KHOẢN USER
   */
  async updateUserStatus(
    userId: string,
    status: 'ACTIVE' | 'BANNED' | 'PENDING',
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user)
      throw new NotFoundException('Không tìm thấy tài khoản người dùng này.');

    return await this.prisma.user.update({
      where: { id: userId },
      data: { status },
    });
  }
}
