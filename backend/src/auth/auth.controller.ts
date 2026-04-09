import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto'; // <-- Import DTO vào

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  // Thay thế kiểu `any` lỏng lẻo bằng `RegisterDto` chặt chẽ
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }
}
