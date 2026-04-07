# StudyOS – Deploy-ready setup (Vercel + Supabase)

After deploying to **https://studyos-ai.vercel.app**, login was sending users to `http://localhost:3000/?code=...` instead of the dashboard. Follow these steps so auth works in production.

---

## 1. Supabase: Redirect URLs and Site URL

Supabase uses **Site URL** and **Redirect URLs** to decide where to send users after login. If your production URL is missing, it falls back to localhost.

### In Supabase Dashboard

1. Open your project: **https://supabase.com/dashboard**
2. Go to **Authentication** → **URL Configuration**.
3. Set:

**Site URL** (main app URL):

```text
https://studyos-ai.vercel.app
```

**Redirect URLs** (one per line). **Include the callback URL** so users go straight to `/auth/callback` and then to the dashboard (not to `/?code=...`):

```text
https://studyos-ai.vercel.app/auth/callback
https://studyos-ai.vercel.app/**
http://localhost:3000/auth/callback
http://localhost:3000/**
```

4. Save.

- If you only had `https://studyos-ai.vercel.app` (root), Supabase may redirect to `https://studyos-ai.vercel.app?code=...`. The app now detects that and redirects to `/auth/callback` so login still works, but adding `https://studyos-ai.vercel.app/auth/callback` above gives the correct flow and sends users straight to the dashboard.

---

## 2. Vercel: Environment variables

In **Vercel** → your project → **Settings** → **Environment Variables**, set (for Production, and optionally Preview):

| Name | Value | Notes |
|------|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | From Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Same place |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service_role key | Same place (keep secret) |
| `NEXT_PUBLIC_GROQ_API_KEY` | Your Groq API key | For AI |
| `NEXT_PUBLIC_HUGGINGFACE_API_KEY` | Your HuggingFace token | For AI fallback |

Optional but recommended for production:

| Name | Value | Notes |
|------|--------|------|
| `NEXT_PUBLIC_APP_URL` | `https://studyos-ai.vercel.app` | Used for auth redirects so we never send users to localhost |

- `VERCEL_URL` is set automatically by Vercel (e.g. `studyos-ai.vercel.app`). The app uses it when `NEXT_PUBLIC_APP_URL` is not set.
- If you use a custom domain later, set `NEXT_PUBLIC_APP_URL` to that (e.g. `https://studyos.com`) and add the same URL and `https://yourdomain.com/auth/callback` in Supabase Redirect URLs.

Redeploy after changing env vars.

---

## 3. What was changed in the code (for your reference)

- **`lib/app-url.ts`**  
  Central helper for “where is this app running?”. Uses, in order:
  - `NEXT_PUBLIC_APP_URL`
  - `VERCEL_URL` (on Vercel)
  - `x-forwarded-host` (when behind a proxy)
  - Dev/local fallback

- **`lib/supabase/middleware.ts`**  
  - **Preview → production:** Any request to a Vercel **preview** URL (e.g. `study-xxx-amanrdevs-projects.vercel.app`) is redirected to the **production** URL (`studyos-ai.vercel.app`) with the same path and query. That way auth and cookies use one domain only and you avoid the “login → different URL → login again” cycle.  
  - **`?code=...`:** If the user lands on any URL with `?code=...` (e.g. `https://studyos-ai.vercel.app/?code=...`), the middleware redirects to `/auth/callback?code=...&next=/dashboard` so the code is exchanged and the user is sent to the dashboard.

- **`app/auth/callback/route.ts`**  
  Exchanges the OAuth code for a session and redirects to `getAppUrl(request)` + `/dashboard` (or `next` param). All redirects use the same origin so preview vs production stays consistent.

- **`app/login/page.tsx`**  
  After successful email/password sign-in, the app uses `window.location.href = "/dashboard"` so the server receives the session cookie and the user is not left on the login page.

Together with the Supabase URL configuration above, this makes the app deploy-ready and fixes the post-login redirect.

---

## 4. Google OAuth (if you use “Sign in with Google”)

1. **Google Cloud Console** → APIs & Services → Credentials → your OAuth 2.0 Client ID.
2. Under **Authorized redirect URIs**, add:
   - `https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback`  
   (Replace `YOUR_SUPABASE_PROJECT_REF` with your Supabase project ref from the Supabase URL.)
3. Under **Authorized JavaScript origins**, add **only**:
   - `https://studyos-ai.vercel.app`
   - `http://localhost:3000` (for local dev)  
   Do **not** add preview URLs (e.g. `study-xxx-amanrdevs-projects.vercel.app`). The app redirects all preview traffic to production so auth runs on one domain only.
4. Save.

---

## 5. Quick checklist

- [ ] Supabase **Site URL** = `https://studyos-ai.vercel.app`
- [ ] Supabase **Redirect URLs** include `https://studyos-ai.vercel.app/**` and `https://studyos-ai.vercel.app/auth/callback`
- [ ] Vercel env vars set (Supabase, Groq, HuggingFace; optional: `NEXT_PUBLIC_APP_URL`)
- [ ] Redeploy on Vercel after env changes
- [ ] If using Google login: Google OAuth redirect URI and origins updated

After this, logging in at **https://studyos-ai.vercel.app** should redirect to the dashboard on the same domain, not to localhost.
