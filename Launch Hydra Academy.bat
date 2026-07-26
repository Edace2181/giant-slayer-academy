@echo off
setlocal

set "HYDRA_ROOT=%~dp0"
set "HYDRA_ROOT_ARG=%HYDRA_ROOT:~0,-1%"
set "HYDRA_PORT=8765"

powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%HYDRA_ROOT%hydra-local-server.ps1" -Root "%HYDRA_ROOT_ARG%" -Port %HYDRA_PORT% -Launch

if errorlevel 1 (
    echo.
    echo Hydra Academy could not be launched.
    echo Review the message above, then press any key to close this window.
    pause >nul
)

endlocal
