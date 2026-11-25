@echo off
setlocal

if /i "%~1"=="backend" goto backend
if /i "%~1"=="frontend" goto frontend

cd /d "%~dp0" || exit /b 1
if not defined SERVER_PORT set "SERVER_PORT=8080"
echo Backend ^(Spring Boot^): http://localhost:%SERVER_PORT%
echo Frontend ^(Expo^): http://localhost:8081
echo Iniciando os dois servicos neste terminal...
echo.

powershell -NoProfile -Command ^
    "$backend = [System.Diagnostics.ProcessStartInfo]::new($env:ComSpec, '/d /c call iniciar.bat backend');" ^
    "$backend.UseShellExecute = $false;" ^
    "$processo = [System.Diagnostics.Process]::Start($backend);" ^
    "try { & $env:ComSpec /d /c call iniciar.bat frontend; $resultado = $LASTEXITCODE }" ^
    "finally { if (-not $processo.HasExited) { & taskkill.exe /PID $processo.Id /T /F 2>$null | Out-Null }; $processo.Dispose() };" ^
    "exit $resultado"
exit /b %errorlevel%

:backend
cd /d "%~dp0backend" || exit /b 1
where java.exe >nul 2>&1
if errorlevel 1 (
    echo Java 17 ou superior precisa estar no PATH.
    exit /b 1
)

powershell -NoProfile -Command "if (-not $env:JWT_SECRET) { $env:JWT_SECRET = [Guid]::NewGuid().ToString('N') + [Guid]::NewGuid().ToString('N') }; & .\mvnw.cmd spring-boot:run; exit $LASTEXITCODE"
if errorlevel 1 echo Backend encerrou. Confira o erro acima.
exit /b %errorlevel%

:frontend
cd /d "%~dp0frontend" || exit /b 1
if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"
if exist "%ProgramFiles%\nodejs\node.exe" set "PATH=%ProgramFiles%\nodejs;%PATH%"
where node.exe >nul 2>&1
if errorlevel 1 (
    echo Node.js precisa estar no PATH.
    exit /b 1
)

if not exist "node_modules\expo\bin\cli" (
    where npm.cmd >nul 2>&1
    if errorlevel 1 (
        echo npm precisa estar no PATH para instalar as dependencias.
        exit /b 1
    )
    call npm.cmd ci
    if errorlevel 1 exit /b 1
)

node.exe "node_modules\expo\bin\cli" start --port 8081
exit /b %errorlevel%
