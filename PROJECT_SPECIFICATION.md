# 📋 ĐẶC TẢ CHI TIẾT DỰ ÁN (PROJECT SPECIFICATION)

**Tên dự án:** Hệ thống hỗ trợ tìm kiếm việc làm cho người khuyết tật ứng dụng trí tuệ nhân tạo (AI-Powered Job Matching System).

---

## 1. Mục Tiêu Dự Án (Project Goals)

- Xây dựng một nền tảng bình đẳng, xóa bỏ rào cản tìm việc cho 3 nhóm người khuyết tật (Vận động, Nghe/Nói, Nhìn).
- Cung cấp công cụ chuyên biệt để các doanh nghiệp dễ dàng tiếp cận và tuyển dụng nguồn lao động đặc thù.
- Ứng dụng AI để tự động hóa các khâu khó khăn nhất: Viết CV, lọc hồ sơ và thao tác trên thiết bị (dành cho người khiếm thị).

## 2. Đối Tượng Người Dùng (Target Audience)

1. **Ứng viên (Candidate):** Người khuyết tật đang có nhu cầu tìm kiếm việc làm phù hợp với năng lực và điều kiện sức khỏe.
2. **Nhà tuyển dụng (Employer):** Các doanh nghiệp, tổ chức có nhu cầu tuyển dụng người khuyết tật hoặc có môi trường làm việc thân thiện với người khuyết tật.
3. **Quản trị viên (Admin):** Người giám sát hệ thống, kiểm duyệt nội dung và hỗ trợ người dùng.

---

## 3. Danh Sách Tính Năng Chi Tiết (Features Breakdown)

### 3.1. Phân hệ Ứng viên (Web & Mobile)

- **Quản lý Hồ sơ Cá nhân:** Khai báo thông tin, kỹ năng và lựa chọn nhóm khiếm khuyết (để hệ thống tối ưu hóa hiển thị và gợi ý).
- **AI CV Generator (Tạo CV tự động):** Ứng viên nhập kỹ năng cốt lõi, AI sẽ tự động phân tích và sinh ra bản CV hoàn chỉnh, nhấn mạnh vào thế mạnh chuyên môn thay vì khiếm khuyết.
- **Tìm kiếm & Lọc việc làm:** Lọc công việc theo mức độ phù hợp với tình trạng sức khỏe (VD: Việc làm tại nhà, văn phòng có lối đi xe lăn).
- **Voice Assistant (Độc quyền trên Mobile):** Trợ lý giọng nói hỗ trợ người khiếm thị. Chuyển đổi giọng nói thành văn bản (STT) để tìm việc và đọc kết quả bằng giọng nói (TTS).
- **Theo dõi Ứng tuyển:** Cập nhật trạng thái hồ sơ (Đã xem, Chấp nhận phỏng vấn, Từ chối).

### 3.2. Phân hệ Nhà Tuyển Dụng (Web & Mobile)

- **Quản lý Hồ sơ Doanh nghiệp:** Thông tin công ty, hình ảnh môi trường làm việc, các tiện ích hỗ trợ người khuyết tật.
- **Đăng Tin Tuyển Dụng:** Cho phép gắn thẻ (tag) các yêu cầu đặc thù hoặc nhóm người khuyết tật phù hợp với vị trí công việc.
- **AI Recommendation (Gợi ý Ứng viên):** Hệ thống tự động quét và đề xuất danh sách ứng viên có bộ kỹ năng khớp nhất với yêu cầu công việc.
- **Quản lý Quy trình Tuyển dụng:** Xem CV, đánh giá, gửi lời mời phỏng vấn hoặc phản hồi trực tiếp trên nền tảng.

### 3.3. Phân hệ Quản trị viên (Web Portal)

- **Kiểm duyệt Nội dung:** Duyệt tin đăng tuyển dụng và tài khoản doanh nghiệp để tránh lừa đảo.
- **Quản lý Người dùng:** Khóa/Mở khóa tài khoản có hành vi vi phạm.
- **Báo cáo & Thống kê:** Bảng điều khiển (Dashboard) thống kê số lượng tin đăng, số lượt ứng tuyển thành công, biểu đồ tăng trưởng.

---

## 4. Kết Quả Mong Đợi (Expected Outcomes)

- **Sản phẩm đầu ra:** Một hệ thống chạy thực tế, ổn định trên cả môi trường trình duyệt (Web) và điện thoại di động (App).
- **Hiệu suất AI:** Mô hình LLM sinh CV đạt độ tự nhiên, logic và bám sát vào yêu cầu của thị trường lao động. Trợ lý giọng nói phản hồi chính xác lệnh của người dùng.
- **Vận hành (DevOps):** Toàn bộ hệ thống được đóng gói bằng Docker và triển khai luồng CI/CD tự động lên máy chủ VPS.

## 5. Tiêu Chuẩn Kỹ Thuật (Technical Constraints)

- **Bảo mật:** Mật khẩu được mã hóa, sử dụng JWT để xác thực phiên đăng nhập.
- **Tối ưu hóa (SEO):** Các trang tin tuyển dụng trên Web Portal (Next.js) phải được lập chỉ mục tốt trên các công cụ tìm kiếm.
- **Trải nghiệm người dùng (UX/UI):** Giao diện phải tuân thủ các tiêu chuẩn trợ năng (Accessibility - a11y), độ tương phản cao, hỗ trợ trình đọc màn hình.

## 6. Quy Trình Nghiệp Vụ Cơ Bản (User Flows)

### 6.1. Luồng Ứng viên tìm việc (Candidate Flow)

1. **Đăng nhập/Đăng ký:** Truy cập hệ thống (Web/Mobile), tạo tài khoản và xác thực.
2. **Thiết lập Profile:** Khai báo thông tin cá nhân, chọn nhóm khiếm khuyết (Vận động/Nghe/Nói/Nhìn) để hệ thống tối ưu giao diện và gợi ý.
3. **Tạo CV bằng AI:** Nhập danh sách kỹ năng, kinh nghiệm. AI tự động sinh ra bản CV hoàn chỉnh và lưu vào hồ sơ.
4. **Tìm kiếm & Ứng tuyển:**
   - Sử dụng bộ lọc hoặc nhận danh sách công việc do AI gợi ý.
   - _(Trên Mobile)_: Sử dụng Voice Assistant để tìm việc bằng giọng nói.
   - Chọn công việc phù hợp và bấm "Nộp CV".
5. **Theo dõi trạng thái:** Nhận thông báo khi Nhà tuyển dụng xem CV hoặc mời phỏng vấn.

### 6.2. Luồng Nhà tuyển dụng (Employer Flow)

1. **Xác thực Doanh nghiệp:** Đăng ký tài khoản, cập nhật hồ sơ công ty và chờ Admin kiểm duyệt.
2. **Đăng tin tuyển dụng:** Điền thông tin job, yêu cầu kỹ năng và gắn tag các nhóm khuyết tật có thể đáp ứng công việc.
3. **Quản lý Ứng viên:**
   - Nhận hồ sơ ứng tuyển từ hệ thống.
   - Sử dụng hệ thống AI Recommendation để chủ động tìm kiếm các hồ sơ phù hợp đang có sẵn trên nền tảng.
4. **Tương tác:** Đánh giá hồ sơ, đổi trạng thái (Từ chối/Phỏng vấn) để hệ thống tự động báo cho ứng viên.
