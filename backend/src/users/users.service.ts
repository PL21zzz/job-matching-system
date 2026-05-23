import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfileMe(userId: string, userRole: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        roleId: true,
        // Đổ kèm bảng dữ liệu chi tiết tương ứng với Role
        candidateProfile: userRole === 'Candidate' ? true : false,
        employerProfile: userRole === 'Employer' ? true : false,
      },
    });

    if (!user) {
      throw new BadRequestException(
        'Không tìm thấy thông tin người dùng trong hệ thống.',
      );
    }

    return user;
  }
  async updateProfile(userId: string, userRole: string, dto: any) {
    const { fullName, ...profileData } = dto;

    // 1. Cập nhật fullName vào bảng User nếu Frontend có truyền lên
    if (fullName) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { fullName },
      });
    }

    // 2. Kiểm tra Role trích xuất từ Token để cắm dữ liệu vào đúng bảng Profile
    if (userRole === 'Candidate') {
      return await this.prisma.candidateProfile.update({
        where: { userId: userId },
        data: {
          dob: profileData.dob ? new Date(profileData.dob) : undefined,
          phone: profileData.phone,
          address: profileData.address,
        },
      });
    }

    if (userRole === 'Employer') {
      return await this.prisma.employerProfile.update({
        where: { userId: userId },
        data: {
          companyName: profileData.companyName,
          taxCode: profileData.taxCode,
          address: profileData.address,
          description: profileData.description,
          accessibilityFeatures: profileData.accessibilityFeatures,
        },
      });
    }

    throw new BadRequestException(
      'Vai trò người dùng không hợp lệ để thực hiện cập nhật hồ sơ.',
    );
  }
}
