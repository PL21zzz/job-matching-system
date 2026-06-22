import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 📊 1. BỐC SỐ LIỆU THỐNG KÊ TỔNG QUAN (Đổ vào 4 ô màu Dashboard)
   */
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

        this.prisma.job.count({
          where: { status: 'OPEN' },
        }),

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
   * 🏢 3. LẤY TOÀN BỘ DOANH NGHIỆP TRÊN HỆ THỐNG
   */
  async getAllEmployers() {
    return this.prisma.user.findMany({
      where: {
        role: {
          name: 'Employer',
        },
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
   * 🎓 4. LẤY TOÀN BỘ ỨNG VIÊN TRÊN HỆ THỐNG
   */
  async getAllCandidates() {
    return this.prisma.user.findMany({
      where: {
        role: {
          name: 'Candidate',
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
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * 💼 5. LẤY TOÀN BỘ TIN TUYỂN DỤNG (Kèm thông tin công ty và ngành nghề)
   */
  async getAllJobs() {
    return this.prisma.job.findMany({
      include: {
        employer: {
          select: {
            companyName: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * 📄 6. LẤY TOÀN BỘ ĐƠN ỨNG TUYỂN (Giám sát hệ thống - Read-Only)
   */
  async getAllApplications() {
    return this.prisma.application.findMany({
      include: {
        candidate: {
          include: {
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
          },
        },
        job: {
          select: {
            title: true,
            location: true,
          },
        },
      },
      orderBy: {
        appliedAt: 'desc',
      },
    });
  }

  /**
   * 🚀 7. HÀNH ĐỘNG: PHÊ DUYỆT HOẶC KHÓA TÀI KHOẢN USER
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

  /**
   * 🗑️ 8. HÀNH ĐỘNG: XÓA TIN TUYỂN DỤNG RÁC
   */
  async deleteJob(jobId: string) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundException('Không tìm thấy tin tuyển dụng này.');

    // Xóa tin tuyển dụng (Cơ chế Cascade hoặc tự động ngắt quan hệ tùy DB setup)
    return await this.prisma.job.delete({
      where: { id: jobId },
    });
  }

  /**
   * 🗑️ 9. HÀNH ĐỘNG: XÓA ĐƠN ỨNG TUYỂN SAI SÓT HOẶC SPAM (Hành chính)
   */
  async deleteApplication(applicationId: string) {
    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });
    if (!app) throw new NotFoundException('Không tìm thấy đơn ứng tuyển này.');

    return await this.prisma.application.delete({
      where: { id: applicationId },
    });
  }
}
