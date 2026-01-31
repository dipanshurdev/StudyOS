import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { getOrCreateUser } from "@/lib/db"
import { getAppUrl } from "@/lib/app-url"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  // Use deploy-aware base URL so redirects always go to the app (not localhost)
  const baseUrl = getAppUrl(request)

  if (code) {
    const supabase = await createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data?.user) {
      try {
        await getOrCreateUser({
          id: data.user.id,
          email: data.user.email!,
          display_name: data.user.user_metadata.full_name || data.user.email!.split("@")[0],
        })
      } catch (err) {
        console.error("Error creating user record:", err)
      }

      return NextResponse.redirect(`${baseUrl}${next}`)
    }
  }

  return NextResponse.redirect(`${baseUrl}/login?error=auth`)
}
