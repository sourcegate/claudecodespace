# Talk to Landing

Transform any YouTube video into a premium, commercial-ready landing page.

## Features

- **YouTube Transcript Extraction** - Automatically fetches video captions
- **Manual Transcript Input** - For videos without captions, paste your own transcript
- **AI Framework Extraction** - Uses Claude to analyze and extract:
  - Core philosophy and powerful quotes
  - Signature question that reframes everything
  - Origin stories and transformation arc
  - Custom acronym framework
  - Three-layer positioning reframe
  - Service tiers, book concept, and workshop modules
- **Premium Landing Page** - Well-crafted with editorial design
- **One-Click Download** - Export as standalone HTML
- **User Authentication** - Clerk-powered Google OAuth
- **Usage Limits** - 3 free generations per user
- **Lead Tracking** - Log all generations to Google Sheets (optional)

## Tech Stack

- Next.js 16 (App Router)
- Tailwind CSS
- Framer Motion
- Claude API (Anthropic)
- Clerk Authentication
- YouTube Transcript API

## Environment Variables

Create a `.env.local` file with the following:

```bash
# Required - Claude AI for content generation
ANTHROPIC_API_KEY=your_anthropic_key

# Required - Clerk authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Optional - Track generations in Google Sheets
GOOGLE_SHEETS_WEBHOOK_URL=your_google_apps_script_url
```

### Getting API Keys

| Service | URL | Purpose |
|---------|-----|---------|
| Anthropic | https://console.anthropic.com/ | Claude AI for framework extraction |
| Clerk | https://dashboard.clerk.com/ | User authentication |

For Google Sheets tracking, see [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md).

## Setting Up Clerk for Production

### Step 1: Create Production Instance

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Click your app name dropdown (top-left corner)
3. Click **"Create production instance"**
4. Name it (e.g., "Talk to Landing Production")

### Step 2: Set Up Custom Domain in Clerk

1. In your **Production** instance, go to **Domains** in the left sidebar
2. Click **"Add domain"**
3. Enter your subdomain: `talktolanding.yourdomain.com`
4. Clerk will show you DNS records to add - add them to your DNS provider
5. Wait for verification (can take a few minutes)

### Step 3: Set Up Google OAuth Credentials

You need your own Google OAuth credentials for production. Here's how:

#### 3a. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown (top-left, next to "Google Cloud")
3. Click **"New Project"**
4. Name it (e.g., "Talk to Landing") and click **Create**
5. Make sure your new project is selected

#### 3b. Configure OAuth Consent Screen

1. In the left sidebar, go to **APIs & Services** → **OAuth consent screen**
2. Select **External** and click **Create**
3. Fill in the required fields:
   - **App name**: Talk to Landing
   - **User support email**: your email
   - **Developer contact email**: your email
4. Click **Save and Continue**
5. On Scopes page, click **Add or Remove Scopes**
6. Add these scopes:
   - `openid`
   - `email`
   - `profile`
7. Click **Update**, then **Save and Continue**
8. On Test Users page, click **Save and Continue**
9. Review and click **Back to Dashboard**

#### 3c. Create OAuth 2.0 Credentials

1. In the left sidebar, go to **APIs & Services** → **Credentials**
2. Click **"+ Create Credentials"** → **"OAuth client ID"**
3. Select **Web application**
4. Name it (e.g., "Talk to Landing Web")
5. Under **Authorized redirect URIs**, click **"+ Add URI"**
6. Add: `https://clerk.yourdomain.com/v1/oauth_callback`
   - Replace `yourdomain.com` with your actual domain
   - Example: `https://clerk.talktolanding.theresonance.studio/v1/oauth_callback`
7. Click **Create**
8. Copy the **Client ID** and **Client Secret** (save these!)

#### 3d. Add Credentials to Clerk

1. In Clerk Dashboard (Production instance), go to **User & Authentication** → **Social Connections**
2. Click on **Google**
3. Toggle **"Use custom credentials"** ON
4. Paste your **Client ID** and **Client Secret**
5. Click **Save**

### Step 4: Update Vercel Environment Variables

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project → **Settings** → **Environment Variables**
3. Update these with your **Production** Clerk keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` → starts with `pk_live_`
   - `CLERK_SECRET_KEY` → starts with `sk_live_`
4. Redeploy your app

### Step 5: Publish Google OAuth App (Optional)

While in "Testing" mode, only you can sign in. To allow anyone:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Go to **APIs & Services** → **OAuth consent screen**
3. Click **"Publish App"**
4. Confirm the warning

> **Note**: For simple apps, you don't need Google verification. Just publish and it works.

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your API keys (see above)
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Usage

1. Sign in with Google
2. Paste any YouTube URL
3. Watch as AI extracts the speaker's framework
4. Preview your generated landing page
5. Download as HTML for deployment

## How It Works

1. **Caption Check** - First tries to fetch existing YouTube captions
2. **Manual Fallback** - If no captions, prompts user to paste transcript manually
3. **AI Analysis** - Claude analyzes transcript and extracts frameworks
4. **Page Generation** - Generates a well-crafted landing page

## Design System

- **Colors**: Deep navy (#1a1a2e) + warm gold (#c9a227) on cream (#FAFAF8)
- **Typography**: Source Serif 4 (body) + DM Sans (headings)
- **Style**: Editorial, premium consulting aesthetic

## Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sourcegate/claudecodespace)

## Credits

Built by [Thought Owner](https://thoughtowner.com/)
