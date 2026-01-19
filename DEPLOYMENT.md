# Deployment Guide for StudyOS SaaS Platform

## Pre-Deployment Checklist

- [ ] Supabase project created and configured
- [ ] Database schema initialized (SQL script run)
- [ ] Google OAuth credentials created
- [ ] API keys for Groq and HuggingFace obtained
- [ ] All environment variables in `.env.local`
- [ ] Code tested locally with preview
- [ ] GitHub repository created and code pushed

## Environment Variables Required

Add these to Vercel project settings:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
NEXTAUTH_URL=https://your-domain.vercel.app

NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your_google_secret

NEXT_PUBLIC_GROQ_API_KEY=your_groq_key
NEXT_PUBLIC_HUGGINGFACE_API_KEY=your_huggingface_key
```

## Step-by-Step Deployment

### 1. Set Up Supabase
- Create project at https://supabase.com
- Copy URL and anon key from Settings → API
- Copy service role key from Settings → API → Service Role
- Go to SQL Editor
- Paste entire contents of `scripts/01-init-schema.sql`
- Execute to create all tables and RLS policies

### 2. Configure Google OAuth
- Go to https://console.cloud.google.com
- Create OAuth 2.0 credentials (Web application)
- Add authorized redirect URIs:
  - `http://localhost:3000/api/auth/callback/google` (for local testing)
  - `https://your-domain.vercel.app/api/auth/callback/google` (production)
- Copy Client ID and Secret

### 3. Get API Keys
- **Groq:** Visit https://console.groq.com/keys, create API key
- **HuggingFace:** Visit https://huggingface.co/settings/tokens, create token

### 4. Deploy to Vercel
```bash
# 1. Create GitHub repository
git init
git add .
git commit -m "Initial StudyOS SaaS commit"
git branch -M main
git remote add origin https://github.com/your-username/studyos.git
git push -u origin main

# 2. Connect to Vercel
# - Go to vercel.com
# - Click "New Project"
# - Import your GitHub repository
# - Add all environment variables listed above
# - Deploy!
```

### 5. Test Deployed Application
1. Visit your Vercel URL
2. Sign in with Google OAuth
3. Create an account with email/password
4. Create a new study document
5. Test AI features: Summarize, Explain, Generate Questions
6. Check usage limits (Free: 5 actions/day)

## Post-Deployment Checklist

- [ ] Database schema created in Supabase
- [ ] Google OAuth working on production domain
- [ ] Email/password authentication working
- [ ] AI features responding correctly
- [ ] Daily rate limiting functioning
- [ ] All environment variables set in Vercel
- [ ] Custom domain configured (optional)
- [ ] Analytics/monitoring enabled (optional)

## Cost Analysis (Staying Free)

| Service | Free Tier | Limit |
|---------|-----------|-------|
| Supabase | 500MB storage | Generous for MVP |
| Vercel | 100GB bandwidth | More than enough |
| Groq API | 30 req/min | 2,592,000/day |
| HuggingFace | Free inference | Rate limited |
| **Total** | **$0/month** | **Suitable for thousands of users** |

## Troubleshooting

### "Unauthorized" Error
- Check `NEXTAUTH_URL` matches your domain exactly
- Generate new `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- Clear browser cookies and try again

### AI Features Not Working
- Verify Groq API key is valid at https://console.groq.com
- Check HuggingFace token at https://huggingface.co/settings/tokens
- Review Vercel function logs for errors

### Database Connection Failed
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` matches Supabase project
- Ensure SQL schema was executed in Supabase

### User Can't Sign Up
- Supabase Auth must be enabled in project
- Check row level security policies are in place
- Verify email format validation

## Monitoring & Analytics

### Supabase Dashboard
- Check database size and connections
- Monitor real-time database activity
- Review authentication logs

### Vercel Analytics
- Function execution times and errors
- Edge network performance
- Deployment history

### Groq API Console
- Monitor API usage and quotas
- Check request/response times
- Set up usage alerts

## Scaling to Paid Features

When you're ready to monetize:

1. **Add Stripe Integration**
   - Install: `npm install @stripe/stripe-js`
   - Create pricing page
   - Add subscription table to Supabase
   - Update rate limits based on plan

2. **Upgrade Limits**
   ```typescript
   // Free: 5/day
   // Pro ($9.99/month): 50/day
   // Enterprise: Unlimited
   ```

3. **Supabase Scaling**
   - Free tier: 500MB (plenty for MVP)
   - Pro: $25/month for 8GB + better support
   - Custom: Per your needs

## Backup & Recovery

### Automatic Backups
- Supabase includes automatic daily backups
- Retained for 14 days (Pro) or 3 days (Free)
- Access via Backups tab in Supabase dashboard

### Manual Export
```bash
# In Supabase SQL Editor:
SELECT * FROM users;
SELECT * FROM documents;
SELECT * FROM ai_requests;
# Export as CSV or JSON
```

## Custom Domain Setup

1. Purchase domain (e.g., studyos.com)
2. In Vercel dashboard → Settings → Domains
3. Add your domain
4. Update DNS records (Vercel will provide)
5. Update `NEXTAUTH_URL` environment variable
6. Test authentication with new domain

## Security Best Practices

- Never commit `.env.local` to git
- Rotate API keys quarterly
- Enable 2FA on Supabase account
- Monitor Vercel function logs for suspicious activity
- Use RLS policies (already configured)
- Keep dependencies updated: `npm update`

---

**You're live!** Your StudyOS SaaS is ready to accept real users and scale. Start with the free tier and upgrade services only when needed.
