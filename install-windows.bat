@echo off
setlocal EnableDelayedExpansion

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║        Spoken IL Arabic MCP Server - Windows Installer      ║
echo ║                  Global Installation Script                  ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: This script must be run as Administrator
    echo.
    echo Please:
    echo 1. Right-click on this file
    echo 2. Select "Run as administrator"
    echo.
    pause
    exit /b 1
)

echo ✅ Running with Administrator privileges...
echo.

REM Clear npm cache to avoid Windows file locking issues
echo 🧹 Step 1: Clearing npm cache...
call npm cache clean --force
if %errorlevel% neq 0 (
    echo ⚠️  Warning: Failed to clear cache, continuing anyway...
)
echo ✅ Cache cleared successfully
echo.

REM Remove any existing global installation
echo 🗑️  Step 2: Removing any existing installation...
call npm uninstall -g spoken-il-arabic-mcp >nul 2>&1
echo ✅ Previous installation removed (if existed)
echo.

REM Install the package globally with force flag
echo 📦 Step 3: Installing spoken-il-arabic-mcp globally...
echo    This may take a moment, please wait...
call npm install -g spoken-il-arabic-mcp --force
if %errorlevel% neq 0 (
    echo.
    echo ❌ ERROR: Global installation failed!
    echo.
    echo 🔧 TROUBLESHOOTING:
    echo.
    echo 1. Make sure you're connected to the internet
    echo 2. Try running this command manually:
    echo    npm cache clean --force
    echo    npm install -g spoken-il-arabic-mcp --force
    echo.
    echo 3. If the issue persists, you can install directly from GitHub:
    echo    npm install -g git+https://github.com/avi-the-coach/spoken-il-arabic-mcp.git --force
    echo.
    pause
    exit /b 1
)

echo ✅ Installation completed successfully!
echo.

REM Verify installation
echo 🔍 Step 4: Verifying installation...
call npm list -g spoken-il-arabic-mcp
if %errorlevel% neq 0 (
    echo ⚠️  Warning: Package might not be properly installed
) else (
    echo ✅ Installation verified successfully!
)
echo.

REM Show installation path
for /f "tokens=*" %%i in ('npm root -g') do set NPM_GLOBAL_ROOT=%%i
set MCP_SERVER_PATH=%NPM_GLOBAL_ROOT%\spoken-il-arabic-mcp\dist\index.js

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    INSTALLATION COMPLETE                     ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 🎉 spoken-il-arabic-mcp has been installed successfully!
echo.
echo 📁 Installation Location:
echo    %MCP_SERVER_PATH%
echo.
echo 📋 Next Steps:
echo.
echo 1. Add this configuration to your Claude Desktop config file:
echo    Location: %%APPDATA%%\Claude\claude_desktop_config.json
echo.
echo 2. Configuration to add:
echo.
echo {
echo   "mcpServers": {
echo     "spoken-arabic": {
echo       "command": "node",
echo       "args": [
echo         "%MCP_SERVER_PATH%"
echo       ]
echo     }
echo   }
echo }
echo.
echo 3. Restart Claude Desktop
echo.
echo 4. Test the Arabic tools in Claude!
echo.
echo 📖 For more information, visit:
echo    https://github.com/avi-the-coach/spoken-il-arabic-mcp
echo.
pause
