import { createClient } from "@/lib/supabase/server";
import { generateAIResponse } from "@/lib/ai";
import { AILimitError } from "@/lib/ai-errors";
import { checkRateLimit, recordAIUsage } from "@/lib/api-limits";
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

    // Enforce the daily plan limit server-side, not just on the client.
    const { allowed, remaining } = await checkRateLimit(userId);
    if (!allowed) {
      return NextResponse.json(
        {
          error: "Rate limit reached",
          message:
            "You've used all your AI actions for today. Upgrade to Pro for more.",
        },
        { status: 429 },
      );
    }

    console.log(`Processing ${action}, content length: ${content.length}`);

    const conversationHistory = body.conversationHistory || undefined;
    const result = await generateAIResponse(
      action as any,
      content,
      conversationHistory,
    );

    await recordAIUsage(userId, action, documentId);

    return NextResponse.json({
      result,
      remaining: Math.max(0, remaining - 1),
      success: true,
    });
  } catch (error) {
    console.error("AI API error:", error);

    if (error instanceof AILimitError) {
      return NextResponse.json(
        {
          error: "Invalid request",
          message: error.message,
        },
        { status: error.status },
      );
    }

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
        message: errorMessage || "Unable to process your request. Please try again.",
      },
      { status: 500 },
    );
  }
}
