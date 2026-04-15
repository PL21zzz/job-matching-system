import { IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu cũ' })
  oldPassword!: string;

  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu mới' })
  @MinLength(6, { message: 'Mật khẩu mới phải từ 6 ký tự trở lên' })
  newPassword!: string;
}
