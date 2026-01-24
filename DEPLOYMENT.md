# 🚀 Automated Deployment System

**FULLY AUTOMATED** - No more manual Git commands or push rejections!

---

## 🎯 Quick Start

### Method 1: NPM Scripts (Recommended)

```bash
# Deploy with automatic commit message prompt
npm run push

# Or using PowerShell (Windows)
npm run push:ps
```

### Method 2: Git Aliases

```bash
# Same as npm run push
git deploy

# Or short version
git ship

# Just sync without deploying
git sync
```

### Method 3: Direct Script

```bash
# With commit message
./deploy.sh "Add new feature"

# Interactive mode (will prompt for message)
./deploy.sh

# PowerShell version
./deploy.ps1 "Add new feature"
```

---

## ✨ What Gets Automated

The script automatically:
1. ✅ **Checks for changes** - Exits if nothing to deploy
2. ✅ **Syncs with remote** - Pulls latest changes with rebase
3. ✅ **Handles conflicts** - Provides clear instructions if conflicts occur
4. ✅ **Stages all changes** - `git add .` automatically
5. ✅ **Creates commit** - Interactive or from argument
6. ✅ **Pushes to GitHub** - Never get "rejected" errors
7. ✅ **Triggers Vercel CI/CD** - Automatic deployment
8. ✅ **Shows deployment info** - Link to monitor progress

---

## 📋 All Available Commands

| Command | Description |
|---------|-------------|
| `npm run push` | Full deployment automation (Bash) |
| `npm run push:ps` | Full deployment automation (PowerShell) |
| `npm run ship` | Same as `npm run push` |
| `git deploy` | Git alias for deployment |
| `git ship` | Git alias for deployment (shorter) |
| `git sync` | Just pull and rebase, no push |
| `./deploy.sh "msg"` | Direct script with message |
| `./deploy.sh` | Direct script (interactive) |

---

## 🎨 Features

### Automatic Conflict Resolution
- Pulls and rebases before pushing
- Never get "rejected" errors again
- Clear instructions if conflicts occur

### Beautiful Output
- Color-coded messages
- Step-by-step progress
- Deployment status and links

### Flexible Usage
- Interactive mode (prompts for message)
- Non-interactive mode (pass message as argument)
- Multiple command options (npm, git, direct)

### Safety Features
- Checks for changes before proceeding
- Validates commit messages
- Error handling with helpful messages
- Conflict detection and guidance

---

## 💡 Daily Workflow Examples

### Quick Deploy

```bash
# Make your changes in code, then:
npm run push
# Enter commit message when prompted
```

### Deploy with Message

```bash
./deploy.sh "Update hero section and fix mobile layout"
```

### Just Sync (No Deploy)

```bash
git sync  # Pull latest changes
```

---

## 🔧 How It Works

```
1. Check for changes → 2. Fetch remote → 3. Compare local/remote
                                               ↓
                                        4. Pull if needed (rebase)
                                               ↓
                                        5. Stage changes (git add .)
                                               ↓
                                        6. Get/create commit message
                                               ↓
                                        7. Commit changes
                                               ↓
                                        8. Push to GitHub
                                               ↓
                                        9. Vercel CI/CD triggered! 🚀
```

---

## 🐛 Troubleshooting

### Conflict During Rebase

If you see a conflict message:

```bash
# 1. Open conflicted files and fix them
# 2. Stage the resolved files
git add <file>

# 3. Continue the rebase
git rebase --continue

# 4. Run deployment again
npm run push
```

### Script Permissions (Bash only)

If you get "permission denied":

```bash
chmod +x deploy.sh
```

### PowerShell Execution Policy

If PowerShell blocks the script:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Or use:
```bash
npm run push:ps  # Bypasses policy automatically
```

---

## 🎉 Benefits

### Before Automation
```bash
git pull origin main --rebase  # Remember to pull first!
git add .
git commit -m "Your message"
git push origin main           # Might get rejected!
# Oh no, rejected! Start over...
```

### After Automation
```bash
npm run push
# Done! ✅
```

---

## 🌟 Pro Tips

1. **Use `npm run push`** - It's the easiest and most reliable
2. **Always provide good commit messages** - Future you will thank you
3. **Check Vercel dashboard** - Monitor deployment progress
4. **Use `git sync`** - To just update without deploying

---

## 📊 Deployment Monitoring

After running the script, monitor at:
- **Vercel**: https://vercel.com/pubudu-tharanagas-projects/pubudu-portfolio
- **GitHub**: Check commit for green checkmark ✅

---

## 🔗 Additional Resources

- [GitHub Repository](https://github.com/pubudutharanga/pubudu-portfolio)
- [Vercel Project](https://vercel.com/pubudu-tharanagas-projects/pubudu-portfolio)
- [CI/CD Setup Guide](./github-vercel-cicd-status.md)

---

**Remember**: From now on, deploying is just **one command**:

```bash
npm run push
```

No more manual Git operations. No more "rejected" errors. Fully automated! 🚀
