import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import OpenAI from 'openai';
import { PrismaService } from '../prisma/prisma.service';
import { ApplyJobDto } from './dto/apply-job.dto';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobsService {
  private ai: GoogleGenerativeAI;
  private openai: OpenAI;
  constructor(private readonly prisma: PrismaService) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY chưa được cấu hình tại file .env Backend.',
      );
    }
    this.ai = new GoogleGenerativeAI(apiKey);
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async findAllCategories() {
    return await this.prisma.category.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  async createJob(userId: string, dto: CreateJobDto) {
    const employerProfile = await this.prisma.employerProfile.findUnique({
      where: { userId: userId },
    });

    if (!employerProfile) {
      throw new BadRequestException(
        'Tài khoản của bạn chưa hoàn thiện hồ sơ nhà tuyển dụng để có thể đăng tin.',
      );
    }

    const categoryExists = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!categoryExists) {
      throw new NotFoundException(
        'Ngành nghề tuyển dụng được chọn không tồn tại.',
      );
    }

    const { suitableDisabilityIds, ...jobData } = dto;

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

  async findAllJobs(filters: {
    search?: string;
    location?: string;
    categoryId?: number;
  }) {
    const { search, location, categoryId } = filters;

    return await this.prisma.job.findMany({
      where: {
        status: 'OPEN',
        ...(categoryId && { categoryId: Number(categoryId) }),
        ...(location && {
          location: { contains: location, mode: 'insensitive' },
        }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }),
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
        createdAt: 'desc',
      },
    });
  }

  async findJobById(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        employer: {
          select: {
            companyName: true,
            description: true,
            address: true,
            accessibilityFeatures: true,
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
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job)
      throw new NotFoundException('Công việc này không tồn tại trên hệ thống.');

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

  async applyJob(userId: string, dto: ApplyJobDto, file: Express.Multer.File) {
    // 1. KIỂM TRA THÔNG TIN HỒ SƠ ỨNG VIÊN
    const candidateProfile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
      include: { disabilityType: true },
    });

    if (!candidateProfile) {
      throw new BadRequestException(
        'Tài khoản của bạn chưa khởi tạo phân hệ Hồ sơ ứng viên.',
      );
    }

    // 2. KIỂM TRA ĐƠN ỨNG TUYỂN TRÙNG LẶP
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

    // 3. KIỂM TRA TIN TUYỂN DỤNG
    const job = await this.prisma.job.findUnique({ where: { id: dto.jobId } });
    if (!job) throw new NotFoundException('Tin tuyển dụng này không tồn tại.');

    // 4. TIẾN TRÌNH UPLOAD FILE LÊN CLOUDINARY LẤY URL THẬT
    let secureCvUrl = '';
    try {
      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: 'raw', // Lưu trữ tệp tin dạng văn bản/PDF
              folder: 'candidate_cvs',
              public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, '')}`,
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            },
          )
          .end(file.buffer);
      });
      secureCvUrl = uploadResult.secure_url;
      console.log('=== UPLOAD CV LÊN CLOUDINARY THÀNH CÔNG ===', secureCvUrl);
    } catch (uploadError) {
      console.error('Lỗi upload Cloudinary:', uploadError);
      throw new BadRequestException(
        'Hệ thống không thể lưu trữ tệp tin CV. Vui lòng thử lại.',
      );
    }

    // Trích xuất chữ thô ban đầu từ buffer file (Loại bỏ các ký tự nhị phân lỗi)
    const extractedCvText = file.buffer
      .toString('utf8')
      .replace(/[^\x20-\x7E\x0A\x0D]/g, ' ');

    // 5. LUỒNG CHẤM ĐIỂM THÔNG MINH BẰNG OPENAI GPT-4O-MINI
    let computedScore = 70; // Điểm mặc định phòng hờ lỗi mạng

    try {
      console.log('=== ĐANG GỬI DỮ LIỆU SANG OPENAI GPT CHẤM ĐIỂM... ===');

      const matchPrompt = `
        Bạn là một chuyên gia Tuyển dụng nhân sự cao cấp (ATS System).
        Hãy phân tích nội dung chữ trích xuất từ CV của Ứng viên và so sánh với Yêu cầu công việc (JD) sau để chấm điểm độ tương thích.

        [YÊU CẦU CÔNG VIỆC (JD)]:
        - Tiêu đề: ${job.title}
        - Mô tả: ${job.description}
        - Yêu cầu: ${job.requirements}

        [THƯ GIỚI THIỆU (COVER LETTER)]:
        ${dto.coverLetter || 'Không có thư giới thiệu.'}

        [DỮ LIỆU VĂN BẢN TRÍCH XUẤT TỪ CV]:
        ${extractedCvText.substring(0, 5000)}

        Nhiệm vụ của bạn: Đánh giá mức độ tương thích (Match Score) giữa CV và JD từ 0 đến 100.
        BẮT BUỘC TRẢ VỀ ĐỊNH DẠNG JSON NGUYÊN BẢN, KHÔNG CHỨA BLOCK MARKDOWN (\`\`\`json):
        {
          "matchScore": số_nguyên_từ_0_đến_100
        }
      `;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: matchPrompt }],
        temperature: 0.2,
        response_format: { type: 'json_object' }, // Ép OpenAI trả về cấu trúc JSON sạch
      });

      const rawJson = completion.choices[0].message.content?.trim();
      if (rawJson) {
        const parsedData = JSON.parse(rawJson);
        if (parsedData && typeof parsedData.matchScore === 'number') {
          computedScore = parsedData.matchScore;
        }
      }
      console.log(
        '=== OPENAI SMARTMATCH XỬ LÝ THÀNH CÔNG === Điểm số thật:',
        computedScore,
      );
    } catch (aiError) {
      console.error('Lỗi tiến trình OpenAI chấm điểm:', aiError);
      // Fallback giữ nguyên 70 điểm để luồng ứng tuyển không bị gián đoạn
    }

    // 6. GHI NHẬN ĐƠN ỨNG TUYỂN CHÍNH THỨC VÀO CƠ SỞ DỮ LIỆU
    return this.prisma.application.create({
      data: {
        candidateId: candidateProfile.id,
        jobId: dto.jobId,
        coverLetter: dto.coverLetter,
        cvUrl: secureCvUrl,
        cvTextRaw: extractedCvText.substring(0, 3000), // Lưu trữ text sạch phục vụ tìm kiếm từ khóa sau này
        status: 'APPLIED',
        matchScore: computedScore,
      },
    });
  }

  async findEmployerApplications(userId: string) {
    const employerProfile = await this.prisma.employerProfile.findUnique({
      where: { userId: userId },
    });

    if (!employerProfile) {
      throw new BadRequestException(
        'Tài khoản của bạn không có quyền truy cập dữ liệu nhà tuyển dụng.',
      );
    }

    return await this.prisma.application.findMany({
      where: {
        job: {
          employerId: employerProfile.id,
        },
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
        candidate: {
          include: {
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
            disabilityType: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        appliedAt: 'desc',
      },
    });
  }

  async updateApplicationStatus(applicationId: string, status: string) {
    const validStatuses = [
      'APPLIED',
      'REVIEWING',
      'INTERVIEW',
      'ACCEPTED',
      'REJECTED',
    ];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Trạng thái cập nhật không hợp lệ.');
    }

    const application = await this.prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw new NotFoundException('Không tìm thấy đơn ứng tuyển yêu cầu.');
    }

    return await this.prisma.application.update({
      where: { id: applicationId },
      data: { status },
    });
  }
}
