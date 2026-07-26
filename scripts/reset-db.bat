@echo off
REM CareerOS AI — Development Database Reset Batch Script
echo [WARNING] Resetting development database and clearing postgres_data volume!
set /p CONFIRM="Are you sure? (Y/N): "
if /i "%CONFIRM%"=="Y" (
    docker compose down -v
    echo [CareerOS AI] Volume wiped. Re-launching container stack...
    docker compose up -d
    echo [CareerOS AI] Database reset completed.
) else (
    echo Reset cancelled.
)
