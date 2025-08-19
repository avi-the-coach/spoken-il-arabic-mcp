# Installation Guide - Spoken IL Arabic MCP Server

## Quick Installation (Windows)

### Option 1: Automated Script
1. **Download and run install script**:
   ```powershell
   # PowerShell (Recommended)
   Invoke-WebRequest -Uri "https://raw.githubusercontent.com/avi-the-coach/spoken-il-arabic-mcp/main/install.ps1" -OutFile "install.ps1"
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   .\install.ps1
   ```

   Or use the batch file:
   ```cmd
   curl -o install.bat https://raw.githubusercontent.com/avi-the-coach/spoken-il-arabic-mcp/main/install.bat
   install.bat
   ```

### Option 2: Manual Installation (Recommended for Windows Issues)

**This method works around Windows npm permission issues:**

1. **Clone the repository**:
   ```bash
   git clone https://github.com/avi-the-coach/spoken-il-arabic-mcp.git
   cd spoken-il-arabic-mcp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install globally** (Run as Administrator if needed):
   ```bash
   npm install -g .
   ```

4. **Verify installation**:
   ```bash
   spoken-il-arabic-mcp --help
   ```

## Installation on macOS/Linux

```bash
# Simple one-command install
npm install -g git+https://github.com/avi-the-coach/spoken-il-arabic-mcp.git

# Or manual method
git clone https://github.com/avi-the-coach/spoken-il-arabic-mcp.git
cd spoken-il-arabic-mcp
npm install -g .
```

## Troubleshooting Windows Installation

### Common Issue: npm Permission Errors

**Symptoms:**
- `EPERM: operation not permitted`
- `ENOTEMPTY: directory not empty`
- `npm error git dep preparation failed`

**Solutions:**

1. **Run as Administrator**:
   - Open Command Prompt or PowerShell as Administrator
   - Try the installation commands again

2. **Clear npm cache**:
   ```bash
   npm cache clean --force
   ```

3. **Manual cleanup**:
   ```cmd
   rmdir /s "%APPDATA%\npm\node_modules\spoken-il-arabic-mcp"
   ```

4. **Use manual installation method** (most reliable):
   - Clone the repository first
   - Install locally, then globally

### Alternative: Development Mode

If global installation continues to fail, you can run in development mode:

1. **Clone and setup**:
   ```bash
   git clone https://github.com/avi-the-coach/spoken-il-arabic-mcp.git
   cd spoken-il-arabic-mcp
   npm install
   npm run build
   ```

2. **Use absolute path in Claude config**:
   ```json
   {
     "mcpServers": {
       "spoken-arabic": {
         "command": "node",
         "args": ["C:\\path\\to\\spoken-il-arabic-mcp\\dist\\index.js"]
       }
     }
   }
   ```

## Claude Desktop Configuration

After successful installation, add to your Claude Desktop MCP configuration:

**Location**: `%APPDATA%\Claude\claude_desktop_config.json` (Windows)

```json
{
  "mcpServers": {
    "spoken-arabic": {
      "command": "spoken-il-arabic-mcp"
    }
  }
}
```

## Verification

Test that everything works:

1. **Check if command is available**:
   ```bash
   spoken-il-arabic-mcp --help
   ```

2. **Test API connectivity** (requires internet):
   ```bash
   node -e "
   import('./dist/api/client.js').then(({ RoadToRecoveryApiClient }) => {
     const client = new RoadToRecoveryApiClient();
     client.healthCheck().then(healthy => 
       console.log('API Status:', healthy ? '✅ Connected' : '❌ Failed')
     );
   });
   "
   ```

## Need Help?

If you continue to have installation issues:

1. **Check the GitHub Issues**: [spoken-il-arabic-mcp/issues](https://github.com/avi-the-coach/spoken-il-arabic-mcp/issues)
2. **Create a new issue** with:
   - Your operating system
   - Node.js version (`node --version`)
   - npm version (`npm --version`)
   - Full error message
   - Steps you tried

---

*The Windows npm permission issues are unfortunately common with complex dependencies. The manual installation method is the most reliable workaround.*