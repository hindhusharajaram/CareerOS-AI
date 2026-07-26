# CareerOS AI Platform — Version Changelog

All notable changes to the **CareerOS AI Platform** project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-07-26

### Added
- **Sprint 6.5: CI/CD, Security Hardening & Production Release Platform**
  - GitHub Actions CI/CD workflows (`ci.yml` & `release.yml`) for automated testing, linting, Docker image compilation, and GitHub releases.
  - Production security hardening: HTTP Strict Transport Security (HSTS), Content Security Policy (CSP), X-Frame-Options (`DENY`), X-Content-Type-Options (`nosniff`), Referrer Policy, and Permissions Policy.
  - Rate limiting filter (`RateLimitingFilter`) enforcing max 15 requests per minute per IP on authentication endpoints.
  - Version metadata endpoint `GET /api/v1/version` exposing platform version, build timestamp, commit hash, active environment, and enabled subsystem module inventories.
  - Database automated backup (`backup-db.sh`/`.bat`) and restore (`restore-db.sh`/`.bat`) scripts with SHA256 checksum verification.
  - Disaster Recovery Plan (`Disaster_Recovery_Plan.md`) and Production Readiness Checklist.

- **Sprint 6.4: Containerization & Cloud-Native Foundation**
  - Multi-stage Docker build for backend (`eclipse-temurin:21-jdk-alpine` builder -> `eclipse-temurin:21-jre-alpine` runtime) with non-root execution (`USER spring:spring`).
  - Multi-stage Docker build for frontend (`node:20-alpine` builder -> `nginx:alpine` runtime) with Gzip compression, static caching, SPA fallback routing, and REST API reverse proxying.
  - Docker Compose orchestration (`docker-compose.yml`, `docker-compose.override.yml`, `.env.example`) configuring `postgres`, `backend`, and `frontend` services with persistent volumes (`postgres_data`, `backend_uploads`) and `careeros_network`.
  - Spring profile environment management (`local`, `dev`, `staging`, `prod`).
  - Cross-platform container lifecycle scripts (`scripts/build`, `start`, `stop`, `reset-db`).

- **Sprint 6.3: Observability & Production Monitoring Platform**
  - Dedicated `com.careerosai.observability` package (`logging`, `metrics`, `tracing`, `health`, `monitoring`, `alerts`, `audit`, `dashboard`, `config`, `dto`).
  - Structured JSON logging with MDC tracing (`traceId`, `spanId`, `correlationId`, `userId`, `executionTimeMs`, stack traces).
  - Health check diagnostic probes covering Application, PostgreSQL Database, Star Schema Warehouse, Async Analytics, Local AI Module, Disk Usage, JVM Heap Memory, and CPU Load.
  - System metric engine tracking API response latency, request counts, error rates, active user counts, JVM heap space, thread count, DB latency, ETL duration, and event processing latency.
  - Immutable action audit logging (`audit_logs`) tracking logins, profile updates, resume uploads, admin operations, AI requests, and warehouse ETL jobs.
  - System alert engine (`system_alerts`) automatically raising alerts on high latency (> 2000ms), failed ETL, failed schedulers, failed AI requests, and DB connectivity issues.
  - Single-page System Monitor dashboard UI at `/system-monitor`.

- **Sprint 6.2: Grounded AI Career Assistant Extensions**
  - AI Grounded Mock Interview Simulator & Feedback Generator (`/api/v1/ai/interview/generate`).
  - AI Skill Gap Analysis & Learning Pathway Recommendations (`/api/v1/ai/skill-gap/analyze`).
  - Dynamic AI Conversation History & Multi-Turn Chat Sessions.

- **Sprint 6.1: Grounded AI Career Assistant**
  - Grounded AI Provider Layer (`LocalGroundedAiProvider`).
  - AI Career Advisor Chat Assistant (`/api/v1/ai/chat`).
  - AI Automated Resume Tailoring & ATS Score Optimization Engine (`/api/v1/ai/tailor-resume`).
  - AI Smart Career Roadmap Generator (`/api/v1/ai/generate-roadmap`).

- **Sprint 5: Analytics Warehouse & Data Engineering Platform**
  - Star Schema Data Warehouse (`dim_user`, `dim_date`, `dim_skill`, `dim_project`, `dim_company`, `dim_resume`, `dim_feature`, `dim_career_goal`, `fact_user_activity`, `fact_resume_analysis`, `fact_ai_usage`, `fact_profile_updates`, `fact_career_scores`, `fact_recommendations`, `fact_interviews`).
  - Automated Star Schema ETL Engine (`WarehouseEtlService`) with assertion quality checks and execution history (`etl_execution_history`).
  - Data Quality Assertion Engine & Quality Score Reports (`data_quality_reports`).
  - Data Warehouse Admin Control Panel at `/warehouse-admin`.

- **Sprint 4: Event-Driven Analytics Platform**
  - Event Bus & Asynchronous Consumer Architecture (`AnalyticsEventPublisher`, `AnalyticsEventConsumer`).
  - Event Ingestion API (`/api/v1/analytics/events`) tracking DAU/WAU/MAU and feature usage.
  - Analytics Summary Aggregators (`AnalyticsDailySummary`) and Admin Dashboard (`/analytics-admin`).

- **Sprint 3: AI Resume Analyzer & ATS Engine**
  - Apache Tika Resume Document Text Extractor (`ResumeParserService`).
  - Rule-Based ATS Scoring Engine (`AtsScoringService`).
  - Resume Version Control (`resumes` table) and Student Workspace UI at `/workspace`.

- **Sprint 2: Master Skill Taxonomy & Resume Management**
  - Hierarchical Skill Taxonomy (`skill_categories`, `master_skills`, `skill_aliases`).
  - Multipart File Upload Controller & Physical Storage Service (`FileController`, `FileStorageService`).

- **Sprint 1: Core User & Student Profile Domain**
  - PostgreSQL Schema Baseline (`database/schema.sql`).
  - JWT Stateless Authentication (`AuthController`, `AuthSimpleController`, `JwtAuthenticationFilter`).
  - Student Profile Management & Career Goals Domain (`StudentProfile`, `CareerGoal`, `Skill`, `Education`, `Project`, `Certificate`, `Experience`).
