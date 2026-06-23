import { Body, Controller, Post } from '@nestjs/common';
import { CareerAssistantService } from './career-assistant.service';
import { ChatCareerAssistantDto } from './dto/chat-career-assistant.dto';

@Controller('career-assistant')
export class CareerAssistantController {
  constructor(
    private readonly careerAssistantService: CareerAssistantService,
  ) {}

  @Post('chat')
  async chat(@Body() dto: ChatCareerAssistantDto) {
    return this.careerAssistantService.chat(dto);
  }
}
