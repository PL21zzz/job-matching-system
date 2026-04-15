# 🚀 TIẾN ĐỘ DỰ ÁN (PROJECT PROGRESS)

**Tên dự án:** Hệ thống hỗ trợ tìm kiếm việc làm cho người khuyết tật ứng dụng trí tuệ nhân tạo (AI-Powered Job Matching System).

---

## 🟢 MODULE 1: AUTHENTICATION & AUTHORIZATION (HOÀN THÀNH)

### 1. Hạ tầng & Cơ sở dữ liệu (Database Infrastructure)

- [x] **Database Schema:** Thiết kế cấu trúc Prisma chuẩn với các quan hệ phức tạp: User, Role, Profiles, OTP, DisabilityType.
- [x] **Database Migration:** Hoàn thành cập nhật cấu hình vật lý cho trường `refreshTokenHash` trong PostgreSQL.
- [x] **Master Data Automation:** Tự động kiểm tra và nạp dữ liệu chuẩn (Roles, DisabilityTypes) khi hệ thống khởi chạy (`onModuleInit`).

### 2. Luồng nghiệp vụ Xác thực (Authentication Flows)

- [x] **Đăng ký (Register):** Mã hóa mật khẩu (Bcrypt) và xử lý luồng đăng ký theo Role động.
- [x] **Xác thực OTP (OTP Verification):** Hệ thống tự động sinh mã, gửi Mail (Nodemailer) và kích hoạt trạng thái ACTIVE.
- [x] **Khởi tạo hồ sơ tự động:** Tự động tạo EmployerProfile hoặc CandidateProfile ngay khi User xác thực thành công.
- [x] **Đăng nhập đa phương thức:** Hỗ trợ cả đăng nhập truyền thống và Google OAuth.
- [x] **Quản lý mật khẩu:** Hoàn thiện các tính năng Quên mật khẩu, Đặt lại mật khẩu (OTP) và Đổi mật khẩu.

### 3. Bảo mật & Quản lý phiên (Security & Session Management)

- [x] **JWT Refresh Token Rotation:** Cơ chế xoay vòng Token bảo mật cao, bảo vệ phiên đăng nhập lâu dài.
- [x] **Phân quyền người dùng (RBAC):** Triển khai RolesGuard để bảo vệ các API đặc thù cho Employer và Candidate.
- [x] **Đăng xuất (Logout):** Hủy phiên làm việc bằng cách xóa bản băm Token trong Database.

### 4. Kiểm thử chất lượng (Quality Assurance)

- [x] **Unit Testing:** Hoàn thiện bộ Test cho AuthService với **18/18 cases PASS**, bao phủ toàn bộ các trường hợp thành công và xử lý lỗi ngoại lệ.

---

### 📅 Cập nhật lần cuối: 15/04/2026

\*Trạng thái Module 1: **100% Hoàn thành (Production Ready)\***
