import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/db";
import { getAppUrl } from "@/lib/app-url";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const { searchParams } = url;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  const baseUrl = getAppUrl(request);

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/login?error=no_code`);
  }

  const redirectTo = next.startsWith("/") ? next : `/${next}`;
  const successRedirect = `${baseUrl}${redirectTo}`;
  const errorRedirect = `${baseUrl}/login?error=auth`;

  // Build the response we will return. We MUST set session cookies on THIS
  // response so the browser receives them; cookieStore.set() in route handlers
  // does not attach to a later NextResponse.redirect().
  const response = NextResponse.redirect(successRedirect);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { error, data } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Auth callback exchange error:", error.message);
    return NextResponse.redirect(errorRedirect);
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
    return response;
  }

  return NextResponse.redirect(errorRedirect);
}
