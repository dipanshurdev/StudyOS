# StudyOS – AI-Powered Study Platform

A modern SaaS platform that helps students study faster using AI. Create summaries, explanations, flashcards, mind maps, and practice questions from your notes. Built with Next.js, Supabase, and Groq/HuggingFace AI.

---

## Features

### AI Study Tools
- **Summarize** – Turn long notes into short bullet-point summaries
- **Explain** – Get plain-language explanations with examples
- **Practice Questions** – Generate MCQs and short-answer questions
- **Flashcards** – Auto-generate flashcards with spaced repetition (SM-2)
- **Mind Maps** – AI-generated mind map structure from your content
- **AI Tutor Chat** – Ask questions and get answers in context

### Study Experience
- **Documents** – Create and manage study docs with auto-save
- **PDF Import** – Upload PDFs and extract text into a document
- **Study Streaks** – Track daily study days and longest streak
- **Analytics** – View usage, activity, and action breakdown

### Platform
- **Authentication** – Email/password and Google OAuth via Supabase Auth
- **Plans** – Free (10 AI actions/day), Pro (100/day), Enterprise
- **Deploy-ready** – Redirects and env handling for Vercel production

---

## Tech Stack

| Layer      | Technology |
|-----------|------------|
| Frontend  | Next.js 16, React 19, TypeScript |
| Styling   | Tailwind CSS v4, shadcn/ui |
| Database  | Supabase (PostgreSQL) |
| Auth      | Supabase Auth (email + Google OAuth) |
| AI        | Groq (llama-3.1-8b-instant), HuggingFace (Mistral-7B) fallback |
| Hosting   | Vercel |

---

<!-- ## Getting Started

### Prerequisites
- Node.js 18+
- Supabase project
- Groq API key and (optional) HuggingFace token for AI

### Environment Variables

Create `.env.local` in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Auth redirect (optional; Vercel sets VERCEL_URL automatically)
NEXTAUTH_URL=http://localhost:3000

# AI
NEXT_PUBLIC_GROQ_API_KEY=your-groq-api-key
NEXT_PUBLIC_HUGGINGFACE_API_KEY=your-huggingface-token
```

For production on Vercel, add the same variables in the Vercel project. Optionally set `NEXT_PUBLIC_APP_URL` to your production URL (e.g. `https://studyos-ai.vercel.app`).

### Database

Run the Supabase migrations in order (Supabase Dashboard → SQL Editor):

1. `supabase/migrations/20240101_init.sql` – users, documents, ai_requests
2. `supabase/migrations/20240102_saas_features.sql` – flashcards, mind_maps, study_plans, document_shares, ai_conversations, etc.

### Install and Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm start
```

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/ai` | AI actions: summarize, explain, questions, flashcards, mindmap |
| POST   | `/api/chat` | AI tutor chat (message, conversationId, documentId) |
| GET/POST | `/api/documents` | List or create documents |
| GET/PATCH/DELETE | `/api/documents/[docId]` | Get, update, or delete a document |
| GET/POST | `/api/flashcards` | List or create flashcards |
| PATCH  | `/api/flashcards/[id]` | Update flashcard review (quality 0–5 for SM-2) |
| GET    | `/api/usage` | Current user usage and limit |

---

## Project Structure

```
app/
├── api/              # API routes (ai, chat, documents, flashcards, usage)
├── auth/             # callback, signout
├── dashboard/        # dashboard home, [docId] editor, analytics, settings, new
├── login/
├── pricing/
├── page.tsx          # Landing
└── layout.tsx

components/
├── dashboard/        # modern-sidebar, editor, create-document-dialog, etc.
└── ui/               # shadcn components

lib/
├── ai.ts             # Groq + HuggingFace AI
├── api-limits.ts     # Rate limits and usage
├── app-url.ts        # Deploy-aware base URL for redirects
├── db.ts             # Supabase CRUD and flashcards/streaks
├── models.ts         # TypeScript types
└── supabase/         # server, client, middleware clients
```

---

## Deployment (Vercel)

1. Connect the repo to Vercel and deploy.
2. Add all required env vars in Vercel (Supabase, Groq, HuggingFace, optional `NEXT_PUBLIC_APP_URL`).
3. In **Supabase** → Authentication → URL Configuration:
   - **Site URL**: your production URL (e.g. `https://studyos-ai.vercel.app`)
   - **Redirect URLs**: add `https://your-domain.com/**` and `https://your-domain.com/auth/callback`
4. Redeploy after changing env vars.

See `DEPLOYMENT.md` for step-by-step Supabase and Vercel setup.

--- -->

## Support

For issues, check the docs in the repo (`COMPLETE_PROJECT_DOCUMENTATION.md`, `DEPLOYMENT.md`) and your Supabase/Vercel logs.

---

Study smarter, not harder.
