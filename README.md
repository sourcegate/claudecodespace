# Talk to Landing

Transform any YouTube video into a premium, commercial-ready landing page.

## Features

- **YouTube Transcript Extraction** - Automatically fetches video captions
- **Whisper Transcription** - For videos without captions, uses OpenAI Whisper to transcribe audio
- **AI Framework Extraction** - Uses Claude to analyze and extract:
  - Core philosophy and powerful quotes
  - Signature question that reframes everything
  - Origin stories and transformation arc
  - Custom acronym framework
  - Three-layer positioning reframe
  - Service tiers, book concept, and workshop modules
- **Premium Landing Page** - StoryBrand-structured with editorial design
- **One-Click Download** - Export as standalone HTML
- **User Authentication** - Clerk-powered Google OAuth
- **Usage Limits** - 3 free generations per user

## Tech Stack

- Next.js 16 (App Router)
- Tailwind CSS
- Framer Motion
- Claude API (Anthropic)
- OpenAI Whisper API
- Clerk Authentication
- RapidAPI (YouTube audio extraction)

## Environment Variables

Create a `.env.local` file with the following:

```bash
# Required - Claude AI for content generation
ANTHROPIC_API_KEY=your_anthropic_key

# Required - Clerk authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Optional - For transcribing videos without captions
OPENAI_API_KEY=your_openai_key
RAPIDAPI_KEY=your_rapidapi_key
```

### Getting API Keys

| Service | URL | Purpose |
|---------|-----|---------|
| Anthropic | https://console.anthropic.com/ | Claude AI for framework extraction |
| Clerk | https://dashboard.clerk.com/ | User authentication |
| OpenAI | https://platform.openai.com/ | Whisper transcription |
| RapidAPI | https://rapidapi.com/ytjar/api/youtube-mp36 | YouTube audio extraction |

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
2. **Audio Fallback** - If no captions, extracts audio via RapidAPI
3. **Whisper Transcription** - Transcribes audio using OpenAI Whisper
4. **AI Analysis** - Claude analyzes transcript and extracts frameworks
5. **Page Generation** - Generates a premium StoryBrand-structured landing page

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
