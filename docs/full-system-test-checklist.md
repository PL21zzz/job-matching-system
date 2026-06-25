# Full System Test Checklist – Equitas AI

Dưới đây là checklist test từ đầu đến cuối cho dự án Equitas AI.  
Mục tiêu là:

- test đủ chức năng chính
- có sẵn dữ liệu để nhập
- tiện dùng khi rehearsal trước lúc bảo vệ

---

# 1. Chuẩn bị trước khi test

## 1.1 Tài khoản nên có sẵn

- Candidate account
- Employer account
- Admin account

## 1.2 File nên chuẩn bị

- 1 file CV PDF mẫu để upload khi apply
- 1 ảnh chụp màn hình hoặc terminal Docker/VPS nếu muốn demo deploy

## 1.3 Dữ liệu mẫu dùng xuyên suốt

### Candidate mẫu

- Full name: `Nguyễn Hữu Tuấn`
- Email: `candidate.demo.equitas@gmail.com`
- Password: `Candidate@123`
- Phone: `0912345678`
- Address: `Triệu Cơ, Quảng Trị`
- Disability type: `Khuyết tật vận động`

### Employer mẫu

- Full name: `Công ty TNHH ADRA`
- Email: `employer.demo.equitas@gmail.com`
- Password: `Employer@123`
- Company name: `Công ty TNHH ADRA`
- Tax code: `0401999999`
- Address: `Hải Châu, Đà Nẵng`
- Description:
  `Doanh nghiệp công nghệ tập trung vào các giải pháp web, dữ liệu và vận hành số, ưu tiên môi trường làm việc hòa nhập.`

### Admin mẫu

- Email: `admin.demo.equitas@gmail.com`
- Password: `Admin@123`

---

# 2. Checklist test Authentication

## 2.1 Đăng ký Candidate

- [ ] Truy cập `/register`
- [ ] Chọn role `Candidate`
- [ ] Nhập:
  - Full name: `Nguyễn Hữu Tuấn`
  - Email: `candidate.demo.equitas@gmail.com`
  - Password: `Candidate@123`
- [ ] Submit
- [ ] Kiểm tra hệ thống báo gửi OTP

## 2.2 Verify OTP Candidate

- [ ] Nhập OTP đúng
- [ ] Kiểm tra chuyển sang onboarding hoặc profile edit

## 2.3 Đăng nhập Candidate

- [ ] Truy cập `/login`
- [ ] Nhập:
  - Email: `candidate.demo.equitas@gmail.com`
  - Password: `Candidate@123`
- [ ] Submit
- [ ] Kiểm tra login thành công
- [ ] Kiểm tra navbar hiển thị đúng tên user
- [ ] Reload trang
- [ ] Kiểm tra vẫn còn đăng nhập

## 2.4 Logout

- [ ] Click dropdown navbar
- [ ] Chọn `Đăng xuất`
- [ ] Kiểm tra quay về trang chủ
- [ ] Reload trang
- [ ] Kiểm tra vẫn ở trạng thái logout

## 2.5 Đăng ký Employer

- [ ] Truy cập `/register`
- [ ] Chọn role `Employer`
- [ ] Nhập:
  - Full name: `Công ty TNHH ADRA`
  - Email: `employer.demo.equitas@gmail.com`
  - Password: `Employer@123`
- [ ] Submit
- [ ] Xác thực OTP
- [ ] Đăng nhập lại

---

# 3. Checklist test Candidate flow

## 3.1 Candidate hoàn thiện hồ sơ

- [ ] Login Candidate
- [ ] Truy cập `/profile/edit`
- [ ] Nhập:
  - Full name: `Nguyễn Hữu Tuấn`
  - Phone: `0912345678`
  - Address: `Triệu Cơ, Quảng Trị`
  - Disability type: `Khuyết tật vận động`
- [ ] Submit
- [ ] Kiểm tra lưu thành công
- [ ] Kiểm tra chuyển về `/profile`

## 3.2 Kiểm tra trang hồ sơ Candidate

- [ ] Kiểm tra hiển thị:
  - tên
  - email
  - số điện thoại
  - địa chỉ
  - loại khuyết tật

## 3.3 Tìm việc

- [ ] Truy cập `/jobs`
- [ ] Test search keyword: `React`
- [ ] Test location: `Đà Nẵng`
- [ ] Test disability focus: `Vận động`
- [ ] Test accessibility filter nếu có
- [ ] Kiểm tra danh sách job thay đổi đúng

## 3.4 Xem job detail

- [ ] Click vào 1 job do Employer tạo
- [ ] Kiểm tra hiển thị:
  - title
  - company
  - description
  - requirements
  - salary
  - accommodations
  - suitable disability groups

## 3.5 Generate Cover Letter

- [ ] Ở job detail, bấm nút generate cover letter
- [ ] Kiểm tra có nội dung cover letter
- [ ] Kiểm tra nội dung bám đúng job

## 3.6 CV Templates

- [ ] Truy cập `/resumes/templates`
- [ ] Chọn 1 template
- [ ] Kiểm tra điều hướng sang CV editor

## 3.7 AI Create/Tailor CV theo Job

- [ ] Trong CV editor, chọn/tạo CV theo job
- [ ] Nếu hệ thống yêu cầu jobId thì chọn đúng job đang test
- [ ] Kiểm tra AI sinh ra:
  - summary
  - experience bullets
  - skills
  - projects nếu có
- [ ] Kiểm tra preview hiển thị

### Prompt / ngữ cảnh mẫu để test CV

Nếu có chỗ nhập mô tả thô hoặc dữ liệu kinh nghiệm, dùng mẫu:

`Tôi là sinh viên CNTT, đã làm đồ án web với ReactJS, Next.js, NestJS, PostgreSQL, Prisma. Tôi từng xây dựng giao diện responsive, API backend, chức năng đăng nhập, CRUD và tích hợp AI để hỗ trợ người dùng.`

## 3.8 AI Interview Practice

- [ ] Vào lại job detail
- [ ] Bấm `Tập phỏng vấn với AI`
- [ ] Kiểm tra AI hỏi câu đầu tiên
- [ ] Trả lời câu 1 bằng mẫu:

`Em đã từng xây dựng một hệ thống web fullstack dùng Next.js và NestJS. Em phụ trách phần giao diện responsive, kết nối API và một số tính năng AI hỗ trợ người dùng.`

- [ ] Kiểm tra AI phản hồi + hỏi tiếp
- [ ] Trả lời câu 2 bằng mẫu:

`Điểm mạnh của em là khả năng tự học nhanh, chịu khó sửa lỗi đến cùng và phối hợp tốt giữa frontend với backend để hoàn thành tính năng.`

- [ ] Kiểm tra AI vẫn tiếp tục hội thoại đúng job

## 3.9 Apply Job

- [ ] Bấm `Ứng tuyển`
- [ ] Upload file CV PDF
- [ ] Dùng cover letter đã tạo hoặc nhập mẫu:

`Kính gửi Quý công ty, tôi mong muốn ứng tuyển vào vị trí này vì kinh nghiệm của tôi phù hợp với yêu cầu công việc và tôi tin rằng mình có thể đóng góp hiệu quả cho đội ngũ.`

- [ ] Submit application
- [ ] Kiểm tra hệ thống báo apply thành công
- [ ] Apply lại lần 2 cùng job
- [ ] Kiểm tra hệ thống chặn trùng

## 3.10 Stories / bài viết

- [ ] Vào `/stories/manage`
- [ ] Tạo bài viết mới

### Dữ liệu mẫu bài viết

- Title: `Hành trình tìm việc với Equitas AI`
- Content:
  `Trước đây tôi khá khó khăn khi chuẩn bị CV và tìm công việc phù hợp với nhu cầu trợ năng của mình. Sau khi sử dụng Equitas AI, tôi có thể tối ưu CV theo đúng JD, luyện phỏng vấn với AI và tìm được các vị trí phù hợp hơn.`

- [ ] Submit
- [ ] Kiểm tra bài viết hiển thị ở `/stories`
- [ ] Sửa lại 1 câu nội dung
- [ ] Kiểm tra update thành công
- [ ] Xóa bài viết test nếu cần

---

# 4. Checklist test Employer flow

## 4.1 Employer hoàn thiện hồ sơ

- [ ] Login Employer
- [ ] Truy cập `/profile/edit`
- [ ] Nhập:
  - Company name: `Công ty TNHH ADRA`
  - Tax code: `0401999999`
  - Address: `Hải Châu, Đà Nẵng`
  - Description:
    `Doanh nghiệp công nghệ tập trung vào các giải pháp web, dữ liệu và vận hành số, ưu tiên môi trường làm việc hòa nhập.`
- [ ] Submit
- [ ] Kiểm tra lưu thành công

## 4.2 Create Job – dữ liệu mẫu đầy đủ

- [ ] Truy cập `/employer/create-job`

### Dữ liệu mẫu Job 1

- Title: `Lập trình viên Full-Stack Web (ReactJS & NodeJS)`
- Category: `Công nghệ thông tin`
- Type: `REMOTE`
- Location: `Đà Nẵng`
- Salary Min: `12000000`
- Salary Max: `20000000`
- Salary Text: `12 - 20 triệu`
- Description:
  `Phát triển và bảo trì hệ thống web nội bộ và sản phẩm SaaS của công ty. Phối hợp với đội ngũ frontend, backend và QA để triển khai tính năng mới.`
- Requirements:
  `Có kinh nghiệm với ReactJS, Next.js, Node.js hoặc NestJS. Hiểu REST API, Git, làm việc nhóm tốt. Ưu tiên ứng viên có kinh nghiệm với PostgreSQL và các ứng dụng web có yếu tố accessibility.`

### Chọn nhóm khuyết tật hỗ trợ

- [ ] Chọn `Khuyết tật vận động`
- [ ] Chọn `Khiếm thị`
- [ ] Chọn `Khiếm thính`

### Chọn accommodations

#### Cho Khuyết tật vận động

- [ ] Có lối đi và cửa ra vào phù hợp xe lăn
- [ ] Cho phép làm việc từ xa hoặc hybrid

#### Cho Khiếm thị

- [ ] Hệ thống tương thích trình đọc màn hình
- [ ] Giao diện web nội bộ có cấu trúc rõ ràng, dễ điều hướng

#### Cho Khiếm thính

- [ ] Giao tiếp công việc qua chat hoặc văn bản
- [ ] Ưu tiên quy trình làm việc rõ ràng bằng văn bản

- [ ] Submit
- [ ] Kiểm tra tạo job thành công
- [ ] Sang `/jobs` kiểm tra job xuất hiện

## 4.3 Test validation create job

- [ ] Tạo job nhưng không chọn disability group
- [ ] Kiểm tra bị chặn

- [ ] Tạo job có chọn group nhưng không chọn accommodation cho group đó
- [ ] Kiểm tra bị chặn

## 4.4 Employer xem applications

- [ ] Sau khi Candidate apply, vào employer manage applications
- [ ] Kiểm tra thấy application vừa gửi
- [ ] Kiểm tra thấy:
  - candidate name
  - email
  - CV
  - match score nếu có
  - status

## 4.5 Update application status

- [ ] Đổi status sang `REVIEWING`
- [ ] Đổi status sang `INTERVIEW`
- [ ] Đổi status sang `ACCEPTED` hoặc `REJECTED`
- [ ] Kiểm tra lưu thành công

---

# 5. Checklist test Admin flow

## 5.1 Login Admin

- [ ] Login bằng tài khoản admin
- [ ] Vào `/admin/dashboard`
- [ ] Kiểm tra vào được

## 5.2 Dashboard statistics

- [ ] Kiểm tra có số liệu:
  - users
  - employers
  - candidates
  - jobs
  - applications

## 5.3 Danh sách users

- [ ] Xem danh sách candidates
- [ ] Xem danh sách employers
- [ ] Chuyển trạng thái 1 user test:
  - ACTIVE
  - BANNED
  - PENDING

## 5.4 Jobs / Applications moderation

- [ ] Xem danh sách jobs
- [ ] Xem danh sách applications
- [ ] Nếu cần, thử xóa 1 job test hoặc 1 application test

---

# 6. Checklist test AI / Accessibility flow

## 6.1 Web Voice Assistant

- [ ] Truy cập `/assistant`
- [ ] Bấm mic
- [ ] Nói câu 1:

`Tôi muốn tìm việc lập trình web làm từ xa ở Đà Nẵng`

- [ ] Kiểm tra hệ thống nhận transcript
- [ ] Kiểm tra AI trả lời có suggested jobs
- [ ] Bấm nghe lại

- [ ] Nói câu 2:

`Tôi là người khiếm thị, muốn tìm việc phù hợp và dễ thao tác bằng trình đọc màn hình`

- [ ] Kiểm tra AI trả lời đúng hướng khiếm thị

## 6.2 Refresh token / giữ phiên

- [ ] Login Candidate
- [ ] Reload trang nhiều lần
- [ ] Kiểm tra navbar vẫn hiện đúng user
- [ ] Kiểm tra không bị tự logout bất thường

## 6.3 Navbar profile dropdown

- [ ] Click navbar avatar/profile
- [ ] Kiểm tra không còn warning duplicate key
- [ ] Kiểm tra:
  - Trang cá nhân
  - Bài viết của tôi
  - Bàn làm việc
  - Cài đặt
  - Đăng xuất

---

# 7. Checklist test hạ tầng / deploy

## 7.1 Docker

- [ ] Mở terminal server/local deploy
- [ ] Chạy `docker ps`
- [ ] Kiểm tra có:
  - frontend container
  - backend container
  - postgres container

## 7.2 Nginx / HTTPS

- [ ] Truy cập domain hoặc IP VPS
- [ ] Kiểm tra app chạy qua HTTPS nếu đã cấu hình

## 7.3 Database

- [ ] Mở Prisma schema hoặc pgAdmin / DB client
- [ ] Kiểm tra có dữ liệu:
  - users
  - jobs
  - applications
  - disability_types

---

# 8. Checklist demo bảo vệ ngắn gọn 5–7 phút

Nếu demo nhanh, đi đúng thứ tự này:

- [ ] Login Candidate
- [ ] Vào profile
- [ ] Search job
- [ ] Mở job detail
- [ ] Generate CV theo JD
- [ ] Demo AI Interview Practice
- [ ] Apply job
- [ ] Logout

- [ ] Login Employer
- [ ] Create job với accommodations
- [ ] Xem application
- [ ] Update status

- [ ] Login Admin
- [ ] Xem dashboard

- [ ] Demo Voice Assistant

- [ ] Show Docker / VPS / database

---

# 9. Chỗ ghi lỗi để báo lại cho Codex

Bạn có thể ghi theo mẫu này khi test:

- Bước lỗi:
- Tài khoản đang dùng:
- Dữ liệu nhập:
- Kỳ vọng:
- Thực tế:
- Có ảnh lỗi / log không:

Ví dụ:

- Bước lỗi: 4.2 Create Job
- Tài khoản đang dùng: Employer
- Dữ liệu nhập: Job Full-Stack Web
- Kỳ vọng: tạo job thành công
- Thực tế: bấm submit không lưu
- Có ảnh lỗi / log không: có
