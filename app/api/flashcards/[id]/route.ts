import { createClient } from "@/lib/supabase/server";
import { updateFlashcardReview } from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { quality } = body; // Quality: 0-5 (0=complete blackout, 5=perfect recall)

    if (typeof quality !== "number" || quality < 0 || quality > 5) {
      return NextResponse.json(
        { error: "Quality must be a number between 0 and 5" },
        { status: 400 },
      );
    }

    const updated = await updateFlashcardReview(params.id, quality);

    return NextResponse.json({ flashcard: updated, success: true });
  } catch (error) {
    console.error("Flashcard review error:", error);
    return NextResponse.json(
      { error: "Failed to update flashcard review" },
      { status: 500 },
    );
  }
}
