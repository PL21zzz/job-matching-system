# Chapter 5 – Conclusion and Product Roadmap

Dưới đây là bản Chương 5 cuối cùng để khép báo cáo theo đúng hệ thống hiện tại:

- web-first
- không còn Android native riêng
- nhấn mạnh AI CV tailoring, AI interview practice, web voice assistant
- giữ tinh thần khởi nghiệp và lộ trình sản phẩm

---

# CONCLUSION & PRODUCT ROADMAP

## Main Achievements

Following the processes of problem analysis, system design, implementation, and validation, the project has successfully developed Equitas AI as a functional web-based MVP for inclusive recruitment. The platform is designed to support candidates with disabilities in preparing application materials, identifying suitable jobs, and navigating recruitment workflows with greater accessibility and autonomy.

The major achievements of the project can be summarized as follows:

- First, the project has developed a responsive web platform using Next.js, React, and TypeScript to support candidate, employer, and admin workflows in a unified environment.
- Second, the project has implemented a modular backend architecture using NestJS and TypeScript, enabling authentication, profile management, job posting, application handling, AI integration, and administrative control.
- Third, the system has established a relational database structure using PostgreSQL and Prisma ORM to manage users, roles, profiles, job postings, applications, stories, CV-related data, and disability-support categories.
- Fourth, the project has standardized the current MVP around four target disability groups: mobility disabilities, visual impairments, hearing impairments, and speech impairments.
- Fifth, the platform has implemented structured accommodation-aware job posting and job filtering, helping candidates identify more suitable opportunities and helping employers describe inclusive roles more clearly.
- Sixth, the system has integrated AI-assisted candidate preparation functions, including CV generation and tailoring by job description, cover letter generation, and AI interview practice.
- Seventh, the project has implemented a browser-based voice assistant for visually impaired users, allowing job exploration through speech-based interaction directly on the web platform.
- Eighth, the web application has been designed for deployment on a VPS-based hosting model using Docker, Nginx, PostgreSQL, and secure HTTPS routing, demonstrating real deployment feasibility beyond a purely academic prototype.

Overall, the project has established a meaningful technical foundation for an inclusive recruitment platform that combines accessibility-aware workflows, practical AI assistance, and startup-oriented product potential.

## Innovation Value and Applicability

### Innovation Value

The innovation value of Equitas AI lies not simply in the use of artificial intelligence, but in the way AI is combined with structured accessibility data and inclusive interaction design in a single recruitment platform.

Unlike traditional job platforms, Equitas AI is designed around the practical needs of users with disabilities. The system does not only display job listings; it also supports job discovery through structured accommodations, improves candidate readiness through AI-generated and job-tailored documents, and extends accessibility through a browser-based voice assistant for visually impaired users.

Another important innovation is the employer-side accommodation workflow. Instead of treating accessibility as unstructured text or a vague note, the platform moves toward explicit, structured accommodation configuration that can later support better search, recommendation, and matching logic.

### Applicability

Equitas AI has direct practical applicability for several groups:

- candidates with disabilities who need accessible job discovery and AI-supported application preparation
- employers interested in inclusive hiring and structured accommodation-aware recruitment workflows
- universities, NGOs, and support organizations that assist disadvantaged job seekers
- future social-impact or HRTech initiatives seeking a deployable inclusive recruitment foundation

The platform is especially useful because it addresses not only one stage of recruitment, but multiple connected stages: preparing a CV, tailoring it to a job, generating a cover letter, practicing interviews, searching for suitable jobs, and tracking application progress.

## Limitations of the Topic

Although the project has achieved important technical and practical results, several limitations remain in the current MVP:

- First, the system is still an MVP and has not yet reached the maturity level of a fully commercial HR platform.
- Second, the quality of AI-generated CV content, cover letters, and interview feedback still depends on the quality of user input and the behavior of third-party AI services.
- Third, accessibility support has been improved significantly, but it still requires broader validation with real users from disability communities to confirm usability in more diverse contexts.
- Fourth, the job matching logic can still be improved through richer structured data, more advanced scoring methods, and larger job datasets.
- Fifth, voice interaction quality may vary depending on browser support, speech recognition reliability, and text-to-speech service responsiveness.
- Sixth, the platform currently focuses on four target disability groups only, meaning it does not yet cover the full diversity of disability-support needs across the labor market.
- Seventh, the current evaluation scope is still limited and does not yet include large-scale field testing with real employers and a broad external user base.

## Recommendations and Development Directions

To improve the system further, the following development directions are recommended:

- First, improve AI output reliability through better prompt design, structured validation layers, and stronger error handling in content-generation workflows.
- Second, enhance the job matching and recommendation engine by using more structured candidate data, accommodation data, and explainable ranking logic.
- Third, expand the employer-side management experience through richer analytics, better job management controls, and stronger inclusive hiring support features.
- Fourth, improve candidate-side workflow continuity by adding stronger application history tracking, notification support, and saved-job features.
- Fifth, continue refining the accessibility layer through larger-scale testing, better screen-reader support, and more robust voice interaction quality.
- Sixth, strengthen the community and inspirational content layer so that candidate stories can contribute to motivation, onboarding, and trust-building inside the platform.
- Seventh, conduct broader testing with disability-focused organizations, universities, and inclusive employers to gather real-world feedback and improve the platform based on actual user experience.

## Future Product Development Roadmap

The future roadmap of Equitas AI can be divided into phased development stages:

- **Phase 1 – Stabilize the MVP:** fix remaining usability issues, polish key workflows, strengthen accessibility consistency, and improve AI reliability in CV tailoring and interview practice.
- **Phase 2 – Expand Real-World User Testing:** deploy the system to broader user groups, especially disability-support communities and partner organizations, to gather real feedback and validate practical usefulness.
- **Phase 3 – Enhance Intelligent Matching and Guidance:** improve matching quality, recommendation logic, and explainability of AI-assisted job suggestions and candidate preparation.
- **Phase 4 – Strengthen Employer and Admin Capabilities:** add richer employer analytics, better application management tools, and stronger moderation/governance features for platform administration.
- **Phase 5 – Commercialize and Scale the Platform:** introduce employer-oriented service models such as premium job posting, inclusive hiring support packages, analytics services, and future B2B partnership features.

This roadmap positions Equitas AI not only as a graduation project, but also as a practical foundation for a startup-oriented social-impact HRTech platform.

---

# Ghi chú tiếng Việt – không đưa vào báo cáo

## 1. Chương 5 này đã sửa gì

- Bỏ toàn bộ mô tả Android native.
- Bỏ các câu quá “nổ” kiểu production-grade quá mức.
- Đổi sang giọng học thuật nhưng vẫn giữ màu khởi nghiệp.
- Nhấn mạnh đúng các giá trị lõi hiện tại:
  - AI CV tailoring theo job
  - AI cover letter
  - AI interview practice
  - web voice assistant
  - structured accommodations
  - deploy trên VPS

## 2. Nếu bạn muốn phần cuối báo cáo đẹp hơn nữa

Bạn có thể thêm 1 đoạn ngắn trước `REFERENCES` kiểu:

`In summary, Equitas AI demonstrates that inclusive recruitment can be supported through a practical web-based ecosystem that combines structured accessibility data, assistive AI, and startup-oriented product thinking.`

Đoạn này không bắt buộc, nhưng nếu thêm sẽ giúp kết report mềm và chắc hơn.

## 3. Phần References cần rà lại

Vì giờ sản phẩm không còn mobile Android riêng, bạn nên cân nhắc:

- bỏ hoặc không ưu tiên các tài liệu như:
  - Android Developers. Kotlin and Android
  - Android Developers. Accessibility on Android

- thay bằng tài liệu liên quan hơn nếu cần:
  - Web Speech API
  - MDN SpeechRecognition / SpeechSynthesis
  - WCAG / WAI
  - Next.js / NestJS / Prisma / PostgreSQL
  - Gemini / Google AI
  - Docker / Nginx / Let's Encrypt

## 4. Sau Chương 5 là coi như xong phần thân báo cáo

Sau phần này bạn chỉ còn:

- References
- Appendices (nếu có)

Nếu cần, bước sau mình có thể giúp bạn:

- dọn lại phần References cho khớp hệ thống hiện tại
- hoặc gom toàn bộ Chương 1 → 5 thành checklist cuối để bạn paste vào Word cho khỏi sót
