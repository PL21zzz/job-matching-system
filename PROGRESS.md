# PROJECT PROGRESS

**Tên dự án:** Hệ thống hỗ trợ tìm kiếm việc làm cho người khuyết tật ứng dụng trí tuệ nhân tạo (AI-Powered Job Search Support System for People with Disabilities)

---

## 1. Module 1: Authentication & Authorization (HOÀN THÀNH)

### 1.1. Hạ tầng & Cơ sở dữ liệu

- Database Schema: Thiết kế Prisma với các bảng User, Role, Profiles, OTP, DisabilityType
- Database Migration: Cập nhật trường refreshTokenHash (PostgreSQL)
- Master Data Automation: Auto seed Roles & DisabilityTypes (onModuleInit)
- Tách bảng OTP: Tối ưu bảo mật và hiệu năng

### 1.2. Authentication Flows

- Register: Hash mật khẩu (Bcrypt), xử lý Role
- OTP Verification: Sinh mã, gửi mail (Nodemailer), ACTIVE user
- Auto Profile Creation: EmployerProfile / CandidateProfile
- Multi-login: Traditional + Google OAuth
- Password Management: Forgot / Reset / Change Password
- OTP Flow Optimization:
  `/forgot-password -> /verify-otp -> /reset-password`

### 1.3. UI/UX & Frontend

- Auth Layout: Split screen (Illustration + Form)
- Tailwind CSS v4: Config trực tiếp trong globals.css
- Theme Toggle: Light/Dark (next-themes)
- Fix Hydration Errors: Autofill + SVG mismatch

### 1.4. Quality Assurance

- Unit Test (Service): Full cases (including PENDING)
- Unit Test (Controller): API correctness
- 100% Test Cases Pass

---

## 2. Module 2: PUBLIC UI & FRONTEND FOUNDATION (ĐANG THỰC HIỆN)

**Mục tiêu:** Xây dựng bộ mặt của hệ thống, tối ưu SEO và trải nghiệm người dùng vãng lai.

- Cấu trúc Route Group (public): Tách biệt hoàn toàn Layout trang chủ với Layout Auth để tránh chồng chéo giao diện.

- Modular Homepage: Phân rã trang chủ 1000 dòng thành các Section độc lập (Hero, Stats, FeaturedJobs, FAQ...) để dễ bảo trì.

- Hệ thống Design System (Tailwind v4): Định nghĩa bộ màu primary, secondary, surface trong globals.css để đồng bộ UI toàn hệ thống.

- Trang Danh sách việc làm (Public Jobs): Giao diện cho phép khách xem danh sách công việc mà không cần đăng nhập.

- Trang Chi tiết việc làm (Job Detail): Hiển thị mô tả công việc và các tiện ích hỗ trợ người khuyết tật.

- Trang Giới thiệu (About Us) & Chính sách: Các trang thông tin bổ trợ cho hệ thống.

---

## 3. Module 3: Job Management & Accessibility Search (Next)

**Mục tiêu:** Đăng tin và tìm việc hiệu quả

- [ ] Job Posting (Employer)
  - CRUD: Title, Description, Requirement, Salary, Location
  - Accessibility Tags:
    - Wheelchair accessible
    - Sign language support
    - Remote 100%

- [ ] Smart Search (Candidate)
  - Keyword, ngành, lương
  - Filter theo disability compatibility

---

## 4. Module 4: AI Resume Parsing & Job Matching (Core)

**Mục tiêu:** Ứng dụng AI

- [ ] AI Resume Parser (NestJS + AI API)
  - Extract: Skills, Experience, Education

- [ ] AI Matching Engine
  - Match CV với Job Description
  - Scoring (%)
  - Đánh giá môi trường phù hợp

- [ ] AI CV Feedback
  - Gợi ý cải thiện CV
  - Tăng tỷ lệ match

---

## 5. Module 5: Application & Interview Workflow

**Mục tiêu:** Quản lý quy trình tuyển dụng

- [ ] Apply Job (CV + Cover Letter - AI hỗ trợ)

- [ ] Employer Dashboard
  - Danh sách ứng viên + Match %
  - Trạng thái:
    - Pending -> Interview -> Hired -> Rejected

- [ ] Interview Scheduling (Online/Offline)
- [ ] Realtime Notification (WebSocket)

---

## 6. Module 6: Accessibility & Inclusive Experience

**Mục tiêu:** Tăng khả năng tiếp cận

- [ ] Text-to-Speech
- [ ] Keyboard Navigation
- [ ] Screen Reader Support (JAWS, NVDA, VoiceOver)

---

## Progress Summary

- Module 1: 100% (Production Ready)
- Total Project Progress: ~20%
