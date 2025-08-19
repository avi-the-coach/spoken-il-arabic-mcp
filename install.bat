@echo off
echo Installing Spoken IL Arabic MCP Server...
echo.

REM Clean up any previous failed installations
echo Cleaning up previous installation attempts...
rmdir /s /q "%APPDATA%\npm\node_modules\spoken-il-arabic-mcp" 2>nul
npm cache clean --force 2>nul

REM Try different installation methods
echo.
echo Attempting installation method 1: Direct from GitHub...
npm install -g git+https://github.com/avi-the-coach/spoken-il-arabic-mcp.git

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Installation successful!
    echo.
    echo To use with Claude Desktop, add this to your config:
    echo {
    echo   "mcpServers": {
    echo     "spoken-arabic": {
    echo       "command": "spoken-il-arabic-mcp"
    echo     }
    echo   }
    echo }
    echo.
    echo Test the installation:
    echo spoken-il-arabic-mcp --help
    goto :end
)

echo.
echo ⚠️  Method 1 failed, trying method 2: Clone and install locally...
cd /d "%TEMP%"
rmdir /s /q "spoken-il-arabic-mcp-install" 2>nul
git clone https://github.com/avi-the-coach/spoken-il-arabic-mcp.git spoken-il-arabic-mcp-install
cd spoken-il-arabic-mcp-install
npm install -g .

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Installation successful via local method!
    cd /d "%TEMP%"
    rmdir /s /q "spoken-il-arabic-mcp-install" 2>nul
    goto :success
)

echo.
echo ❌ Both installation methods failed.
echo This is likely due to Windows file permission issues.
echo.
echo Manual installation steps:
echo 1. Clone: git clone https://github.com/avi-the-coach/spoken-il-arabic-mcp.git
echo 2. Open Command Prompt as Administrator
echo 3. Navigate to the cloned directory
echo 4. Run: npm install -g .
echo.

:success
echo.
echo To use with Claude Desktop, add this to your config:
echo {
echo   "mcpServers": {
echo     "spoken-arabic": {
echo       "command": "spoken-il-arabic-mcp"
echo     }
echo   }
echo }

:end
pause