// backend/src/admin/admin.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalCandidates, pendingEmployers, openJobs, rejectedApplications] =
      await Promise.all([
        this.prisma.candidateProfile.count(),

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

  async getAllEmployers() {
    return this.prisma.user.findMany({
      where: {
        role: {
          name: 'Employer',
        },
      },
      include: {
        employerProfile: true, // Bốc kèm theo profile công ty để lấy tên, địa chỉ
      },
      orderBy: {
        createdAt: 'desc', // Doanh nghiệp mới đăng ký xếp lên đầu
      },
    });
  }

  async getAllCandidates() {
    return this.prisma.user.findMany({
      where: {
        role: {
          name: 'Candidate', // Chỉ lấy những người có quyền là Ứng viên
        },
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        status: true,
        createdAt: true,
        candidateProfile: {
          select: {
            disabilityType: {
              select: {
                name: true, // Lấy tên loại khuyết tật hiển thị lên bảng
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Người mới đăng ký xếp lên đầu
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
