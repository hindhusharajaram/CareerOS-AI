#!/usr/bin/env bash
# CareerOS AI — Docker Stack Launch Script
set -e

echo "[CareerOS AI] Starting cloud-native container stack..."
docker compose up -d

echo "[CareerOS AI] Services started! Checking service health..."
docker compose ps
