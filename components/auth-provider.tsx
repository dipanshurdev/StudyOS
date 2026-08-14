"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      switch (event) {
        case "SIGNED_OUT":
          router.push("/login");
          router.refresh();
          break;
        case "SIGNED_IN":
        case "TOKEN_REFRESHED":
        case "INITIAL_SESSION":
          // Keep server-rendered pages in sync with the browser session so
          // access tokens refreshed client-side are immediately readable by
          // middleware and server components.
          router.refresh();
          break;
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return <>{children}</>;
}
