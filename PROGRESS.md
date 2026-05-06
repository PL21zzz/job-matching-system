# PROJECT PROGRESS

**Tên dự án:** Hệ thống hỗ trợ tìm kiếm việc làm cho người khuyết tật ứng dụng trí tuệ nhân tạo (Equitas AI / Inclusive AI Job Matching System)

---

## 1. Module 1: Authentication & Authorization (100% - Production Ready)

### 1.1. Hạ tầng & Cơ sở dữ liệu

- [x] Database Schema: Thiết kế Prisma với các bảng User, Role, Profiles, OTP, DisabilityType
- [x] Database Migration: Cập nhật trường refreshTokenHash (PostgreSQL)
- [x] Master Data Automation: Auto seed Roles & DisabilityTypes (onModuleInit)
- [x] Tách bảng OTP: Tối ưu bảo mật và hiệu năng

### 1.2. Authentication Flows

- [x] Register: Hash mật khẩu (Bcrypt), xử lý Role
- [x] OTP Verification: Sinh mã, gửi mail (Nodemailer), ACTIVE user
- [x] Auto Profile Creation: EmployerProfile / CandidateProfile
- [x] Multi-login: Traditional + Google OAuth
- [x] Password Management: Forgot / Reset / Change Password
- [x] OTP Flow Optimization:
      `/forgot-password -> /verify-otp -> /reset-password`

### 1.3. UI/UX & Frontend

- [x] Auth Layout: Split screen (Illustration + Form)
- [x] Tailwind CSS v4: Config trực tiếp trong globals.css
- [x] Theme Toggle: Light/Dark (next-themes)
- [x] Fix Hydration Errors: Autofill + SVG mismatch

### 1.4. Quality Assurance

- [x] Unit Test (Service): Full cases (including PENDING)
- [x] Unit Test (Controller): API correctness
- [x] 100% Test Cases Pass

---

## 2. Module 2: Candidate Onboarding & Disability Profile (Next)

**Mục tiêu:** Hoàn thiện hồ sơ người dùng

- [ ] Role-based Onboarding

  **Candidate:**
  - Thông tin cá nhân, học vấn, kinh nghiệm
  - Kỹ năng
  - Disability Type
  - Accommodations (wheelchair, screen reader, flexible time, ...)

  **Employer:**
  - Thông tin công ty
  - Quy mô, MST, website
  - Upload giấy phép kinh doanh

- [ ] Upload & Parse CV (PDF/DOCX)
- [ ] Accessibility Form (ARIA + keyboard support)

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
