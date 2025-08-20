@echo off
echo ===========================================
echo    Publishing spoken-il-arabic-mcp v1.0.1
echo ===========================================

echo.
echo Step 1: Building the project...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    exit /b 1
)

echo.
echo Step 2: Publishing to npm registry...
call npm publish
if %errorlevel% neq 0 (
    echo ERROR: Publish failed!
    exit /b 1
)

echo.
echo ✅ SUCCESS: Package published successfully!
echo.
echo You can now install it globally using:
echo npm install -g spoken-il-arabic-mcp
echo.
pause
