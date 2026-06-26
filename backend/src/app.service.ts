import { Injectable, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from './prisma/prisma.service';

const DEFAULT_ROLES = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Employer' },
  { id: 3, name: 'Candidate' },
];

const DEFAULT_DISABILITY_TYPES = [
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

const DEFAULT_CATEGORIES = [
  'Công nghệ thông tin',
  'Nhập liệu & Hành chính',
  'Chăm sóc khách hàng',
  'Kế toán - Văn phòng',
  'Thiết kế sáng tạo',
  'Marketing',
  'Bán hàng',
  'Vệ sinh & Tạp vụ',
  'Kho vận',
  'Sản xuất',
  'Thủ công mỹ nghệ',
  'Nhà hàng - Khách sạn',
];

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    console.log('--- Đang kiểm tra dữ liệu hệ thống ---');
    await this.seedData();
  }

  private async seedRoles() {
    for (const role of DEFAULT_ROLES) {
      await this.prisma.role.upsert({
        where: { id: role.id },
        update: { name: role.name },
        create: role,
      });
    }

    console.log('✅ Đã chuẩn hóa bảng roles');
  }

  private async seedDisabilityTypes() {
    for (const type of DEFAULT_DISABILITY_TYPES) {
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

  private async seedCategories() {
    for (const name of DEFAULT_CATEGORIES) {
      await this.prisma.category.upsert({
        where: { name },
        update: { name },
        create: { name },
      });
    }

    console.log('✅ Đã nạp danh mục ngành nghề mặc định');
  }

  private async seedAdminAccount() {
    const adminEmail = process.env.ADMIN_EMAIL?.trim();
    const adminPassword = process.env.ADMIN_PASSWORD?.trim();
    const adminFullName =
      process.env.ADMIN_FULL_NAME?.trim() || 'Quản trị viên Equitas';

    if (!adminEmail || !adminPassword) {
      console.log(
        'ℹ️ Chưa cấu hình ADMIN_EMAIL hoặc ADMIN_PASSWORD, bỏ qua tạo admin mặc định.',
      );
      return;
    }

    const adminRole = await this.prisma.role.findUnique({
      where: { name: 'Admin' },
    });

    if (!adminRole) {
      console.log('⚠️ Không tìm thấy role Admin, bỏ qua tạo tài khoản admin.');
      return;
    }

    const passwordHash = await bcrypt.hash(adminPassword, 10);

    await this.prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        fullName: adminFullName,
        roleId: adminRole.id,
        status: 'ACTIVE',
        provider: 'local',
        passwordHash,
      },
      create: {
        email: adminEmail,
        fullName: adminFullName,
        roleId: adminRole.id,
        status: 'ACTIVE',
        provider: 'local',
        passwordHash,
      },
    });

    console.log(`✅ Đã tạo hoặc cập nhật admin mặc định: ${adminEmail}`);
  }

  async seedData() {
    await this.seedRoles();
    await this.seedDisabilityTypes();
    await this.seedCategories();
    await this.seedAdminAccount();
  }
}
