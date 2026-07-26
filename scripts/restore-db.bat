@echo off
REM CareerOS AI — PostgreSQL Automated Restore Batch Script
if "%~1"=="" (
    echo Usage: scripts\restore-db.bat ^<path_to_backup_file.sql^>
    exit /b 1
)

set BACKUP_FILE=%~1

if not exist "%BACKUP_FILE%" (
    echo Error: Backup file '%BACKUP_FILE%' does not exist!
    exit /b 1
)

echo [WARNING] Restoring database from '%BACKUP_FILE%' will overwrite existing data.
set /p CONFIRM="Are you sure you want to proceed? (Y/N): "
if /i "%CONFIRM%"=="Y" (
    echo [CareerOS AI] Restoring database...
    type "%BACKUP_FILE%" | docker exec -i careeros-postgres psql -U postgres -d careeros_ai_db
    echo [CareerOS AI] Database restore completed successfully.
) else (
    echo Restore operation cancelled.
)
