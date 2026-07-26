#!/usr/bin/env bash
# CareerOS AI — PostgreSQL Automated Backup Script
set -e

BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/careeros_backup_${TIMESTAMP}.sql"
CHECKSUM_FILE="${BACKUP_FILE}.sha256"

mkdir -p "${BACKUP_DIR}"

echo "[CareerOS AI] Initiating PostgreSQL database backup..."
docker exec careeros-postgres pg_dump -U "${POSTGRES_USER:-postgres}" "${POSTGRES_DB:-careeros_ai_db}" > "${BACKUP_FILE}"

echo "[CareerOS AI] Generating SHA256 checksum for backup integrity..."
sha256sum "${BACKUP_FILE}" > "${CHECKSUM_FILE}"

echo "[CareerOS AI] Backup complete:"
echo " - Dump File: ${BACKUP_FILE}"
echo " - Checksum: ${CHECKSUM_FILE}"
