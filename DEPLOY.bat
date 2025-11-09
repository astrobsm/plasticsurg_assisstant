@echo off
REM ============================================
REM PLASTIC SURGEON ASSISTANT - ONE-CLICK DEPLOY
REM ============================================

echo.
echo ============================================
echo PLASTIC SURGEON ASSISTANT - AUTO DEPLOYMENT
echo ============================================
echo.
echo This will deploy your app to:
echo IP: 164.90.225.181
echo.
echo You will be prompted for your droplet password
echo.
pause

echo.
echo Starting automated deployment...
echo.

powershell.exe -ExecutionPolicy Bypass -File "%~dp0Deploy-ToDroplet.ps1"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo DEPLOYMENT SUCCESSFUL!
    echo ============================================
    echo.
    echo Open your browser and visit:
    echo http://164.90.225.181
    echo.
    echo Login with:
    echo   Email: admin@unth.edu.ng
    echo   Password: admin123
    echo.
) else (
    echo.
    echo ============================================
    echo DEPLOYMENT FAILED!
    echo ============================================
    echo.
    echo Please check the errors above
    echo.
)

pause
