import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: documents, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) { 
        throw error 
    }

    return NextResponse.json({
      documents: documents || [],
    })
  } catch (error) {
    console.error("[v0] Documents API error:", error)
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content } = await request.json()

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const { data: newDocument, error } = await supabase
      .from("documents")
      .insert({
        user_id: user.id,
        title,
        content: content || "",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(newDocument, { status: 201 })
  } catch (error) {
    console.error("[v0] Create document error:", error)
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 })
  }
}
