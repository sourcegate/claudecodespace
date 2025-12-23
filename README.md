# Talk to Landing

Transform any YouTube video into a premium, commercial-ready landing page.

## Features

- **YouTube Transcript Extraction** - Automatically fetches video captions
- **AI Framework Extraction** - Uses Claude to analyze and extract:
  - Core philosophy and powerful quotes
  - Signature question that reframes everything
  - Origin stories and transformation arc
  - Custom acronym framework
  - Three-layer positioning reframe
  - Service tiers, book concept, and workshop modules
- **Premium Landing Page** - StoryBrand-structured with editorial design
- **One-Click Download** - Export as standalone HTML

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Framer Motion
- Claude API (Anthropic)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Usage

1. Paste any YouTube URL with captions enabled
2. Watch as AI extracts the speaker's framework
3. Preview your generated landing page
4. Download as HTML for deployment

## Design System

- **Colors**: Deep navy (#1a1a2e) + warm gold (#c9a227) on cream (#FAFAF8)
- **Typography**: Source Serif 4 (body) + DM Sans (headings)
- **Style**: Editorial, premium consulting aesthetic

## Deploy

Deploy to Vercel with one click. Make sure to add `ANTHROPIC_API_KEY` to your environment variables.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sourcegate/claudecodespace)
