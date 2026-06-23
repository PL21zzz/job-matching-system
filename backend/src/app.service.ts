import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    console.log('--- Đang kiểm tra dữ liệu hệ thống ---');
    await this.seedData();
  }

  async seedData() {
    const roleCount = await this.prisma.role.count();
    if (roleCount === 0) {
      await this.prisma.role.createMany({
        data: [
          { id: 1, name: 'Admin' },
          { id: 2, name: 'Employer' },
          { id: 3, name: 'Candidate' },
        ],
      });
      console.log('✅ Đã nạp xong bảng Roles');
    }

    const disabilityTypes = [
      {
        id: 1,
        name: 'Khuyết tật vận động',
        description:
          'Khó khăn trong di chuyển, đứng lâu hoặc thao tác thể chất cần hỗ trợ.',
      },
      {
        id: 2,
        name: 'Khiếm thị',
        description:
          'Người mù hoặc suy giảm thị lực, cần công cụ đọc màn hình và điều hướng rõ ràng.',
      },
      {
        id: 3,
        name: 'Khiếm thính',
        description:
          'Khó khăn trong việc nghe, phù hợp môi trường giao tiếp bằng chữ và trực quan.',
      },
      {
        id: 4,
        name: 'Câm',
        description:
          'Khó khăn trong phát âm hoặc giao tiếp bằng lời nói, ưu tiên trao đổi qua văn bản.',
      },
    ];

    for (const type of disabilityTypes) {
      await this.prisma.disabilityType.upsert({
        where: { id: type.id },
        update: {
          name: type.name,
          description: type.description,
        },
        create: type,
      });
    }

    console.log('✅ Đã chuẩn hóa 4 nhóm khuyết tật mục tiêu');
  }
}
