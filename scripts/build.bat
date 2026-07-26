@echo off
REM CareerOS AI — Docker Build Automation Batch Script
echo [CareerOS AI] Building container images...
docker compose build --no-cache
if %ERRORLEVEL% NEQ 0 (
    echo [CareerOS AI] Error: Docker build failed!
    exit /b %ERRORLEVEL%
)
echo [CareerOS AI] Build completed successfully!
