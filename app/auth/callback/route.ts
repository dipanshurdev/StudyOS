import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/db";
import { getAppUrl } from "@/lib/app-url";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const { searchParams } = url;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  // Redirect base: same origin as request (so preview vs production stays consistent)
  const baseUrl = getAppUrl(request);

  // No code: might be duplicate callback or expired link
  if (!code) {
    return NextResponse.redirect(`${baseUrl}/login?error=no_code`);
  }

  const supabase = await createClient();
  const { error, data } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Auth callback exchange error:", error.message);
    return NextResponse.redirect(`${baseUrl}/login?error=auth`);
  }

  if (data?.user) {
    try {
      await getOrCreateUser({
        id: data.user.id,
        email: data.user.email!,
        display_name:
          data.user.user_metadata.full_name || data.user.email!.split("@")[0],
      });
    } catch (err) {
      console.error("Error creating user record:", err);
    }

    const redirectTo = next.startsWith("/") ? next : `/${next}`;
    return NextResponse.redirect(`${baseUrl}${redirectTo}`);
  }

  return NextResponse.redirect(`${baseUrl}/login?error=auth`);
}
