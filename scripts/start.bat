@echo off
REM CareerOS AI — Docker Stack Launch Batch Script
echo [CareerOS AI] Starting cloud-native container stack...
docker compose up -d
if %ERRORLEVEL% NEQ 0 (
    echo [CareerOS AI] Error: Container stack launch failed!
    exit /b %ERRORLEVEL%
)
echo [CareerOS AI] Services started successfully!
docker compose ps
