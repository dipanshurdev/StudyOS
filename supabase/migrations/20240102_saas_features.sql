-- Migration: Add SaaS features tables
-- This migration adds tables for flashcards, study sessions, mind maps, study plans, collaboration, and more

-- Flashcards table with spaced repetition support
create table if not exists public.flashcards (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  document_id uuid references public.documents(id) on delete set null,
  front text not null,
  back text not null,
  difficulty real default 2.5 check (difficulty >= 0 and difficulty <= 5),
  interval_days int default 1,
  repetitions int default 0,
  ease_factor real default 2.5,
  next_review_date timestamp with time zone default timezone('utc'::text, now()),
  last_reviewed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Study sessions table for tracking study time
create table if not exists public.study_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  document_id uuid references public.documents(id) on delete set null,
  session_type text not null check (session_type in ('reading', 'review', 'practice', 'flashcard', 'mindmap')),
  duration_minutes int default 0,
  started_at timestamp with time zone default timezone('utc'::text, now()),
  ended_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Mind maps table
create table if not exists public.mind_maps (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  document_id uuid references public.documents(id) on delete set null,
  title text not null,
  data jsonb not null, -- Stores the mind map structure
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Study plans table
create table if not exists public.study_plans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  description text,
  start_date date not null,
  end_date date not null,
  daily_hours real default 2.0,
  plan_data jsonb, -- Stores plan structure and tasks
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Study streaks table for gamification
create table if not exists public.study_streaks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null unique,
  current_streak int default 0,
  longest_streak int default 0,
  last_study_date date,
  total_study_days int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Document sharing and collaboration
create table if not exists public.document_shares (
  id uuid default uuid_generate_v4() primary key,
  document_id uuid references public.documents(id) on delete cascade not null,
  shared_by uuid references public.users(id) on delete cascade not null,
  shared_with uuid references public.users(id) on delete set null, -- null means public link
  access_level text default 'view' check (access_level in ('view', 'comment', 'edit')),
  share_token text unique, -- For public sharing
  expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- AI chat conversations (for AI tutor feature)
create table if not exists public.ai_conversations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  document_id uuid references public.documents(id) on delete set null,
  title text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- AI chat messages
create table if not exists public.ai_messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.ai_conversations(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Study analytics and insights
create table if not exists public.study_analytics (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  date date not null,
  documents_studied int default 0,
  flashcards_reviewed int default 0,
  study_time_minutes int default 0,
  ai_actions_used int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, date)
);

-- Add indexes for performance
create index if not exists idx_flashcards_user_id on public.flashcards(user_id);
create index if not exists idx_flashcards_next_review on public.flashcards(next_review_date);
create index if not exists idx_study_sessions_user_id on public.study_sessions(user_id);
create index if not exists idx_study_sessions_started_at on public.study_sessions(started_at);
create index if not exists idx_mind_maps_user_id on public.mind_maps(user_id);
create index if not exists idx_study_plans_user_id on public.study_plans(user_id);
create index if not exists idx_document_shares_document_id on public.document_shares(document_id);
create index if not exists idx_document_shares_token on public.document_shares(share_token);
create index if not exists idx_ai_conversations_user_id on public.ai_conversations(user_id);
create index if not exists idx_ai_messages_conversation_id on public.ai_messages(conversation_id);
create index if not exists idx_study_analytics_user_date on public.study_analytics(user_id, date);

-- Enable RLS on all new tables
alter table public.flashcards enable row level security;
alter table public.study_sessions enable row level security;
alter table public.mind_maps enable row level security;
alter table public.study_plans enable row level security;
alter table public.study_streaks enable row level security;
alter table public.document_shares enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;
alter table public.study_analytics enable row level security;

-- RLS Policies for flashcards
create policy "Users can view their own flashcards"
  on public.flashcards for select
  using (auth.uid() = user_id);

create policy "Users can insert their own flashcards"
  on public.flashcards for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own flashcards"
  on public.flashcards for update
  using (auth.uid() = user_id);

create policy "Users can delete their own flashcards"
  on public.flashcards for delete
  using (auth.uid() = user_id);

-- RLS Policies for study sessions
create policy "Users can view their own study sessions"
  on public.study_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own study sessions"
  on public.study_sessions for insert
  with check (auth.uid() = user_id);

-- RLS Policies for mind maps
create policy "Users can view their own mind maps"
  on public.mind_maps for select
  using (auth.uid() = user_id);

create policy "Users can insert their own mind maps"
  on public.mind_maps for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own mind maps"
  on public.mind_maps for update
  using (auth.uid() = user_id);

create policy "Users can delete their own mind maps"
  on public.mind_maps for delete
  using (auth.uid() = user_id);

-- RLS Policies for study plans
create policy "Users can view their own study plans"
  on public.study_plans for select
  using (auth.uid() = user_id);

create policy "Users can insert their own study plans"
  on public.study_plans for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own study plans"
  on public.study_plans for update
  using (auth.uid() = user_id);

create policy "Users can delete their own study plans"
  on public.study_plans for delete
  using (auth.uid() = user_id);

-- RLS Policies for study streaks
create policy "Users can view their own study streaks"
  on public.study_streaks for select
  using (auth.uid() = user_id);

create policy "Users can update their own study streaks"
  on public.study_streaks for update
  using (auth.uid() = user_id);

-- RLS Policies for document shares
create policy "Users can view shares for their documents"
  on public.document_shares for select
  using (auth.uid() = shared_by or auth.uid() = shared_with);

create policy "Users can create shares for their documents"
  on public.document_shares for insert
  with check (auth.uid() = shared_by);

create policy "Users can update shares for their documents"
  on public.document_shares for update
  using (auth.uid() = shared_by);

create policy "Users can delete shares for their documents"
  on public.document_shares for delete
  using (auth.uid() = shared_by);

-- RLS Policies for AI conversations
create policy "Users can view their own conversations"
  on public.ai_conversations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own conversations"
  on public.ai_conversations for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own conversations"
  on public.ai_conversations for update
  using (auth.uid() = user_id);

create policy "Users can delete their own conversations"
  on public.ai_conversations for delete
  using (auth.uid() = user_id);

-- RLS Policies for AI messages
create policy "Users can view messages in their conversations"
  on public.ai_messages for select
  using (
    exists (
      select 1 from public.ai_conversations
      where ai_conversations.id = ai_messages.conversation_id
      and ai_conversations.user_id = auth.uid()
    )
  );

create policy "Users can insert messages in their conversations"
  on public.ai_messages for insert
  with check (
    exists (
      select 1 from public.ai_conversations
      where ai_conversations.id = ai_messages.conversation_id
      and ai_conversations.user_id = auth.uid()
    )
  );

-- RLS Policies for study analytics
create policy "Users can view their own analytics"
  on public.study_analytics for select
  using (auth.uid() = user_id);

create policy "Users can insert their own analytics"
  on public.study_analytics for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own analytics"
  on public.study_analytics for update
  using (auth.uid() = user_id);

-- Add study streak tracking to users table
alter table public.users add column if not exists study_streak int default 0;
alter table public.users add column if not exists longest_streak int default 0;
alter table public.users add column if not exists last_study_date date;

-- Function to update study streak
create or replace function public.update_study_streak(user_id_param uuid)
returns void as $$
declare
  last_date date;
  current_date_val date := current_date;
  current_streak int;
begin
  -- Get last study date
  select last_study_date into last_date
  from public.users
  where id = user_id_param;

  -- If no last study date or it's not today/yesterday, reset or start streak
  if last_date is null then
    -- First study session
    update public.users
    set study_streak = 1,
        last_study_date = current_date_val,
        longest_streak = greatest(longest_streak, 1)
    where id = user_id_param;
  elsif last_date = current_date_val then
    -- Already studied today, no change needed
    return;
  elsif last_date = current_date_val - interval '1 day' then
    -- Continuing streak
    select study_streak into current_streak
    from public.users
    where id = user_id_param;

    update public.users
    set study_streak = study_streak + 1,
        last_study_date = current_date_val,
        longest_streak = greatest(longest_streak, study_streak + 1)
    where id = user_id_param;
  else
    -- Streak broken, start new streak
    update public.users
    set study_streak = 1,
        last_study_date = current_date_val
    where id = user_id_param;
  end if;
end;
$$ language plpgsql security definer;
