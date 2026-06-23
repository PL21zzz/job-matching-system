# Chapter 4 – Deployment and Business Models

Dưới đây là bản Chương 4 đã được chỉnh theo hướng hệ thống hiện tại:

- triển khai web-first
- deploy trên VPS
- có Docker, Nginx, PostgreSQL
- không còn hướng Android native riêng
- nhấn mạnh giá trị khởi nghiệp và mô hình kinh doanh thực tế hơn

---

# DEPLOYMENT AND BUSINESS MODELS

## Implementation Results

### System Implementation Overview

Following the completion of system analysis, architecture design, database modeling, and core feature development, the Equitas AI platform has been implemented as a functional web-based Minimum Viable Product (MVP). The current product is centered on a responsive Next.js frontend, a NestJS backend API, and a PostgreSQL database managed through Prisma ORM.

The deployment model is designed for practical hosting on a production VPS environment. To ensure stable runtime behavior and reduce environment inconsistency between development and deployment, the frontend, backend, and database services are organized through containerized infrastructure. The system is intended to be hosted on an Ubuntu-based VPS, with Nginx acting as the reverse proxy and SSL termination layer for secure HTTPS access.

Artificial intelligence capabilities are integrated into the platform through external AI services. In the current system, these services support multiple assistive functions, including CV generation and tailoring based on job descriptions, cover letter generation, AI interview practice, and conversational job-search assistance. For visually impaired users, the voice-support layer is implemented directly on the web platform through browser-based interaction rather than through a standalone mobile application.

The current deployment demonstrates the technical feasibility of the platform as a real web-based inclusive recruitment product rather than a theoretical academic prototype.

### Implemented Functions

The current version of Equitas AI successfully implements the primary functional modules required by the MVP scope.

#### Advanced Authentication, Session Security, and Role Segregation Subsystem

The authentication subsystem supports:

- account registration
- OTP-based verification through email
- local login with email and password
- Google OAuth login
- logout
- password recovery and reset
- refresh-token-based session continuity
- role-based access control for Candidate, Employer, and Admin

This subsystem is important because it protects sensitive personal, profile, and application data while keeping repeated access practical for users.

#### Accessibility Profile Configuration and Inclusive Job Data Modeling

The platform supports structured data modeling for inclusive recruitment. Candidates can configure profile information relevant to accessibility needs, while employers can create job posts that explicitly define supported disability groups and accommodations.

In the current MVP, the system is standardized around four target disability groups:

- mobility disabilities
- visual impairments
- hearing impairments
- speech impairments

This standardization improves job filtering, matching, and AI interpretation throughout the system.

#### AI-Assisted Candidate Preparation Features

The AI layer supports several important candidate-facing functions:

- CV generation and CV tailoring according to a selected job description
- cover letter generation
- interview practice using the selected job and the candidate profile as context

These functions help candidates improve application quality and reduce barriers during preparation, especially when they are unsure how to present their experience in a professional and job-relevant way.

#### Accessibility-Aware Job Search and Voice Assistance

The current platform includes an accessibility-aware job search experience in which job results can be interpreted together with structured accommodation data. This improves the practical relevance of search results for candidates with disabilities.

For visually impaired users, the system also provides a browser-based voice assistant. This module supports spoken job-search requests, AI-assisted intent interpretation, and spoken responses. As a result, the product offers a more accessible job discovery pathway directly on the web platform.

#### Employer and Administrative Functions

On the employer side, the system supports:

- employer profile management
- inclusive job post creation
- accommodation configuration
- application review
- application status updates

On the admin side, the system supports:

- statistics overview
- user management
- employer and candidate monitoring
- job and application review

Together, these functions make the MVP operational for all three main stakeholder groups.

### System Images and Function Demo

The implementation results should be demonstrated through screenshots that reflect the real working flow of the system. Instead of inserting screens randomly, the screenshots should be arranged in a narrative order that matches the business lifecycle.

A recommended order is:

1. candidate registration / login
2. candidate home page or onboarding state
3. candidate job search page
4. job detail page
5. AI CV creation or CV tailoring page
6. AI interview practice modal/page
7. AI voice assistant page
8. candidate profile page
9. employer landing page
10. employer create job page with structured accommodations
11. employer application management page
12. admin dashboard
13. Docker / VPS deployment evidence
14. database schema or live database view

### Usage Case Study

To illustrate the practical use of the system, a realistic usage scenario can be described through a complete candidate-to-employer flow.

For example, a candidate with mobility-related accessibility needs logs into the platform, updates their profile, uses AI to tailor a CV for a selected job description, generates a cover letter, reviews compatible jobs based on accessibility-related information, and submits an application. The employer then reviews the application, sees the candidate’s materials, and updates the application status through the employer dashboard.

This scenario demonstrates how the system connects accessibility-aware search, AI-assisted preparation, and recruitment workflow management in a single platform.

## Testing and Evaluation

### Testing Objectives

The testing phase aims to confirm that the MVP works reliably across the main functional paths of the system. The verification process should focus on:

- authentication and session continuity
- candidate and employer role separation
- profile update workflows
- job posting and job filtering
- CV generation and CV tailoring
- cover letter generation
- interview practice
- application submission
- voice-assistant interaction
- deployment stability on VPS infrastructure

### Test Scenario

The test scenario table may remain in the report, but its interpretation should emphasize real feature validation rather than only technical completion. Each scenario should show whether the platform can support the intended user workflow from input to outcome.

### Evaluation Results

The evaluation results of the current MVP indicate that the platform is technically feasible and functionally coherent within the intended graduation-project scope. The authentication, role management, profile handling, job workflows, and AI-assisted preparation functions operate together as a unified web system.

The AI-supported CV tailoring and cover letter functions provide clear practical value because they help users transform raw input into more professional application content. The interview practice feature also extends the system beyond document preparation into candidate readiness support.

At the same time, some limitations remain. The overall experience still depends partly on third-party AI and speech services. Voice interaction quality may vary depending on browser support and service responsiveness. In addition, matching quality can still be improved through richer structured data and more advanced scoring logic in future iterations.

### User Feedback

If direct user feedback is still limited, the report should present this honestly. You can state that the current feedback comes primarily from internal testing, peer review, and limited scenario-based evaluation.

The feedback can be summarized around three positive areas:

- the social value and inclusiveness of the platform idea
- the practical usefulness of AI-supported CV tailoring and interview preparation
- the convenience of structured accommodations for job exploration

At the same time, future user testing should involve a broader real-world audience, especially participants from disability support communities and inclusive employers.

## Effectiveness Analysis

### Time Saving

The platform reduces the time needed for candidates to move from raw information to a job-ready application package. Instead of using multiple disconnected tools, users can search for jobs, tailor a CV, generate a cover letter, and practice interviews within the same ecosystem.

For employers, structured job posting and application review reduce the friction of identifying suitable candidates and organizing application progress.

### Improving Performance

The system improves the quality of candidate preparation by giving users structured AI support before they apply. It also improves employer-side efficiency by allowing job information and accommodation logic to be expressed more clearly.

### Reducing the Cost of Using Multiple Tools

One of the core advantages of Equitas AI is consolidation. Instead of forcing users to combine separate platforms for recruitment, CV editing, AI writing, voice support, and application management, the system brings these functions into a unified web platform. This reduces workflow fragmentation and lowers practical usage cost.

### Improving Accuracy in Progress Management

The application lifecycle is tracked through structured application states such as APPLIED, REVIEWING, INTERVIEW, ACCEPTED, and REJECTED. This improves transparency for both candidates and employers and creates a clearer recruitment pipeline than manual communication or fragmented tools.

## Startup Orientation and Commercialization

### Lean Startup Model

The development direction of Equitas AI fits the Lean Startup model by focusing first on a practical MVP rather than a feature-complete platform.

- **Build:** develop a functional inclusive recruitment MVP with authentication, job posting, structured accommodations, AI CV tailoring, interview practice, and voice assistance.
- **Measure:** evaluate technical performance, usability, and perceived value through testing and limited real-user feedback.
- **Learn:** improve matching logic, accessibility flows, and commercialization strategy based on observed usage and stakeholder response.

This approach is suitable for an early-stage startup because it reduces waste and keeps the product closely tied to real user problems.

### Business Model Canvas

The business model of Equitas AI can be described through a two-sided platform structure:

- **Customer Segments:** candidates with disabilities, inclusive employers, social organizations, universities, and support centers
- **Value Proposition:** inclusive job discovery, structured accommodations, AI-assisted candidate preparation, and accessibility-aware workflows
- **Channels:** web platform, partnerships, community organizations, university networks, and B2B outreach
- **Customer Relationships:** self-service platform usage, guided onboarding, support documentation, and future enterprise support
- **Revenue Streams:** employer subscriptions, premium inclusive job postings, advanced analytics, and enterprise hiring-support services
- **Key Resources:** software platform, database, prompt design, partnerships, and domain understanding of inclusive recruitment
- **Key Activities:** software development, deployment maintenance, AI optimization, employer onboarding, and user support
- **Key Partnerships:** disability support organizations, universities, NGOs, employers, and cloud/AI service providers
- **Cost Structure:** VPS hosting, AI usage cost, development labor, maintenance, and outreach cost

### Design Thinking Orientation

The project also aligns with Design Thinking because its feature set is built around understanding the real friction experienced by a specific underserved user group.

- **Empathize:** understand barriers in job discovery, application preparation, and accessibility
- **Define:** identify the lack of structured inclusive recruitment workflows
- **Ideate:** design a platform combining AI support, accessibility-aware data, and voice interaction
- **Prototype:** build a web-based MVP
- **Test:** validate the MVP through technical tests and scenario-based usage

### Commercialization Orientation

In its current form, Equitas AI can be positioned as a social-impact HRTech platform.

A realistic commercialization roadmap is:

- **Short-term:** provide a strong free or low-cost experience for candidates while validating employer demand
- **Mid-term:** introduce B2B subscription services for employers, including premium job posting and advanced inclusive hiring features
- **Long-term:** expand into a broader inclusive employment ecosystem through partnerships, analytics, accessibility scoring, and larger talent-network features

The key innovation is not merely the use of AI, but the combination of AI assistance, structured accommodation data, and accessible web interaction in a platform specifically designed for inclusive employment.

---

# Ghi chú tiếng Việt – không đưa vào báo cáo

## 1. Chương 4 này đã sửa những gì

- Bỏ toàn bộ hướng Android native riêng.
- Giữ rõ hướng deploy trên VPS Ubuntu.
- Giữ Docker + Nginx + PostgreSQL + HTTPS.
- Đổi mô tả implementation results sang web-first đúng với sản phẩm hiện tại.
- Đưa AI Interview Practice vào phần implemented functions.
- Đưa voice assistant về web voice assistant.
- Viết phần business model theo hướng startup thực tế hơn.

## 2. Chỗ demo trong Chương 4 nên chụp gì

Bạn nên chụp theo thứ tự này để report nhìn có câu chuyện:

### Nhóm Candidate

1. Trang đăng ký Candidate
2. Trang đăng nhập
3. Trang chủ
4. Trang tìm việc
5. Trang chi tiết job
6. Trang profile candidate
7. Trang edit profile
8. Trang CV editor / create CV
9. Màn AI tạo CV theo JD
10. Màn AI cover letter
11. Màn AI interview practice
12. Màn AI voice assistant
13. Màn apply job thành công hoặc form apply

### Nhóm Employer

14. Trang “For Employer”
15. Trang employer profile
16. Trang create job
17. Phần accommodations theo 4 nhóm trong create job
18. Trang employer manage applications / manage jobs

### Nhóm Admin

19. Trang admin dashboard
20. Màn danh sách users / jobs / applications nếu muốn chứng minh quản trị

### Nhóm hạ tầng triển khai

21. Docker containers đang chạy
22. VPS / terminal deploy
23. Nginx / reverse proxy nếu có ảnh hợp lý
24. Database view / Prisma schema / pgAdmin hoặc table view
25. GitHub commit / CI-CD nếu muốn chứng minh quy trình kỹ thuật

## 3. Nếu cần chụp ít mà vẫn đủ mạnh

Nếu không muốn quá nhiều ảnh, ưu tiên các ảnh này:

- Login
- Home
- Find Jobs
- Job Detail
- Create CV
- AI Interview Practice
- Web Voice Assistant
- Employer Create Job
- Employer Manage Applications
- Admin Dashboard
- Docker / VPS deploy
- Database

## 4. Chỗ AI Interview Practice ở Chapter 3

Đúng như bạn nói, module này hiện đã có phần chữ nhưng chưa có bộ hình riêng.

Nếu bạn muốn bộ Chapter 3 đầy đủ hơn, bước tiếp theo nên làm thêm:

- AI Interview Practice Use Case Diagram
- AI Interview Practice Activity Diagram
- AI Interview Practice Sequence Diagram

Mình có thể viết luôn bộ PlantUML đó cho bạn ở bước sau.
