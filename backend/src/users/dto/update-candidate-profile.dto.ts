import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCandidateProfileDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày sinh phải đúng định dạng ngày tháng' })
  dob?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsNumber()
  @IsOptional()
  disabilityTypeId?: number;
}
