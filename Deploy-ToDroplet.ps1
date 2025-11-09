# ============================================
# PLASTIC SURGEON ASSISTANT - AUTOMATED DEPLOYMENT
# Digital Ocean Droplet: 164.90.225.181
# ============================================

param(
    [string]$DropletIP = "164.90.225.181",
    [string]$SSHUser = "root"
)

$ErrorActionPreference = "Stop"

# Colors for output
function Write-Success { Write-Host $args -ForegroundColor Green }
function Write-Info { Write-Host $args -ForegroundColor Cyan }
function Write-Warning { Write-Host $args -ForegroundColor Yellow }
function Write-Error { Write-Host $args -ForegroundColor Red }

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "PLASTIC SURGEON ASSISTANT - AUTO DEPLOYMENT" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Write-Info "Droplet IP: $DropletIP"
Write-Info "SSH User: $SSHUser"
Write-Host ""

# Step 1: Check if SSH is available
Write-Info "Step 1: Checking SSH connectivity..."
try {
    $null = Get-Command ssh -ErrorAction Stop
    Write-Success "✓ SSH command found"
} catch {
    Write-Error "✗ SSH not found. Please install OpenSSH."
    Write-Info "Install via: Settings > Apps > Optional Features > Add OpenSSH Client"
    exit 1
}

# Step 2: Test connection
Write-Info "`nStep 2: Testing connection to droplet..."
Write-Warning "You may be prompted for password..."
$testConnection = ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no $SSHUser@$DropletIP "echo 'Connection successful'" 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Error "✗ Failed to connect to droplet"
    Write-Info "Please ensure:"
    Write-Info "  1. Droplet IP is correct: $DropletIP"
    Write-Info "  2. You have the root password"
    Write-Info "  3. SSH is enabled on the droplet"
    exit 1
}
Write-Success "✓ Connection successful"

# Step 3: Copy deployment script
Write-Info "`nStep 3: Copying deployment script to droplet..."
scp -o StrictHostKeyChecking=no deploy-to-droplet.sh $SSHUser@${DropletIP}:~/

if ($LASTEXITCODE -ne 0) {
    Write-Error "✗ Failed to copy deployment script"
    exit 1
}
Write-Success "✓ Deployment script copied"

# Step 4: Execute deployment
Write-Info "`nStep 4: Executing deployment on droplet..."
Write-Warning "This will take 3-5 minutes. Please wait..."
Write-Host ""

ssh -o StrictHostKeyChecking=no $SSHUser@$DropletIP @"
chmod +x ~/deploy-to-droplet.sh
./deploy-to-droplet.sh
"@

if ($LASTEXITCODE -ne 0) {
    Write-Error "✗ Deployment script failed"
    Write-Info "Check the logs above for errors"
    exit 1
}

# Step 5: Verify deployment
Write-Info "`nStep 5: Verifying deployment..."
Start-Sleep -Seconds 5

try {
    $response = Invoke-WebRequest -Uri "http://$DropletIP" -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Success "✓ Application is running!"
    }
} catch {
    Write-Warning "! Could not verify application (might still be starting)"
}

# Final summary
Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "✅ DEPLOYMENT COMPLETED!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Success "Application URL: http://$DropletIP"
Write-Host ""
Write-Info "Default Login Credentials:"
Write-Info "  Admin: admin@unth.edu.ng / admin123"
Write-Info "  Doctor: doctor@unth.edu.ng / doctor123"
Write-Host ""
Write-Info "Next Steps:"
Write-Info "  1. Open browser: http://$DropletIP"
Write-Info "  2. Login with credentials above"
Write-Info "  3. Test all features"
Write-Info "  4. Set up SSL if you have a domain"
Write-Host ""
Write-Info "Useful Commands:"
Write-Info "  Check logs: ssh $SSHUser@$DropletIP 'tail -f /var/log/nginx/plasticsurg_error.log'"
Write-Info "  Restart app: ssh $SSHUser@$DropletIP 'systemctl restart nginx'"
Write-Info "  Update app: ssh $SSHUser@$DropletIP 'cd /var/www/plasticsurg_assisstant && git pull && npm run build && systemctl restart nginx'"
Write-Host ""
Write-Success "🎉 Your Plastic Surgeon Assistant is now LIVE!"
Write-Host "============================================" -ForegroundColor Green
