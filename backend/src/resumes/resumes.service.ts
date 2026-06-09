import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResumesService {
  private ai: GoogleGenerativeAI;

  constructor(private prisma: PrismaService) {
    this.ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  }

  // 1. Lấy tất cả các mẫu template CV có sẵn để hiển thị ra trang chọn
  async getTemplates() {
    return this.prisma.cvTemplate.findMany({ where: { isActive: true } });
  }

  // 2. Lõi xử lý AI: Nhận văn bản thô + Yêu cầu từ Job và gọt giũa thành Bullet Points chuyên nghiệp
  async optimizeSectionWithAI(
    rawText: string,
    jobTitle: string,
    requirements: string,
  ) {
    const model = this.ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Bạn là một chuyên gia viết CV và cố vấn tuyển dụng cao cấp.
      Nhiệm vụ của bạn là tối ưu hóa đoạn mô tả kinh nghiệm làm việc thô của ứng viên để nó trở nên chuyên nghiệp và khớp tối đa với vị trí tuyển dụng.

      Vị trí ứng tuyển: ${jobTitle}
      Yêu cầu từ nhà tuyển dụng (JD): ${requirements}
      Đoạn văn thô của ứng viên: "${rawText}"

      Yêu cầu đầu ra:
      - Hãy viết lại thành 3 đến 4 dòng bullet points (dấu chấm đầu dòng) bằng tiếng Việt.
      - Sử dụng các động từ hành động mạnh mẽ, chuyên nghiệp (ví dụ: "Phát triển", "Tối ưu", "Xây dựng", "Phối hợp").
      - Nhấn mạnh vào kỹ năng phù hợp với yêu cầu của công việc trên.
      - Trả về danh sách chuỗi dạng mảng JSON thuần túy, không chứa ký tự định dạng markdown như \`\`\`json hay dấu nháy ngoài.
      Ví dụ định dạng chính xác: ["Dòng 1", "Dòng 2", "Dòng 3"]
    `;

    const response = await model.generateContent(prompt);
    const cleanedText = response.response.text().trim();

    try {
      return JSON.parse(cleanedText);
    } catch (e) {
      // Fallback nếu AI trả về chuỗi text thường thay vì mảng JSON
      return [cleanedText];
    }
  }

  // 3. Tạo mới hoặc cập nhật bản nháp CV vào database
  async saveCvDraft(userId: string, dto: any) {
    const {
      id,
      templateId,
      fullName,
      email,
      phone,
      address,
      education,
      skills,
      experience,
    } = dto;

    if (id) {
      // Nếu có ID tức là cập nhật bản nháp cũ
      return this.prisma.cvProfile.update({
        where: { id },
        data: {
          fullName,
          email,
          phone,
          address,
          education,
          skills,
          experience,
        },
      });
    }

    // Nếu chưa có ID thì tạo bản ghi mới hoàn toàn
    return this.prisma.cvProfile.create({
      data: {
        userId,
        templateId,
        fullName,
        email,
        phone,
        address,
        education,
        skills,
        experience,
      },
    });
  }
}
