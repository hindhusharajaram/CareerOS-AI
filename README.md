<div align="center">
  <img src="assets/banner.png" alt="CareerOS AI Banner" width="100%" />

  <h1>CareerOS AI</h1>
  <p><b>An open-source, AI-powered Career Operating System for engineering students.</b></p>
  <p>Stop guessing if you're hireable. Quantify your engineering readiness.</p>

  <p>
    <a href="https://career-os-ai-mu.vercel.app"><img src="https://img.shields.io/badge/Live_Demo-Visit_App-2E4CFF?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" /></a>
    <a href="docs/demo/CareerOS_AI_OnePager.pdf"><img src="https://img.shields.io/badge/Download-One--Pager_PDF-2E4CFF?style=for-the-badge&logo=adobeacrobatreader&logoColor=white" alt="Download One-Pager PDF" /></a>
  </p>

  <p>
    <a href="https://github.com/hindhusharajaram/CareerOS-AI/releases/tag/v1.0.0"><img src="https://img.shields.io/badge/Release-v1.0.0-2E4CFF?style=for-the-badge&logo=github&logoColor=white" alt="Release v1.0.0" /></a>
    <a href="https://github.com/hindhusharajaram/CareerOS-AI/actions/workflows/backend-ci.yml"><img src="https://github.com/hindhusharajaram/CareerOS-AI/actions/workflows/backend-ci.yml/badge.svg" alt="Backend CI Status" /></a>
    <a href="https://github.com/hindhusharajaram/CareerOS-AI/actions/workflows/frontend-ci.yml"><img src="https://github.com/hindhusharajaram/CareerOS-AI/actions/workflows/frontend-ci.yml/badge.svg" alt="Frontend CI Status" /></a>
    <a href="https://java.com"><img src="https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=java&logoColor=white" alt="Java 21" /></a>
    <a href="https://spring.io/projects/spring-boot"><img src="https://img.shields.io/badge/Spring_Boot-3.4-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot 3.4" /></a>
    <a href="https://react.dev"><img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" /></a>
    <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5.7" /></a>
    <a href="https://www.postgresql.org"><img src="https://img.shields.io/badge/PostgreSQL-17-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL 17" /></a>
    <a href="https://www.docker.com"><img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License MIT" /></a>
  </p>
</div>

---

## Table of Contents
- [What is CareerOS AI?](#-what-is-careeros-ai)
- [Live Demo](#-live-demo)
- [The 5 Pillars](#-the-5-pillars-of-identity)
- [Screenshots](#-screenshots)
- [Architecture & Tech Stack](#-architecture--technology-stack)
- [Quick Start](#-quick-start-local-setup)
- [Documentation](#-detailed-documentation)
- [Contributing](#-contributing--community)
- [License](#-license)

---

## 📌 What is CareerOS AI?

**CareerOS AI** is an open-source, AI-powered Career Operating System built specifically for computer science and engineering students preparing for competitive software engineering roles.

Rather than relying on static job portals or generic templates, CareerOS AI connects directly to a student's actual career profile — analyzing project portfolios, technical skills, coursework, and work experience to calculate an objective readiness score and generate personalized, actionable preparation roadmaps.

---

## 🎥 Live Demo

- **Try it live:** [career-os-ai-mu.vercel.app](https://career-os-ai-mu.vercel.app)
- **One-pager overview:** [docs/demo/CareerOS_AI_OnePager.pdf](docs/demo/CareerOS_AI_OnePager.pdf) — a single-page PDF summary for quick review.

> Note: the live app is hosted on a free tier and may take up to a minute to respond on first load after a period of inactivity (cold start).

---

## 🎯 The 5 Pillars of Identity

CareerOS AI is designed around five core pillars of career intelligence:

| Pillar | Focus | Capability |
| :--- | :--- | :--- |
| 📊 **Assess** | **Career Readiness** | Calculates an objective, 9-factor weighted **Career Score (0–1000)** based on actual profile data. |
| 📄 **Analyze** | **ATS Compatibility** | Evaluates resumes against recruiter ATS patterns, keyword coverage, and quantifiable achievement density. |
| 🎯 **Recommend** | **Skill Gap Detection** | Identifies missing technologies and skills relative to target engineering job roles. |
| 🗺️ **Prepare** | **Structured Roadmaps** | Generates week-by-week 30, 60, and 90-day learning execution plans and mock interview prompts. |
| 📈 **Track** | **Analytics & Growth** | Tracks skill progression over time with a Star Schema data warehouse and ETL pipelines. |

---

## 📸 Screenshots

| Page / Interface | Preview |
| :--- | :--- |
| **Landing Page** | ![Landing Page](assets/screenshots/landing-page.png) |
| **Student Dashboard** | ![Student Dashboard](assets/screenshots/dashboard.png) |
| **Career Score Engine** | ![Career Score](assets/screenshots/career-score.png) |
| **AI Career Chat** | ![AI Chat](assets/screenshots/ai-chat.png) |
| **Analytics & Data Warehouse** | ![Analytics](assets/screenshots/analytics.png) |

---

## 🛠️ Architecture & Technology Stack

CareerOS AI is built with modern, production-tested software engineering standards:

- **Backend**: Java 21 LTS, Spring Boot 3.4, Spring Security (Stateless JWT + Rate Limiting), Spring Data JPA, Apache Tika.
- **Frontend**: React 18, TypeScript 5.7, Vite 6, TailwindCSS 3, Recharts, Lucide Icons.
- **Database**: PostgreSQL 17 (Relational Store + Star Schema Data Warehouse).
- **DevOps**: Docker, Docker Compose, GitHub Actions CI/CD.

```mermaid
graph TD
    Client[React 18 SPA] -->|HTTP / REST| Security[Spring Security 6 + JWT]

    subgraph Spring Boot Backend
        Security --> Auth[Auth Service]
        Security --> Intell[Intelligence Engines]
        Security --> AI[AI Context Engine]

        Intell --> CoreDB[(PostgreSQL Primary)]
        AI --> CoreDB

        Intell --> ETL[ETL Worker Pipeline]
    end

    ETL --> DW[(PostgreSQL Star Schema Warehouse)]
```

---

## 🚀 Quick Start (Local Setup)

The quickest way to launch CareerOS AI locally is using **Docker Compose**:

```bash
# 1. Clone the repository
git clone https://github.com/hindhusharajaram/CareerOS-AI.git
cd CareerOS-AI

# 2. Start all containers (PostgreSQL, Backend API, Frontend UI)
docker-compose up --build -d

# 3. Access the application
# Frontend UI: http://localhost:5173 (or http://localhost)
# Backend API: http://localhost:8080/api/v1/version
# Health Check: http://localhost:8080/api/v1/observability/health
```

### Manual Development Setup

If you prefer running services directly:

1. **Database**: Ensure PostgreSQL 17 is running on `localhost:5432` with database `careeros_ai_db`.
2. **Backend**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
3. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 📚 Detailed Documentation

For technical deep dives, architectural specs, and deployment guides, explore the `docs/` directory:

- 🏗️ [System Architecture](docs/architecture/ARCHITECTURE.md)
- 🔐 [Spring Security & Auth Design](docs/architecture/spring_security_architecture.md)
- 🚀 [Deployment Guide](docs/deployment/DEPLOYMENT_GUIDE.md)
- 🧪 [Testing Strategy](docs/testing/TESTING_STRATEGY.md)
- 📋 [Disaster Recovery Plan](docs/Disaster_Recovery_Plan.md)
- 📝 [Sprint Notes & Walkthroughs](docs/sprint-notes/)

---

## 🤝 Contributing & Community

We welcome open-source contributions from engineering students and software developers!

- 📖 [Contributing Guidelines](CONTRIBUTING.md)
- 🛡️ [Security Policy](SECURITY.md)
- 📜 [Code of Conduct](CODE_OF_CONDUCT.md)
- 🗺️ [Project Roadmap](ROADMAP.md)

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.