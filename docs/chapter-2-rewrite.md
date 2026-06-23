# Chapter 2 – Literature Review and Background (Revised Draft)

This revised draft keeps the original structure of Chapter 2 and updates only the parts that need to be aligned with the current version of the system: a web-first inclusive recruitment platform with AI-assisted CV tailoring, structured accessibility accommodations, interview practice, and a voice job assistant for visually impaired users.

## What should be updated in the current Chapter 2

- Keep:
  - the chapter structure
  - technology trend discussion
  - digital transformation in recruitment
  - SWOT / PESTEL / Porter framework
  - theoretical basis around Next.js, NestJS, Prisma, PostgreSQL, Gemini, GitHub Actions, and Docker

- Update:
  - emphasize the market gap around structured accessibility data
  - add AI CV tailoring by job description as a core product value
  - replace any remaining “mobile-first” implication with browser-based voice interaction on the web
  - revise functional requirements so they reflect the actual system:
    - 4 supported disability groups
    - structured accommodations in employer job posting
    - AI CV generation/tailoring
    - AI interview practice
    - AI job search assistant
    - role-based access control for Candidate / Employer / Admin

---

# LITERATURE REVIEW AND BACKGROUND

## Field Overview

### Technology Trends

The global development of assistive technology for people with disabilities is increasingly moving from isolated support tools toward integrated digital ecosystems powered by artificial intelligence, structured data, and accessible user experience design. In this transition, two technological trends are particularly relevant to the engineering direction of Equitas AI.

The first trend is the rapid growth of generative artificial intelligence and large language models. Modern AI systems are no longer limited to simple question-answering. They can understand context, transform raw user input into structured professional content, personalize output according to a target use case, and support natural multi-turn interaction. In the recruitment domain, this enables functions such as CV generation, CV tailoring based on a specific job description, cover letter drafting, interview practice, and conversational job guidance. For job seekers with disabilities, these capabilities are especially valuable because they reduce barriers in self-presentation and improve readiness before applying.

The second trend is the transition from purely visual user interfaces toward accessible multimodal interaction. Traditional recruitment websites depend heavily on mouse interaction, dense layouts, and manual typing. This creates serious friction for visually impaired users and can also affect users with mobility-related difficulties. Browser-native voice interaction technologies now make it possible to support job discovery through speech-to-text, intent interpretation, and text-to-speech response. As a result, web platforms can provide a more inclusive interaction model without requiring a separate mobile application.

### Digital Transformation in Recruitment

Digital transformation has significantly changed how employers and candidates meet in the labor market. Online recruitment platforms, applicant tracking systems, digital portfolios, and remote interviewing tools have made recruitment faster and broader in reach. However, most of these systems are still designed for the general population and rarely account for accessibility-related needs in a structured way.

This creates a major gap in inclusive recruitment. Existing job platforms usually store standard fields such as title, location, salary, and experience, but they do not organize accessibility accommodations as formal searchable data. As a result, a role may appear suitable on paper while remaining inaccessible in practice due to workplace setup, communication style, or digital workflow incompatibility. Therefore, true digital transformation in recruitment should not only digitize job posting and application submission, but also structure accessibility information so that compatibility can be evaluated earlier and more transparently.

### Related Market

The market for inclusive employment technology remains underdeveloped despite its clear social and economic relevance. On one side, mainstream recruitment platforms have scale, brand recognition, and large job volumes, but they are not optimized for candidates with disabilities and do not provide disability-aware matching or accessibility-specific filtering. On the other side, traditional support organizations and employment centers often work manually, have limited digital reach, and cannot provide intelligent assistance for job preparation or personalized matching at scale.

This gap creates a meaningful opportunity for a specialized digital platform such as Equitas AI. The project does not attempt to compete with general job boards only on volume. Instead, it focuses on a narrower but high-impact value proposition: structured accessibility-aware job data, AI-assisted application preparation, and inclusive interaction for users with different disabilities. From a startup and innovation perspective, this niche is important because it combines social impact with a practical market problem that existing platforms have not solved well.

## Market Demand Survey and Related Product Analysis

### User Demand Survey

To understand the functional direction of the system, the project considers the needs of two major groups: candidates with disabilities and employers interested in inclusive hiring.

From the candidate perspective, the demand goes beyond simply browsing job posts. Users need support in identifying whether a role is practically suitable, not only whether the title looks relevant. Candidates with mobility disabilities need clear information about physical access and flexible work options. Candidates with hearing or speech impairments need workflows that do not depend excessively on phone calls or verbal interaction. Visually impaired candidates require a way to search and interact with jobs through accessible web navigation and voice support.

In addition, a major demand exists around job application preparation. Many candidates struggle not because they lack capability, but because they lack tools to convert their background into a professional application package. Therefore, the ability to generate a CV, tailor that CV to a selected job description, and create a relevant cover letter becomes a central requirement rather than an optional enhancement.

From the employer perspective, the main demand is not only access to a wider talent pool, but also a practical method for posting inclusive opportunities more clearly. Employers need a system that helps them describe accommodations, define suitable candidate groups, and reduce mismatch during early screening. This supports both operational efficiency and broader Diversity and Inclusion objectives.

### Comparison of Advantages and Disadvantages of Related Products/Systems

The current recruitment technology landscape includes many large platforms, but most of them are optimized for general-purpose hiring rather than inclusive hiring. Therefore, the comparative analysis in this section should focus on criteria that are truly relevant to the current system design.

The comparison table should include at least the following dimensions:

- general job volume
- accessibility accommodation data
- disability-specific filtering
- AI CV generation or CV tailoring by job description
- AI cover letter support
- AI interview practice
- voice-based interaction for visually impaired users
- employer-side inclusive job configuration

Under this comparison logic, mainstream recruitment platforms may score strongly on traffic and employer network, but weakly on accessibility-aware workflows. Equitas AI is positioned differently: it may have a smaller initial marketplace scale, but offers deeper support for inclusive recruitment and candidate preparation.

### SWOT Analysis

The SWOT analysis remains relevant, but its interpretation should reflect the current product direction.

- Strengths:
  - clear social impact value
  - AI-assisted CV tailoring and candidate preparation
  - structured accommodations for four target disability groups
  - web-based voice assistant for visually impaired users

- Weaknesses:
  - limited initial dataset compared with large job boards
  - dependence on third-party AI services and voice services
  - early-stage product maturity

- Opportunities:
  - growing employer interest in CSR and D&I hiring
  - partnerships with universities, NGOs, and support centers
  - potential for startup development in an underserved market

- Threats:
  - competition from large platforms if they add accessibility features
  - instability in external AI or speech service costs
  - slow adoption from organizations unfamiliar with inclusive hiring workflows

### PESTEL Analysis

The PESTEL section can remain, but it should be interpreted around:

- Political / Legal: inclusive employment policies, disability rights, data privacy obligations
- Economic: demand for digital jobs, cost sensitivity of SMEs, efficiency benefits of better job matching
- Social: growing awareness of inclusion, reduced stigma, social demand for equal access
- Technological: rapid evolution of generative AI, browser speech technologies, cloud infrastructure
- Environmental: remote and digital work can reduce transport barriers for some disability groups
- Legal / Ethical: secure handling of user profile data and responsible use of AI-generated content

### Porter Five Forces Analysis

Porter’s Five Forces can also remain structurally unchanged, but the analysis should emphasize that Equitas AI is not entering a completely generic job-board market. It is entering a more specialized inclusive employment niche.

This means:

- rivalry with large platforms exists, but direct feature competition is still limited
- buyer power is significant because employers can still use mainstream platforms
- supplier power matters due to dependence on AI and voice APIs
- threat of substitution exists through manual NGO or support-center workflows
- barriers to entry are moderate because the technology stack is accessible, but the real differentiation lies in domain design and structured accessibility workflows

## System Requirements Identification

### Functional Requirements

Functional requirements define the operational capabilities that the system must provide for the current product scope. Based on the implemented direction of the system, the functional requirements should be updated as follows:

#### Identity Management and Access Control

- The system must allow users to register, verify accounts, log in, log out, and recover passwords securely.
- The system must support onboarding into at least two main business roles: Candidate and Employer, with Admin as a governance role.
- The system must enforce role-based access control so that each role can access only its appropriate functions.
- The system must maintain secure user sessions through JWT-based authentication and refresh-token support.

#### Candidate Profile and Job Application Support

- The system must allow candidates to create and edit personal profiles.
- The system must support four target disability groups in the current MVP: mobility, visual, hearing, and speech impairments.
- The system must allow candidates to browse, search, and filter jobs based on relevant criteria, including accessibility-related information.
- The system must allow candidates to upload CV files when applying for jobs.

#### Employer Job Management and Structured Accessibility Configuration

- The system must allow employers to create and publish job posts.
- The system must allow employers to specify structured accommodations associated with the supported disability groups.
- The system must use these accommodations as part of search, filtering, and AI-assisted matching logic.
- The system must allow employers to review incoming applications and update application status.

#### Assistive AI Features

- The system must provide AI-assisted CV generation and CV tailoring based on a selected job description.
- The system must provide AI-generated cover letter assistance for a target job.
- The system must support AI-assisted job recommendation and filtering based on user context and accessibility needs.
- The system must provide an AI interview practice feature that uses the selected job and candidate profile as context.

#### Accessible Voice Interaction

- The system must support browser-based voice interaction for visually impaired users.
- The system must convert spoken user requests into text, interpret job-search intent, and return responses through text and speech.
- The voice assistant must help users discover suitable jobs without relying entirely on visual scanning.

#### Story and Community-Oriented Content

- The system should allow candidates to create and manage inspirational or experiential stories.
- The system should provide published story content as part of the platform’s social and motivational value.

### Non-functional Requirements

Non-functional requirements remain important and mostly valid, but they should be interpreted in line with the current MVP.

- Accessibility and usability:
  - the web interface should follow semantic HTML principles and be reasonably compatible with assistive technologies
  - responsive design should support desktop and mobile web usage
  - voice-assisted interaction should reduce friction for visually impaired users

- Performance:
  - normal transactional endpoints should respond quickly under standard conditions
  - AI-driven features may take longer, so the interface should communicate progress and handle fallback behavior clearly

- Security:
  - password hashing, secure cookies, authenticated APIs, and role-based restrictions must be enforced
  - user profile data and application data must be handled responsibly

- Maintainability and scalability:
  - the backend should remain modular and service-based
  - the frontend should remain component-based and reusable
  - deployment should support containerization and future scaling

## Theoretical Basis

### Next.js Framework and Semantic HTML Specifications

This section remains appropriate. However, its wording should emphasize that Next.js is used not only for performance and modular UI development, but also for building an accessibility-aware web experience. Semantic HTML is especially relevant because the system serves visually impaired users and relies on meaningful structural markup to improve screen-reader interpretation and keyboard-oriented navigation.

### NestJS Framework and TypeScript Language

This section remains valid. NestJS and TypeScript continue to serve as the backend foundation for secure API design, modular service organization, authentication, role-based access control, and AI orchestration.

### Prisma ORM and PostgreSQL Database Engine

This section should remain, but the interpretation should reflect the current domain more clearly. The database is not only storing users and jobs, but also candidate profiles, disability support categories, employer-configured accommodations, applications, and AI-related interaction context. If the report mentions dynamic or semi-structured data, that explanation should connect to the accommodation-driven job model used by the platform.

### Google Gemini API and Gemini 2.5 Flash Model

This section remains highly relevant. It should explicitly state that the model is used for:

- CV generation and tailoring by job description
- cover letter generation
- interview practice
- conversational job assistance
- voice-intent assistance where applicable

### Client-Side html2canvas and jsPDF Compilation Libraries

This section remains valid if your current CV editor/export workflow still uses these libraries. The explanation should emphasize that they support practical CV export after AI-assisted CV generation and editing.

### GitHub Version Control and GitHub Actions CI/CD Pipeline

This section can be kept with only minor wording cleanup if needed. It remains relevant as part of the engineering and deployment workflow.

### Docker Containerization Platform

This section can also remain. Docker still fits the current architecture and supports a startup-oriented MVP deployment model through reproducible environments and easier infrastructure management.
