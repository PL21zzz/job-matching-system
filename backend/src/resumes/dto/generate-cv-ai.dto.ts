import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class GenerateCvAiDto {
  @IsNotEmpty({ message: 'jobId không được để trống' })
  @IsUUID('4', { message: 'jobId phải là định dạng UUID hợp lệ' })
  jobId!: string;

  @IsNotEmpty({ message: 'templateId không được để trống' })
  @IsString({ message: 'templateId phải là chuỗi ký tự' })
  templateId!: string;
}
