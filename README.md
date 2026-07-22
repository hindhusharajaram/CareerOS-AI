# CareerOS AI — AI-Powered Career Intelligence Platform

CareerOS AI is an enterprise-grade AI-powered career intelligence platform designed to empower students, companies, and educational institutions through automated career guidance, intelligent placement management, and analytics.

---

## 🚀 Mission & Scope

CareerOS AI streamlines the career ecosystem:
- **Students**: Discover opportunities, track applications, and optimize career readiness.
- **Companies**: Recruits talent efficiently through structured application pipelines.
- **Institutions**: Monitor and manage student career placement performance.

### Version 1 Capabilities
- **Authentication & Authorization**: Role-Based Access Control (`STUDENT`, `COMPANY`, `ADMIN`) via JWT.
- **Student Portal**: Profile configuration and application tracking dashboard.
- **Company Portal**: Profile administration and internship management dashboard.
- **Internship CRUD**: Complete publishing and lifecycle management for internship opportunities.
- **Student Application System**: Structured application flow and status progression tracking.

---

## 🛠️ Technology Stack

| Domain | Technology |
| :--- | :--- |
| **Frontend** | React 18+, TypeScript, Vite, TailwindCSS, Shadcn UI, React Router, Axios, React Hook Form |
| **Backend** | Java 21, Spring Boot 3.4+, Spring Security, JWT, Hibernate, Spring Data JPA, Maven |
| **Database** | PostgreSQL (Neon PostgreSQL) |
| **Deployment** | Vercel (Frontend), Render (Backend), Neon PostgreSQL (Database) |

---

## ⚡ Prerequisites

Before setting up or building CareerOS AI locally, ensure your environment meets the following requirements:

- **Java Development Kit (JDK)**: Java 21 LTS (Oracle OpenJDK 21 or Eclipse Temurin 21)
- **Node.js**: Node.js 20+ LTS (with `npm` 10+)
- **Database**: PostgreSQL 15+ (Local instance or Neon PostgreSQL cloud connection)
- **Version Control**: Git 2.40+
- **Recommended IDEs / Tools**:
  - **Backend**: IntelliJ IDEA Ultimate / Community Edition (with Spring Boot & Lombok plugins) or VS Code (Java Extension Pack)
  - **Frontend**: VS Code or Cursor (with ESLint, Prettier, and Tailwind CSS IntelliSense extensions)
  - **API Testing**: Postman or Insomnia
  - **Database Management**: DBeaver, PgAdmin 4, or DataGrip

---

## 📐 Enterprise Architecture Principles

- **Clean Layered Architecture**: Decoupled presentation, domain, and data access layers.
- **SOLID & DRY Principles**: Strict single responsibility and non-duplication across codebases.
- **API Uniformity**: Standardized JSON envelope (`ApiResponse<T>`) for all REST endpoints.
- **Audit Traceability**: Base entity tracking (`created_at`, `updated_at`) across all domain models.
- **Security-First Design**: Stateless JWT authentication, BCrypt password hashing, role-based authorization.

---

## 📁 Repository Organization

```
CareerOS-AI/
├── .github/        # GitHub workflows & templates
├── database/       # Schema DDL & seed scripts
├── docker/         # Container configurations
├── scripts/        # Build & environment setup scripts
├── docs/           # Modular project documentation
├── backend/        # Spring Boot Java application
└── frontend/       # React TypeScript Vite application
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
