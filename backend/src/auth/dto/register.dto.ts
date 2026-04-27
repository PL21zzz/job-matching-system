import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { RoleName } from '../constants/role.enum';

export class RegisterDto {
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email!: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password!: string;

  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  @IsString()
  fullName!: string;

  @ValidateIf((o) => o.role === 'Employer')
  @IsNotEmpty({ message: 'Tên công ty là bắt buộc đối với nhà tuyển dụng' })
  @IsString()
  companyName?: string;

  @IsNotEmpty({ message: 'Bạn phải chọn vai trò' })
  @IsEnum(RoleName, {
    message: 'Vai trò phải là Employer hoặc Candidate',
  })
  role!: RoleName;
}
