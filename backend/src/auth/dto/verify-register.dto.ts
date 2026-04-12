import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyRegisterDto {
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'Mã OTP phải có đúng 6 ký tự' })
  otp!: string;
}
