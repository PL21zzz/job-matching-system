import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateJobDto {
  @IsNotEmpty({ message: 'Tiêu đề công việc không được để trống' })
  @IsString({ message: 'Tiêu đề phải là chuỗi ký tự' })
  title!: string;

  @IsNotEmpty({ message: 'Mô tả công việc không được để trống' })
  @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
  description!: string;

  @IsNotEmpty({ message: 'Yêu cầu công việc không được để trống' })
  @IsString({ message: 'Yêu cầu phải là chuỗi ký tự' })
  requirements!: string;

  @IsOptional()
  @IsInt({ message: 'Mức lương tối thiểu phải là số nguyên' })
  salaryMin?: number;

  @IsOptional()
  @IsInt({ message: 'Mức lương tối đa phải là số nguyên' })
  salaryMax?: number;

  @IsOptional()
  @IsString({ message: 'Lương hiển thị phải là chuỗi ký tự' })
  salaryText?: string; // Ví dụ: "15 - 25 Triệu"

  @IsNotEmpty({ message: 'Địa điểm làm việc không được để trống' })
  @IsString({ message: 'Địa điểm phải là chuỗi ký tự' })
  location!: string;

  @IsOptional()
  @IsString({ message: 'Loại hình làm việc phải là chuỗi ký tự' })
  type?: string; // Mặc định trong Prisma là FULL_TIME, ngoài ra có PART_TIME, REMOTE

  @IsOptional()
  @IsString({ message: 'Tiện ích trợ năng phải là chuỗi ký tự' })
  accessibilityFeatures?: string; // Lưu chuỗi các tiện ích hỗ trợ, ví dụ: "Xe lăng, Trình đọc màn hình"

  @IsNotEmpty({ message: 'Ngành nghề không được để trống' })
  @IsInt({ message: 'Mã ngành nghề (categoryId) phải là số nguyên' })
  categoryId!: number;

  @IsArray()
  @IsOptional()
  suitableDisabilityIds?: number[];
}
