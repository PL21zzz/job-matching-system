# Chapter 3 – Product Design and Development

Dưới đây là bản Chương 3 đã được làm sạch theo 2 lớp:

- Phần tiếng Anh: có thể dùng để đưa vào báo cáo.
- Phần ghi chú tiếng Việt ở cuối file: chỉ để bạn biết cần sửa hình nào, đổi tên gì, hoặc lưu ý biên tập gì thêm.

---

# PRODUCT DESIGN AND DEVELOPMENT

## System Architecture

### System Architecture Overview

The Equitas AI platform is designed as a web-first, multi-role recruitment ecosystem that integrates accessibility-aware data, assistive artificial intelligence, and responsive browser-based interaction. The system follows a decoupled client-server architecture in which all core user groups interact through a unified web platform, while the backend coordinates business logic, data persistence, and AI service integration.

At the frontend level, the system provides two complementary interaction layers within the same web application:

- **Graphical Web Interface (Next.js):** This is the main interface used by Candidates, Employers, and Admins. It supports profile management, job search, job posting, CV editing, AI-assisted writing tools, interview practice, story management, and administrative monitoring.
- **Voice-Assisted Web Interface:** This interaction layer is embedded directly into the web platform to support visually impaired users. Instead of requiring a standalone mobile application, the browser-based voice workflow allows users to speak job-related requests, receive AI-processed responses, and listen to suggested opportunities through speech output.

The frontend communicates with the backend through secure HTTPS-based APIs. The backend then handles authentication, role validation, profile and job logic, accessibility-aware matching, and communication with external AI and speech services.

### Backend and API Architecture

The backend is implemented using NestJS with TypeScript and follows a modular service-oriented architecture. This structure improves maintainability, separation of concerns, and future extensibility.

The backend is organized into three main layers:

- **Controller Layer:** Handles incoming HTTP requests, validates payloads through DTOs, applies guards and role restrictions, and forwards requests to the appropriate services.
- **Service Layer:** Contains the business logic of the platform, including authentication flows, profile management, job creation, accessibility-aware filtering, job applications, AI-assisted CV generation, cover letter generation, interview practice, and conversational job guidance.
- **Data Access Layer (Prisma ORM):** Provides structured and type-safe communication with the PostgreSQL database. This layer manages persistence for users, roles, profiles, disability types, job postings, applications, stories, and related entities.

Within the current system, the backend also supports:

- refresh-token-based session continuity
- role-based access control for Candidate, Employer, and Admin
- AI orchestration for CV tailoring, cover letter generation, interview practice, and job-search assistance
- structured accommodation data for job postings

### Cloud and Deployment Architecture

To support MVP deployment and future commercialization, the platform is designed for containerized deployment on a cloud-hosted VPS environment. The architecture includes:

- **Nginx Reverse Proxy Layer:** Receives public traffic, handles SSL termination, and routes requests to the frontend or backend services.
- **Frontend Container:** Hosts the Next.js web application.
- **Backend Container:** Hosts the NestJS API service.
- **Database Container / Persistent Storage:** Maintains PostgreSQL data with persistent volumes.

This architecture supports environment consistency, easier deployment, lower infrastructure complexity, and scalable extension in future iterations.

## Database, Function, and UI/UX Design

### Database Design

The database is built on PostgreSQL and accessed through Prisma ORM. The schema supports the main workflows of inclusive recruitment, AI-assisted application preparation, and administrative governance.

The core data entities include:

- **roles:** stores system roles such as Admin, Employer, and Candidate
- **users:** stores account identity, authentication, and role-related data
- **otps:** stores one-time verification codes for security workflows
- **candidate_profiles:** stores candidate information, including disability type and personal context for matching and AI support
- **employer_profiles:** stores employer information and organization-level profile details
- **disability_types:** stores the four supported disability groups in the current MVP
- **categories:** stores job categories
- **jobs:** stores job postings, role details, salary information, and structured accessibility/accommodation information
- **applications:** stores candidate applications, uploaded CV data, match scores, and status tracking
- **stories:** stores candidate-created inspirational or experiential posts published on the platform

The current system is standardized around four supported disability groups:

- mobility disabilities
- visual impairments
- hearing impairments
- speech impairments

In the current product direction, the `jobs` entity is especially important because it not only stores general job information, but also structured accommodation data used for search, matching, and AI interpretation.

### System Analysis and Design

#### Actor Identification

The system currently identifies four main actors:

- **Candidate:** the primary end user who creates a profile, searches for jobs, applies for jobs, generates CV and cover letter content, practices interviews with AI, and may use voice interaction if visually impaired.
- **Employer:** the business user who manages an organization profile, creates inclusive job posts, defines accommodations, and reviews applications.
- **Admin:** the governance user who monitors platform activity, manages users, reviews system-wide data, and performs moderation-oriented administration.
- **External AI Services:** third-party AI engines that support CV tailoring, cover letter generation, interview practice, job-search assistance, and speech-related workflows.

The current MVP supports visually impaired users directly on the web platform through browser-based voice interaction.

#### General Use Case

The system’s overall use cases are structured around a unified web-first platform:

##### Universal System Functions

- register candidate and employer accounts
- verify accounts through OTP-based workflows
- authenticate users with email/password or Google login
- maintain session continuity through refresh-token support
- allow profile update and password management

##### Candidate Functional Suite

- create and manage a candidate profile
- select the relevant disability support category
- search and filter jobs by keyword, category, location, disability relevance, and accommodations
- view job details and assess accessibility compatibility
- generate and tailor CV content according to a selected job description
- generate AI-assisted cover letters
- practice interviews with AI based on a selected job and candidate profile
- apply for jobs with uploaded CV documents
- create and manage personal inspirational stories
- use browser-based voice interaction for job assistance if needed

##### Employer Functional Suite

- create and update employer profile information
- create inclusive job posts
- select supported disability groups for each job
- configure structured accommodations for those groups
- review candidate applications
- update application statuses

##### Admin Functional Suite

- view dashboard statistics
- manage candidates and employers
- review jobs and applications
- update user status
- remove inappropriate or invalid system records where necessary

#### System Class Diagram

The class diagram should reflect the core domain entities and their relationships more accurately. In particular, it should clearly show the relationships among:

- User
- Role
- CandidateProfile
- EmployerProfile
- DisabilityType
- Job
- Application
- Story

If accessibility-related job data is represented as structured accommodation information, this attribute should also be reflected conceptually in the diagram.

#### System Function Design

##### Advanced Authentication Module

This module controls registration, login, Google authentication, OTP verification, password recovery, logout, and refresh-token-based session continuity. It is implemented to protect sensitive candidate and employer data while maintaining a practical user experience across repeated sessions.

The authentication flow includes:

- OTP-based verification
- JWT-based authentication
- refresh-token workflow
- role-protected access to sensitive functions

##### Assistive AI CV Tailoring Module

This module is one of the most important differentiators of the platform. It enables candidates to generate and refine CV content in a way that aligns with a selected job description. The workflow takes candidate context and target job context as inputs, then uses AI to rewrite or structure content into more professional and job-relevant form.

The module supports:

- AI-assisted CV generation
- AI-assisted CV tailoring based on job description
- preparation of job-specific application materials
- export-ready document preparation through the web interface

##### AI Interview Practice Module

This capability is a real part of the current system. The module uses the selected job and candidate profile to simulate interview questions and guide the user through a text-based interview practice experience.

This module is especially meaningful for:

- candidates who want to improve readiness before applying
- candidates with hearing or speech impairments who benefit from non-verbal practice workflows

The interaction flow of this module can be represented through dedicated use case, activity, and sequence diagrams if the report requires a more complete AI feature set.

##### Web Voice Job Assistant Module

The current system integrates a browser-based voice interaction workflow directly into the web platform. This module allows visually impaired users to:

- speak job-search needs
- convert spoken input into text
- pass that text into AI-assisted intent analysis and ranking logic
- receive relevant job suggestions
- listen to the response through text-to-speech output

This module replaces the previous mobile-specific direction and aligns the report with the actual MVP scope.

### UI/UX Design

#### Design Philosophy and Accessibility Principles

The interface design follows inclusive design principles and aims to reduce digital barriers for different disability groups through:

- semantic HTML and accessible structure
- reasonable screen-reader compatibility
- high contrast and readable typography
- keyboard-friendly navigation
- responsive layout
- voice-assisted workflows for visually impaired users

The system is positioned as accessibility-aware and inclusion-oriented, with the goal of improving practical digital access for all supported user groups.

#### Web Client Interface Design – Next.js

The web interface is the central client environment of the current MVP. It includes several major interaction spaces:

- **Job Search Interface:** supports job discovery, filtering, and accessibility-aware exploration
- **Job Detail Interface:** presents role information, accommodations, and application entry points
- **AI CV Builder / CV Editor:** supports profile-based and job-based CV preparation
- **AI Interview Practice Interface:** supports structured AI conversation for interview preparation
- **Employer Job Management Interface:** supports inclusive job post creation and application review
- **Profile Management Interface:** supports candidate and employer profile editing
- **Story Management Interface:** supports candidate-created inspirational content
- **Admin Dashboard:** supports system monitoring and governance

In particular, the employer job creation interface is designed as a structured inclusive workflow in which accommodations are explicitly configured for the supported disability groups.

#### Voice-Assisted Web Interface for Visually Impaired Users

The current voice-oriented experience is embedded directly into the web platform. Instead of relying on a separate mobile application, the design focuses on:

- a microphone-first interaction entry point
- minimal friction in spoken query capture
- AI-generated spoken responses
- simplified navigation to job suggestions
- compatibility with browser-native speech technologies and accessible web structure

This design aligns the report with the real MVP scope and reflects the current web-first product direction.

## MVP Development

### Development Environment and Tech Stack Selection

The current MVP is implemented as a web-first full-stack system. The technology stack includes:

- **Frontend:** Next.js with TypeScript and Tailwind CSS
- **Backend:** NestJS with TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT, refresh token, OTP verification, Google login
- **AI Integration:** Gemini-based content generation and conversational support
- **Voice Support:** browser speech recognition and speech synthesis, with external TTS support where available

### Containerization and Docker Configuration

The system uses containerization to isolate:

- frontend service
- backend service
- database service

This supports reproducible deployment and MVP stability.

### Cloud Deployment and Network Security Plan

The cloud deployment model remains based on:

- VPS hosting environment
- Nginx reverse proxy
- HTTPS with SSL termination
- internal service routing between frontend, backend, and database
- firewall restrictions for safer production exposure

This deployment direction is appropriate for the current MVP and supports practical real-world hosting.

### MVP Key Deliverables Validation

The MVP includes:

- account authentication and role separation
- candidate and employer profile management
- inclusive job posting with structured accommodations
- accessibility-aware job discovery
- AI-assisted CV tailoring by job description
- AI-generated cover letters
- AI interview practice
- browser-based voice job assistant for visually impaired users
- application submission and status handling
- admin monitoring functions

This framing presents the MVP as a coherent inclusive recruitment platform rather than a mixture of web features and a separate mobile accessibility track.

---

# Ghi chú tiếng Việt – không đưa vào báo cáo

## 1. Các chỗ đã được đổi để khớp hệ thống hiện tại

- Đã bỏ hướng Android/mobile riêng.
- Đã chuyển toàn bộ logic sang web-first.
- Đã đổi phần voice assistant thành voice assistant chạy trực tiếp trên web.
- Đã thêm rõ:
  - AI CV tailoring theo job description
  - AI interview practice
  - accommodations có cấu trúc cho employer job form
  - deploy lên VPS

## 2. Những hình ở Chapter 3 cần sửa sau bằng PlantUML

- Figure 10: System Architecture Overview
  - Giữ ý tưởng tổng thể
  - Nhưng hình phải thể hiện:
    - 1 web platform thống nhất
    - browser-based voice assistant
    - backend
    - AI services
    - PostgreSQL
    - deploy trên VPS

- General Use Case Diagram
  - Bỏ actor/use case liên quan Android riêng
  - Chỉ giữ web-based flows

- Assistive AI CV Builder diagrams
  - Có thể giữ nhóm hình
  - Nhưng nên đổi wording sang gần sản phẩm hiện tại hơn:
    - CV Tailoring by Job Description

- AI Interview Practice Module
  - Hiện phần chữ đã có trong chương 3
  - Nếu muốn chương 3 đầy đủ hơn, nên bổ sung thêm 1 bộ hình riêng:
    - AI Interview Practice Use Case Diagram
    - AI Interview Practice Activity Diagram
    - AI Interview Practice Sequence Diagram

- Cần thay hoàn toàn các hình:
  - Android Touchless Voice Assistant Use Case Diagram
  - Android Touchless Voice Assistant Activity Diagram
  - Android Touchless Voice Assistant Sequence Diagram

  bằng:

  - Web Voice Job Assistant Use Case Diagram
  - Web Voice Job Assistant Activity Diagram
  - Web Voice Job Assistant Sequence Diagram

## 3. Chỗ cần nhớ khi paste vào báo cáo

- Chỉ lấy phần tiếng Anh ở trên để đưa vào báo cáo.
- Không lấy phần “Ghi chú tiếng Việt – không đưa vào báo cáo”.
- Nếu cần, mình có thể làm tiếp một bản “ready to paste” sạch hơn nữa, tức là chỉ còn phần tiếng Anh hoàn chỉnh, không kèm note nào.
