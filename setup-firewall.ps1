# Smart Tourist Safety Platform - Firewall Setup
# Run this script as Administrator to allow mobile access

Write-Host "🔥 Setting up Windows Firewall rules for mobile access..." -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Right-click on PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Running as Administrator" -ForegroundColor Green
Write-Host ""

# Remove existing rules if they exist
Write-Host "🧹 Removing old firewall rules (if any)..." -ForegroundColor Yellow
Remove-NetFirewallRule -DisplayName "Smart Tourist - Vite Dev Server" -ErrorAction SilentlyContinue
Remove-NetFirewallRule -DisplayName "Smart Tourist - Node Backend" -ErrorAction SilentlyContinue
Write-Host "✅ Cleanup complete" -ForegroundColor Green
Write-Host ""

# Create new firewall rules
Write-Host "🔓 Creating firewall rules..." -ForegroundColor Cyan

# Rule for Frontend (Port 3000)
Write-Host "   Adding rule for Frontend (Port 3000)..." -ForegroundColor White
New-NetFirewallRule -DisplayName "Smart Tourist - Vite Dev Server" `
    -Direction Inbound `
    -LocalPort 3000 `
    -Protocol TCP `
    -Action Allow `
    -Profile Any `
    -Description "Allow access to Smart Tourist frontend from mobile devices" | Out-Null

Write-Host "   ✅ Frontend port 3000 allowed" -ForegroundColor Green

# Rule for Backend (Port 5000)
Write-Host "   Adding rule for Backend (Port 5000)..." -ForegroundColor White
New-NetFirewallRule -DisplayName "Smart Tourist - Node Backend" `
    -Direction Inbound `
    -LocalPort 5000 `
    -Protocol TCP `
    -Action Allow `
    -Profile Any `
    -Description "Allow access to Smart Tourist backend API from mobile devices" | Out-Null

Write-Host "   ✅ Backend port 5000 allowed" -ForegroundColor Green
Write-Host ""

# Get computer's IP addresses
Write-Host "📡 Your computer's network information:" -ForegroundColor Cyan
Write-Host ""

$ipAddresses = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.*" }

foreach ($ip in $ipAddresses) {
    Write-Host "   IP Address: $($ip.IPAddress)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Firewall setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 To access from mobile:" -ForegroundColor Cyan
Write-Host "   1. Connect your mobile to the SAME WiFi network" -ForegroundColor White
Write-Host "   2. Open mobile browser and go to:" -ForegroundColor White

foreach ($ip in $ipAddresses) {
    Write-Host "      http://$($ip.IPAddress):3000" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔐 Test Credentials:" -ForegroundColor Cyan
Write-Host "   Admin:   admin@test.com / admin123" -ForegroundColor White
Write-Host "   Tourist: tourist@test.com / password123" -ForegroundColor White
Write-Host ""
Write-Host "✨ You're all set! Open the URL on your mobile device." -ForegroundColor Green
Write-Host ""

Read-Host "Press Enter to exit"
