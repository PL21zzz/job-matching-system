import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GenerateCvAiDto } from './dto/generate-cv-ai.dto';
import { ResumesService } from './resumes.service';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}
  @UseGuards(JwtAuthGuard)
  @Post('generate-ai')
  async generateCvWithAi(
    @Req() req: any,
    @Body() generateCvAiDto: GenerateCvAiDto,
  ) {
    // 1. Bóc tách userId từ payload token đã được JwtStrategy giải mã gán vào request
    const userId = req.user?.sub;

    if (!userId) {
      throw new BadRequestException(
        'Token không hợp lệ hoặc phiên làm việc đã hết hạn.',
      );
    }

    // 2. Chuyển tiếp tham số xuống tầng Service xử lý lõi với Gemini AI
    return this.resumesService.generateCvWithAi(userId, generateCvAiDto);
  }
}
