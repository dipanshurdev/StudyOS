import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Editor } from "@/components/dashboard/editor"
import { getUserById } from "@/lib/db"

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ docId: string }>;
}) {
  const { docId } = await params;
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch document with RLS context if possible, but safe to use admin for server component fetching 
  // if we verify ownership. 
  // Or just use the supabase client which has the auth context!
  
  const { data: doc, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", docId)
    .single()

  if (error || !doc) {
    // If error is 406 (Not Acceptable) or empty, it means RLS blocked it or not found
    console.error("Error loading document or not found:", error)
    redirect("/dashboard")
  }

  // Double check ownership although RLS should handle it
  if (doc.user_id !== user.id) {
    redirect("/dashboard")
  }

  return <Editor initialDocument={doc} userId={user.id} />
}
