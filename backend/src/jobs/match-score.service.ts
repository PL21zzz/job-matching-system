import { BadRequestException, Injectable } from '@nestjs/common';
import { PDFParse } from 'pdf-parse';

const STOP_WORDS = new Set([
  'và', 'là', 'có', 'cho', 'các', 'của', 'trong', 'với', 'một', 'những',
  'được', 'theo', 'tại', 'the', 'and', 'for', 'with', 'from', 'that',
  'this', 'are', 'you', 'your',
]);

@Injectable()
export class MatchScoreService {
  async extractText(file: Express.Multer.File): Promise<string> {
    const mime = file.mimetype.toLowerCase();
    const extension = file.originalname.split('.').pop()?.toLowerCase();

    if (mime === 'application/pdf' || extension === 'pdf') {
      const parser = new PDFParse({ data: file.buffer });
      try {
        const result = await parser.getText();
        return this.cleanText(result.text);
      } finally {
        await parser.destroy();
      }
    }

    if (mime.startsWith('text/') || extension === 'txt') {
      return this.cleanText(file.buffer.toString('utf8'));
    }

    throw new BadRequestException(
      'Hệ thống chấm điểm chính xác với CV PDF hoặc TXT. Vui lòng xuất CV Word sang PDF trước khi tải lên.',
    );
  }

  calculate(jobText: string, cvText: string, coverLetter = '') {
    const jobKeywords = this.keywords(jobText);
    const candidateText = this.normalize(`${cvText} ${coverLetter}`);
    const matched = jobKeywords.filter((keyword) =>
      candidateText.includes(keyword),
    );
    const keywordRatio =
      jobKeywords.length > 0 ? matched.length / jobKeywords.length : 0;
    const completeness = Math.min(cvText.length / 2500, 1);
    const coverLetterBonus = Math.min(coverLetter.trim().length / 800, 1);

    return {
      score: Math.max(
        5,
        Math.min(
          100,
          Math.round(
            keywordRatio * 75 + completeness * 15 + coverLetterBonus * 10,
          ),
        ),
      ),
      source: 'LOCAL_ATS_V1',
      matchedKeywords: matched.slice(0, 20),
    };
  }

  private keywords(text: string) {
    const words = this.normalize(text)
      .split(/\s+/)
      .filter(
        (word) =>
          word.length >= 3 && !STOP_WORDS.has(word) && !/^\d+$/.test(word),
      );
    const frequency = new Map<string, number>();
    words.forEach((word) => frequency.set(word, (frequency.get(word) || 0) + 1));
    return [...frequency.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 45)
      .map(([word]) => word);
  }

  private normalize(text: string) {
    return text
      .toLocaleLowerCase('vi')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9+#.\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private cleanText(text: string) {
    return text.replace(/\0/g, ' ').replace(/\s+/g, ' ').trim();
  }
}
