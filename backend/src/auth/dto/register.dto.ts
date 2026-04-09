import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

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

  @IsNotEmpty({ message: 'Bạn phải chọn vai trò' })
  @IsIn(['CANDIDATE', 'EMPLOYER'], {
    message: 'Vai trò chỉ được là CANDIDATE hoặc EMPLOYER',
  })
  role!: string;
}
