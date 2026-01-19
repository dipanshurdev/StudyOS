-- SAFE REPAIR SCRIPT FOR DOCUMENTS TABLE
-- Run this in Supabase SQL Editor.

-- 1. Create a backup table just in case (if the table exists)
CREATE TABLE IF NOT EXISTS public.documents_backup AS SELECT * FROM public.documents;

-- 2. Drop the existing table (This clears the conflicting constraints)
-- We need to drop dependent objects like RLS policies automatically (CASCADE)
DROP TABLE IF EXISTS public.documents CASCADE;

-- 3. Re-create the documents table with CLEAN constraints
CREATE TABLE public.documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- 5. Restore data (if any existed in backup)
INSERT INTO public.documents (id, user_id, title, content, created_at, updated_at)
SELECT id, user_id, title, content, created_at, updated_at FROM public.documents_backup
ON CONFLICT (id) DO NOTHING;

-- 6. Add RLS Policies
CREATE POLICY "Users can view their own documents"
  ON public.documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents"
  ON public.documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents"
  ON public.documents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents"
  ON public.documents FOR DELETE
  USING (auth.uid() = user_id);

-- 7. Grant permissions
GRANT ALL ON public.documents TO postgres;
GRANT ALL ON public.documents TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;

-- 8. Clean up backup (Optional, keeping it for now)
-- DROP TABLE public.documents_backup;
