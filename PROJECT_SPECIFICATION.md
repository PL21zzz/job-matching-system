# Đặc tả dự án Equitas AI

## 1. Mục tiêu

Xây dựng một nền tảng tuyển dụng web có khả năng tiếp cận cao, giúp người khuyết tật tìm công việc phù hợp và giúp doanh nghiệp xây dựng quy trình tuyển dụng hòa nhập.

## 2. Phạm vi nền tảng

Sản phẩm triển khai trên web responsive. Dự án không phát triển ứng dụng mobile riêng; các chức năng dành cho người khiếm thị được tích hợp trực tiếp vào website.

## 3. Người dùng

- Candidate: ứng viên tìm việc.
- Employer: nhà tuyển dụng.
- Admin: quản trị hệ thống.

## 4. Nghiệp vụ chính

### Candidate

- Đăng ký, OTP, Google OAuth.
- Hoàn thiện hồ sơ trợ năng.
- Tìm kiếm và lọc công việc.
- Tạo CV và cover letter bằng Gemini.
- Nộp CV PDF/TXT.
- Nhận match score từ bộ ATS nội bộ.
- Viết và quản lý câu chuyện truyền cảm hứng.

### Employer

- Hoàn thiện hồ sơ doanh nghiệp.
- Đăng công việc và khai báo điều kiện tiếp cận.
- Xem ứng viên thuộc công việc của doanh nghiệp.
- Cập nhật trạng thái tuyển dụng.

### Admin

- Quản lý tài khoản.
- Quản lý công việc và đơn ứng tuyển.
- Theo dõi số liệu tổng quan.

## 5. Trợ năng

- Semantic HTML và tiêu đề trang rõ ràng.
- Điều hướng hoàn toàn bằng bàn phím.
- Focus indicator dễ nhận biết.
- Skip-link.
- Tùy chỉnh cỡ chữ và tương phản.
- Đọc nội dung bằng giọng nói trên trình duyệt.
- Tôn trọng thiết lập giảm chuyển động.
- Responsive từ màn hình điện thoại đến desktop.

## 6. Kiến trúc

```text
Next.js Web
     |
NestJS REST API
     |
PostgreSQL / Prisma

NestJS -> Gemini
NestJS -> Cloudinary
NestJS -> Email/FPT Voice
```

## 7. Match score

Match score mặc định chạy cục bộ:

1. Trích xuất text thật từ CV PDF/TXT.
2. Chuẩn hóa nội dung CV và JD.
3. Lấy nhóm từ khóa quan trọng trong JD.
4. Tính tỷ lệ khớp, độ đầy đủ CV và cover letter.
5. Lưu điểm cùng nguồn `LOCAL_ATS_V1`.

OpenAI là tùy chọn, không phải phụ thuộc bắt buộc.

## 8. Bảo mật

- Mật khẩu băm bằng bcrypt.
- JWT access/refresh token trong cookie `HttpOnly`.
- Refresh token rotation.
- Role guard cho Admin/Employer.
- Kiểm tra quyền sở hữu trước khi thay đổi đơn ứng tuyển hoặc bài viết.
- CORS giới hạn theo danh sách frontend domain.
- API key chỉ lấy từ biến môi trường.
