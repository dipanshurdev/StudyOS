import type React from "react";
import { ModernSidebar } from "@/components/dashboard/modern-sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/db";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let userDetails;
  try {
    userDetails = await getOrCreateUser({
      id: user.id,
      email: user.email!,
      display_name:
        user.user_metadata?.full_name || user.email?.split("@")[0] || "Student",
    });
  } catch (e) {
    userDetails = {
      plan_type: "free",
      display_name: user.email?.split("@")[0] || "Student",
    };
  }

  const userData = {
    email: user.email,
    name: userDetails.display_name,
    plan_type: userDetails.plan_type || "free",
  };

  return (
    <div className="relative flex h-screen bg-linear-to-br from-background via-background to-muted/20">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl dark:bg-primary/20" />
        <div className="absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/20" />
      </div>
      <ModernSidebar user={userData} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto bg-background/50">
          {children}
        </main>
      </div>
    </div>
  );
}
