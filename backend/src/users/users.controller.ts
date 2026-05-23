import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateCandidateProfileDto } from './dto/update-candidate-profile.dto';
import { UpdateEmployerProfileDto } from './dto/update-employer-profile.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile/me')
  async getProfileMe(@Req() req: any) {
    const userId = req.user?.sub;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      throw new BadRequestException(
        'Token không hợp lệ hoặc thiếu thông tin vai trò.',
      );
    }

    return this.usersService.getProfileMe(userId, userRole);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile/edit')
  async editProfile(@Req() req: any, @Body() body: any) {
    const userId = req.user?.sub;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      throw new BadRequestException(
        'Token không hợp lệ hoặc thiếu thông tin vai trò.',
      );
    }

    let validatedDto: any;

    if (userRole === 'Candidate') {
      // Ép kiểu body về DTO của Ứng viên và kiểm tra dữ liệu
      validatedDto = plainToInstance(UpdateCandidateProfileDto, body);
      const errors = await validate(validatedDto);
      if (errors.length > 0) {
        throw new BadRequestException(
          'Dữ liệu ứng viên không hợp lệ hoặc sai định dạng.',
        );
      }
    } else if (userRole === 'Employer') {
      // Ép kiểu body về DTO của Nhà tuyển dụng và kiểm tra dữ liệu
      validatedDto = plainToInstance(UpdateEmployerProfileDto, body);
      const errors = await validate(validatedDto);
      if (errors.length > 0) {
        throw new BadRequestException(
          'Dữ liệu nhà tuyển dụng không hợp lệ hoặc sai định dạng.',
        );
      }
    } else {
      throw new BadRequestException('Vai trò tài khoản không hợp lệ.');
    }

    return this.usersService.updateProfile(userId, userRole, validatedDto);
  }
}
