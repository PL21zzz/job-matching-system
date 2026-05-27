import { PrismaClient } from '@prisma/client';

// Khởi tạo trực tiếp không truyền param lỗi engine
const prisma = new PrismaClient();

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

  // --- Bảng DisabilityType (8 danh mục phẳng, ngắn gọn, chuẩn gu sếp) ---
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
    {
      id: 5,
      name: 'Khuyết tật trí tuệ',
      description:
        'Suy giảm khả năng nhận thức, học tập hoặc chậm phát triển trí tuệ.',
    },
    {
      id: 6,
      name: 'Khuyết tật thần kinh',
      description:
        'Gặp các hội chứng tự kỷ, rối loạn phổ tự kỷ hoặc tổn thương hệ thần kinh.',
    },
    {
      id: 7,
      name: 'Khuyết tật tinh thần',
      description:
        'Mắc các bệnh lý tâm thần phân liệt, trầm cảm nặng hoặc rối loạn tâm thần.',
    },
    {
      id: 8,
      name: 'Đa khuyết tật',
      description: 'Người mắc đồng thời từ hai loại khuyết tật trở lên.',
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

  console.log('✅ Đã nạp xong Roles và 8 DisabilityTypes sạch sẽ!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi seed dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
