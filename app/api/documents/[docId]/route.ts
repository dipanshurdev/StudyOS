import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ docId: string }> }) {
  try {
    const { docId } = await params;
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content } = await request.json()

    const { data, error } = await supabase
      .from("documents")
      .update({ title, content, updated_at: new Date().toISOString() })
      .eq("id", docId)
      .eq("user_id", user.id) // Security check via RLS or explicit check
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Document not found or access denied" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Update document error:", error)
    return NextResponse.json({ error: "Failed to update document" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ docId: string }> }) {
  try {
    const { docId } = await params;
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("documents")
      .delete()
      .eq("id", docId)
      .eq("user_id", user.id)
      .select()

    if (error || !data || data.length === 0) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete document error:", error)
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 })
  }
}
