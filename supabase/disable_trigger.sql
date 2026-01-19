-- EMERGENCY DEBUG SCRIPT
-- Run this to DISABLE the automatic user creation trigger.
-- This will allow you to sign up. If this works, we know the "Trigger" was the problem.

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- After running this, try to Sign Up with email/password. 
-- It should return "Check your email" (200 OK) instead of 500 Error.
