# CareerOS AI — Production Disaster Recovery & Business Continuity Plan

## 1. Executive Summary & Recovery Objectives
This Disaster Recovery Plan (DRP) defines operational protocols, recovery time objectives, and data loss limits for **CareerOS AI Platform v1.0.0**.

- **Recovery Time Objective (RTO)**: Target **< 1 hour** total service recovery time following major infrastructure failure.
- **Recovery Point Objective (RPO)**: Target **< 15 minutes** max tolerable data loss using automated hourly/daily backups and write-ahead transaction logging.

---

## 2. Backup Strategy & Automation

### Database Backups (PostgreSQL 17)
- **Hourly Incremental Dumps**: Executed via automated cron script `./scripts/backup-db.sh`.
- **SHA256 Checksums**: Generated alongside every SQL dump file for tamper and corruption detection.
- **Retention Schedule**:
  - Daily backups: Retained for 30 days.
  - Weekly backups: Retained for 90 days.
  - Monthly backups: Retained for 1 year in encrypted cloud storage (S3 / Azure Blob Storage).

### Persistent Uploads & Media Assets
- **`backend_uploads` Volume**: Mirrored daily to secondary object storage bucket with versioning enabled.

---

## 3. Disaster Recovery Procedures & Emergency Runbook

### Scenario A: Single Container / Process Failure
1. Docker Compose automatic healthcheck restarts failed `careeros-backend` or `careeros-frontend` container.
2. Verify container state: `docker compose ps`.

### Scenario B: Database Corruption or Volume Failure
1. Stop backend service: `docker stop careeros-backend`.
2. Inspect latest verified backup file in `./backups/` and check SHA256 integrity:
   ```bash
   sha256sum -c backups/careeros_backup_YYYYMMDD_HHMMSS.sql.sha256
   ```
3. Execute restore script:
   ```bash
   ./scripts/restore-db.sh backups/careeros_backup_YYYYMMDD_HHMMSS.sql
   ```
4. Restart backend service: `docker start careeros-backend`.
5. Execute health probe check: `curl http://localhost:8080/api/v1/observability/health`.

### Scenario C: Complete Cloud Instance Loss (Data Center Disaster)
1. Provision new Cloud VM / Host.
2. Clone repository & fetch latest `.env` secrets from Secret Manager.
3. Download latest database backup dump from offsite S3 bucket.
4. Launch stack: `./scripts/start.sh`.
5. Restore database state: `./scripts/restore-db.sh latest_backup.sql`.

---

## 4. Disaster Recovery Testing Protocol
- DRP verification drills conducted bi-annually.
- Automated checksum verification executed daily.
