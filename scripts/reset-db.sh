#!/usr/bin/env bash
# CareerOS AI — Development Database Reset Script
set -e

echo "[WARNING] Resetting development database and clearing postgres_data volume!"
read -p "Are you sure? (y/N) " confirm
if [[ "$confirm" =~ ^[Yy]$ ]]; then
    docker compose down -v
    echo "[CareerOS AI] Volume wiped. Re-launching container stack..."
    docker compose up -d
    echo "[CareerOS AI] Database reset completed."
else
    echo "Reset cancelled."
fi
