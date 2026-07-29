# CareerOS-AI Architecture

CareerOS-AI is a modern, modular, full-stack application leveraging a robust combination of enterprise-grade backend technologies and high-performance frontend tooling.

## High-Level Architecture

![System Architecture](../assets/architecture.png)
*(Note: Refer to `assets/architecture.png` for a visual diagram if available).*

### 1. Frontend (Client Layer)
- **Framework:** React + Vite
- **Styling:** Tailwind CSS + Radix UI Primitives
- **Hosting:** Vercel (Production)
- **Role:** Handles user interactions, state management, and API communication. Compiled into static assets for edge delivery.

### 2. Backend (API Layer)
- **Framework:** Spring Boot 3.4.x (Java 21)
- **Security:** Spring Security with JWT Authentication
- **ORM:** Spring Data JPA + Hibernate
- **Hosting:** Render (Web Services via Docker)
- **Role:** Business logic, authentication/authorization, and database orchestration.

### 3. Database (Persistence Layer)
- **Engine:** PostgreSQL
- **Hosting:** Neon (Serverless Postgres)
- **Role:** Secure, highly available data storage with native connection pooling and SSL enforcement.

## Data Flow
1. Client makes an HTTPS request to the React application (hosted on Vercel).
2. The React application sends a REST API request containing a JWT token to the Spring Boot backend (hosted on Render).
3. The backend validates the JWT, processes the business logic, and executes a query via Hibernate.
4. Hibernate communicates securely (via `sslmode=require`) with Neon Postgres.
5. Data traverses back up the stack to the client UI.
