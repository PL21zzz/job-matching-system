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
    // 1. Kiểm tra xem có Role chưa, nếu chưa thì nạp
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

    // 2. Kiểm tra bảng DisabilityType
    const typeCount = await this.prisma.disabilityType.count();
    if (typeCount === 0) {
      await this.prisma.disabilityType.createMany({
        data: [
          {
            id: 1,
            name: 'Khuyết tật vận động',
            description: 'Khó khăn di chuyển...',
          },
          { id: 2, name: 'Khuyết tật thị giác', description: 'Kếm thị...' },
          {
            id: 3,
            name: 'Khuyết tật thính giác',
            description: 'Khiếm thính...',
          },
          {
            id: 4,
            name: 'Khuyết tật ngôn ngữ',
            description: 'Khó khăn phát âm...',
          },
        ],
      });
      console.log('✅ Đã nạp xong bảng DisabilityType');
    }
  }
}
