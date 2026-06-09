import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyRegisterDto } from './dto/verify-register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('forgot-password')
  forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Post('verify-forgot-otp')
  async verifyForgotOtp(@Body() body: { email: string; code: string }) {
    return this.authService.verifyForgotOtp(body.email, body.code);
  }

  @Post('verify-register')
  verifyRegister(@Body() dto: VerifyRegisterDto) {
    return this.authService.verifyRegister(dto);
  }

  @Post('resend-otp')
  async resendOtp(@Body('email') email: string) {
    return this.authService.resendOtp(email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.sub, dto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const result = await this.authService.googleLogin(req.user);

    // 🚀 Đã sửa: Lấy linh hoạt domain Frontend từ môi trường, mặc định local là 3001
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';

    // Ghép chuỗi bằng cú pháp Template Literal chuẩn chỉ
    return res.redirect(
      `${frontendUrl}/auth-callback?token=${result.access_token}&isNewUser=${result.isNewUser}`,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Employer')
  @Get('employer-only')
  testEmployerOnly() {
    return {
      message: 'Chào sếp, đây là khu vực dành riêng cho Nhà tuyển dụng!',
    };
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Req() req: any) {
    const userId = req.user.sub;
    const refreshToken = req.user.refreshToken;
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: any) {
    const userId = req.user.sub;
    return this.authService.logout(userId);
  }
}
