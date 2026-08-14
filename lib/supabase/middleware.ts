import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PRODUCTION_HOST =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, "").split("/")[0] ??
  "studyos-ai.vercel.app";

const AUTH_COOKIE_PREFIX = "sb-";
const AUTH_COOKIE_SUFFIX = "-auth-token";

function isPreviewDeployment(host: string): boolean {
  return host !== PRODUCTION_HOST && host.endsWith("vercel.app");
}

function isInvalidRefreshTokenError(error: any): boolean {
  if (!error) return false;
  const message = String(error.message ?? "").toLowerCase();
  const code = String(error.code ?? "");
  return (
    code.includes("refresh_token_not_found") ||
    message.includes("invalid refresh token") ||
    message.includes("refresh token not found")
  );
}

function isAuthCookie(name: string): boolean {
  return name.startsWith(AUTH_COOKIE_PREFIX) && name.endsWith(AUTH_COOKIE_SUFFIX);
}

function clearAuthCookies(request: NextRequest, response: NextResponse): NextResponse {
  for (const cookie of request.cookies.getAll()) {
    if (isAuthCookie(cookie.name)) {
      response.cookies.set(cookie.name, "", { maxAge: 0, path: "/" });
    }
  }
  return response;
}

export async function updateSession(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const host = request.nextUrl.host;

  // All traffic from preview URLs goes to production so auth and cookies
  // use one domain only. Stops the login → different URL → login cycle.
  if (isPreviewDeployment(host)) {
    const productionUrl = new URL(
      pathname + request.nextUrl.search,
      `https://${PRODUCTION_HOST}`
    );
    return NextResponse.redirect(productionUrl);
  }

  // If Supabase OAuth redirected to / (or any page) with ?code=..., send to callback
  // so the code is exchanged and user is redirected to dashboard.
  const code = searchParams.get("code");
  if (code && pathname !== "/auth/callback") {
    const callbackUrl = new URL("/auth/callback", request.url);
    callbackUrl.search = request.nextUrl.search;
    if (!callbackUrl.searchParams.has("next")) {
      callbackUrl.searchParams.set("next", "/dashboard");
    }
    return NextResponse.redirect(callbackUrl);
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  let user = null;
  try {
    const {
      data: { user: currentUser },
      error,
    } = await supabase.auth.getUser();

    // A stale/revoked refresh token makes every request retry the refresh
    // endpoint and log "Invalid Refresh Token: Refresh Token Not Found".
    // Drop the dead cookies so the user gets a clean session instead of an
    // infinite loop of failed refreshes.
    if (error && isInvalidRefreshTokenError(error)) {
      if (request.nextUrl.pathname.startsWith("/dashboard")) {
        const redirect = NextResponse.redirect(new URL("/login", request.url));
        return clearAuthCookies(request, redirect);
      }
      const next = NextResponse.next({ request });
      return clearAuthCookies(request, next);
    }

    user = currentUser ?? null;
  } catch {
    user = null;
  }

  if (request.nextUrl.pathname.startsWith("/dashboard") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (request.nextUrl.pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}
