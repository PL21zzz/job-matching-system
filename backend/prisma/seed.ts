import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient({
  log: ['error'],
});

async function main() {
  console.log('🚀 Bắt đầu nạp Master Data...');

  // --- Bảng Roles ---
  const roles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Employer' },
    { id: 3, name: 'Candidate' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: { name: role.name },
      create: role,
    });
  }

  // --- Bảng DisabilityType (Có đầy đủ description) ---
  const disabilityTypes = [
    {
      id: 1,
      name: 'Khuyết tật vận động',
      description:
        'Khó khăn trong di chuyển, cầm nắm do khiếm khuyết cơ, xương, khớp.',
    },
    {
      id: 2,
      name: 'Khuyết tật thị giác',
      description: 'Người khiếm thị hoặc giảm thị lực nặng.',
    },
    {
      id: 3,
      name: 'Khuyết tật thính giác',
      description: 'Khó khăn trong việc nghe hoặc giao tiếp bằng âm thanh.',
    },
    {
      id: 4,
      name: 'Khuyết tật ngôn ngữ',
      description:
        'Gặp trở ngại trong phát âm hoặc sử dụng ngôn ngữ giao tiếp.',
    },
  ];

  for (const type of disabilityTypes) {
    await prisma.disabilityType.upsert({
      where: { id: type.id },
      update: {
        name: type.name,
        description: type.description,
      },
      create: type,
    });
  }

  console.log('✅ Đã nạp xong Roles và DisabilityTypes!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
