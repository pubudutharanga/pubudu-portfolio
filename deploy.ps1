# 🚀 Automated Deployment Script for Vercel CI/CD (PowerShell)
# Repository: pubudutharanga/pubudu-portfolio
# Description: Fully automated Git workflow with conflict handling

$ErrorActionPreference = "Stop"

# Print banner
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   🚀 Vercel CI/CD Deploy Automation   ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Function to print colored messages
function Print-Success($message) {
    Write-Host "✅ $message" -ForegroundColor Green
}

function Print-Info($message) {
    Write-Host "ℹ️  $message" -ForegroundColor Cyan
}

function Print-Warning($message) {
    Write-Host "⚠️  $message" -ForegroundColor Yellow
}

function Print-Error($message) {
    Write-Host "❌ $message" -ForegroundColor Red
}

# Step 1: Check for uncommitted changes
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Print-Info "Step 1/6: Checking for changes..."
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

$status = git status -s
if ([string]::IsNullOrWhiteSpace($status)) {
    Print-Warning "No changes detected. Nothing to deploy."
    exit 0
}

Print-Success "Changes detected!"
git status -s
Write-Host ""

# Step 2: Sync with remote
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Print-Info "Step 2/6: Syncing with GitHub..."
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

git fetch origin

$local = git rev-parse main
$remote = git rev-parse origin/main

if ($local -ne $remote) {
    Print-Warning "Remote has new commits. Pulling changes..."
    
    try {
        git pull origin main --rebase
        Print-Success "Successfully synced with remote!"
    }
    catch {
        Print-Error "Merge conflict detected!"
        Print-Warning "Please resolve conflicts manually:"
        Write-Host "  1. Fix conflicts in your editor"
        Write-Host "  2. Run: git add <file>"
        Write-Host "  3. Run: git rebase --continue"
        Write-Host "  4. Run this script again"
        exit 1
    }
}
else {
    Print-Success "Already up to date with remote!"
}
Write-Host ""

# Step 3: Stage changes
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Print-Info "Step 3/6: Staging changes..."
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

git add .
Print-Success "All changes staged!"
Write-Host ""

# Step 4: Get commit message
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Print-Info "Step 4/6: Creating commit..."
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# Check if message provided as argument
if ($args.Count -gt 0) {
    $commitMsg = $args -join " "
    Print-Info "Using provided message: $commitMsg"
}
else {
    # Interactive mode
    Write-Host "Enter commit message:" -ForegroundColor Yellow
    $commitMsg = Read-Host ">"
    
    if ([string]::IsNullOrWhiteSpace($commitMsg)) {
        Print-Error "Commit message cannot be empty!"
        exit 1
    }
}

git commit -m $commitMsg
Print-Success "Commit created: $commitMsg"
Write-Host ""

# Step 5: Push to GitHub
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Print-Info "Step 5/6: Pushing to GitHub..."
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

try {
    git push origin main
    Print-Success "Successfully pushed to GitHub!"
}
catch {
    Print-Error "Push failed! This should not happen after sync."
    Print-Warning "Try running: git pull --rebase && git push"
    exit 1
}
Write-Host ""

# Step 6: Deployment triggered
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Print-Info "Step 6/6: Vercel CI/CD Triggered!"
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

Print-Success "Deployment initiated! 🚀"
Write-Host ""
Print-Info "Monitor deployment at:"
Write-Host "  https://vercel.com/pubudu-tharanagas-projects/pubudu-portfolio" -ForegroundColor Cyan
Write-Host ""
Print-Info "Latest commit:"
git log -1 --oneline
Write-Host ""

Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║          ✅ DEPLOYMENT SUCCESS!        ║" -ForegroundColor Green
Write-Host "║    Your site will update in 1-2 min    ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green
