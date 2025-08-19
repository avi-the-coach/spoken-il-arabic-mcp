# PowerShell installation script for Spoken IL Arabic MCP Server
# Run as Administrator for best results

Write-Host "🚀 Installing Spoken IL Arabic MCP Server..." -ForegroundColor Cyan
Write-Host ""

# Function to test if running as admin
function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not (Test-Administrator)) {
    Write-Host "⚠️  Warning: Not running as Administrator. Some operations may fail." -ForegroundColor Yellow
    Write-Host "   For best results, run PowerShell as Administrator and try again." -ForegroundColor Yellow
    Write-Host ""
}

# Clean up previous installations
Write-Host "🧹 Cleaning up previous installation attempts..." -ForegroundColor Yellow
try {
    $npmGlobalPath = "$env:APPDATA\npm\node_modules\spoken-il-arabic-mcp"
    if (Test-Path $npmGlobalPath) {
        Remove-Item -Recurse -Force $npmGlobalPath -ErrorAction SilentlyContinue
    }
    npm cache clean --force 2>$null
    Write-Host "   Cleanup completed." -ForegroundColor Green
} catch {
    Write-Host "   Cleanup had some issues, continuing anyway..." -ForegroundColor Yellow
}

Write-Host ""

# Try Method 1: Direct from GitHub
Write-Host "📦 Method 1: Installing directly from GitHub..." -ForegroundColor Cyan
try {
    $result = npm install -g git+https://github.com/avi-the-coach/spoken-il-arabic-mcp.git 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Installation successful!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎯 To use with Claude Desktop, add this to your MCP config:" -ForegroundColor Cyan
        Write-Host @"
{
  "mcpServers": {
    "spoken-arabic": {
      "command": "spoken-il-arabic-mcp"
    }
  }
}
"@ -ForegroundColor White
        Write-Host ""
        Write-Host "🧪 Test the installation:" -ForegroundColor Cyan
        Write-Host "   spoken-il-arabic-mcp --help" -ForegroundColor White
        exit 0
    }
} catch {
    Write-Host "❌ Method 1 failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Try Method 2: Clone and install locally
Write-Host "📦 Method 2: Clone and install locally..." -ForegroundColor Cyan
$tempDir = "$env:TEMP\spoken-il-arabic-mcp-install"

try {
    # Clean temp directory
    if (Test-Path $tempDir) {
        Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue
    }
    
    # Clone repository
    Write-Host "   Cloning repository..." -ForegroundColor Yellow
    git clone https://github.com/avi-the-coach/spoken-il-arabic-mcp.git $tempDir
    
    # Install from local directory
    Write-Host "   Installing from local directory..." -ForegroundColor Yellow
    Push-Location $tempDir
    npm install -g .
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Installation successful via local method!" -ForegroundColor Green
        Pop-Location
        Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue
        
        Write-Host ""
        Write-Host "🎯 To use with Claude Desktop, add this to your MCP config:" -ForegroundColor Cyan
        Write-Host @"
{
  "mcpServers": {
    "spoken-arabic": {
      "command": "spoken-il-arabic-mcp"
    }
  }
}
"@ -ForegroundColor White
        exit 0
    }
} catch {
    Write-Host "❌ Method 2 failed: $($_.Exception.Message)" -ForegroundColor Red
    Pop-Location -ErrorAction SilentlyContinue
} finally {
    Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "❌ Both automated installation methods failed." -ForegroundColor Red
Write-Host ""
Write-Host "🛠️  Manual installation steps:" -ForegroundColor Yellow
Write-Host "1. Clone: git clone https://github.com/avi-the-coach/spoken-il-arabic-mcp.git" -ForegroundColor White
Write-Host "2. Open PowerShell as Administrator" -ForegroundColor White
Write-Host "3. Navigate to the cloned directory: cd spoken-il-arabic-mcp" -ForegroundColor White
Write-Host "4. Run: npm install -g ." -ForegroundColor White
Write-Host ""
Write-Host "🔧 This is a Windows npm permission issue with the MCP SDK dependencies." -ForegroundColor Yellow
Write-Host "   The manual method should work around these permission problems." -ForegroundColor Yellow

Read-Host "Press Enter to continue..."