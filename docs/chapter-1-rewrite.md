# Chapter 1 – Introduction (Revised Draft)

This draft is written to replace the current Chapter 1 in the report and align it with the current version of the project, which is now a web-first inclusive recruitment platform with AI-powered CV tailoring, job matching, interview practice, and voice-based job search assistance.

## Sections that should be revised in the current Chapter 1

- Reasons for Choosing the Topic
  - Keep the digital transformation context.
  - Strengthen the practical problem around inaccessible recruitment data and structured accommodations.
  - Explicitly mention that mainstream job platforms do not support accessibility-aware job discovery.

- Market and User Demands
  - Add the need for CV creation and CV tailoring based on a specific job description.
  - Emphasize that visually impaired users are now supported directly on the web through voice interaction, not through a separate mobile app.

- Objectives of the Topic
  - The current version already mentions AI Resume Builder & Tailoring, but this capability should be made more central because it is one of the strongest practical values of the product.
  - Mention structured accommodations for four target disability groups as a design objective.

- Subjects and Scope of the Topic
  - Remove any implication that a standalone mobile solution is part of the MVP.
  - Standardize the whole chapter around the four supported groups:
    - mobility disabilities
    - visual impairments
    - hearing impairments
    - speech impairments

- Practical Significance / Deployment Feasibility
  - Remove the Android/Kotlin direction.
  - Replace it with browser-based voice interaction for visually impaired users.

---

# INTRODUCTION

## Reasons for Choosing the Topic

### Digital Transformation Context

In the era of the Fourth Industrial Revolution, digital transformation has evolved from a temporary technological trend into a fundamental force that reshapes the way societies learn, work, and connect. In Vietnam, the national digital transformation agenda consistently emphasizes the principle of inclusive development, in which no citizen should be left behind when accessing digital opportunities. Within this context, people with disabilities should not only be viewed as beneficiaries of social support, but also as potential contributors to the labor market, the digital economy, and sustainable social development.

At the same time, recent advances in Artificial Intelligence (AI), cloud-based platforms, and modern web engineering have created new opportunities to solve social problems that traditional software products have not addressed effectively. AI is now capable of understanding context, restructuring raw information, generating professional written content, and supporting natural interaction through both text and voice. These capabilities make it feasible to design a recruitment support platform that is not only technically functional, but also genuinely inclusive and adaptive to different accessibility needs.

### Practical Problem Statement

Vietnam currently has millions of people with disabilities, and a large proportion of them are of working age. Many are capable of performing digital and knowledge-based jobs such as office administration, customer support, data handling, design, software-related tasks, and online services. However, despite having employable skills, many still face major barriers when trying to enter the labor market through existing online recruitment systems.

The first problem is information asymmetry in recruitment platforms. Most mainstream job boards focus on general recruitment information such as title, salary, location, and experience level, but they do not provide structured information about accessibility accommodations. As a result, employers cannot clearly communicate whether a role is suitable for candidates with mobility, visual, hearing, or speech impairments. On the other side, candidates are forced to apply with uncertainty, often discovering too late that the workplace environment, communication method, or digital workflow is not compatible with their needs.

The second problem is profile preparation and self-presentation. Many candidates with disabilities have valuable experiences and capabilities, but they often struggle to transform informal or fragmented information into a professional CV that matches employer expectations. This becomes even more difficult when a candidate needs to adapt the CV for a specific job description. Therefore, the ability to generate or tailor a CV according to a target job is not a secondary feature, but a core requirement for improving employability and passing the first screening stage.

The third problem is interaction accessibility. Different groups of users face different barriers in digital environments. Candidates with mobility, hearing, and speech impairments may still use standard web interfaces effectively if the workflows are well designed. However, visually impaired users often face severe barriers in conventional recruitment websites because these systems rely heavily on dense visual layouts, mouse-based navigation, and manual typing. Therefore, the project must move beyond a traditional graphical interface and provide a voice-oriented interaction layer directly on the web.

### Market and User Demands

From the perspective of job seekers with disabilities, there is a clear demand for a specialized employment support platform that can do more than display job listings. Users need a system that can help them identify suitable jobs, understand whether a role matches their accessibility needs, and improve the quality of their application materials.

For candidates with mobility, hearing, and speech impairments, the demand centers on a responsive web platform that supports structured job filtering, AI-assisted profile writing, CV tailoring based on a selected job, cover letter generation, and interview practice in a safe digital environment. These functions reduce communication barriers and help candidates present their professional value more effectively.

For visually impaired candidates, the demand goes further. They require a browser-based voice interaction experience that enables them to ask for jobs, receive AI-guided suggestions, and navigate job opportunities without depending entirely on visual scanning or complex typing. In the current version of the project, this need is addressed directly on the web platform through speech-to-text and text-to-speech interaction, instead of a separate mobile application.

From the perspective of employers and society, there is also growing demand for inclusive recruitment. Enterprises increasingly pay attention to Corporate Social Responsibility (CSR), Diversity and Inclusion (D&I), and social impact hiring. However, many organizations still lack a practical digital tool that allows them to define job accommodations clearly and connect with candidates whose accessibility profiles match those roles. This creates a market opportunity for a platform that structures accessibility information and turns inclusive hiring into an operational workflow rather than a symbolic commitment.

### Relevant Technological Trends

Recent advances in Large Language Models (LLMs), especially cloud-based generative AI services, have significantly expanded the design space for assistive digital products. Modern AI systems can now rewrite unstructured content into professional language, personalize output according to context, summarize user intent, simulate interview interaction, and support conversational workflows.

At the same time, modern web frameworks such as Next.js and NestJS provide a strong technical foundation for building scalable, modular, and accessible applications. Browser-native capabilities such as the Web Speech API also make it possible to build voice-driven interactions directly in a web application. The convergence of these trends enables the creation of an inclusive recruitment platform that combines structured data, AI support, and accessible interaction in a single unified system.

Driven by these practical social needs and technological opportunities, the project titled **“AI-Powered Job Search Support System for People with Disabilities”** was developed as a web-based product prototype. The project aims not only to provide technical assistance for job seekers with disabilities, but also to establish a foundation for an inclusive and commercially viable digital recruitment platform.

## Objectives of the Topic

### General Objective

The general objective of this thesis is to research, design, and develop a responsive web-based recruitment support platform for people with disabilities. The system integrates artificial intelligence, structured accessibility data, and accessible interaction design to reduce labor-market barriers for four target groups: users with mobility disabilities, visual impairments, hearing impairments, and speech impairments.

Beyond being a purely academic software exercise, the project is intended as a practical Minimum Viable Product (MVP) with social impact and startup potential. It aims to demonstrate that inclusive hiring can be supported by a sustainable digital platform in which candidates, employers, and AI services interact through a structured and scalable workflow.

### Specific Objectives

To achieve the general objective, the study focuses on the following specific objectives:

- Analyze the recruitment barriers and digital interaction needs of four target disability groups: mobility, visual, hearing, and speech impairments.
- Design a full-stack web architecture that supports secure authentication, role-based access control, scalable APIs, and responsive user interfaces.
- Build a structured accessibility data model that allows employers to define accommodations clearly and allows candidates to search for jobs more accurately.
- Develop an AI-assisted CV creation and CV tailoring workflow in which a candidate can generate or improve a CV according to a selected job description.
- Implement AI-supported job matching and filtering based on job information, user profile context, and accessibility compatibility.
- Provide AI-generated cover letter support to help candidates improve application quality.
- Develop an AI interview practice feature that uses the job description and candidate profile to simulate interview questions and responses.
- Implement a browser-based voice assistant that helps visually impaired users search and explore jobs through speech interaction on the web.
- Evaluate the feasibility of the platform as a startup-oriented social impact product through business model thinking and commercialization analysis.

## Subjects and Scope of the Topic

### Target Users

The system is designed for two main user groups: candidates and employers.

- Candidates with mobility disabilities: users who need clear information about physical accessibility, remote work options, and flexible workplace accommodations.
- Candidates with visual impairments: users who benefit from voice-based interaction, screen-reader-friendly design, and simplified navigation workflows.
- Candidates with hearing impairments: users who prefer text-based communication, clear written workflows, and visually accessible interfaces.
- Candidates with speech impairments: users who need non-verbal digital workflows such as text-based interview practice, CV preparation, and written communication support.
- Employers: organizations that want to post inclusive job opportunities, declare accommodations clearly, and connect with a more appropriate candidate pool.

### Technology Scope

The project is implemented as a full-stack web system using modern software technologies.

- Backend and APIs are developed using NestJS with TypeScript.
- Database access is managed through Prisma ORM with PostgreSQL.
- The frontend is built using Next.js with responsive and accessibility-aware web design.
- Artificial intelligence services are integrated to support CV tailoring, job matching, cover letter generation, interview practice, and conversational assistance.
- Browser-native voice interaction is implemented through speech recognition and speech synthesis workflows to support visually impaired users directly on the web.

### System Limitations

The current project is implemented as an MVP and therefore has several boundaries.

- The system currently focuses on four target disability groups only: mobility, visual, hearing, and speech impairments.
- The platform is web-first and does not include a standalone mobile application in the present version.
- The voice assistant depends on browser support for microphone access and speech technologies.
- AI-generated outputs such as CV suggestions, cover letters, interview practice, and job recommendations are assistive rather than definitive, and still require user review.

### Deployment Environment

The system is developed and tested in a web-based full-stack environment. The backend service, frontend client, and database are separated logically and can be packaged for deployment through containerized infrastructure. This architecture supports maintainability, future scaling, and cost-effective MVP deployment.

## Practical Significance of the Topic

### Solving Practical Problems

The project provides a practical solution to a real employment problem: the mismatch between the capabilities of job seekers with disabilities and the lack of accessible, structured recruitment workflows in existing platforms. Instead of treating disability as a broad social label, the system focuses on concrete matching factors such as accommodations, communication mode, and digital interaction needs.

A particularly important contribution of the project is its support for AI-assisted CV creation and CV tailoring according to a target job. This directly addresses one of the strongest barriers faced by many candidates: the inability to convert experience into a professional, job-specific application document. Combined with AI-generated cover letters and interview practice, this significantly improves candidate readiness before application submission.

At the same time, the project gives employers a structured way to define inclusive job opportunities through accommodation-based job posting. This creates a more transparent recruitment process and helps reduce failed applications caused by poor accessibility fit.

### Deployment Feasibility

The current system is implemented as a functional MVP on a responsive web platform. Its web-first architecture reduces the complexity of maintaining separate client ecosystems while still allowing multi-device access. By integrating AI services and browser-native voice interaction into a single platform, the system demonstrates that an inclusive recruitment solution can be built with feasible development cost and realistic deployment effort.

### Scalability Potential and Social Impact Startup Blueprint

From a startup perspective, the project has potential as a social impact technology platform. Its value proposition lies in combining three elements that are rarely integrated in a single recruitment product: structured accessibility-aware job data, AI-assisted candidate preparation, and voice-based access for visually impaired users.

This foundation can be expanded in future iterations toward a broader inclusive hiring ecosystem, including enterprise dashboards, accessibility scoring for job posts, richer recommendation engines, and partnerships with universities, NGOs, and inclusive employers. Therefore, the project is not only a graduation thesis but also a meaningful prototype for a startup-oriented innovation model in the field of inclusive employment.
