import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Bắt đầu nạp Master Data...');

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
    await prisma.disabilityType.upsert({
      where: { id: type.id },
      update: {
        name: type.name,
        description: type.description,
      },
      create: type,
    });
  }

  console.log('✅ Đã nạp xong Roles và 4 DisabilityTypes mục tiêu!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi seed dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
