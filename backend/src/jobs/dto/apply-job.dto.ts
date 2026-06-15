import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ApplyJobDto {
  @IsNotEmpty({ message: 'Mã công việc (jobId) không được để trống' })
  @IsUUID('4', { message: 'Mã công việc phải tuân theo định dạng UUID' })
  jobId!: string;

  @IsNotEmpty({ message: 'Nội dung thư ứng tuyển không được để trống' })
  @IsString({ message: 'Thư ứng tuyển phải ở định dạng văn bản thuần' })
  coverLetter!: string;
}
