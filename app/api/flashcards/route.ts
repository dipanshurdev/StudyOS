import { createClient } from "@/lib/supabase/server";
import { createFlashcards, getUserFlashcards } from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get("documentId") || undefined;

    const flashcards = await getUserFlashcards(user.id, documentId);

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error("Flashcards GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch flashcards" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { documentId, flashcards } = body;

    if (!flashcards || !Array.isArray(flashcards)) {
      return NextResponse.json(
        { error: "Invalid flashcards data" },
        { status: 400 },
      );
    }

    const created = await createFlashcards(
      user.id,
      documentId || null,
      flashcards,
    );

    return NextResponse.json({ flashcards: created, success: true });
  } catch (error) {
    console.error("Flashcards POST error:", error);
    return NextResponse.json(
      { error: "Failed to create flashcards" },
      { status: 500 },
    );
  }
}
