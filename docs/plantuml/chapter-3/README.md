# Chapter 3 - PlantUML figures (updated)

Các file trong thư mục này là bản PlantUML mới cho các hình của Chapter 3, đã chỉnh theo sản phẩm hiện tại:

- web-first
- deploy trên VPS
- có Docker + Nginx + PostgreSQL
- voice assistant chạy trên web, không còn Android riêng

## Danh sách hình

- Figure 10. System Architecture Overview → [figure-10-system-architecture.puml](D:\projects\job-matching-system\docs\plantuml\chapter-3\figure-10-system-architecture.puml)
- Figure 11. Cloud and Deployment Architecture → [figure-11-cloud-deployment.puml](D:\projects\job-matching-system\docs\plantuml\chapter-3\figure-11-cloud-deployment.puml)
- Figure 12. General Use Case Diagram → [figure-12-general-usecase.puml](D:\projects\job-matching-system\docs\plantuml\chapter-3\figure-12-general-usecase.puml)
- Figure 14. Authentication Use Case Diagram → [figure-14-auth-usecase.puml](D:\projects\job-matching-system\docs\plantuml\chapter-3\figure-14-auth-usecase.puml)
- Figure 15. Authentication Activity Diagram → [figure-15-auth-activity.puml](D:\projects\job-matching-system\docs\plantuml\chapter-3\figure-15-auth-activity.puml)
- Figure 16. Authentication Sequence Diagram → [figure-16-auth-sequence.puml](D:\projects\job-matching-system\docs\plantuml\chapter-3\figure-16-auth-sequence.puml)
- Figure 17. Assistive AI CV Builder Use Case Diagram → [figure-17-cv-usecase.puml](D:\projects\job-matching-system\docs\plantuml\chapter-3\figure-17-cv-usecase.puml)
- Figure 18. Assistive AI CV Builder Activity Diagram → [figure-18-cv-activity.puml](D:\projects\job-matching-system\docs\plantuml\chapter-3\figure-18-cv-activity.puml)
- Figure 19. Assistive AI CV Builder Sequence Diagram → [figure-19-cv-sequence.puml](D:\projects\job-matching-system\docs\plantuml\chapter-3\figure-19-cv-sequence.puml)
- AI Interview Practice Use Case Diagram → [figure-interview-practice-usecase.puml](D:\projects\job-matching-system\docs\plantuml\chapter-3\figure-interview-practice-usecase.puml)
- AI Interview Practice Activity Diagram → [figure-interview-practice-activity.puml](D:\projects\job-matching-system\docs\plantuml\chapter-3\figure-interview-practice-activity.puml)
- AI Interview Practice Sequence Diagram → [figure-interview-practice-sequence.puml](D:\projects\job-matching-system\docs\plantuml\chapter-3\figure-interview-practice-sequence.puml)
- Figure 20. Web Voice Job Assistant Use Case Diagram → [figure-20-web-voice-usecase.puml](D:\projects\job-matching-system\docs\plantuml\chapter-3\figure-20-web-voice-usecase.puml)
- Figure 21. Web Voice Job Assistant Activity Diagram → [figure-21-web-voice-activity.puml](D:\projects\job-matching-system\docs\plantuml\chapter-3\figure-21-web-voice-activity.puml)
- Figure 22. Web Voice Job Assistant Sequence Diagram → [figure-22-web-voice-sequence.puml](D:\projects\job-matching-system\docs\plantuml\chapter-3\figure-22-web-voice-sequence.puml)
- Figure 26. System Deployment → [figure-26-system-deployment.puml](D:\projects\job-matching-system\docs\plantuml\chapter-3\figure-26-system-deployment.puml)

## Ghi chú sửa caption

- Figure 20, 21, 22:
  - bỏ chữ `Android Touchless Voice Assistant`
  - đổi thành `Web Voice Job Assistant`

- Figure 11:
  - dùng rõ từ `Production VPS (Ubuntu Server)`
  - nhấn mạnh `Nginx + Docker + PostgreSQL + External AI/Cloudinary`

- Figure 26:
  - bỏ nhánh `Mobile Android Application`
  - chỉ giữ web browser client
  - thể hiện rõ:
    - Public Internet
    - VPS Ubuntu
    - Nginx reverse proxy + SSL
    - Docker containers
    - PostgreSQL
    - Google Gemini API

- Figure 12:
  - use case tổng quát giờ là web-first
  - không còn use case Android riêng

- AI Interview Practice:
  - đây là bộ hình bổ sung thêm để phần `System Function Design` cân hơn
  - nếu bạn muốn đánh số chính thức trong report thì có thể đặt sau Figure 19 và trước Figure 20
