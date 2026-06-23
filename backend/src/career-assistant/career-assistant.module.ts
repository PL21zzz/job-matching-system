import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { VoiceModule } from '../voice/voice.module';
import { CareerAssistantController } from './career-assistant.controller';
import { CareerAssistantService } from './career-assistant.service';

@Module({
  imports: [PrismaModule, VoiceModule],
  controllers: [CareerAssistantController],
  providers: [CareerAssistantService],
})
export class CareerAssistantModule {}
