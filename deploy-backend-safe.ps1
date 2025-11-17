# Safe Backend Deployment Script with Syntax Validation
# Ensures syntax is correct before deploying and restarting PM2

param(
    [switch]$SkipCommit,
    [string]$CommitMessage = "Backend update"
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendFile = Join-Path $ScriptDir "server\index-postgres.js"
$ServerIP = "164.90.225.181"
$ServerUser = "root"
$ServerPath = "/var/www/plasticsurg_assisstant"
$PM2ProcessName = "plasticsurg-backend"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  SAFE BACKEND DEPLOYMENT SCRIPT" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Step 1: Check if backend file exists
Write-Host "[1/7] Checking backend file..." -ForegroundColor Yellow
if (-not (Test-Path $BackendFile)) {
    Write-Host "ERROR: Backend file not found: $BackendFile" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Backend file found" -ForegroundColor Green

# Step 2: Run local syntax check
Write-Host "`n[2/7] Running local syntax check..." -ForegroundColor Yellow
$syntaxCheck = & node --check $BackendFile 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Syntax error detected in local backend file!" -ForegroundColor Red
    Write-Host $syntaxCheck -ForegroundColor Red
    Write-Host "`nPlease fix the syntax error above before deploying." -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ Local syntax check passed" -ForegroundColor Green

# Step 3: Commit and push (optional)
if (-not $SkipCommit) {
    Write-Host "`n[3/7] Committing and pushing changes..." -ForegroundColor Yellow
    git add .
    $commitResult = git commit -m $CommitMessage 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Changes committed" -ForegroundColor Green
        git push origin main
        if ($LASTEXITCODE -ne 0) {
            Write-Host "ERROR: Failed to push to GitHub" -ForegroundColor Red
            exit 1
        }
        Write-Host "✓ Changes pushed to GitHub" -ForegroundColor Green
    }
    else {
        if ($commitResult -match "nothing to commit") {
            Write-Host "✓ No changes to commit" -ForegroundColor Green
        }
        else {
            Write-Host "WARNING: Commit failed - $commitResult" -ForegroundColor Yellow
        }
    }
}
else {
    Write-Host "`n[3/7] Skipping commit (SkipCommit flag set)" -ForegroundColor Yellow
}

# Step 4: Pull latest code on server
Write-Host "`n[4/7] Pulling latest code on server..." -ForegroundColor Yellow
$pullCommand = "cd $ServerPath ; git pull origin main"
$pullResult = ssh ${ServerUser}@${ServerIP} $pullCommand 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to pull code on server" -ForegroundColor Red
    Write-Host $pullResult -ForegroundColor Red
    exit 1
}
Write-Host $pullResult
Write-Host "✓ Code pulled successfully" -ForegroundColor Green

# Step 5: Run syntax check on server
Write-Host "`n[5/7] Running syntax check on server..." -ForegroundColor Yellow
$syntaxCommand = "cd $ServerPath ; node --check server/index-postgres.js"
$serverSyntaxCheck = ssh ${ServerUser}@${ServerIP} $syntaxCommand 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Syntax error detected on server!" -ForegroundColor Red
    Write-Host $serverSyntaxCheck -ForegroundColor Red
    Write-Host "`nThe server file has a syntax error. This should not happen if local check passed." -ForegroundColor Yellow
    Write-Host "Possible causes:" -ForegroundColor Yellow
    Write-Host "  - File encoding issues during git transfer" -ForegroundColor Yellow
    Write-Host "  - Manual edits on server" -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ Server syntax check passed" -ForegroundColor Green

# Step 6: Restart PM2
Write-Host "`n[6/7] Restarting PM2 process..." -ForegroundColor Yellow
$pm2Command = "pm2 restart $PM2ProcessName --update-env"
$pm2Result = ssh ${ServerUser}@${ServerIP} $pm2Command 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to restart PM2" -ForegroundColor Red
    Write-Host $pm2Result -ForegroundColor Red
    exit 1
}
Write-Host $pm2Result
Write-Host "✓ PM2 restarted successfully" -ForegroundColor Green

# Step 7: Verify backend is running
Write-Host "`n[7/7] Verifying backend health..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
try {
    $healthCheck = Invoke-RestMethod -Uri "http://${ServerIP}/api/health" -Method Get -TimeoutSec 10
    Write-Host "✓ Backend is healthy!" -ForegroundColor Green
    Write-Host "  Status: $($healthCheck.status)" -ForegroundColor Cyan
    Write-Host "  Database: $($healthCheck.database)" -ForegroundColor Cyan
}
catch {
    Write-Host "WARNING: Health check failed - backend may still be starting" -ForegroundColor Yellow
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Success summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  DEPLOYMENT SUCCESSFUL! ✓" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nYour backend is now running at:" -ForegroundColor White
Write-Host "  http://$ServerIP" -ForegroundColor Cyan
Write-Host "  http://$ServerIP/api/health" -ForegroundColor Cyan
Write-Host "`nTest login endpoint:" -ForegroundColor White
Write-Host "  Invoke-RestMethod -Uri 'http://$ServerIP/api/auth/login' -Method Post -ContentType 'application/json' -Body '{\"email\":\"admin@unth.edu.ng\",\"password\":\"Admin@123\"}'" -ForegroundColor Cyan
Write-Host ""
