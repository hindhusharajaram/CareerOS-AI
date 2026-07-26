#!/usr/bin/env bash
# CareerOS AI — Docker Service Stop Script
set -e

echo "[CareerOS AI] Stopping container services..."
docker compose down

echo "[CareerOS AI] Services stopped safely. Persistent volumes preserved."
