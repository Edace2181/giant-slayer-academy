@echo off
setlocal

set "HYDRA_ROOT=%~dp0"
set "HYDRA_ROOT_ARG=%HYDRA_ROOT:~0,-1%"
set "HYDRA_PORT=8765"

powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%HYDRA_ROOT%hydra-local-server.ps1" -Root "%HYDRA_ROOT_ARG%" -Port %HYDRA_PORT% -Stop

if errorlevel 1 (
    echo.
    pause
) else (
    echo.
    echo Hydra Academy local server is stopped.
    powershell.exe -NoLogo -NoProfile -Command "Start-Sleep -Seconds 2"
)

endlocal
