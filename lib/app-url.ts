/**
 * Returns the canonical app base URL for redirects and links.
 * Use this in server code (API routes, server components) so auth redirects
 * always go to the deployed URL, not localhost.
 *
 * Priority:
 * 1. NEXT_PUBLIC_APP_URL (explicit production URL)
 * 2. VERCEL_URL (set automatically on Vercel: "studyos-ai.vercel.app")
 * 3. x-forwarded-host from request (when behind proxy)
 * 4. Fallback for local dev
 */
export function getAppUrl(request?: Request): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL
  if (explicit) {
    return explicit.replace(/\/$/, "") // no trailing slash
  }

  const vercelUrl = process.env.VERCEL_URL
  if (vercelUrl) {
    return `https://${vercelUrl}`
  }

  if (request) {
    const forwardedHost = request.headers.get("x-forwarded-host")
    if (forwardedHost) {
      const proto = request.headers.get("x-forwarded-proto") ?? "https"
      return `${proto}://${forwardedHost}`
    }
  }

  if (process.env.NODE_ENV === "development") {
    return process.env.NEXTAUTH_URL ?? "http://localhost:3000"
  }

  return "https://studyos-ai.vercel.app"
}
