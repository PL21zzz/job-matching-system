import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class InterviewHistoryItemDto {
  @IsString()
  role: 'user' | 'assistant';

  @IsString()
  @MaxLength(1500)
  content: string;
}

export class InterviewPracticeDto {
  @IsOptional()
  @IsString()
  @MaxLength(1500)
  message?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(12)
  @ValidateNested({ each: true })
  @Type(() => InterviewHistoryItemDto)
  history?: InterviewHistoryItemDto[];
}
