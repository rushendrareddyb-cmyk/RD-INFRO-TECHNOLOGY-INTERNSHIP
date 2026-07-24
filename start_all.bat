@echo off
setlocal

:: -------------------------------------------------
:: Detect mongod.exe path
:: -------------------------------------------------
:: Try PATH first
for /f "delims=" %%i in ('where mongod.exe 2^>nul') do set "MONGOD_PATH=%%i"

:: If not found, search typical installation folders
if not defined MONGOD_PATH (
    for %%D in ("C:\Program Files\MongoDB\Server" "C:\Program Files (x86)\MongoDB\Server") do (
        if exist "%%D" (
            for /f "delims=" %%V in ('dir "%%D" /b /ad ^| sort /r') do (
                if exist "%%D\%%V\bin\mongod.exe" (
                    set "MONGOD_PATH=%%D\%%V\bin\mongod.exe"
                    goto :foundMongod
                )
            )
        )
    )
)

:foundMongod
if not defined MONGOD_PATH (
    echo [⚠️] mongod.exe not found. Install MongoDB Community Server and add its \"bin\" folder to PATH.
    pause
    exit /b 1
)

:: -------------------------------------------------
:: Ensure data directory exists
:: -------------------------------------------------
if not exist "C:\\data\\db" (
    echo Creating data directory at C:\\data\\db
    mkdir "C:\\data\\db"
)

:: -------------------------------------------------
:: Start MongoDB
:: -------------------------------------------------
start "MongoDB" cmd /c "%MONGOD_PATH% --dbpath \"C:\\data\\db\""

:: Give MongoDB a moment to start
timeout /t 5 /nobreak > nul

:: -------------------------------------------------
:: Start backend server
:: -------------------------------------------------
start "Backend" cmd /c "cd /d \"%~dp0backend\" && powershell -ExecutionPolicy Bypass -Command \"npm run dev\""

:: -------------------------------------------------
:: Start frontend server
:: -------------------------------------------------
start "Frontend" cmd /c "cd /d \"%~dp0frontend\" && powershell -ExecutionPolicy Bypass -Command \"npm run dev\""

:: Give servers a moment to start
timeout /t 8 /nobreak > nul

:: -------------------------------------------------
:: Open browser
:: -------------------------------------------------
start "" http://localhost:5173

endlocal
