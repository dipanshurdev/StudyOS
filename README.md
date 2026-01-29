# StudyOS - AI-Powered Study Platform

A modern SaaS platform that helps students study faster using AI. Built with Next.js, Supabase, and free AI APIs.

## Features

- **AI-Powered Study Tools**
  - Summarize: Transform long notes into concise summaries
  - Explain: Break down complex concepts in simple language
  - Practice: Generate exam questions and MCQs

- **Smart Authentication**
  - Google OAuth sign-in
  - Email magic link authentication
  - Session-based authentication with NextAuth.js

- **Study Dashboard**
  - Create and manage unlimited documents
  - Auto-save functionality
  - Real-time usage tracking
  - Clean, distraction-free editor

- **Smart Rate Limiting**
  - 5 free AI actions per day
  - Daily reset (UTC-based)
  - Server-side enforcement
  - Future-ready for paid tiers

- **Zero Cost**
  - Free tier with no credit card required
  - Uses free APIs: Groq (primary), HuggingFace (fallback)
  - Supabase Atlas (free tier)
  - Vercel hosting (free tier compatible)

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Database**: Supabase Atlas (free tier)
- **Authentication**: NextAuth.js with Google OAuth & Email
- **AI**: Groq API (llama-3.1-8b) + HuggingFace fallback
- **Hosting**: Optimized for Vercel free tier

<!-- ## Getting Started

### 1. Prerequisites

- Node.js 18+ and npm
- Supabase Atlas account (free tier)
- Google OAuth credentials
- Groq API key
- HuggingFace API token

### 2. Environment Variables

Create a `.env.local` file:

```
# Supabase
Supabase_URI=Supabase+srv://user:password@cluster.Supabase.net/studybuddy

# NextAuth (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your-google-client-secret

# AI APIs (keep these public for client-side usage)
NEXT_PUBLIC_GROQ_API_KEY=your-groq-api-key
NEXT_PUBLIC_HUGGINGFACE_API_KEY=your-huggingface-token

# Email (Gmail SMTP)
NEXT_PUBLIC_SMTP_HOST=smtp.gmail.com
NEXT_PUBLIC_SMTP_PORT=587
NEXT_PUBLIC_SMTP_USER=your-email@gmail.com
NEXT_PUBLIC_SMTP_PASSWORD=your-app-password
NEXT_PUBLIC_EMAIL_FROM=StudyOS <your-email@gmail.com>
```

### 3. Setup Steps

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Get API Keys

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add `http://localhost:3000/api/auth/callback/google` as redirect URI

### Groq API
1. Visit [Groq Console](https://console.groq.com)
2. Sign up free
3. Generate API key from settings
4. Uses `llama-3.1-8b-instant` model (free)

### HuggingFace Token
1. Go to [HuggingFace](https://huggingface.co)
2. Create account
3. Generate token in Settings → Access Tokens
4. Uses `Mistral-7B-Instruct` for fallback

### Supabase Atlas
1. Create free account at [Supabase Atlas](https://www.Supabase.com/cloud/atlas)
2. Create a free cluster
3. Add IP whitelist: 0.0.0.0/0 (for development)
4. Get connection string with username/password

### Gmail SMTP (for email auth)
1. Enable 2-factor authentication on Gmail
2. Generate App Password in Account Settings
3. Use the 16-character password in `.env.local`

## Database Schema

### Users
- Auto-managed by NextAuth + Supabase Adapter
- Fields: name, email, emailVerified, image, provider

### StudyDocuments
- `userId`: Reference to user
- `title`: Document title
- `content`: Study material content
- `aiResults`: Array of AI action results
- `createdAt` / `updatedAt`: Timestamps

### UsageLimits
- `userId`: Reference to user
- `dailyAiCount`: Number of AI actions used today
- `lastResetAt`: Last reset timestamp
- `planType`: "free" or "pro" (for future)

## API Endpoints

### AI Actions
```
POST /api/ai
Body: { action: "summarize|explain|questions", content: string }
Returns: { result: string, remainingActions: number }
```

### Documents
```
GET /api/documents - List user's documents
POST /api/documents - Create new document
PATCH /api/documents/[id] - Update document
DELETE /api/documents/[id] - Delete document
```

### Usage
```
GET /api/usage - Get daily usage stats
Returns: { usage: number, limit: 5, remaining: number, lastReset: Date }
```

## File Structure

```
app/
├── api/                    # API routes
│   ├── ai/                # AI generation endpoint
│   ├── documents/         # Document CRUD operations
│   ├── usage/             # Usage tracking
│   └── auth/              # NextAuth routes
├── dashboard/             # Protected dashboard pages
│   ├── [docId]/          # Document editor
│   ├── layout.tsx         # Dashboard layout with sidebar
│   └── page.tsx           # Documents list
├── login/                 # Authentication pages
├── page.tsx               # Landing page
└── layout.tsx             # Root layout

components/
├── dashboard/             # Dashboard-specific components
│   ├── editor.tsx         # Document editor
│   ├── sidebar.tsx        # Navigation sidebar
│   ├── header.tsx         # Usage tracking header
│   └── ...                # Other dashboard components
└── ui/                    # shadcn/ui components

lib/
├── db.ts                  # Supabase connection
├── models.ts              # Database operations
├── ai.ts                  # AI service (Groq + HuggingFace)
└── utils.ts               # Utilities

hooks/
├── use-usage-limit.ts     # Usage tracking hook
└── use-toast.ts           # Toast notifications
```

## Future Enhancements

### Paid Tier Features
- Unlimited AI actions
- Advanced explanations
- Interview prep questions
- Export to PDF
- Custom study plans
- Analytics dashboard

### Implementation Ready
- Database schema supports `planType` field
- Usage limit checking already in place
- Easy to add Stripe integration
- Rate limiting can be upgraded to per-tier

## Cost Analysis

**Monthly Cost at Scale:**
- Supabase Atlas: Free (< 512MB storage)
- Groq API: Free tier (up to 30 requests/min)
- HuggingFace: Free inference API
- Gmail SMTP: Free
- Vercel: Free tier compatible
- **Total: $0/month** ✨

To monetize:
- Add Stripe integration ($29/month Pro tier)
- Increase limits for paid users
- Add team/organization features

## Deployment

### Vercel (Recommended)
```bash
# Connect repo to Vercel
vercel

# Add environment variables in Vercel dashboard
# Deploy automatically on push
```

### Self-Hosted
```bash
npm run build
npm start
``` -->

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check logs in development mode

## License

MIT - Build upon this freely

---

Built with ❤️ for students. Study smarter, not harder.
