@echo off
setlocal enabledelayedexpansion

:: -------------------------------------------------
:: MongoDB Windows Service Setup
:: -------------------------------------------------

:: 1️⃣ Detect MongoDB installation folder
set "MONGODB_ROOT="
for /d %%D in ("C:\Program Files\MongoDB\Server\*") do (
    if exist "%%~fD\bin\mongod.exe" (
        set "MONGODB_ROOT=%%~fD"
        goto :foundRoot
    )
)

:foundRoot
if not defined MONGODB_ROOT (
    echo [⚠️] MongoDB installation not found under Program Files.
    echo Please install MongoDB Community Server first.
    pause
    exit /b 1
)

set "MONGOD_EXE=%MONGODB_ROOT%\bin\mongod.exe"
set "MONGOD_CFG=%MONGODB_ROOT%\bin\mongod.cfg"
if not exist "C:\data\db" mkdir "C:\data\db" >nul 2>&1

:: 2️⃣ Create a basic config file if it does not exist
if not exist "%MONGOD_CFG%" (
    echo storage: > "%MONGOD_CFG%"
    echo   dbPath: C:\data\db >> "%MONGOD_CFG%"
    echo net: >> "%MONGOD_CFG%"
    echo   bindIp: 127.0.0.1 >> "%MONGOD_CFG%"
    echo   port: 27017 >> "%MONGOD_CFG%"
)

:: 3️⃣ Register the Windows service (skip if already exists)
sc query MongoDB >nul 2>&1
if %errorlevel%==0 (
    echo [ℹ️] Service "MongoDB" already exists – skipping registration.
) else (
    echo [🔧] Registering MongoDB as a Windows service...
    "%MONGOD_EXE%" --config "%MONGOD_CFG%" --install --serviceName "MongoDB"
    if %errorlevel% neq 0 (
        echo [❌] Service registration failed. Check the output above for details.
        pause
        exit /b 1
    )
)

:: 4️⃣ Ensure the service starts automatically
sc config MongoDB start= auto >nul

:: 5️⃣ Start the service now
net start MongoDB >nul 2>&1
if %errorlevel% equ 2 (
    echo [ℹ️] Service already running.
) else if %errorlevel% neq 0 (
    echo [❌] Failed to start MongoDB service.
    pause
    exit /b 1
)

echo [✅] MongoDB service is up and running.
pause

endlocal
