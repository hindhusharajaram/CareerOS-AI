@echo off
REM CareerOS AI — PostgreSQL Automated Backup Batch Script
set BACKUP_DIR=.\backups
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
for /f "tokens=1-2 delims=: " %%a in ('time /t') do (set mytime=%%a%%b)
set TIMESTAMP=%mydate%_%mytime%
set BACKUP_FILE=%BACKUP_DIR%\careeros_backup_%TIMESTAMP%.sql

echo [CareerOS AI] Initiating PostgreSQL database backup...
docker exec careeros-postgres pg_dump -U postgres careeros_ai_db > "%BACKUP_FILE%"

if %ERRORLEVEL% NEQ 0 (
    echo [CareerOS AI] Error: Database backup failed!
    exit /b %ERRORLEVEL%
)

echo [CareerOS AI] Backup complete: %BACKUP_FILE%
