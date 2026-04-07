# StudyOS - Complete Project Documentation

> **A comprehensive guide to understanding every aspect of the StudyOS AI-powered study platform**

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Tech Stack](#architecture--tech-stack)
3. [Database Schema](#database-schema)
4. [Authentication System](#authentication-system)
5. [API Endpoints](#api-endpoints)
6. [AI Integration](#ai-integration)
7. [Frontend Architecture](#frontend-architecture)
8. [Features Breakdown](#features-breakdown)
9. [Code Flow & Execution](#code-flow--execution)
10. [Environment Variables](#environment-variables)
11. [Deployment](#deployment)
12. [File Structure](#file-structure)

---

## 🎯 Project Overview

**StudyOS** is a modern SaaS platform that transforms how students study by leveraging AI to create summaries, explanations, flashcards, mind maps, and practice questions from study materials.

### Core Value Proposition
- **AI-Powered Learning**: Transform study materials into multiple learning formats
- **Spaced Repetition**: SM-2 algorithm for optimal flashcard review scheduling
- **Gamification**: Study streaks to encourage daily learning
- **Multi-Format Support**: PDF import, text input, markdown support
- **Real-time Collaboration**: Document sharing and AI tutor chat

### Target Users
- Students preparing for exams
- Learners who want to optimize study time
- Educational institutions (Enterprise tier)
- Study groups and teams

---

## 🏗️ Architecture & Tech Stack

### Frontend Stack
```
Next.js 16.0.10 (App Router)
├── React 19.2.0
├── TypeScript 5
├── Tailwind CSS 4.1.9
├── shadcn/ui (Radix UI components)
├── React Markdown (for AI output rendering)
├── PDF.js (for PDF text extraction)
└── Lucide React (icons)
```

### Backend Stack
```
Next.js API Routes (Server Actions)
├── Supabase (Database + Auth)
│   ├── PostgreSQL (via Supabase)
│   ├── Row Level Security (RLS)
│   └── Real-time subscriptions (ready)
├── Server Components (RSC)
└── Edge Functions (ready for deployment)
```

### AI Services
```
Primary: Groq API
├── Model: llama-3.1-8b-instant
├── Fast inference
└── Free tier available

Fallback: HuggingFace API
├── Model: Mistral-7B-Instruct-v0.1
└── Backup when Groq fails
```

### Key Libraries
- **@supabase/ssr**: Server-side Supabase client
- **@supabase/supabase-js**: Client-side Supabase
- **date-fns**: Date formatting and manipulation
- **use-debounce**: Auto-save debouncing
- **sonner**: Toast notifications
- **recharts**: Analytics charts
- **zod**: Schema validation

---

## 🗄️ Database Schema

### Overview
The database uses **PostgreSQL** via Supabase with **Row Level Security (RLS)** for data isolation. All tables are in the `public` schema.

### Core Tables

#### 1. `users` Table
```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'enterprise')),
  ai_credits_used_today INT DEFAULT 0,
  ai_credits_monthly INT DEFAULT 0,
  last_credit_reset TIMESTAMPTZ DEFAULT NOW(),
  study_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_study_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose**: Stores user profile and subscription information
**Key Fields**:
- `id`: Links to Supabase Auth user
- `plan_type`: Determines rate limits (free: 10/day, pro: 100/day)
- `ai_credits_used_today`: Daily usage counter
- `study_streak`: Current consecutive study days
- `longest_streak`: Best streak record

**RLS Policies**:
- Users can only view/update their own profile
- Trigger creates user record on signup

#### 2. `documents` Table
```sql
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose**: Stores user study documents/notes
**Relationships**:
- One user → Many documents (CASCADE delete)
- Documents can have flashcards, mind maps, AI requests

**RLS Policies**:
- Users can only CRUD their own documents

#### 3. `ai_requests` Table
```sql
CREATE TABLE public.ai_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose**: Logs all AI actions for analytics and debugging
**Action Types**: `summarize`, `explain`, `questions`, `flashcards`, `mindmap`, `chat`

### SaaS Feature Tables

#### 4. `flashcards` Table
```sql
CREATE TABLE public.flashcards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  difficulty REAL DEFAULT 2.5 CHECK (difficulty >= 0 AND difficulty <= 5),
  interval_days INT DEFAULT 1,
  repetitions INT DEFAULT 0,
  ease_factor REAL DEFAULT 2.5,
  next_review_date TIMESTAMPTZ DEFAULT NOW(),
  last_reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose**: Stores flashcards with SM-2 spaced repetition algorithm data
**Algorithm**: 
- `ease_factor`: Difficulty multiplier (1.3-5.0)
- `interval_days`: Days until next review
- `repetitions`: Number of successful reviews
- `next_review_date`: Calculated based on quality rating (1-5)

**Indexes**: `user_id`, `next_review_date` (for efficient querying)

#### 5. `study_sessions` Table
```sql
CREATE TABLE public.study_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('reading', 'review', 'practice', 'flashcard', 'mindmap')),
  duration_minutes INT DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose**: Tracks study time and session types for analytics

#### 6. `mind_maps` Table
```sql
CREATE TABLE public.mind_maps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose**: Stores AI-generated mind map structures
**Data Format**: JSON with `centralTopic` and `branches` array

#### 7. `study_plans` Table
```sql
CREATE TABLE public.study_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  daily_hours REAL DEFAULT 2.0,
  plan_data JSONB,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose**: AI-generated study schedules (UI pending)

#### 8. `document_shares` Table
```sql
CREATE TABLE public.document_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  shared_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  shared_with UUID REFERENCES public.users(id) ON DELETE SET NULL,
  access_level TEXT DEFAULT 'view' CHECK (access_level IN ('view', 'comment', 'edit')),
  share_token TEXT UNIQUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose**: Document sharing and collaboration (UI pending)
**Features**: Public links via `share_token`, user-specific sharing, expiration

#### 9. `ai_conversations` & `ai_messages` Tables
```sql
CREATE TABLE public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.ai_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose**: Stores AI tutor chat conversations and messages
**Usage**: Enables conversation history and context-aware responses

#### 10. `study_analytics` Table
```sql
CREATE TABLE public.study_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  documents_studied INT DEFAULT 0,
  flashcards_reviewed INT DEFAULT 0,
  study_time_minutes INT DEFAULT 0,
  ai_actions_used INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);
```

**Purpose**: Daily aggregated analytics for dashboard insights

### Database Functions

#### `handle_new_user()` Trigger Function
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Purpose**: Automatically creates user profile when Supabase Auth user signs up
**Trigger**: Fires `AFTER INSERT` on `auth.users`

#### `update_study_streak()` Function
```sql
CREATE OR REPLACE FUNCTION public.update_study_streak(user_id_param UUID)
RETURNS VOID AS $$
-- Updates study streak based on last study date
-- Continues streak if studied yesterday, resets if gap > 1 day
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Purpose**: Calculates and updates study streaks automatically

### Row Level Security (RLS)

**All tables have RLS enabled** with policies ensuring:
- Users can only access their own data
- Document owners control sharing
- Conversation participants can view messages
- Admin operations use `SECURITY DEFINER` functions

---

## 🔐 Authentication System

### Architecture
Uses **Supabase Auth** with email/password and OAuth (Google) support.

### Flow

#### 1. Sign Up Flow
```
User submits email/password
  ↓
Supabase Auth creates auth.users record
  ↓
Trigger fires: handle_new_user()
  ↓
Creates public.users record
  ↓
Redirects to /dashboard
```

#### 2. Sign In Flow
```
User submits credentials
  ↓
Supabase Auth validates
  ↓
Session cookie set
  ↓
Middleware checks session
  ↓
Redirects to /dashboard or /login
```

#### 3. OAuth Flow (Google)
```
User clicks "Sign in with Google"
  ↓
Redirects to Google OAuth
  ↓
User authorizes
  ↓
Callback: /auth/callback?code=...
  ↓
Exchange code for session
  ↓
Create/update user record
  ↓
Redirect to /dashboard
```

### Implementation Files

**`app/middleware.ts`**:
- Runs on every request
- Updates Supabase session
- Protects `/dashboard/*` routes
- Redirects authenticated users away from `/login`

**`app/auth/callback/route.ts`**:
- Handles OAuth callbacks
- Exchanges code for session
- Creates user record if needed
- Handles redirects (local vs production)

**`app/login/page.tsx`**:
- Sign up/Sign in form
- Email/password authentication
- Google OAuth button
- Magic link support (ready)

**`lib/supabase/server.ts`**:
- Server-side Supabase client
- Uses cookies for session management
- Works with Next.js App Router

**`lib/supabase/client.ts`**:
- Client-side Supabase client
- For browser-based operations

**`lib/supabase/middleware.ts`**:
- Middleware-specific client
- Cookie handling for edge runtime

### Session Management
- **Storage**: HTTP-only cookies
- **Refresh**: Automatic via Supabase SDK
- **Expiration**: Managed by Supabase (default: 1 hour, refresh: 7 days)

---

## 🔌 API Endpoints

All API routes are in `app/api/` directory using Next.js App Router.

### 1. `/api/ai` - AI Generation Endpoint

**Method**: `POST`  
**Auth**: Required (via middleware)

**Request Body**:
```typescript
{
  action: "summarize" | "explain" | "questions" | "flashcards" | "mindmap",
  content: string,
  documentId?: string,
  conversationHistory?: Array<{role: string, content: string}> // for chat
}
```

**Response**:
```typescript
{
  result: string, // AI-generated content
  remaining: number,
  success: boolean
}
```

**Flow**:
1. Validates user authentication
2. Checks rate limits (`lib/api-limits.ts`)
3. Calls `generateAIResponse()` from `lib/ai.ts`
4. Records usage in `ai_requests` table
5. Updates `ai_credits_used_today` counter
6. Updates study streak
7. Returns result

**Error Handling**:
- 401: Unauthorized
- 400: Invalid action/content
- 503: AI services unavailable
- 500: Server error

### 2. `/api/chat` - AI Tutor Chat

**Method**: `POST`  
**Auth**: Required

**Request Body**:
```typescript
{
  message: string,
  conversationId?: string,
  documentId?: string,
  conversationHistory: Array<{role: "user" | "assistant", content: string}>
}
```

**Response**:
```typescript
{
  message: string,
  conversationId: string,
  success: boolean
}
```

**Flow**:
1. Creates conversation if `conversationId` missing
2. Saves user message to `ai_messages`
3. Generates AI response with conversation history
4. Saves AI response
5. Records usage
6. Returns response and conversation ID

### 3. `/api/documents` - Document CRUD

**GET `/api/documents`**:
- Returns all user documents
- Ordered by `created_at DESC`
- Uses RLS for security

**POST `/api/documents`**:
```typescript
{
  title: string,
  content: string
}
```
- Creates new document
- Auto-sets `user_id` from session

### 4. `/api/documents/[docId]` - Single Document

**GET**: Fetch single document  
**PATCH**: Update document (title/content)  
**DELETE**: Delete document

All operations respect RLS policies.

### 5. `/api/flashcards` - Flashcard Management

**GET `/api/flashcards?documentId=xxx`**:
- Returns user flashcards
- Optional filter by document
- Ordered by `next_review_date`

**POST `/api/flashcards`**:
```typescript
{
  documentId?: string,
  flashcards: Array<{front: string, back: string}>
}
```
- Creates multiple flashcards
- Initializes SM-2 algorithm values

### 6. `/api/flashcards/[id]` - Flashcard Review

**PATCH `/api/flashcards/[id]`**:
```typescript
{
  quality: number // 0-5 (0=complete blackout, 5=perfect recall)
}
```

**Flow**:
1. Fetches current flashcard
2. Applies SM-2 algorithm:
   - Quality >= 3: Increase interval, increment repetitions
   - Quality < 3: Reset interval, reset repetitions
   - Update ease_factor
3. Calculates `next_review_date`
4. Updates database

**SM-2 Algorithm**:
```typescript
if (quality >= 3) {
  if (repetitions === 0) interval_days = 1
  else if (repetitions === 1) interval_days = 6
  else interval_days = Math.round(interval_days * ease_factor)
  repetitions++
} else {
  repetitions = 0
  interval_days = 1
}

ease_factor = Math.max(1.3, 
  ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
)
```

### 7. `/api/usage` - Usage Statistics

**Method**: `GET`  
**Auth**: Required

**Response**:
```typescript
{
  allowed: boolean,
  remaining: number,
  usage: number,
  used: number,
  limit: number,
  plan_type: "free" | "pro" | "enterprise",
  message: string
}
```

**Flow**:
1. Checks if new day (resets credits)
2. Fetches user plan and usage
3. Calculates remaining actions
4. Returns usage stats

---

## 🤖 AI Integration

### Architecture

**Primary**: Groq API (llama-3.1-8b-instant)  
**Fallback**: HuggingFace API (Mistral-7B-Instruct-v0.1)

### Implementation (`lib/ai.ts`)

#### Prompt Engineering

Each action has a specialized prompt:

1. **Summarize**: Creates 3-5 bullet points of key concepts
2. **Explain**: Simple language explanation with analogies
3. **Questions**: 2 MCQs + 2 short answer questions
4. **Flashcards**: JSON array of {front, back} objects
5. **Mindmap**: JSON structure with centralTopic and branches
6. **Chat**: Context-aware tutor responses with conversation history

#### API Call Flow

```typescript
generateAIResponse(action, content, conversationHistory?)
  ↓
Build prompt from prompts[action]
  ↓
Try Groq API
  ├─ Success → Return result
  └─ Failure → Try HuggingFace
      ├─ Success → Return result
      └─ Failure → Throw error
```

#### Error Handling

- **Content validation**: Empty or >20,000 chars
- **API failures**: Automatic fallback
- **Rate limits**: Handled by `api-limits.ts`
- **User-friendly errors**: Clear error messages

#### Rate Limiting (`lib/api-limits.ts`)

**Plan Limits**:
- Free: 10 AI actions/day
- Pro: 100 AI actions/day
- Enterprise: 999/day

**Reset Logic**:
- Daily reset at UTC midnight
- Automatic via `checkAndResetCredits()`
- Called before every AI request

**Usage Tracking**:
- Increments `ai_credits_used_today`
- Logs to `ai_requests` table
- Updates study streak
- Server-side enforcement

---

## 🎨 Frontend Architecture

### Page Structure

```
app/
├── page.tsx              # Landing page (Product Hunt ready)
├── login/
│   └── page.tsx          # Authentication page
├── pricing/
│   └── page.tsx          # Pricing page
└── dashboard/
    ├── layout.tsx        # Dashboard layout (sidebar + main)
    ├── page.tsx          # Dashboard home
    ├── [docId]/
    │   └── page.tsx      # Document editor page
    ├── new/
    │   └── page.tsx      # Create new document
    ├── analytics/
    │   └── page.tsx      # Analytics dashboard
    └── settings/
        └── page.tsx      # User settings
```

### Component Structure

```
components/
├── dashboard/
│   ├── modern-sidebar.tsx      # Modern navigation sidebar
│   ├── editor.tsx               # Main document editor
│   ├── create-document-dialog.tsx
│   ├── document-list.tsx
│   └── empty-state.tsx
└── ui/                         # shadcn/ui components
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    └── ... (40+ components)
```

### Key Components

#### `components/dashboard/editor.tsx`

**Purpose**: Main document editing interface with AI tools

**Features**:
- Auto-save (1.5s debounce)
- PDF upload and text extraction
- AI action tabs (Summarize, Explain, Questions, Flashcards, Mind Map, Chat)
- Flashcard review interface
- Chat interface with message history
- Fullscreen mode
- Markdown rendering

**State Management**:
```typescript
- title, content: Document content
- selectedAction: Current AI tool
- aiOutput: AI-generated result
- flashcards: Array of flashcard objects
- chatMessages: Conversation history
- isGenerating: Loading state
- usage, limit: Rate limit tracking
```

**Key Functions**:
- `handleFileUpload()`: PDF.js integration (client-side only)
- `handleAiAction()`: Calls AI API, handles different response types
- `handleChatSend()`: Chat message handling
- `handleFlashcardReview()`: SM-2 algorithm application
- `saveDocument()`: Debounced auto-save

#### `components/dashboard/modern-sidebar.tsx`

**Purpose**: Navigation and document list

**Features**:
- Active route highlighting
- Document list with recent items
- Plan badge (Free/Pro)
- Quick upgrade CTA
- User profile section
- Settings and logout

**State**:
- Documents fetched from `/api/documents`
- Loading states
- Dialog for creating documents

### Hooks

#### `hooks/use-usage-limit.ts`

**Purpose**: Client-side usage limit tracking

**Implementation**:
```typescript
export function useUsageLimit() {
  const [usage, setUsage] = useState(0)
  const [limit, setLimit] = useState(10)
  
  useEffect(() => {
    fetchUsage()
  }, [])
  
  return { usage, limit, refreshUsage }
}
```

**Usage**: Used in editor to show remaining actions and disable buttons

### Styling

**Tailwind CSS v4** with:
- Custom color scheme (primary, accent, muted)
- Dark mode support (via next-themes)
- Responsive breakpoints
- Custom animations
- Gradient utilities

**Design System**:
- Rounded corners (lg, xl, 2xl, 3xl)
- Shadow system (sm, md, lg, xl)
- Spacing scale (4px base)
- Typography scale (xs to 5xl)

---

## ✨ Features Breakdown

### 1. Document Management

**Create**:
- Via dialog (`create-document-dialog.tsx`)
- Title and optional initial content
- Auto-redirects to editor

**Edit**:
- Rich text editor (textarea with markdown support)
- Auto-save every 1.5 seconds
- Real-time character/word count
- PDF import support

**Delete**:
- Via API endpoint
- Cascade delete (removes related flashcards, etc.)

### 2. AI Summarization

**How it works**:
1. User selects content in editor
2. Clicks "Summarize" tab
3. Clicks "Generate Summary"
4. API call to `/api/ai` with action="summarize"
5. AI returns bullet points
6. Rendered with ReactMarkdown
7. Can copy or save to document

**Prompt**: Focuses on key concepts, 3-5 bullet points

### 3. AI Explanation

**How it works**:
- Similar flow to summarization
- Prompt emphasizes simple language and analogies
- Targets high school comprehension level
- Returns paragraph-form explanation

### 4. Practice Questions

**How it works**:
- Generates 2 MCQs + 2 short answer questions
- Exam-style formatting
- Tests comprehension, not memorization
- Returns formatted markdown

### 5. Flashcard Generation

**How it works**:
1. User clicks "Flashcards" tab
2. Generates 10-15 flashcards from content
3. AI returns JSON array
4. Parsed and saved to database
5. Displayed in review interface

**Review Interface**:
- Flip animation
- Quality rating (Hard/Good/Easy = 1/3/5)
- SM-2 algorithm updates
- Progress tracking
- Next review date calculation

### 6. Mind Map Generation

**How it works**:
- Generates hierarchical JSON structure
- Central topic + 4-6 branches
- Each branch has 2-4 sub-branches
- Stored in `mind_maps` table
- Ready for visualization library integration

### 7. AI Tutor Chat

**How it works**:
1. User opens "AI Tutor" tab
2. Types question
3. Message sent to `/api/chat`
4. Conversation history included (last 6 messages)
5. AI responds with context
6. Messages saved to database
7. Conversation persists across sessions

**Features**:
- Context-aware responses
- Conversation history
- Document context (if linked)
- Real-time typing indicators

### 8. Study Streaks

**How it works**:
- Automatically updated on AI usage
- Checks `last_study_date` vs today
- Continues streak if studied yesterday
- Resets if gap > 1 day
- Tracks `longest_streak`

**Display**:
- Dashboard stat card
- Analytics page
- Visual indicators

### 9. PDF Import

**How it works**:
1. User clicks "Upload PDF"
2. File selected via input
3. PDF.js loads dynamically (client-side only)
4. Extracts text from all pages
5. Appends to document content
6. Toast notification with page count

**Technical Details**:
- Uses `pdfjs-dist` library
- Dynamic import to avoid SSR issues
- Worker loaded from CDN
- Text extraction via `getTextContent()`
- Handles errors gracefully

### 10. Analytics Dashboard

**Features**:
- Total documents count
- Total AI actions used
- Study streak display
- Weekly activity chart
- Action type breakdown (pie chart)
- Usage percentage (circular progress)
- Learning insights

**Data Sources**:
- `documents` table (count)
- `ai_requests` table (actions, types)
- `users` table (streak, usage)
- Aggregated by date

---

## 🔄 Code Flow & Execution

### User Journey: Creating and Using a Document

#### Step 1: User Signs In
```
1. User visits /login
2. Enters email/password or clicks Google OAuth
3. Supabase Auth validates credentials
4. Session cookie set
5. Middleware redirects to /dashboard
6. Dashboard layout loads
7. ModernSidebar fetches documents
8. Dashboard page fetches user stats
```

#### Step 2: Creating a Document
```
1. User clicks "New Document" button
2. CreateDocumentDialog opens
3. User enters title
4. Clicks "Create"
5. POST /api/documents
6. Server creates document in database
7. Redirects to /dashboard/[docId]
8. Editor component loads with document
```

#### Step 3: Editing Document
```
1. User types in editor
2. onChange triggers setContent()
3. useEffect watches content changes
4. Debounced saveDocument() called (1.5s delay)
5. PATCH /api/documents/[docId]
6. Server updates document
7. UI shows "Saved to cloud" indicator
```

#### Step 4: Using AI Feature (e.g., Summarize)
```
1. User selects "Summarize" tab
2. Clicks "Generate Summary"
3. Editor checks usage limit (useUsageLimit hook)
4. If limit reached → Toast error
5. If OK → setIsGenerating(true)
6. POST /api/ai
   ├─ Server validates auth
   ├─ Checks rate limit (checkRateLimit)
   ├─ Calls generateAIResponse("summarize", content)
   ├─ Groq API called with prompt
   ├─ Response parsed
   ├─ Usage recorded (recordAIUsage)
   ├─ Study streak updated
   └─ Returns result
7. Editor receives result
8. setAiOutput(result)
9. ReactMarkdown renders result
10. User can copy or save to document
```

#### Step 5: Generating Flashcards
```
1. User selects "Flashcards" tab
2. Clicks "Generate Flashcards"
3. POST /api/ai with action="flashcards"
4. AI returns JSON array
5. Editor parses JSON
6. POST /api/flashcards with array
7. Server creates flashcard records
8. Editor shows flashcard review interface
9. User reviews flashcards
10. On rating → PATCH /api/flashcards/[id]
11. SM-2 algorithm updates card
12. Next review date calculated
```

### Request Lifecycle

#### API Request Flow
```
Client Component
  ↓
fetch("/api/endpoint", {...})
  ↓
Next.js API Route Handler
  ↓
Middleware (if applicable)
  ↓
Authentication Check
  ↓
Business Logic
  ↓
Database Operation (via Supabase)
  ↓
RLS Policy Check
  ↓
Query Execution
  ↓
Response Formation
  ↓
JSON Response
  ↓
Client Updates State
```

#### Database Query Flow
```
Server Component/API Route
  ↓
createClient() or supabaseAdmin
  ↓
.from("table")
  ↓
.select() / .insert() / .update() / .delete()
  ↓
.eq() / .order() / etc. (query builder)
  ↓
RLS Policy Evaluation
  ↓
PostgreSQL Query Execution
  ↓
Result Set
  ↓
TypeScript Type Casting
  ↓
Return Data
```

---

## 🔧 Environment Variables

### Required Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NextAuth (if using)
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your-client-secret

# AI APIs
NEXT_PUBLIC_GROQ_API_KEY=your-groq-api-key
NEXT_PUBLIC_HUGGINGFACE_API_KEY=your-huggingface-token

# Email (for magic links, optional)
NEXT_PUBLIC_SMTP_HOST=smtp.gmail.com
NEXT_PUBLIC_SMTP_PORT=587
NEXT_PUBLIC_SMTP_USER=your-email@gmail.com
NEXT_PUBLIC_SMTP_PASSWORD=your-app-password
NEXT_PUBLIC_EMAIL_FROM=StudyOS <your-email@gmail.com>
```

### Variable Usage

**Public Variables** (`NEXT_PUBLIC_*`):
- Exposed to browser
- Used in client components
- Safe for public access

**Server Variables**:
- Only accessible server-side
- Used in API routes and server components
- Never exposed to client

### Security Notes

- **Service Role Key**: Never expose to client, use only server-side
- **API Keys**: Can be public for free-tier APIs, but consider rate limiting
- **OAuth Secrets**: Keep private, use environment variables
- **Database URLs**: Never expose service role credentials

---

## 🚀 Deployment

### Prerequisites

1. **Supabase Project**:
   - Create project at supabase.com
   - Run migrations (`20240101_init.sql`, `20240102_saas_features.sql`)
   - Get URL and keys

2. **API Keys**:
   - Groq API key (console.groq.com)
   - HuggingFace token (huggingface.co)

3. **Hosting** (Recommended: Vercel):
   - Connect GitHub repository
   - Add environment variables
   - Deploy

### Migration Steps

1. **Database Setup**:
   ```sql
   -- Run in Supabase SQL Editor
   -- 1. Run 20240101_init.sql
   -- 2. Run 20240102_saas_features.sql
   ```

2. **Environment Variables**:
   - Add all required variables in hosting platform
   - Test locally with `.env.local`

3. **Build**:
   ```bash
   npm run build
   npm start
   ```

4. **Deploy**:
   - Push to main branch
   - Vercel auto-deploys
   - Check build logs for errors

### Production Checklist

- [ ] All environment variables set
- [ ] Database migrations run
- [ ] RLS policies verified
- [ ] API keys valid
- [ ] OAuth redirect URLs configured
- [ ] Domain configured (if custom)
- [ ] Analytics enabled (optional)
- [ ] Error tracking (Sentry, etc.)
- [ ] Rate limiting configured
- [ ] Backup strategy in place

---

## 📁 File Structure

```
ai-study-app/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── ai/
│   │   │   └── route.ts          # AI generation endpoint
│   │   ├── chat/
│   │   │   └── route.ts          # AI tutor chat
│   │   ├── documents/
│   │   │   ├── route.ts          # Document CRUD
│   │   │   └── [docId]/
│   │   │       └── route.ts      # Single document ops
│   │   ├── flashcards/
│   │   │   ├── route.ts          # Flashcard CRUD
│   │   │   └── [id]/
│   │   │       └── route.ts      # Flashcard review
│   │   └── usage/
│   │       └── route.ts          # Usage statistics
│   ├── auth/
│   │   ├── callback/
│   │   │   └── route.ts          # OAuth callback
│   │   └── signout/
│   │       └── route.ts          # Sign out handler
│   ├── dashboard/
│   │   ├── layout.tsx            # Dashboard layout
│   │   ├── page.tsx              # Dashboard home
│   │   ├── [docId]/
│   │   │   └── page.tsx          # Document editor
│   │   ├── new/
│   │   │   └── page.tsx          # Create document
│   │   ├── analytics/
│   │   │   ├── page.tsx          # Analytics page
│   │   │   └── charts.tsx        # Chart components
│   │   └── settings/
│   │       └── page.tsx          # Settings page
│   ├── login/
│   │   └── page.tsx              # Login/signup page
│   ├── pricing/
│   │   └── page.tsx              # Pricing page
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout
│   ├── middleware.ts             # Auth middleware
│   └── globals.css               # Global styles
├── components/
│   ├── dashboard/
│   │   ├── modern-sidebar.tsx    # Navigation sidebar
│   │   ├── editor.tsx            # Document editor
│   │   ├── create-document-dialog.tsx
│   │   ├── document-list.tsx
│   │   ├── empty-state.tsx
│   │   └── header.tsx
│   └── ui/                       # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ... (40+ components)
├── lib/
│   ├── ai.ts                     # AI service (Groq/HuggingFace)
│   ├── api-limits.ts             # Rate limiting logic
│   ├── db.ts                     # Database utilities
│   ├── models.ts                 # TypeScript interfaces
│   ├── subscription.ts           # Subscription helpers
│   ├── supabase/
│   │   ├── server.ts             # Server client
│   │   ├── client.ts             # Client client
│   │   └── middleware.ts        # Middleware client
│   └── utils.ts                  # Utility functions
├── hooks/
│   ├── use-usage-limit.ts        # Usage limit hook
│   └── use-toast.ts              # Toast notifications
├── supabase/
│   └── migrations/
│       ├── 20240101_init.sql     # Initial schema
│       └── 20240102_saas_features.sql  # SaaS features
├── public/                       # Static assets
│   ├── logo.png
│   └── ...
├── package.json
├── tsconfig.json
├── next.config.mjs
└── .env.local                    # Environment variables (gitignored)
```

---

## 🎯 Key Design Decisions

### Why Supabase?
- **Built-in Auth**: No need for separate auth service
- **PostgreSQL**: Robust relational database
- **RLS**: Security at database level
- **Real-time**: Ready for live collaboration
- **Free Tier**: Generous limits for MVP

### Why Next.js App Router?
- **Server Components**: Better performance
- **API Routes**: Built-in backend
- **File-based Routing**: Simple structure
- **TypeScript**: Type safety
- **SSR/SSG**: SEO and performance

### Why Groq + HuggingFace?
- **Groq**: Fast inference, free tier
- **HuggingFace**: Reliable fallback
- **Cost-effective**: Free tiers available
- **No vendor lock-in**: Easy to switch models

### Why SM-2 Algorithm?
- **Proven**: Used by Anki, SuperMemo
- **Effective**: Scientifically-backed
- **Simple**: Easy to implement
- **Scalable**: Works for any number of cards

---

## 🔍 Code Patterns & Conventions

### Server Actions
- Use `"use server"` directive
- Async/await for all operations
- Error handling with try/catch
- Type-safe with TypeScript

### Client Components
- Use `"use client"` directive
- React hooks for state
- useEffect for side effects
- Optimistic updates where possible

### Database Queries
- Always use RLS-aware clients
- Error handling for all queries
- Type casting for results
- Upsert for user creation

### API Routes
- Authentication check first
- Input validation
- Rate limiting
- Error responses with status codes
- JSON responses

### Component Structure
```typescript
// 1. Imports
// 2. Types/Interfaces
// 3. Component
// 4. Helper functions
// 5. Export
```

---

## 🐛 Common Issues & Solutions

### PDF.js DOMMatrix Error
**Problem**: PDF.js tries to use DOMMatrix in SSR  
**Solution**: Dynamic import only on client-side when needed

### Icon Import Errors
**Problem**: `Cards` and `Network` don't exist  
**Solution**: Use `CreditCard` and `GitBranch` instead

### Rate Limit Not Resetting
**Problem**: Credits not resetting daily  
**Solution**: Check `last_credit_reset` timezone, ensure `checkAndResetCredits()` called

### RLS Policy Errors
**Problem**: "new row violates row-level security policy"  
**Solution**: Check user ID matches, verify RLS policies, use service role for admin ops

### AI API Failures
**Problem**: Both Groq and HuggingFace fail  
**Solution**: Check API keys, verify network, check rate limits, implement retry logic

---

## 📊 Performance Considerations

### Optimizations Implemented

1. **Debounced Auto-save**: Reduces database writes
2. **Dynamic Imports**: PDF.js loaded only when needed
3. **Server Components**: Reduces client bundle size
4. **Database Indexes**: Fast queries on user_id, dates
5. **RLS Caching**: Supabase caches policies
6. **Lazy Loading**: Components loaded on demand

### Future Optimizations

1. **Image Optimization**: Next.js Image component
2. **Code Splitting**: Route-based splitting
3. **Caching**: Redis for frequently accessed data
4. **CDN**: Static assets via CDN
5. **Database Connection Pooling**: Supabase handles this
6. **API Response Caching**: Cache AI responses for similar content

---

## 🔒 Security Measures

### Implemented

1. **Row Level Security**: Database-level access control
2. **Authentication**: Supabase Auth with sessions
3. **Input Validation**: Server-side validation
4. **Rate Limiting**: Prevents abuse
5. **HTTPS**: Enforced in production
6. **Environment Variables**: Secrets not in code
7. **SQL Injection**: Parameterized queries (Supabase)
8. **XSS Protection**: React escapes by default

### Best Practices

- Never trust client input
- Validate on server
- Use RLS for data access
- Keep dependencies updated
- Monitor for suspicious activity
- Regular security audits

---

## 📈 Scaling Considerations

### Current Limits

- **Free Tier**: 10 AI actions/day
- **Pro Tier**: 100 AI actions/day
- **Database**: Supabase free tier (500MB)
- **API**: Groq free tier (30 req/min)

### Scaling Path

1. **Database**: Upgrade Supabase plan
2. **AI APIs**: Add paid tiers or self-host models
3. **Caching**: Redis for AI responses
4. **CDN**: For static assets
5. **Load Balancing**: Multiple instances
6. **Monitoring**: Error tracking, analytics

---

## 🎓 Learning Resources

### Understanding the Codebase

1. **Start Here**: `app/page.tsx` (Landing page)
2. **Auth Flow**: `app/login/page.tsx` → `app/auth/callback/route.ts`
3. **Dashboard**: `app/dashboard/page.tsx` → `components/dashboard/modern-sidebar.tsx`
4. **Editor**: `app/dashboard/[docId]/page.tsx` → `components/dashboard/editor.tsx`
5. **AI**: `app/api/ai/route.ts` → `lib/ai.ts`
6. **Database**: `lib/db.ts` → Supabase queries

### Key Files to Read

1. `lib/ai.ts` - AI integration logic
2. `lib/api-limits.ts` - Rate limiting
3. `lib/db.ts` - Database operations
4. `components/dashboard/editor.tsx` - Main editor
5. `app/api/ai/route.ts` - AI endpoint
6. `supabase/migrations/20240102_saas_features.sql` - Database schema

---

## 🚧 Future Enhancements

### Planned Features

1. **Export Functionality**: PDF, DOCX, Markdown export
2. **Document Sharing**: UI for sharing documents
3. **Study Plans**: UI for AI-generated study schedules
4. **Team Collaboration**: Multi-user document editing
5. **Mobile App**: React Native version
6. **Offline Mode**: Service workers for offline access
7. **Advanced Analytics**: More detailed insights
8. **Custom AI Models**: Fine-tuned models per user
9. **Integration APIs**: Webhooks, REST API
10. **White-label**: Customizable branding

### Technical Debt

1. **Error Boundaries**: Add React error boundaries
2. **Testing**: Unit and integration tests
3. **Documentation**: API documentation
4. **Type Safety**: Stricter TypeScript
5. **Performance**: More optimizations
6. **Accessibility**: WCAG compliance

---

## 📝 Conclusion

This documentation covers every aspect of the StudyOS platform. The codebase follows modern best practices, uses TypeScript for type safety, implements proper security measures, and is designed to scale.

**Key Takeaways**:
- **Architecture**: Next.js App Router + Supabase + AI APIs
- **Database**: PostgreSQL with RLS for security
- **AI**: Groq primary, HuggingFace fallback
- **Features**: 6 AI tools + flashcards + chat + analytics
- **Security**: RLS, authentication, rate limiting
- **Scalability**: Ready for growth with proper architecture

**Next Steps**:
1. Run database migrations
2. Set up environment variables
3. Deploy to production
4. Monitor usage and errors
5. Iterate based on user feedback

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: Production Ready 🚀
