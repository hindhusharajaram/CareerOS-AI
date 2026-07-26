#!/usr/bin/env bash
# CareerOS AI — Docker Build Automation Script
set -e

echo "[CareerOS AI] Building container images..."
docker compose build --no-cache

echo "[CareerOS AI] Build completed successfully!"
