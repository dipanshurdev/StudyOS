-- Run this in your Supabase Dashboard > SQL Editor to fix the user creation trigger

-- 1. Create the users table if it creates problems (idempotent)
create table if not exists public.users (
  id uuid references auth.users not null primary key,
  email text not null,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Grant permissions to the service_role and postgres/authenticated users
grant all on table public.users to service_role;
grant all on table public.users to postgres;
grant select, insert, update on table public.users to authenticated;
grant select on table public.users to anon;

-- 3. Create or replace the trigger function
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    -- Try multiple fields for name, fallback to email prefix
    coalesce(
      new.raw_user_meta_data->>'full_name', 
      new.raw_user_meta_data->>'name', 
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing; -- Prevent errors if user already exists
  return new;
end;
$$ language plpgsql security definer;

-- 4. Re-create the trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
