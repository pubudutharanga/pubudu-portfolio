---
description: How to deploy updates to the Vercel website
---

# Deploying Updates to Vercel

This guide covers all methods to update your live website.

---

## Method 1: Quick Manual Deploy (Recommended for Quick Updates)

After making changes to your code, run this single command:

```bash
// turbo
vercel deploy --prod
```

This will:
- Build your project
- Upload changes to Vercel
- Deploy to production immediately

---

## Method 2: Git-based Automatic Deployment (Best for Teams/CI)

### One-time Setup (if not already done):

1. **Link your GitHub repo to Vercel:**
   - Go to https://vercel.com/dashboard
   - Click your project (project1)
   - Go to **Settings** → **Git**
   - Click **Connect Git Repository**
   - Select your GitHub repo: `pubudutharanga/pubudu-portfolio`

2. **Configure build settings** (should auto-detect, but verify):
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`

### After Setup - Deploying Updates:

Simply push to GitHub:

```bash
# Stage all changes
git add .

# Commit with a message
git commit -m "Your update description"

# Push to main branch
git push origin main
```

Vercel will automatically:
- Detect the push
- Build your project
- Deploy to production

---

## Method 3: Preview Deployments (Testing Before Production)

Deploy without `--prod` flag to create a preview URL:

```bash
vercel deploy
```

This creates a unique preview URL for testing. When satisfied:

```bash
vercel deploy --prod
```

---

## Common Update Scenarios

### 📝 Content Updates (Text, Images, Blog Posts)

1. Edit the relevant files in `src/`
2. Run: `vercel deploy --prod`

### 🎨 Style Changes (CSS, Tailwind)

1. Edit files in `src/styles/` or component files
2. Run: `vercel deploy --prod`

### 📦 Adding New Dependencies

1. Install the package: `npm install package-name`
2. Update your code to use it
3. Run: `vercel deploy --prod`

### 🔧 Configuration Changes

1. Edit config files (`vite.config.js`, `tailwind.config.js`, etc.)
2. Run: `vercel deploy --prod`

---

## Useful Vercel Commands

| Command | Description |
|---------|-------------|
| `vercel` | Deploy to preview |
| `vercel --prod` | Deploy to production |
| `vercel logs` | View deployment logs |
| `vercel ls` | List all deployments |
| `vercel rollback` | Rollback to previous deployment |
| `vercel env pull` | Pull environment variables locally |

---

## Quick Reference: Complete Update Flow

```bash
# 1. Make your code changes in VS Code

# 2. Test locally (optional but recommended)
npm run dev

# 3. Deploy to production
vercel deploy --prod

# 4. (Optional) Also push to GitHub for backup
git add .
git commit -m "Update description"
git push origin main
```

---

## Troubleshooting

### Build Failed
- Check the error in terminal or Vercel dashboard
- Common issues: missing dependencies, TypeScript errors, import errors

### Changes Not Showing
- Hard refresh browser: `Ctrl + Shift + R`
- Clear browser cache
- Wait 1-2 minutes for CDN propagation

### Need to Rollback
```bash
vercel rollback
```

Or go to Vercel Dashboard → Deployments → Click on previous deployment → Promote to Production
