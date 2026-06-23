# Equitas AI — Nền tảng việc làm hòa nhập

Equitas AI là hệ thống tuyển dụng trên web dành cho người khuyết tật, kết nối ứng viên, nhà tuyển dụng và quản trị viên. Dự án ưu tiên khả năng tiếp cận ngay trên trình duyệt, không còn tách riêng ứng dụng mobile.

## Công nghệ

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS.
- Backend: NestJS 11, Prisma ORM.
- Database: PostgreSQL.
- AI: Gemini cho CV và cover letter.
- Match score: bộ chấm ATS nội bộ, không cần API trả phí.
- Lưu trữ CV: Cloudinary.
- Email: Nodemailer.
- Voice: Gemini Speech-to-Text và FPT Text-to-Speech.

## Chức năng

### Ứng viên

- Đăng ký, OTP, đăng nhập email hoặc Google.
- Quản lý hồ sơ và loại trợ năng.
- Tìm kiếm, lọc và ứng tuyển công việc.
- Tạo CV và cover letter bằng AI.
- Nộp CV PDF/TXT và nhận điểm tương thích ATS.
- Viết, lưu nháp và đăng câu chuyện truyền cảm hứng.

### Nhà tuyển dụng

- Quản lý hồ sơ doanh nghiệp.
- Đăng tin với thông tin trợ năng và nhóm khuyết tật phù hợp.
- Xem CV, cover letter, match score.
- Quản lý trạng thái đơn ứng tuyển.

### Quản trị viên

- Dashboard thống kê.
- Quản lý ứng viên, doanh nghiệp, công việc và đơn ứng tuyển.

### Trợ năng web

- Điều hướng bàn phím và skip-link.
- Tăng/giảm cỡ chữ.
- Chế độ tương phản cao.
- Đọc nội dung trang hoặc đoạn văn bản được chọn bằng Web Speech API.
- Hỗ trợ `prefers-reduced-motion`.
- Giao diện responsive cho desktop, tablet và mobile.

## Chạy local

Yêu cầu: Node.js 22+, Docker Desktop.

```bash
docker compose up -d

cd backend
npm install
npx prisma migrate dev
npm run start:dev

cd ../frontend
npm install
npm run dev
```

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:3001`
- pgAdmin: `http://localhost:5050`

## Biến môi trường backend

```env
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
FRONTEND_URL=http://localhost:3001
FRONTEND_URLS=http://localhost:3001
COOKIE_SAME_SITE=lax
MAIL_HOST=
MAIL_PORT=587
MAIL_USER=
MAIL_PASS=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
GEMINI_API_KEY=
FPT_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Mặc định để trống hoặc local. Chỉ đặt openai khi tài khoản có quota.
MATCH_SCORE_PROVIDER=local
OPENAI_API_KEY=
```

Frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Match score

Mặc định hệ thống đọc text thật từ PDF/TXT và chấm theo mức độ trùng khớp từ khóa, độ đầy đủ của CV và cover letter. Luồng ứng tuyển không bị gián đoạn khi OpenAI hết quota.

Nếu muốn thử lại OpenAI:

```env
MATCH_SCORE_PROVIDER=openai
```

Khi OpenAI lỗi, hệ thống giữ điểm ATS nội bộ thay vì gán một điểm mặc định giả.

## Kiểm tra

```bash
cd backend
npm run build
npm test

cd ../frontend
npm run build
npm run lint
```

## Lưu ý bảo mật

- Token mới được lưu trong cookie `HttpOnly`; Bearer token chỉ còn để tương thích phiên cũ.
- Production phải giới hạn `FRONTEND_URLS`.
- Không commit API key vào source code.
- FPT API key từng xuất hiện trong mã nguồn cần được thu hồi và tạo key mới trên FPT Console.
