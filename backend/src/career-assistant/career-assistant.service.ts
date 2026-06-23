import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { extractAccessibilityTags } from '../jobs/disability-support';
import { PrismaService } from '../prisma/prisma.service';
import { VoiceService } from '../voice/voice.service';
import { ChatCareerAssistantDto } from './dto/chat-career-assistant.dto';

type RankedJob = {
  id: string;
  title: string;
  location: string;
  type: string;
  salaryText: string | null;
  accessibilityFeatures: string | null;
  categoryName: string;
  companyName: string | null;
  suitableDisabilities: string[];
  score: number;
  reasons: string[];
};

@Injectable()
export class CareerAssistantService {
  private readonly ai?: GoogleGenerativeAI;

  constructor(
    private readonly prisma: PrismaService,
    private readonly voiceService: VoiceService,
  ) {
    if (process.env.GEMINI_API_KEY) {
      this.ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
  }

  async chat(dto: ChatCareerAssistantDto) {
    const normalizedMessage = dto.message.trim();
    const openJobs = await this.prisma.job.findMany({
      where: { status: 'OPEN' },
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
        suitableDisabilities: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 80,
    });

    const rankedJobs = openJobs
      .map((job) => this.rankJob(job, dto, normalizedMessage))
      .filter((job) => job.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const fallbackJobs =
      rankedJobs.length > 0
        ? rankedJobs
        : openJobs
            .slice(0, 3)
            .map((job) => this.rankJob(job, dto, normalizedMessage, true));

    const answer = await this.buildAnswer(dto, fallbackJobs);
    const audioUrl = await this.voiceService.synthesizeVietnamese(answer);

    return {
      transcript: normalizedMessage,
      answer,
      audioUrl,
      source: this.ai ? 'gemini_with_local_ranking' : 'local_ranking_only',
      suggestedJobs: fallbackJobs.map((job) => ({
        id: job.id,
        title: job.title,
        location: job.location,
        type: job.type,
        salaryText: job.salaryText,
        accessibilityFeatures: job.accessibilityFeatures,
        categoryName: job.categoryName,
        companyName: job.companyName,
        suitableDisabilities: job.suitableDisabilities,
        reasons: job.reasons,
        detailPath: `/jobs/${job.id}`,
      })),
      followUpPrompts: [
        'Tìm việc từ xa cho người khiếm thị',
        'Việc nào phù hợp nếu tôi giỏi tin học văn phòng',
        'Tóm tắt 3 công việc nên ứng tuyển ngay',
      ],
    };
  }

  private rankJob(
    job: any,
    dto: ChatCareerAssistantDto,
    normalizedMessage: string,
    forceInclude = false,
  ): RankedJob {
    const suitabilityNames = job.suitableDisabilities.map((item: any) =>
      item.name.toLowerCase(),
    );
    const accessibilityTags = extractAccessibilityTags(job.accessibilityFeatures);
    const accessibilityTextForPrompt =
      accessibilityTags.join(', ') || job.accessibilityFeatures || '';

    const haystack = [
      job.title,
      job.description,
      job.requirements,
      job.location,
      job.type,
      accessibilityTextForPrompt,
      job.category?.name,
      job.employer?.companyName,
      suitabilityNames.join(' '),
      dto.profileSummary,
      dto.accessibilityNeeds,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const query = [
      normalizedMessage,
      dto.profileSummary,
      dto.accessibilityNeeds,
      dto.preferredLocation,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const tokens = this.tokenize(query);
    let score = forceInclude ? 1 : 0;
    const reasons: string[] = [];

    for (const token of tokens) {
      if (!haystack.includes(token)) {
        continue;
      }

      score += 1;

      if (job.title.toLowerCase().includes(token)) {
        score += 3;
      }

      if (job.location.toLowerCase().includes(token)) {
        score += 2;
      }
    }

    const blindFocused =
      /(khiem thi|khiếm thị|mù|mu|blind|screen reader|đọc màn hình)/i.test(
        query,
      );
    const accessibilityHaystack =
      `${accessibilityTextForPrompt} ${suitabilityNames.join(' ')}`.toLowerCase();

    if (
      blindFocused &&
      /(khiem thi|khiếm thị|mù|mu|blind|screen reader|đọc màn hình)/i.test(
        accessibilityHaystack,
      )
    ) {
      score += 8;
      reasons.push('Có mô tả hỗ trợ gần với nhu cầu của người khiếm thị');
    }

    if (
      dto.preferredLocation &&
      job.location
        .toLowerCase()
        .includes(dto.preferredLocation.toLowerCase().trim())
    ) {
      score += 5;
      reasons.push(`Đúng khu vực ưu tiên: ${job.location}`);
    }

    if (/remote|từ xa|lam tai nha|làm tại nhà/.test(query) && job.type === 'REMOTE') {
      score += 6;
      reasons.push('Có thể làm việc từ xa');
    }

    if (accessibilityTags.length) {
      reasons.push('Tin tuyển dụng có mô tả trợ năng');
      score += 2;
    }

    if (job.category?.name) {
      reasons.push(`Thuộc nhóm ${job.category.name}`);
    }

    return {
      id: job.id,
      title: job.title,
      location: job.location,
      type: job.type,
      salaryText: job.salaryText,
      accessibilityFeatures: accessibilityTextForPrompt || null,
      categoryName: job.category?.name || 'Khác',
      companyName: job.employer?.companyName || null,
      suitableDisabilities: job.suitableDisabilities.map((item: any) => item.name),
      score,
      reasons: Array.from(new Set(reasons)).slice(0, 3),
    };
  }

  private tokenize(text: string) {
    return Array.from(
      new Set(
        text
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .split(/[^a-z0-9]+/i)
          .map((item) => item.trim())
          .filter((item) => item.length >= 3),
      ),
    ).slice(0, 24);
  }

  private async buildAnswer(dto: ChatCareerAssistantDto, jobs: RankedJob[]) {
    if (!jobs.length) {
      return 'Tôi chưa tìm thấy công việc thật sự gần với nhu cầu bạn vừa nói. Bạn hãy nói rõ hơn về kỹ năng, khu vực hoặc nhu cầu trợ năng để tôi lọc chính xác hơn.';
    }

    const fallbackAnswer = this.buildFallbackAnswer(dto, jobs);

    if (!this.ai) {
      return fallbackAnswer;
    }

    try {
      const model = this.ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const historyText = (dto.history || [])
        .map((item) => `${item.role}: ${item.content}`)
        .join('\n');
      const jobsText = jobs
        .slice(0, 3)
        .map(
          (job, index) =>
            `${index + 1}. ${job.title} | ${job.companyName || 'Doanh nghiệp'} | ${job.location} | ${job.type} | ${job.salaryText || 'Thương lượng'} | ${job.accessibilityFeatures || 'Chưa có mô tả trợ năng'} | Lý do: ${job.reasons.join(', ') || 'Phù hợp theo nội dung tìm kiếm'}`,
        )
        .join('\n');

      const prompt = `
Bạn là trợ lý việc làm của Equitas AI dành cho người khuyết tật, ưu tiên trả lời dễ nghe cho người dùng dựa vào âm thanh.

Yêu cầu:
- Trả lời bằng tiếng Việt tự nhiên, có dấu, câu ngắn, dễ nghe.
- Không bịa thêm công việc ngoài danh sách.
- Hệ thống hiện chỉ tập trung vào 4 nhóm: khuyết tật vận động, khiếm thị, khiếm thính và câm.
- Nếu người dùng đang hỏi theo hướng người mù hoặc khiếm thị, ưu tiên nói rõ yếu tố trợ năng, môi trường làm việc và việc nào nên xem trước.
- Chỉ giới thiệu tối đa 3 việc.
- Kết thúc bằng 1 câu hỏi ngắn để mời người dùng nói tiếp.

Tin nhắn mới nhất:
${dto.message}

Tóm tắt hồ sơ:
${dto.profileSummary || 'Chưa có'}

Nhu cầu trợ năng:
${dto.accessibilityNeeds || 'Chưa có'}

Lịch sử gần đây:
${historyText || 'Không có'}

Danh sách việc được xếp hạng:
${jobsText}
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      return text || fallbackAnswer;
    } catch {
      return fallbackAnswer;
    }
  }

  private buildFallbackAnswer(dto: ChatCareerAssistantDto, jobs: RankedJob[]) {
    const topJobs = jobs.slice(0, 3);
    const intro = /(khiem thi|khiếm thị|mù|mu|blind)/i.test(
      `${dto.message} ${dto.accessibilityNeeds || ''}`,
    )
      ? 'Tôi đã ưu tiên các việc gần hơn với nhu cầu của người khiếm thị.'
      : 'Tôi đã lọc các việc gần với nhu cầu bạn vừa mô tả.';

    const jobLines = topJobs
      .map((job, index) => {
        const reasonText = job.reasons.length
          ? ` Lý do: ${job.reasons.join(', ')}.`
          : '';
        return `${index + 1}. ${job.title} tại ${job.companyName || 'doanh nghiệp đang cập nhật'}, ${job.location}, hình thức ${job.type}.${reasonText}`;
      })
      .join(' ');

    return `${intro} ${jobLines} Bạn muốn tôi lọc tiếp theo khu vực, việc từ xa hay mức độ hỗ trợ trợ năng?`;
  }
}
