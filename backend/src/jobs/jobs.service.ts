import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApplyJobDto } from './dto/apply-job.dto';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobsService {
  private ai: GoogleGenerativeAI;
  constructor(private readonly prisma: PrismaService) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY chưa được cấu hình tại file .env Backend.',
      );
    }
    this.ai = new GoogleGenerativeAI(apiKey);
  }

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

  async generateCoverLetterAi(userId: string, jobId: string) {
    // Kiếm tin tuyển dụng trong Docker Postgres
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job)
      throw new NotFoundException('Công việc này không tồn tại trên hệ thống.');

    // Kiếm profile ứng viên và kéo theo dải danh mục loại khuyết tật trợ năng
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        candidateProfile: {
          include: { disabilityType: true },
        },
      },
    });

    if (!user || !user.candidateProfile) {
      throw new BadRequestException(
        'Hồ sơ ứng viên chưa được thiết lập đầy đủ thông tin cá nhân.',
      );
    }

    const disabilityName =
      user.candidateProfile.disabilityType?.name ||
      'Cần hỗ trợ trợ năng tổng quát';

    // Thiết kế Prompt bẻ lái kịch bản tinh tế, tôn vinh năng lực ứng viên
    const prompt = `
      Bạn là một chuyên gia cố vấn hướng nghiệp và viết thư ứng tuyển (Cover Letter) xuất sắc.
      Hãy soạn thảo một bức thư xin việc ngắn gọn, trang trọng và mang tính thuyết phục cao (khoảng 200-250 từ) bằng TIẾNG VIỆT để gửi đến bộ phận nhân sự cho vị trí: ${job.title}.

      Mô tả công việc (JD): ${job.description}
      Yêu cầu chuyên môn: ${job.requirements}

      Thông tin ứng viên:
      - Họ và tên: ${user.fullName}
      - Bối cảnh trợ năng: Ứng viên thuộc nhóm đặc thù (${disabilityName}).

      ⚠️ NGUYÊN TẮC BIÊN SOẠN CHÍ MẠNG:
      - Tuyệt đối KHÔNG kể khổ, không dùng từ ngữ bi quan, không tạo cảm giác tự ti hoặc cầu xin lòng trắc ẩn của nhà tuyển dụng.
      - Hãy nhấn mạnh góc nhìn tích cực: Ứng viên sở hữu sự kiên trì vượt trội, khả năng làm việc sâu, tập trung cao độ với máy tính và thành thạo các công cụ công nghệ để tối ưu hóa hiệu suất công việc.
      - Làm bật lên việc các kỹ năng của ứng viên cực kỳ tương thích với những gì tin tuyển dụng đang tìm kiếm.

      Yêu cầu định dạng: Chỉ trả về nội dung chữ thuần túy của bức thư, không bọc tiêu đề Markdown (không có dấu #), không chứa ký tự bọc văn bản lỗi.
    `;

    try {
      const model = this.ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(prompt);
      return { coverLetter: result.response.text().trim() };
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Lỗi hệ thống AI sinh Cover Letter: ${error.message || error}`,
      );
    }
  }

  /**
   * 💾 LUỒNG NỘP ĐƠN: Lưu chính thức bản ghi vào Docker Postgres
   */
  async applyJob(userId: string, dto: ApplyJobDto) {
    // Tìm mã ứng viên CandidateProfile dựa trên User ID đăng nhập
    const candidateProfile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
    });

    if (!candidateProfile) {
      throw new BadRequestException(
        'Tài khoản của bạn chưa khởi tạo phân hệ Hồ sơ ứng viên.',
      );
    }

    // Chặn trùng lặp: Nếu ứng viên đã nộp đơn vào job này rồi thì không cho nộp nữa
    const existingApplication = await this.prisma.application.findFirst({
      where: {
        candidateId: candidateProfile.id,
        jobId: dto.jobId,
      },
    });

    if (existingApplication) {
      throw new BadRequestException(
        'Hệ thống ghi nhận bạn đã gửi đơn ứng tuyển cho vị trí này trước đó.',
      );
    }

    // Tạo bản ghi lưu trữ thư ứng tuyển mới tinh vào cột coverLetter vừa bổ sung ở Prisma
    return this.prisma.application.create({
      data: {
        candidateId: candidateProfile.id,
        jobId: dto.jobId,
        coverLetter: dto.coverLetter,
        status: 'APPLIED', // Gắn cờ trạng thái nộp đơn mặc định từ Schema
      },
    });
  }
}
