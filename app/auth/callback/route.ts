import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { getOrCreateUser } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    const supabase = await createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data?.user) {
      // Ensure user exists in public.users table
      try {
        await getOrCreateUser({
          id: data.user.id,
          email: data.user.email!,
          display_name: data.user.user_metadata.full_name || data.user.email!.split("@")[0]
        })
      } catch (err) {
        console.error("Error creating user record:", err)
      }

      const forwardedHost = request.headers.get("x-forwarded-host") // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development"
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth`)
}
