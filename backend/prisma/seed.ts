import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt'; // Thêm thư viện băm mật khẩu
import { Pool } from 'pg';

const connectionString =
  'postgresql://root:secretpassword@localhost:5432/job_matching?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Bắt đầu gieo hạt dữ liệu (Seeding)...');

  // --- 1. TẠO 3 CÁI GHẾ (ROLES) ---
  await prisma.role.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, name: 'EMPLOYER' },
  });

  await prisma.role.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, name: 'CANDIDATE' },
  });

  // Thêm cái ghế ADMIN theo đúng ý tưởng của bạn
  await prisma.role.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, name: 'ADMIN' },
  });
  console.log('Đã tạo xong 3 Roles: EMPLOYER, CANDIDATE, ADMIN');

  // --- 2. TẠO TÀI KHOẢN TRÙM CUỐI (SUPER ADMIN) ---
  const adminEmail = 'admin@jobmatching.com';
  const adminPassword = await bcrypt.hash('admin123', 10); // Mật khẩu là admin123

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {}, // Nếu có rồi thì thôi
    create: {
      email: adminEmail,
      passwordHash: adminPassword,
      fullName: 'Super Administrator',
      roleId: 3, // Gắn thẳng vào ghế ADMIN
      status: 'active',
    },
  });
  console.log(`Đã tạo tài khoản Admin tối cao: ${adminEmail} / admin123`);

  console.log('Gieo hạt hoàn tất!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
