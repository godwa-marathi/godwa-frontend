# Deployment Guide: GitHub + Vercel

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `godwa-frontend`
3. Description: "Premium Marathi Poetry Platform - Frontend"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

## Step 2: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
git remote add origin https://github.com/Vedangi05/godwa-frontend.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Step 3: Deploy to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `godwa-frontend` repository
4. Configure project:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

5. **Add Environment Variable:**
   - Key: `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - Value: `967270482740-uq7i45o746p7o4o6qmrh46tpubm5a2d4.apps.googleusercontent.com`

6. Click "Deploy"

## Step 4: Update Google OAuth (After Deployment)

Once deployed, Vercel will give you a URL like: `https://godwa-frontend.vercel.app`

1. Go to Google Cloud Console: https://console.cloud.google.com/apis/credentials?project=stable-balancer-281614
2. Click on "Godwa Backend" OAuth client
3. Under "Authorized JavaScript origins", click "Add URI"
4. Add your Vercel URL: `https://godwa-frontend.vercel.app`
5. Click "Save"

## Verification

Test these on your deployed site:
- [ ] Homepage loads correctly
- [ ] Mobile menu works
- [ ] Word tooltips work on tap
- [ ] Google Sign-In works
- [ ] Navigation to all pages works
- [ ] API calls to backend succeed
