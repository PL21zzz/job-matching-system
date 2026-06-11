// src/resumes/resumes.service.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CV_RESPONSE_SCHEMA } from './constants/ai-schema.constant';
import { GenerateCvAiDto } from './dto/generate-cv-ai.dto';

@Injectable()
export class ResumesService {
  private ai: GoogleGenerativeAI;

  constructor(private prisma: PrismaService) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY chưa được cấu hình trong tệp .env');
    }
    this.ai = new GoogleGenerativeAI(apiKey);
  }
  async generateCvWithAi(userId: string, dto: GenerateCvAiDto) {
    const { jobId } = dto;

    // 1. Query DB Neon lấy thông tin Chi tiết công việc (Job Specs)
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      select: {
        title: true,
        description: true,
        requirements: true,
      },
    });

    if (!job) {
      throw new BadRequestException('Không tìm thấy tin tuyển dụng yêu cầu.');
    }

    // 2. Query DB Neon lấy thông tin Ứng viên cơ bản (User Context)
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        fullName: true,
        candidateProfile: {
          include: {
            disabilityType: true,
          },
        },
      },
    });

    if (!user) {
      throw new BadRequestException(
        'Không tìm thấy thông tin ứng viên trong hệ thống.',
      );
    }

    const disabilityName =
      user.candidateProfile?.disabilityType?.name || 'Không xác định';

    // 3. Xây dựng Kịch bản Prompt chi tiết gửi cho AI
    const prompt = `
      Bạn là một chuyên gia viết CV (Resume Expert) và tư vấn hướng nghiệp xuất sắc trong ngành công nghệ thông tin.
      Nhiệm vụ của bạn là hãy viết nội dung cho một bản CV xin việc bằng TIẾNG VIỆT, được tinh chỉnh và gọt giũa khéo léo để phù hợp 100% với yêu cầu của tin tuyển dụng dưới đây.

      --- THÔNG TIN TIN TUYỂN DỤNG ĐÍCH MÀ CV CẦN HƯỚNG TỚI ---
      Vị trí công việc: ${job.title}
      Mô tả công việc (JD): ${job.description}
      Yêu cầu kỹ thuật (Requirements): ${job.requirements}

      --- THÔNG TIN NGỮ CẢNH ỨNG VIÊN ---
      Tên ứng viên: ${user.fullName}
      Loại khuyết tật hỗ trợ trợ năng: ${disabilityName}
      (Lưu ý quan trọng cho AI: Không được nhắc trực tiếp từ khóa khuyết tật vào các phần nội dung như Summary, Experience, Projects. Thay vào đó, hãy viết nội dung thể hiện ứng viên có tư duy logic cao, kiên trì, tập trung sâu sắc vào công việc và có khả năng làm việc tối ưu trên máy tính).

      --- YÊU CẦU ĐẦU RA ---
      Hãy sinh các phần nội dung CV bao gồm: jobTitle, summary, experienceBullets, projects, skills, certifications, awards.
      Nội dung phải thực tế, chuyên nghiệp, ngôn từ sắc bén chuẩn ngành kỹ thuật phần mềm, mang tính thuyết phục nhà tuyển dụng cao.
    `;

    try {
      // 🚀 ĐÃ CẬP NHẬT CHUẨN XỊN: Đổi sang model thế hệ mới nhất gemini-2.5-flash
      const model = this.ai.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: {
          responseMimeType: 'application/json', // Ép định dạng trả về là JSON
          responseSchema: CV_RESPONSE_SCHEMA, // Bộ khung ép cấu trúc chặt chẽ từ constants
          temperature: 0.7,
        },
      });

      // 5. Kích hoạt gọi AI xử lý bất đồng bộ (Giữ nguyên toàn bộ logic bên dưới)
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      const responseText = result.response.text();

      if (!responseText) {
        throw new InternalServerErrorException(
          'Mô hình AI trả về kết quả rỗng.',
        );
      }

      return JSON.parse(responseText);
    } catch (error) {
      console.error('❌ LỖI GỌI GEMINI AI SERVICE:', error);
      throw new InternalServerErrorException(
        `Hệ thống AI đang bận hoặc xảy ra lỗi kết nối: ${reportError || error}`,
      );
    }
  }
}
