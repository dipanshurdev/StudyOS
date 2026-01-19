-- FIX FOREIGN KEY ERROR
-- Run this in Supabase SQL Editor.
-- This script does 2 things:
-- 1. Syncs any missing users from auth.users to public.users (Fixes your current error)
-- 2. Re-enables the automatic trigger for future signups.

-- PART 1: Sync missing users (Fixes "Violates foreign key constraint")
INSERT INTO public.users (id, email, display_name, avatar_url, created_at, updated_at)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', split_part(email, '@', 1)),
    raw_user_meta_data->>'avatar_url',
    created_at,
    last_sign_in_at
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users);

-- PART 2: Re-enable the Trigger (Safe Version)
-- First, clean up old objects to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING; -- This prevents 500 errors if user exists
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Ensure permissions are correct
GRANT ALL ON public.users TO service_role;
GRANT ALL ON public.users TO postgres;
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
