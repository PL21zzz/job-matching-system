# Deploy Equitas AI lên VPS Ubuntu

Tài liệu này dành cho trường hợp:

- Máy local: Windows + WSL2
- Docker local: Docker Desktop
- VPS: Ubuntu
- Frontend: Next.js
- Backend: NestJS + Prisma
- Database: PostgreSQL chạy bằng Docker Compose

## 1. SSH vào VPS

Từ WSL2:

```bash
ssh root@YOUR_VPS_IP
```

Sau khi vào VPS, đổi mật khẩu root ngay:

```bash
passwd
```

## 2. Cài môi trường cơ bản

```bash
apt update && apt upgrade -y
apt install -y git curl wget unzip build-essential nginx
```

Cài Node.js 22:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
node -v
npm -v
```

Cài PM2:

```bash
npm install -g pm2
```

Cài Docker:

```bash
curl -fsSL https://get.docker.com | sh
docker --version
docker compose version
```

## 3. Nếu apt quá chậm

Hiện tượng `Ign:` lặp lại nhiều thường do mirror chậm hoặc route mạng.

Bạn có thể ép IPv4:

```bash
apt -o Acquire::ForceIPv4=true update
apt -o Acquire::ForceIPv4=true install -y git curl wget unzip build-essential nginx
```

Hoặc sửa mirror:

```bash
sed -i 's|http://archive.ubuntu.com/ubuntu|http://mirror.kakao.com/ubuntu|g' /etc/apt/sources.list
apt update
```

## 4. Đưa source code lên server

```bash
mkdir -p /var/www/equitas-ai
cd /var/www/equitas-ai
```

Nếu dùng Git:

```bash
git clone <YOUR_REPO_URL> .
```

Nếu không dùng Git, copy code bằng VS Code Remote SSH hoặc WinSCP.

## 5. Tạo file .env cho Docker database

Tạo file `/var/www/equitas-ai/.env`

```env
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=job_matching
DB_PORT=5432

PGADMIN_EMAIL=admin@admin.com
PGADMIN_PASSWORD=admin123456
```

## 6. Chạy PostgreSQL bằng Docker

```bash
cd /var/www/equitas-ai
docker compose up -d
docker ps
```

## 7. Tạo env production cho backend

Copy file mẫu:

```bash
cp /var/www/equitas-ai/backend/.env.production.example /var/www/equitas-ai/backend/.env
nano /var/www/equitas-ai/backend/.env
```

Bạn bắt buộc phải sửa:

- DATABASE_URL
- JWT_SECRET
- JWT_REFRESH_SECRET
- MAIL_USER / MAIL_PASS
- GOOGLE_CLIENT_ID / SECRET
- GEMINI / FPT / OPENAI
- CLOUDINARY
- domain thật
- ADMIN_PASSWORD

## 8. Tạo env production cho frontend

```bash
cp /var/www/equitas-ai/frontend/.env.production.example /var/www/equitas-ai/frontend/.env.local
nano /var/www/equitas-ai/frontend/.env.local
```

## 9. Build backend và migrate database

```bash
cd /var/www/equitas-ai/backend
npm install
npx prisma migrate deploy
npx prisma db seed
npm run build
```

Khi seed xong, hệ thống sẽ có:

- 3 role: Admin, Employer, Candidate
- 4 nhóm khuyết tật
- category mặc định
- admin mặc định nếu đã set `ADMIN_EMAIL`, `ADMIN_PASSWORD`

## 10. Build frontend

```bash
cd /var/www/equitas-ai/frontend
npm install
npm run build
```

## 11. Chạy ứng dụng bằng PM2

Từ root project:

```bash
cd /var/www/equitas-ai
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

PM2 sẽ hiện ra 1 lệnh, copy chạy thêm 1 lần nữa.

Kiểm tra:

```bash
pm2 status
```

## 12. Trỏ domain

Trong DNS:

- `@` -> IP VPS
- `www` -> IP VPS
- `api` -> IP VPS

Ví dụ:

- `tenmiencuaban.com`
- `www.tenmiencuaban.com`
- `api.tenmiencuaban.com`

## 13. Cấu hình Nginx

Copy file mẫu:

```bash
cp /var/www/equitas-ai/deploy/nginx/equitas.conf.example /etc/nginx/sites-available/equitas
nano /etc/nginx/sites-available/equitas
```

Thay:

- `tenmiencuaban.com`
- `api.tenmiencuaban.com`

Bật site:

```bash
ln -s /etc/nginx/sites-available/equitas /etc/nginx/sites-enabled/equitas
nginx -t
systemctl restart nginx
```

## 14. Cài SSL

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d tenmiencuaban.com -d www.tenmiencuaban.com
certbot --nginx -d api.tenmiencuaban.com
```

## 15. Mở firewall

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

## 16. Kiểm tra hệ thống

```bash
pm2 status
docker ps
systemctl status nginx
```

## 17. Kiểm tra dữ liệu mặc định trong DB

```bash
docker exec -it job_matching_db psql -U root -d job_matching
```

Trong PostgreSQL shell:

```sql
select * from roles;
select * from disability_types;
select * from categories;
select email, status, role_id from users;
```

## 18. Test production

Test lần lượt:

- Trang chủ
- Tìm việc
- Đăng ký / OTP
- Đăng nhập
- Tạo hồ sơ
- Tạo job employer
- Apply job candidate
- Admin login
- AI CV
- AI interview
- Trợ lý người mù
- Upload CV / ảnh
- Stories
- Google login

## 19. Khi cập nhật code sau này

```bash
cd /var/www/equitas-ai
git pull

cd backend
npm install
npx prisma migrate deploy
npx prisma db seed
npm run build

cd ../frontend
npm install
npm run build

cd ..
pm2 restart ecosystem.config.js
```
