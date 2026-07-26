#!/usr/bin/env bash
# CareerOS AI — PostgreSQL Automated Restore Script
set -e

if [ -z "$1" ]; then
    echo "Usage: ./scripts/restore-db.sh <path_to_backup_file.sql>"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "${BACKUP_FILE}" ]; then
    echo "Error: Backup file '${BACKUP_FILE}' does not exist!"
    exit 1
fi

echo "[WARNING] Restoring database from '${BACKUP_FILE}' will overwrite existing data."
read -p "Are you sure you want to proceed? (y/N) " confirm
if [[ "$confirm" =~ ^[Yy]$ ]]; then
    echo "[CareerOS AI] Restoring database..."
    cat "${BACKUP_FILE}" | docker exec -i careeros-postgres psql -U "${POSTGRES_USER:-postgres}" -d "${POSTGRES_DB:-careeros_ai_db}"
    echo "[CareerOS AI] Database restore completed successfully."
else
    echo "Restore operation cancelled."
fi
