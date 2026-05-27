import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllCategories() {
    return await this.prisma.category.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  async createJob(userId: string, dto: CreateJobDto) {
    // 1. Kiểm tra xem tài khoản này đã cấu hình Hồ sơ doanh nghiệp chưa
    const employerProfile = await this.prisma.employerProfile.findUnique({
      where: { userId: userId },
    });

    if (!employerProfile) {
      throw new BadRequestException(
        'Tài khoản của bạn chưa hoàn thiện hồ sơ nhà tuyển dụng để có thể đăng tin.',
      );
    }

    // 2. Kiểm tra xem ngành nghề (categoryId) có tồn tại không
    const categoryExists = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!categoryExists) {
      throw new NotFoundException(
        'Ngành nghề tuyển dụng được chọn không tồn tại.',
      );
    }

    const { suitableDisabilityIds, ...jobData } = dto;

    // 3. Tiến hành tạo bài đăng Job mới kết nối chuẩn với bảng liên kết Nhiều - Nhiều
    return await this.prisma.job.create({
      data: {
        title: jobData.title,
        description: jobData.description,
        requirements: jobData.requirements,
        salaryMin: jobData.salaryMin,
        salaryMax: jobData.salaryMax,
        salaryText: jobData.salaryText,
        location: jobData.location,
        type: jobData.type || 'FULL_TIME',
        accessibilityFeatures: jobData.accessibilityFeatures,
        employerId: employerProfile.id,
        categoryId: jobData.categoryId,
        status: 'OPEN',

        suitableDisabilities: {
          connect: Array.isArray(suitableDisabilityIds)
            ? suitableDisabilityIds.map((id: number) => ({ id: Number(id) }))
            : [],
        },
      },
      include: {
        employer: {
          select: {
            companyName: true,
          },
        },
        suitableDisabilities: true,
      },
    });
  }

  // Lấy danh sách Job có bộ lọc động
  async findAllJobs(filters: {
    search?: string;
    location?: string;
    categoryId?: number;
  }) {
    const { search, location, categoryId } = filters;

    return await this.prisma.job.findMany({
      where: {
        status: 'OPEN', // Chỉ lấy những Job đang mở tuyển dụng
        ...(categoryId && { categoryId: Number(categoryId) }), // Nếu có chọn ngành nghề thì lọc theo ngành nghề
        ...(location && {
          location: { contains: location, mode: 'insensitive' },
        }), // Lọc theo địa điểm
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }), // Lọc theo từ khóa tìm kiếm (tiêu đề hoặc mô tả)
      },
      include: {
        employer: {
          select: {
            companyName: true,
            address: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        suitableDisabilities: true,
      },
      orderBy: {
        createdAt: 'desc', // Tin mới đăng xếp lên đầu
      },
    });
  }

  // Xem chi tiết một bài tuyển dụng cụ thể
  async findJobById(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        employer: {
          select: {
            companyName: true,
            description: true,
            address: true,
            accessibilityFeatures: true, // Tiện ích trợ năng gốc của văn phòng doanh nghiệp
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        suitableDisabilities: true,
      },
    });

    if (!job) {
      throw new NotFoundException(
        'Không tìm thấy bài đăng tuyển dụng này hoặc tin đã bị đóng.',
      );
    }

    return job;
  }

  async findAllDisabilityTypes() {
    return await this.prisma.disabilityType.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }
}
