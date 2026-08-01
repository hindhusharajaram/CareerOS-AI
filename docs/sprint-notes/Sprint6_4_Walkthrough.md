# Sprint 6.4: Containerization & Cloud-Native Foundation — Technical Documentation & Walkthrough

## Executive Summary
Sprint 6.4 establishes a cloud-native deployment foundation for **CareerOS AI**. The platform is fully dockerized with production multi-stage container builds, orchestrated using Docker Compose, externalized across environment profiles (`local`, `dev`, `staging`, `prod`), configured for zero hardcoded secrets, equipped with Nginx reverse proxying, protected with persistent volumes, and automated via cross-platform lifecycle scripts.

No business features, UI redesigns, or AI additions were introduced. All Sprints 1–6.3 functionality continues operating without regressions.

---

## 1. Deployment Architecture Overview

The cloud-native architecture comprises 3 containerized tiers isolated inside a private bridge network (`careeros_network`):

```
                       [ Client / Web Browser ]
                                  │
                                  ▼ (Port 80)
┌────────────────────────────────────────────────────────────────────────┐
│ Nginx Web Server & Reverse Proxy (careeros-frontend Container)         │
│  ├── Serves SPA Static Bundle (Vite Build)                             │
│  ├── Handles Gzip Compression & Static Asset Caching                  │
│  └── Passes /api/ requests -> http://backend:8080/                      │
└────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼ (Internal Port 8080)
┌────────────────────────────────────────────────────────────────────────┐
│ Spring Boot JRE Runtime (careeros-backend Container)                   │
│  ├── Executes as Non-Root User 'spring:spring'                         │
│  ├── Exposes /api/v1/observability/health Probe                       │
│  └── Mounts Persistent Storage Volume 'backend_uploads'                │
└────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼ (Internal Port 5432)
┌────────────────────────────────────────────────────────────────────────┐
│ PostgreSQL 17 Alpine Database (careeros-postgres Container)            │
│  ├── Auto-initializes schema DDL via database/schema.sql              │
│  └── Persists Relational & Star Schema Data to 'postgres_data'         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Multi-Stage Docker Design & Security Hardening

### Backend Container (`backend/Dockerfile`)
- **Stage 1 (Builder)**: Uses `eclipse-temurin:21-jdk-alpine` to compile Java 21 sources and assemble the production executable JAR.
- **Stage 2 (Runtime)**: Uses `eclipse-temurin:21-jre-alpine` for minimal attack surface and lightweight memory overhead (~250MB JRE base).
- **Non-Root Execution**: Runs under a dedicated system user/group (`USER spring:spring`).
- **Container Healthcheck**: Executes `wget` probe targeting `http://localhost:8080/api/v1/observability/health` every 30s.

### Frontend Container (`frontend/Dockerfile`)
- **Stage 1 (Builder)**: Uses `node:20-alpine` to execute `npm run build` and produce optimized Vite SPA dist assets.
- **Stage 2 (Server)**: Uses `nginx:alpine` to serve production assets and manage API reverse proxying.
- **Container Healthcheck**: Executes `wget` probe targeting `http://localhost/health` every 30s.

---

## 3. Environment Strategy & Configuration Management

Configuration is externalized via environment variables and active Spring profiles:

- **`local` profile** (`application-local.yml`): Configured for local developer desktop execution.
- **`dev` profile** (`application-dev.yml`): Verbose SQL logging (`show-sql: true`), DEBUG logging, automatic schema update (`ddl-auto: update`).
- **`staging` profile** (`application-staging.yml`): Schema validation (`ddl-auto: validate`), medium Hikari connection pool (15 max).
- **`prod` profile** (`application-prod.yml`): Production hardening with schema validation (`ddl-auto: validate`), optimized Hikari connection pool (25 max, connection leak detection), and INFO logging.

---

## 4. Secrets Management Strategy

Zero hardcoded passwords, keys, or tokens exist in source code. All sensitive variables are externalized into `.env` (templated in `.env.example`):

| Variable Name | Purpose | Production Default |
|---|---|---|
| `POSTGRES_DB` | Relational Database Name | `careeros_ai_db` |
| `POSTGRES_USER` | Database Admin Username | `postgres` |
| `POSTGRES_PASSWORD` | Database Admin Password | Externalized via Secret Manager |
| `JWT_SECRET` | HS512 Signing Secret Key | Externalized 256-bit Key |
| `CORS_ALLOWED_ORIGINS` | Permitted Frontend Origins | Comma-separated domain origins |
| `AI_PROVIDER_API_KEY` | AI Provider Authentication Key | Externalized Secret Token |

---

## 5. Container Networking & Storage Architecture

### Isolated Container Networking
- **Network Name**: `careeros_network` (`driver: bridge`)
- Isolates database communication from external exposure while allowing `frontend` -> `backend` and `backend` -> `postgres` inter-container DNS resolution.

### Persistent Data Storage
- **`postgres_data`**: Named Docker volume preserving PostgreSQL database tables, indexes, and star schema state across container restarts or upgrades.
- **`backend_uploads`**: Named Docker volume persisting student resume uploads, profile photos, and parsed documents.

---

## 6. Nginx Reverse Proxy & Asset Optimization

Configured in `frontend/nginx.conf` & `docker/nginx.conf`:

1. **API Reverse Proxying**: Routes all `/api/*` HTTP requests directly to `http://backend:8080/api/` with proper header forwarding (`X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`).
2. **SPA Fallback**: Implements `try_files $uri $uri/ /index.html;` to ensure client-side React router routes resolve cleanly.
3. **Gzip Compression**: Compresses `html`, `css`, `js`, `json`, `svg`, and `xml` responses (`gzip_min_length 1024`).
4. **Browser Caching**: Sets `Cache-Control: public, max-age=2592000` (30 days) for static assets (`.js`, `.css`, `.png`, `.jpg`, `.woff2`).

---

## 7. Startup & Lifecycle Automation Scripts

Cross-platform automation scripts located in `scripts/`:

- **`scripts/build.sh` / `build.bat`**: Executes `docker compose build --no-cache` to rebuild all container images.
- **`scripts/start.sh` / `start.bat`**: Executes `docker compose up -d` to launch the full container stack in detached mode.
- **`scripts/stop.sh` / `stop.bat`**: Executes `docker compose down` to gracefully terminate container processes while preserving volumes.
- **`scripts/reset-db.sh` / `reset-db.bat`**: Development helper script executing `docker compose down -v` to reset data volumes cleanly.

---

## 8. Multi-Cloud Deployment Guide

### A. Docker Desktop (Windows / macOS)
```bash
cp .env.example .env
./scripts/build.sh
./scripts/start.sh
```
Access frontend at `http://localhost` and health endpoint at `http://localhost:8080/api/v1/observability/health`.

### B. Linux VPS (Ubuntu / Debian / RHEL)
```bash
git clone https://github.com/careeros-ai/careeros-ai.git /opt/careeros-ai
cd /opt/careeros-ai
cp .env.example .env
# Edit .env with production credentials
chmod +x scripts/*.sh
./scripts/build.sh
./scripts/start.sh
```

### C. Azure VM / AWS EC2 Container Deployment
1. Provision EC2/Azure VM instance running Ubuntu 22.04 LTS with Docker & Docker Compose plugin installed.
2. Configure Security Group inbound rules: Allow TCP 80 (HTTP), TCP 443 (HTTPS), TCP 22 (SSH).
3. Clone repository, populate `.env`, and launch stack via `./scripts/start.sh`.

---

## 9. Future Kubernetes Migration Blueprint

For scaling to Kubernetes (EKS / AKS / GKE):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: careeros-backend
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: backend
        image: careeros-backend:1.0.0
        envFrom:
        - secretRef:
            name: careeros-secrets
        livenessProbe:
          httpGet:
            path: /api/v1/observability/health
            port: 8080
          initialDelaySeconds: 30
```

---

## 10. Verification Results Summary

- **Backend Build & Unit Tests**: `mvn clean compile test` -> **BUILD SUCCESS** (8/8 unit tests passed).
- **Frontend Vite Production Build**: `npm run build` -> **BUILD SUCCESS** (dist static bundle generated in 4.64s).
- **Dockerfiles & Compose Validation**: Syntactically validated `backend/Dockerfile`, `frontend/Dockerfile`, `docker-compose.yml`, `docker-compose.override.yml`, `nginx.conf`, and automation scripts.
