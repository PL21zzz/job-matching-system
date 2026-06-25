import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalCandidates,
      totalEmployers,
      pendingEmployers,
      openJobs,
      totalApplications,
      totalStories,
    ] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.candidateProfile.count(),
        this.prisma.user.count({
          where: {
            role: { name: 'Employer' },
          },
        }),
        this.prisma.user.count({
          where: {
            role: { name: 'Employer' },
            status: 'PENDING',
          },
        }),
        this.prisma.job.count({
          where: { status: 'OPEN' },
        }),
        this.prisma.application.count(),
        this.prisma.testimonial.count(),
      ]);

    return {
      totalUsers,
      totalCandidates,
      totalEmployers,
      pendingEmployers,
      openJobs,
      totalApplications,
      totalStories,
    };
  }

  async getPendingEmployers() {
    return this.prisma.user.findMany({
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
        employerProfile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

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

  async getAllCategories() {
    return this.prisma.category.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  async getAllStories() {
    return this.prisma.testimonial.findMany({
      include: {
        author: {
          include: {
            user: {
              select: {
                fullName: true,
                email: true,
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

  async createCategory(name: string) {
    const normalizedName = name?.trim();

    if (!normalizedName) {
      throw new BadRequestException('Tên category không được để trống.');
    }

    const existing = await this.prisma.category.findUnique({
      where: { name: normalizedName },
    });

    if (existing) {
      throw new BadRequestException('Category này đã tồn tại.');
    }

    return this.prisma.category.create({
      data: {
        name: normalizedName,
      },
    });
  }

  async updateCategory(categoryId: number, name: string) {
    const normalizedName = name?.trim();

    if (!categoryId || Number.isNaN(categoryId)) {
      throw new BadRequestException('ID category không hợp lệ.');
    }

    if (!normalizedName) {
      throw new BadRequestException('Tên category không được để trống.');
    }

    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Không tìm thấy category này.');
    }

    const duplicate = await this.prisma.category.findFirst({
      where: {
        name: normalizedName,
        NOT: { id: categoryId },
      },
    });

    if (duplicate) {
      throw new BadRequestException('Đã có category khác trùng tên này.');
    }

    return this.prisma.category.update({
      where: { id: categoryId },
      data: {
        name: normalizedName,
      },
    });
  }

  async deleteCategory(categoryId: number) {
    if (!categoryId || Number.isNaN(categoryId)) {
      throw new BadRequestException('ID category không hợp lệ.');
    }

    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        jobs: {
          select: { id: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Không tìm thấy category này.');
    }

    if (category.jobs.length > 0) {
      throw new BadRequestException(
        'Category này đang được dùng bởi tin tuyển dụng, chưa thể xóa.',
      );
    }

    return this.prisma.category.delete({
      where: { id: categoryId },
    });
  }

  async updateUserStatus(
    userId: string,
    status: 'ACTIVE' | 'BANNED' | 'PENDING',
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản người dùng này.');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { status },
    });
  }

  async deleteUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        candidateProfile: true,
        employerProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản người dùng này.');
    }

    if (user.role?.name === 'Admin') {
      throw new BadRequestException(
        'Hiện tại không hỗ trợ xóa trực tiếp tài khoản quản trị viên.',
      );
    }

    await this.prisma.$transaction(async (tx) => {
      if (user.candidateProfile) {
        await tx.application.deleteMany({
          where: { candidateId: user.candidateProfile.id },
        });

        await tx.testimonial.updateMany({
          where: { authorId: user.candidateProfile.id },
          data: { authorId: null },
        });

        await tx.candidateProfile.delete({
          where: { id: user.candidateProfile.id },
        });
      }

      if (user.employerProfile) {
        const employerJobs = await tx.job.findMany({
          where: { employerId: user.employerProfile.id },
          select: { id: true },
        });

        const jobIds = employerJobs.map((job) => job.id);

        if (jobIds.length > 0) {
          await tx.application.deleteMany({
            where: {
              jobId: { in: jobIds },
            },
          });

          for (const job of employerJobs) {
            await tx.job.delete({
              where: { id: job.id },
            });
          }
        }

        await tx.employerProfile.delete({
          where: { id: user.employerProfile.id },
        });
      }

      await tx.user.delete({
        where: { id: userId },
      });
    });

    return { message: 'Đã xóa tài khoản người dùng và dữ liệu liên quan.' };
  }

  async deleteJob(jobId: string) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('Không tìm thấy tin tuyển dụng này.');
    }

    return this.prisma.job.delete({
      where: { id: jobId },
    });
  }

  async deleteApplication(applicationId: string) {
    const app = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });
    if (!app) {
      throw new NotFoundException('Không tìm thấy đơn ứng tuyển này.');
    }

    return this.prisma.application.delete({
      where: { id: applicationId },
    });
  }

  async deleteStory(storyId: string) {
    const story = await this.prisma.testimonial.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      throw new NotFoundException('Không tìm thấy bài viết/câu chuyện này.');
    }

    return this.prisma.testimonial.delete({
      where: { id: storyId },
    });
  }
}
