import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Giả định sếp có guard check token này
import { ResumesService } from './resumes.service';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Get('templates')
  async getTemplates() {
    return this.resumesService.getTemplates();
  }

  @Post('ai/optimize')
  async optimizeWithAI(
    @Body() body: { rawText: string; jobTitle: string; requirements: string },
  ) {
    const result = await this.resumesService.optimizeSectionWithAI(
      body.rawText,
      body.jobTitle,
      body.requirements,
    );
    return { data: result };
  }

  @UseGuards(JwtAuthGuard)
  @Post('save')
  async saveCv(@Req() req, @Body() dto: any) {
    const result = await this.resumesService.saveCvDraft(req.user.id, dto);
    return { data: result };
  }
}
