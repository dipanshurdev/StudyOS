import type React from "react";
import { ModernSidebar } from "@/components/dashboard/modern-sidebar";
import { CommandPalette } from "@/components/dashboard/command-palette";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getOrFetchUser } from "@/lib/db";

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

  const userDetails =
    (await getOrFetchUser({
      id: user.id,
      email: user.email!,
      display_name:
        user.user_metadata?.full_name || user.email?.split("@")[0] || "Student",
    })) ??
    ({
      plan_type: "free",
      display_name: user.email?.split("@")[0] || "Student",
    } as any);

  const userData = {
    email: user.email,
    name: userDetails.display_name,
    plan_type: userDetails.plan_type || "free",
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <CommandPalette />
      <ModernSidebar user={userData} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
