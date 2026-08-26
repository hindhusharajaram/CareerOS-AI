# CareerOS AI — One-Pager Technical Summary

**Live Demo**: [https://career-os-ai-mu.vercel.app](https://career-os-ai-mu.vercel.app)  
**Repository**: [https://github.com/hindhusharajaram/CareerOS-AI](https://github.com/hindhusharajaram/CareerOS-AI)

---

## 📌 Executive Summary
**CareerOS AI** is an open-source, AI-powered Career Operating System designed specifically for computer science and engineering students preparing for competitive software engineering positions.

Rather than relying on static job portals or generic resume builders, CareerOS AI connects directly to a student's profile data — analyzing project portfolios, technical skills, coursework, and work experience to calculate an objective readiness score and generate personalized, actionable preparation roadmaps.

---

## 🎯 Core Features (The 5 Pillars)

1. **Assess (Career Readiness)**: Computes a 9-factor weighted **Career Score (0–1000)** evaluating Projects (20%), Skills (20%), Experience (15%), Profile Completeness (15%), Education (10%), Certificates (10%), ATS Resume Quality (5%), GitHub Presence (3%), and LinkedIn Presence (2%).
2. **Analyze (ATS Resume Audit)**: Single-pass ATS parsing engine providing ATS score, keyword matching, formatting audits, and quantification density analysis.
3. **Recommend (Skill Gap Detection)**: Compares verified student skills against target engineering job roles (Backend, Data Science/AI, DevOps, Frontend, Mobile, Product Management).
4. **Prepare (Learning Coach & Mock Interview)**: Direct Groq AI (`llama-3.3-70b-versatile`) integration generating custom 12-week study sequences and realistic technical/system design mock interview sets.
5. **Track (Analytics & Warehouse)**: Star Schema data warehouse with ETL pipelines tracking student skill progression over time.

---

## 🛠️ Architecture & Tech Stack

- **Backend**: Java 21 LTS, Spring Boot 3.4, Spring Security (Stateless JWT + Rate Limiting), Spring Data JPA, PostgreSQL 17.
- **Frontend**: React 18, TypeScript 5.7, Vite 6, TailwindCSS 3, Recharts, Lucide Icons.
- **AI Engine**: Groq AI Cloud API (`llama-3.3-70b-versatile`) with structured JSON schema outputs.
- **DevOps & Infrastructure**: Docker, Docker Compose, GitHub Actions CI/CD, Render (Backend API), Vercel (Frontend SPA).

---

## 📄 License
Distributed under the MIT License. Copyright © 2026 CareerOS AI.
