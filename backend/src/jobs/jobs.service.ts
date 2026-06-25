import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import OpenAI from 'openai';
import { PrismaService } from '../prisma/prisma.service';
import { ApplyJobDto } from './dto/apply-job.dto';
import {
  extractAccessibilityTags,
  SUPPORTED_DISABILITY_TYPE_IDS,
} from './disability-support';
import { CreateJobDto } from './dto/create-job.dto';
import { InterviewPracticeDto } from './dto/interview-practice.dto';
import { MatchScoreService } from './match-score.service';

@Injectable()
export class JobsService {
  private ai: GoogleGenerativeAI;
  private openai?: OpenAI;
  private static readonly AI_TIMEOUT_MS = 30000;

  constructor(
    private readonly prisma: PrismaService,
    private readonly matchScoreService: MatchScoreService,
  ) {
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
    if (
      process.env.MATCH_SCORE_PROVIDER === 'openai' &&
      process.env.OPENAI_API_KEY
    ) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
  }

  private withAiTimeout<T>(promise: Promise<T>, label = 'Gemini'): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(
          () => reject(new Error(`${label} timeout after 30 seconds`)),
          JobsService.AI_TIMEOUT_MS,
        ),
      ),
    ]);
  }

  private extractJsonObjectFromAiText(rawText: string) {
    if (!rawText) return null;

    const trimmed = rawText.trim();
    const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    const candidate = fencedMatch?.[1]?.trim() || trimmed;

    try {
      return JSON.parse(candidate);
    } catch {
      const firstBrace = candidate.indexOf('{');
      const lastBrace = candidate.lastIndexOf('}');

      if (firstBrace >= 0 && lastBrace > firstBrace) {
        const sliced = candidate.slice(firstBrace, lastBrace + 1);
        try {
          return JSON.parse(sliced);
        } catch {
          return null;
        }
      }

      return null;
    }
  }

  private async generateInterviewPracticeContent(prompt: string) {
    const fallbackFocusPoints = [
      'Trả lời rõ ví dụ thực tế',
      'Nêu kỹ năng liên quan trực tiếp đến vị trí',
      'Giữ câu trả lời ngắn gọn, tự tin',
    ];

    const retryDelays = [0, 1200, 2500];
    let lastError: any = null;

    for (let attempt = 0; attempt < retryDelays.length; attempt += 1) {
      if (retryDelays[attempt] > 0) {
        await new Promise((resolve) => setTimeout(resolve, retryDelays[attempt]));
      }

      try {
        const model = this.ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await this.withAiTimeout(
          model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
          },
          }),
          'Gemini interview practice',
        );
        const rawText = result.response.text().trim();

        const parsed = this.extractJsonObjectFromAiText(rawText);
        if (parsed) {
          return {
            reply: parsed.reply || 'Chúng ta bắt đầu buổi tập phỏng vấn nhé.',
            focusPoints: Array.isArray(parsed.focusPoints)
              ? parsed.focusPoints.slice(0, 3)
              : fallbackFocusPoints,
          };
        }

        return {
          reply: rawText || 'Chúng ta bắt đầu buổi tập phỏng vấn nhé.',
          focusPoints: fallbackFocusPoints,
        };
      } catch (error: any) {
        lastError = error;
        const message = String(error?.message || error || '');
        const isTemporaryOverload =
          message.includes('503') ||
          message.toLowerCase().includes('service unavailable') ||
          message.toLowerCase().includes('high demand');

        if (!isTemporaryOverload || attempt === retryDelays.length - 1) {
          break;
        }
      }
    }

    const finalMessage = String(lastError?.message || lastError || '');

    if (
      finalMessage.includes('503') ||
      finalMessage.toLowerCase().includes('service unavailable') ||
      finalMessage.toLowerCase().includes('high demand')
    ) {
      throw new ServiceUnavailableException(
        'AI phỏng vấn đang tạm quá tải. Bạn đợi khoảng 10-30 giây rồi thử lại giúp mình.',
      );
    }

    throw new InternalServerErrorException(
      `Lỗi AI phỏng vấn thử: ${finalMessage}`,
    );
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
    const disabilityIds = Array.isArray(suitableDisabilityIds)
      ? suitableDisabilityIds.map((id) => Number(id))
      : [];

    if (!disabilityIds.length) {
      throw new BadRequestException(
        'Vui lòng chọn ít nhất 1 trong 4 nhóm khuyết tật hệ thống đang hỗ trợ.',
      );
    }

    if (
      disabilityIds.some(
        (id) => !(SUPPORTED_DISABILITY_TYPE_IDS as readonly number[]).includes(id),
      )
    ) {
      throw new BadRequestException(
        'Vị trí chỉ được cấu hình cho 4 nhóm khuyết tật: vận động, khiếm thị, khiếm thính và câm.',
      );
    }

    if (!extractAccessibilityTags(jobData.accessibilityFeatures).length) {
      throw new BadRequestException(
        'Vui lòng chọn ít nhất 1 accommodation trợ năng để AI và bộ lọc sử dụng.',
      );
    }

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
          connect: disabilityIds.map((id: number) => ({ id })),
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
      where: {
        id: {
          in: [...SUPPORTED_DISABILITY_TYPE_IDS],
        },
      },
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
      const result = await this.withAiTimeout(
        model.generateContent(prompt),
        'Gemini cover letter',
      );
      return { coverLetter: result.response.text().trim() };
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Lỗi hệ thống AI sinh Cover Letter: ${error.message || error}`,
      );
    }
  }

  async practiceInterview(
    userId: string,
    jobId: string,
    dto: InterviewPracticeDto,
  ) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        employer: {
          select: {
            companyName: true,
            description: true,
            accessibilityFeatures: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        suitableDisabilities: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!job) {
      throw new NotFoundException('Không tìm thấy công việc yêu cầu.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        candidateProfile: {
          include: {
            disabilityType: true,
          },
        },
      },
    });

    if (!user || !user.candidateProfile) {
      throw new BadRequestException(
        'Chỉ ứng viên đã có hồ sơ mới có thể tập phỏng vấn với AI.',
      );
    }

    const disabilityNameClean =
      user.candidateProfile.disabilityType?.name || 'Chưa khai báo';
    const totalQuestions = 3;
    const previousUserAnswersClean = (dto.history || []).filter(
      (item) => item.role === 'user',
    ).length;
    const candidateMessageClean = dto.message?.trim() || '';
    const shouldSummarizeClean =
      candidateMessageClean.length > 0 &&
      previousUserAnswersClean >= totalQuestions - 1;
    const currentQuestionClean = shouldSummarizeClean
      ? totalQuestions
      : Math.min(previousUserAnswersClean + 1, totalQuestions);

    const profileSummaryClean = [
      `Họ tên: ${user.fullName}`,
      `Nhóm khuyết tật/nhu cầu hỗ trợ đã khai báo trong profile: ${disabilityNameClean}`,
      user.candidateProfile.address
        ? `Địa chỉ: ${user.candidateProfile.address}`
        : '',
      user.candidateProfile.phone
        ? `Điện thoại: ${user.candidateProfile.phone}`
        : '',
    ]
      .filter(Boolean)
      .join('\n');

    const historyTextClean = (dto.history || [])
      .map((item) => `${item.role}: ${item.content}`)
      .join('\n');

    const promptClean = `
Bạn là một AI interviewer mô phỏng nhà tuyển dụng, đang phỏng vấn một ứng viên khuyết tật cho đúng công việc bên dưới.

[CÔNG VIỆC]
- Vị trí: ${job.title}
- Doanh nghiệp: ${job.employer.companyName}
- Ngành: ${job.category.name}
- Địa điểm: ${job.location}
- Hình thức: ${job.type}
- Mô tả: ${job.description}
- Yêu cầu: ${job.requirements}
- Trợ năng nơi làm việc: ${job.accessibilityFeatures || 'Chưa có mô tả'}
- Nhóm phù hợp: ${job.suitableDisabilities.map((item) => item.name).join(', ') || 'Chưa khai báo'}

[THÔNG TIN ỨNG VIÊN]
${profileSummaryClean}

[LỊCH SỬ PHỎNG VẤN]
${historyTextClean || 'Chưa có'}

[TIN NHẮN MỚI NHẤT CỦA ỨNG VIÊN]
${candidateMessageClean || 'Ứng viên vừa bắt đầu buổi tập phỏng vấn.'}

[TRẠNG THÁI BUỔI TẬP]
- Tổng số câu trả lời cần có: ${totalQuestions}
- Số câu ứng viên đã trả lời trước lượt này: ${previousUserAnswersClean}
- Câu hiện tại: ${currentQuestionClean}/${totalQuestions}
- Chế độ hiện tại: ${shouldSummarizeClean ? 'TỔNG KẾT BUỔI PHỎNG VẤN' : 'TIẾP TỤC PHỎNG VẤN'}

QUY TẮC BẮT BUỘC:
- Trả lời bằng tiếng Việt, có dấu, tự nhiên, rõ ràng.
- Bạn PHẢI ý thức rõ ứng viên thuộc nhóm: ${disabilityNameClean}. Cách hỏi và nhận xét phải phù hợp, tôn trọng, không thương hại, không bi quan.
- Nếu đây là lượt đầu tiên: giới thiệu ngắn và hỏi đúng 1 câu đầu tiên.
- Nếu chưa đến phần tổng kết: nhận xét ngắn câu vừa trả lời rồi hỏi tiếp đúng 1 câu mới.
- Nếu đang ở chế độ TỔNG KẾT BUỔI PHỎNG VẤN:
  1. Nêu điểm mạnh
  2. Nêu điểm cần cải thiện
  3. Gợi ý trả lời tốt hơn
  4. Đánh giá mức độ sẵn sàng
  5. KHÔNG hỏi thêm câu mới
- Trả về JSON thuần, không markdown, không thêm giải thích ngoài JSON:
{
  "reply": "nội dung trả lời của AI",
  "focusPoints": ["ý 1", "ý 2", "ý 3"]
}
`;

    const cleanResult = await this.generateInterviewPracticeContent(promptClean);
    return {
      ...cleanResult,
      isCompleted: shouldSummarizeClean,
      currentQuestion: currentQuestionClean,
      totalQuestions,
      disabilityTypeLabel: disabilityNameClean,
    };

    /*
    const profileSummary = [
      `Họ tên: ${user.fullName}`,
      user.candidateProfile.disabilityType?.name
        ? `Nhóm hỗ trợ: ${user.candidateProfile.disabilityType.name}`
        : '',
      user.candidateProfile.address
        ? `Địa chỉ: ${user.candidateProfile.address}`
        : '',
      user.candidateProfile.phone ? `Điện thoại: ${user.candidateProfile.phone}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const historyText = (dto.history || [])
      .map((item) => `${item.role}: ${item.content}`)
      .join('\n');

    const candidateMessage = dto.message?.trim();
    const prompt = `
Bạn là một nhà tuyển dụng mô phỏng đang phỏng vấn ứng viên cho công việc sau.

[CÔNG VIỆC]
- Vị trí: ${job.title}
- Doanh nghiệp: ${job.employer.companyName}
- Ngành: ${job.category.name}
- Địa điểm: ${job.location}
- Hình thức: ${job.type}
- Mô tả: ${job.description}
- Yêu cầu: ${job.requirements}
- Trợ năng: ${job.accessibilityFeatures || 'Chưa có mô tả'}
- Nhóm phù hợp: ${job.suitableDisabilities.map((item) => item.name).join(', ') || 'Chưa khai báo'}

[THÔNG TIN ỨNG VIÊN]
${profileSummary}

[LỊCH SỬ]
${historyText || 'Chưa có'}

[TIN NHẮN MỚI NHẤT CỦA ỨNG VIÊN]
${candidateMessage || 'Ứng viên vừa bắt đầu buổi tập phỏng vấn.'}

Yêu cầu:
- Trả lời bằng tiếng Việt, có dấu, tự nhiên và chuyên nghiệp.
- Nếu đây là lượt đầu tiên, hãy giới thiệu ngắn và hỏi câu phỏng vấn đầu tiên phù hợp với job.
- Nếu ứng viên vừa trả lời, hãy phản hồi ngắn về điểm mạnh/điểm cần cải thiện trong câu trả lời đó, rồi hỏi tiếp 1 câu khác.
- Ưu tiên câu hỏi bám sát job và hồ sơ ứng viên.
- Trả về JSON thuần với định dạng:
{
  "reply": "nội dung trả lời của AI",
  "focusPoints": ["ý 1", "ý 2", "ý 3"]
}
`;

    return this.generateInterviewPracticeContent(prompt);

    try {
      const model = this.ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(prompt);
      const rawText = result.response.text().trim();

      try {
        const parsed = this.extractJsonObjectFromAiText(rawText);
        if (!parsed) {
          throw new Error('Invalid AI interview JSON payload');
        }
        return {
          reply: parsed.reply || 'Chúng ta bắt đầu buổi tập phỏng vấn nhé.',
          focusPoints: Array.isArray(parsed.focusPoints)
            ? parsed.focusPoints.slice(0, 3)
            : [],
        };
      } catch {
        return {
          reply: rawText || 'Chúng ta bắt đầu buổi tập phỏng vấn nhé.',
          focusPoints: [
            'Trả lời rõ ví dụ thực tế',
            'Nêu kỹ năng liên quan trực tiếp đến vị trí',
            'Giữ câu trả lời ngắn gọn, tự tin',
          ],
        };
      }
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Lỗi AI phỏng vấn thử: ${error.message || error}`,
      );
    }
    */
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
    const extractedCvText = await this.matchScoreService.extractText(file);

    // 5. LUỒNG CHẤM ĐIỂM THÔNG MINH BẰNG OPENAI GPT-4O-MINI
    let computedScore = this.matchScoreService.calculate(
      `${job.title}\n${job.description}\n${job.requirements}`,
      extractedCvText,
      dto.coverLetter,
    ).score;

    if (process.env.MATCH_SCORE_PROVIDER === 'openai' && this.openai) try {
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
        matchScoreSource:
          process.env.MATCH_SCORE_PROVIDER === 'openai'
            ? 'OPENAI_WITH_LOCAL_FALLBACK'
            : 'LOCAL_ATS_V1',
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
            updatedAt: true,
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

  async findEmployerJobs(userId: string) {
    const employerProfile = await this.prisma.employerProfile.findUnique({
      where: { userId },
    });

    if (!employerProfile) {
      throw new BadRequestException(
        'Tài khoản của bạn không có quyền truy cập dữ liệu nhà tuyển dụng.',
      );
    }

    return this.prisma.job.findMany({
      where: {
        employerId: employerProfile.id,
      },
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true,
        createdAt: true,
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async updateApplicationStatus(
    userId: string,
    applicationId: string,
    status: string,
  ) {
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
      include: { job: { include: { employer: true } } },
    });

    if (!application) {
      throw new NotFoundException('Không tìm thấy đơn ứng tuyển yêu cầu.');
    }

    if (application.job.employer.userId !== userId) {
      throw new BadRequestException(
        'Bạn không có quyền cập nhật đơn ứng tuyển của doanh nghiệp khác.',
      );
    }

    return await this.prisma.application.update({
      where: { id: applicationId },
      data: { status },
    });
  }
}
