import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CareerAssistantHistoryItemDto {
  @IsString()
  role: 'user' | 'assistant';

  @IsString()
  @MaxLength(1200)
  content: string;
}

export class ChatCareerAssistantDto {
  @IsString()
  @MaxLength(1200)
  message: string;

  @IsOptional()
  @IsString()
  @MaxLength(1200)
  profileSummary?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  accessibilityNeeds?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  preferredLocation?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(8)
  @ValidateNested({ each: true })
  @Type(() => CareerAssistantHistoryItemDto)
  history?: CareerAssistantHistoryItemDto[];
}
