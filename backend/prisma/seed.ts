import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const defaultRoles = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Employer' },
  { id: 3, name: 'Candidate' },
];

const defaultDisabilityTypes = [
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

const defaultCategories = [
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

async function seedRoles() {
  for (const role of defaultRoles) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: { name: role.name },
      create: role,
    });
  }
}

async function seedDisabilityTypes() {
  for (const type of defaultDisabilityTypes) {
    await prisma.disabilityType.upsert({
      where: { id: type.id },
      update: {
        name: type.name,
        description: type.description,
      },
      create: type,
    });
  }
}

async function seedCategories() {
  for (const name of defaultCategories) {
    await prisma.category.upsert({
      where: { name },
      update: { name },
      create: { name },
    });
  }
}

async function seedAdminAccount() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();
  const adminFullName =
    process.env.ADMIN_FULL_NAME?.trim() || 'Quản trị viên Equitas';

  if (!adminEmail || !adminPassword) {
    console.log(
      'ℹ️ Bỏ qua tạo tài khoản admin mặc định vì chưa có ADMIN_EMAIL hoặc ADMIN_PASSWORD.',
    );
    return;
  }

  const adminRole = await prisma.role.findUnique({
    where: { name: 'Admin' },
  });

  if (!adminRole) {
    throw new Error('Không tìm thấy role Admin để tạo tài khoản quản trị.');
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
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

  console.log(`✅ Đã tạo hoặc cập nhật tài khoản admin mặc định: ${adminEmail}`);
}

async function main() {
  console.log('🚀 Bắt đầu nạp dữ liệu mặc định cho hệ thống...');

  await seedRoles();
  await seedDisabilityTypes();
  await seedCategories();
  await seedAdminAccount();

  console.log('✅ Đã nạp xong roles, nhóm khuyết tật, categories và admin mặc định.');
}

main()
  .catch((error) => {
    console.error('❌ Lỗi seed dữ liệu:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
