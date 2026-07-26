@echo off
REM CareerOS AI — Docker Service Stop Batch Script
echo [CareerOS AI] Stopping container services...
docker compose down
echo [CareerOS AI] Services stopped safely. Persistent volumes preserved.
