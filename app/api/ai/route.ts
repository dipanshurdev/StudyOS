import { createClient } from "@/lib/supabase/server";
import { generateAIResponse } from "@/lib/ai";
import { recordAIUsage } from "@/lib/api-limits";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;
    const body = await request.json();
    const { action, content, documentId } = body;

    if (!action || !content) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          message: "Please provide action and content",
        },
        { status: 400 },
      );
    }

    if (
      !["summarize", "explain", "questions", "flashcards", "mindmap"].includes(
        action,
      )
    ) {
      return NextResponse.json(
        {
          error: "Invalid action",
          message:
            "Action must be summarize, explain, questions, flashcards, or mindmap",
        },
        { status: 400 },
      );
    }

    if (typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Invalid content",
          message: "Content must be a non-empty string",
        },
        { status: 400 },
      );
    }

    console.log(`[v0] Processing ${action}, content length: ${content.length}`);

    const conversationHistory = body.conversationHistory || undefined;
    const result = await generateAIResponse(
      action as any,
      content,
      conversationHistory,
    );

    // Note: recordAIUsage likely needs update too if it used NextAuth,
    // but it likely takes userId which we are passing correctly now.
    await recordAIUsage(userId, action, documentId);

    return NextResponse.json({
      result,
      remaining: 0, // client should refetch usage to be accurate
      success: true,
    });
  } catch (error) {
    console.error("[v0] AI API error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    if (errorMessage.includes("temporarily unavailable")) {
      return NextResponse.json(
        {
          error: "Service unavailable",
          message: errorMessage,
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        error: "Processing failed",
        message: "Unable to process your request. Please try again.",
      },
      { status: 500 },
    );
  }
}
