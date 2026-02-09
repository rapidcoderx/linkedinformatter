# Deployment Guide — LinkedIn Text Formatter

This guide provides detailed instructions for deploying the LinkedIn Text Formatter to Vercel.

---

## Prerequisites

Before deploying, ensure you have:

1. **Node.js** (v18 or higher) installed locally
2. **Git** installed and project tracked in a Git repository
3. **Vercel account** — Sign up at [vercel.com](https://vercel.com) (free tier available)
4. **Vercel CLI** (optional, for CLI deployment) — Install with `npm i -g vercel`

---

## Deployment Options

You can deploy this project to Vercel using either:
- **Option A**: Vercel Dashboard (Web UI) — Easiest for first-time deployments
- **Option B**: Vercel CLI — Best for developers who prefer command-line workflows

---

## Option A: Deploy via Vercel Dashboard (Recommended)

### Step 1: Prepare Your Repository

1. **Build CSS locally** (to verify build works):
   ```bash
   npm install
   npm run build:css
   ```

2. **Commit all changes**:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   ```

3. **Push to GitHub/GitLab/Bitbucket**:
   ```bash
   git push origin main
   ```
   *(Replace `main` with your branch name if different)*

### Step 2: Import Project to Vercel

1. **Go to Vercel Dashboard**:
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click **"Add New..."** → **"Project"**

2. **Import Git Repository**:
   - Connect your Git provider (GitHub, GitLab, or Bitbucket) if not already connected
   - Select your `linkedinformatter` repository
   - Click **"Import"**

3. **Configure Project**:
   - **Framework Preset**: Select **"Other"** (or leave as auto-detected)
   - **Root Directory**: Leave as `./` (default)
   - **Build Command**: `npm run build:css`
   - **Output Directory**: Leave empty (Vercel will use the root)
   - **Install Command**: `npm install`

4. **Environment Variables** (Optional):
   - No environment variables are required for this project
   - The app uses `process.env.PORT` which Vercel provides automatically

5. **Deploy**:
   - Click **"Deploy"**
   - Wait 1-2 minutes for the build to complete

### Step 3: Verify Deployment

1. Once deployment completes, Vercel will show:
   - ✅ **Production URL**: `https://your-project-name.vercel.app`
   - Preview of your site

2. **Test the application**:
   - Visit the Production URL
   - Try formatting text with the toolbar
   - Test slash commands (type `/bold` in the editor)
   - Test markdown import
   - Test copy and export functionality
   - Verify API endpoint: `https://your-project-name.vercel.app/api/health`

3. **Check deployment logs**:
   - Click on the deployment in the Vercel dashboard
   - View **"Build Logs"** to ensure CSS built correctly
   - View **"Runtime Logs"** to see server output

---

## Option B: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Build CSS Locally

```bash
npm install
npm run build:css
```

### Step 3: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate (email verification link will be sent).

### Step 4: Deploy

#### First Deployment (Development)

```bash
vercel
```

You'll be prompted with:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your Vercel account
- **Link to existing project?** → No (for first deployment)
- **What's your project's name?** → `linkedin-formatter` (or your preferred name)
- **In which directory is your code located?** → `./` (press Enter)

Vercel will:
1. Detect the project settings
2. Upload your files
3. Build CSS (`npm run build:css`)
4. Deploy to a preview URL

#### Deploy to Production

```bash
vercel --prod
```

This deploys to your production URL: `https://your-project-name.vercel.app`

### Step 5: Verify Deployment

```bash
# Open the production URL in your browser
vercel --prod --open
```

Test all features as described in Step 3 of Option A.

---

## Configuration Files Explained

### `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server.js"
    },
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

**What it does**:
- `version: 2`: Uses Vercel Build API v2
- `builds`: Tells Vercel to build `server.js` as a Node.js serverless function
- `routes`: Routes all `/api/*` and other requests to `server.js`
- `env`: Sets `NODE_ENV=production` for the deployment
- Vercel auto-detects and runs the `build` script from `package.json` during deployment

**Note**: You may see a warning about "builds existing in your configuration file" - this is harmless and just means Dashboard Build Settings are overridden by this file, which is intentional.

### `.vercelignore`

```
node_modules
src
.git
.gitignore
*.md
!README.md
.DS_Store
```

**What it does**:
- Excludes unnecessary files from deployment (source CSS, markdown docs, etc.)
- Keeps deployment bundle small and fast
- Only deploys production-ready files

---

## Custom Domain Setup (Optional)

### Step 1: Add Domain in Vercel

1. Go to your project in Vercel Dashboard
2. Click **"Settings"** → **"Domains"**
3. Click **"Add"**
4. Enter your domain (e.g., `linkedinformatter.com`)

### Step 2: Configure DNS

Vercel will provide DNS records. Add one of these to your DNS provider:

**Option 1: A Record** (Recommended)
```
Type: A
Name: @ (or subdomain)
Value: 76.76.19.19
```

**Option 2: CNAME**
```
Type: CNAME
Name: @ (or subdomain)
Value: cname.vercel-dns.com
```

### Step 3: Verify

Wait 10-60 minutes for DNS propagation. Vercel will automatically issue an SSL certificate.

---

## Environment Variables (If Needed)

This project doesn't require environment variables by default. If you need to add any:

### Via Vercel Dashboard

1. Go to **Settings** → **Environment Variables**
2. Add key-value pairs
3. Select environments (Production, Preview, Development)
4. Click **"Save"**
5. Redeploy the project for changes to take effect

### Via Vercel CLI

```bash
vercel env add YOUR_VARIABLE_NAME
```

---

## Continuous Deployment

Once your project is connected to a Git repository in Vercel:

1. **Automatic Deployments**:
   - Every `git push` to your main branch triggers a production deployment
   - Every pull request creates a preview deployment with a unique URL

2. **Preview Deployments**:
   - Each PR gets a preview URL like `https://linkedinformatter-git-feature-branch.vercel.app`
   - Perfect for testing changes before merging

3. **Rollback**:
   - Go to **Deployments** tab in Vercel Dashboard
   - Click **"⋮"** on any previous deployment → **"Promote to Production"**

---

## Monitoring & Logs

### View Logs

1. **Vercel Dashboard**:
   - Go to your project
   - Click on a deployment
   - View **"Runtime Logs"** and **"Build Logs"**

2. **Vercel CLI**:
   ```bash
   vercel logs <deployment-url>
   ```

### Performance Monitoring

- Vercel provides **Analytics** (requires Pro plan) for:
  - Page views
  - Real User Monitoring (Web Vitals)
  - API route performance

---

## Troubleshooting

### Build Fails: "CSS not found" or "could not determine executable to run"

**Problem**: Tailwind CSS build failed or was skipped.

**Solution**:
1. Verify `build:css` script in `package.json`
2. Check Build Logs in Vercel Dashboard
3. Ensure `src/css/input.css` exists in your repository
4. **IMPORTANT**: Make sure `tailwindcss` is listed in `dependencies` (not `devDependencies`)
   - Vercel needs build tools in `dependencies` to access them during deployment
5. If you moved packages, commit and redeploy: `git add . && git commit -m "Fix deps" && git push`

### Warning: "Due to builds existing in your configuration file..."

**Problem**: Vercel shows warning about unused Build Settings due to `builds` property in `vercel.json`.

**Solution**:
- ⚠️ **This warning is harmless** — You can safely ignore it
- It simply means the Build Settings in your Vercel Dashboard are overridden by `vercel.json`
- This is intentional and correct for this project
- Your deployment will still succeed with this warning present
- The warning does not affect functionality or performance

### 500 Error: FUNCTION_INVOCATION_FAILED

**Problem**: Serverless function crashes with "500: INTERNAL_SERVER_ERROR" and "FUNCTION_INVOCATION_FAILED".

**Solution**:
- ✅ **Already fixed** — The server.js now conditionally runs `app.listen()` only for local dev
- **Root cause**: Calling `app.listen()` in serverless environments causes crashes
- Vercel handles server startup automatically; you only need to export the Express app
- If you see this error, ensure your server.js has:
  ```javascript
  // Only start server if run directly (not imported by Vercel)
  if (require.main === module) {
    app.listen(PORT, () => { /* ... */ });
  }
  module.exports = app;
  ```
- Check Runtime Logs in Vercel Dashboard for specific error details
- Verify all dependencies are installed correctly

### 404 on All Routes

**Problem**: Routes not configured correctly.

**Solution**:
- Verify `vercel.json` exists and has correct routing rules
- Ensure `server.js` is in the project root
- Redeploy after fixing configuration

### API Routes Return 500 Error

**Problem**: Server-side error in Express routes.

**Solution**:
1. Check Runtime Logs in Vercel Dashboard
2. Test API locally: `npm start` → `curl http://localhost:3000/api/health`
3. Verify `marked` package is installed in `dependencies` (not `devDependencies`)

### Static Files Not Loading

**Problem**: CSS/JS files return 404.

**Solution**:
- Ensure `public/` directory is in your repository
- Verify `public/css/styles.css` exists (built by Tailwind)
- Check that `.vercelignore` doesn't exclude `public/`

### Environment Variable Not Working

**Problem**: Added env var but app can't access it.

**Solution**:
1. Redeploy after adding environment variables
2. Check variable name (case-sensitive)
3. Verify it's enabled for Production environment

---

## Performance Optimization

### Enable Compression

✅ **Already configured** — `compression` middleware is active in `server.js`.

### Enable Caching

Add cache headers in `server.js`:

```javascript
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d', // Cache static files for 1 day
  immutable: true
}));
```

### Optimize Images

If you add images later:
1. Use WebP format
2. Enable Vercel Image Optimization
3. Add `next/image` equivalent for static sites

---

## Security Best Practices

### Current Security (Already Implemented)

✅ **Helmet.js** — Security headers configured  
✅ **CSP** — Content Security Policy active  
✅ **Compression** — Response compression enabled  
✅ **Input validation** — API validates markdown input  

### Additional Recommendations

1. **Rate Limiting** (optional):
   ```bash
   npm install express-rate-limit
   ```

2. **CORS** (if accessing from other domains):
   ```bash
   npm install cors
   ```

3. **Update Dependencies Regularly**:
   ```bash
   npm audit fix
   npm update
   ```

---

## Cost Considerations

### Vercel Free Tier Limits

- **Bandwidth**: 100 GB/month
- **Serverless Function Execution**: 100 GB-hours/month
- **Deployments**: Unlimited
- **Team Members**: 1 (Hobby plan)

**This project's usage**: Very low — should stay within free tier unless you get significant traffic.

### When to Upgrade

Consider Vercel Pro ($20/month) if:
- Traffic exceeds 100 GB/month
- You need analytics
- You need team collaboration

---

## Deployment Checklist

Before deploying, verify:

- [ ] CSS build completes successfully (`npm run build:css`)
- [ ] All files committed to Git
- [ ] `vercel.json` exists with correct configuration
- [ ] `.vercelignore` excludes unnecessary files
- [ ] `package.json` has correct `build:css` script
- [ ] Dependencies installed (`node_modules/` should NOT be in Git)
- [ ] Tested locally: `npm start` → `http://localhost:3000`
- [ ] API endpoint tested: `/api/health` returns `{"status":"ok"}`

After deploying, verify:

- [ ] Production URL loads correctly
- [ ] Toolbar formatting works
- [ ] Slash commands work
- [ ] Preview card updates in real-time
- [ ] Copy, export, and markdown import work
- [ ] Emoji picker opens and inserts emojis
- [ ] Device previews (phone/tablet) work
- [ ] Mobile responsive layout displays correctly

---

## Support & Resources

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Project Repository**: Check README.md for project-specific help

---

## Quick Reference: Common Commands

```bash
# Install dependencies
npm install

# Build CSS
npm run build:css

# Start development server
npm run dev

# Deploy to Vercel (CLI)
vercel                 # Deploy to preview
vercel --prod          # Deploy to production

# View logs (CLI)
vercel logs <url>

# List deployments
vercel ls

# Open production URL
vercel --prod --open
```

---

**🚀 Happy Deploying!**

Your LinkedIn Text Formatter will be live in minutes. If you encounter issues, check the Troubleshooting section or Vercel's documentation.

