import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { MatchScoreService } from './match-score.service';

@Module({
  imports: [PrismaModule],
  controllers: [JobsController],
  providers: [JobsService, MatchScoreService],
})
export class JobsModule {}
