#!/bin/bash

# 🚀 Automated Deployment Script for Vercel CI/CD
# Repository: pubudutharanga/pubudu-portfolio
# Description: Fully automated Git workflow with conflict handling

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print banner
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🚀 Vercel CI/CD Deploy Automation   ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo ""

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Check for uncommitted changes
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
print_info "Step 1/6: Checking for changes..."
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [[ -z $(git status -s) ]]; then
    print_warning "No changes detected. Nothing to deploy."
    exit 0
fi

print_success "Changes detected!"
git status -s
echo ""

# Step 2: Sync with remote
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
print_info "Step 2/6: Syncing with GitHub..."
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

git fetch origin

LOCAL=$(git rev-parse main)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
    print_warning "Remote has new commits. Pulling changes..."
    
    if git pull origin main --rebase; then
        print_success "Successfully synced with remote!"
    else
        print_error "Merge conflict detected!"
        print_warning "Please resolve conflicts manually:"
        echo "  1. Fix conflicts in your editor"
        echo "  2. Run: git add <file>"
        echo "  3. Run: git rebase --continue"
        echo "  4. Run this script again"
        exit 1
    fi
else
    print_success "Already up to date with remote!"
fi
echo ""

# Step 3: Stage changes
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
print_info "Step 3/6: Staging changes..."
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

git add .
print_success "All changes staged!"
echo ""

# Step 4: Get commit message
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
print_info "Step 4/6: Creating commit..."
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check if message provided as argument
if [ -n "$1" ]; then
    COMMIT_MSG="$1"
    print_info "Using provided message: ${YELLOW}$COMMIT_MSG${NC}"
else
    # Interactive mode
    echo -e "${YELLOW}Enter commit message:${NC}"
    read -p "> " COMMIT_MSG
    
    if [ -z "$COMMIT_MSG" ]; then
        print_error "Commit message cannot be empty!"
        exit 1
    fi
fi

git commit -m "$COMMIT_MSG"
print_success "Commit created: $COMMIT_MSG"
echo ""

# Step 5: Push to GitHub
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
print_info "Step 5/6: Pushing to GitHub..."
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if git push origin main; then
    print_success "Successfully pushed to GitHub!"
else
    print_error "Push failed! This should not happen after sync."
    print_warning "Try running: git pull --rebase && git push"
    exit 1
fi
echo ""

# Step 6: Deployment triggered
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
print_info "Step 6/6: Vercel CI/CD Triggered!"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

print_success "Deployment initiated! 🚀"
echo ""
print_info "Monitor deployment at:"
echo -e "${BLUE}  https://vercel.com/pubudu-tharanagas-projects/pubudu-portfolio${NC}"
echo ""
print_info "Latest commit:"
git log -1 --oneline
echo ""

echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          ✅ DEPLOYMENT SUCCESS!        ║${NC}"
echo -e "${GREEN}║    Your site will update in 1-2 min    ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
