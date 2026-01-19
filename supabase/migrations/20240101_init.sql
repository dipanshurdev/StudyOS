-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table
create table if not exists public.users (
  id uuid references auth.users not null primary key,
  email text not null,
  display_name text,
  avatar_url text,
  plan_type text default 'free' check (plan_type in ('free', 'pro', 'enterprise')),
  ai_credits_used_today int default 0,
  ai_credits_monthly int default 0,
  last_credit_reset timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Documents table
create table if not exists public.documents (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- AI Usage Logs
create table if not exists public.ai_requests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  document_id uuid references public.documents(id) on delete set null,
  action_type text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS Policies
alter table public.users enable row level security;
alter table public.documents enable row level security;
alter table public.ai_requests enable row level security;

create policy "Users can view their own profile"
  on public.users for select
  using ( auth.uid() = id );

create policy "Users can update their own profile"
  on public.users for update
  using ( auth.uid() = id );

create policy "Users can view their own documents"
  on public.documents for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own documents"
  on public.documents for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own documents"
  on public.documents for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own documents"
  on public.documents for delete
  using ( auth.uid() = user_id );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
