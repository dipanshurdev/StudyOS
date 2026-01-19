import type React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const userData = {
    email: user.email,
    name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Student",
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={userData} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={userData} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
