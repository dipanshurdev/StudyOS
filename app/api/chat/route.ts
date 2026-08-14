import { createClient } from "@/lib/supabase/server";
import { generateAIResponse } from "@/lib/ai";
import { AILimitError } from "@/lib/ai-errors";
import { checkRateLimit, recordAIUsage } from "@/lib/api-limits";
import { supabaseAdmin } from "@/lib/supabase";
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

    const body = await request.json();
    const { message, conversationId, documentId, conversationHistory } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    // Enforce the daily plan limit server-side.
    const { allowed } = await checkRateLimit(user.id);
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

    // Get or create conversation
    let convId = conversationId;
    if (!convId) {
      const { data: newConv, error: convError } = await supabaseAdmin
        .from("ai_conversations")
        .insert({
          user_id: user.id,
          document_id: documentId || null,
          title: message.substring(0, 50),
        } as any)
        .select()
        .single();

      if (convError) throw convError;
      convId = newConv.id;
    }

    // Save user message
    await supabaseAdmin.from("ai_messages").insert({
      conversation_id: convId,
      role: "user",
      content: message,
    } as any);

    // Generate AI response
    const history = conversationHistory || [];
    const result = await generateAIResponse("chat", message, history);

    // Save AI response
    await supabaseAdmin.from("ai_messages").insert({
      conversation_id: convId,
      role: "assistant",
      content: result,
    } as any);

    // Record usage
    await recordAIUsage(user.id, "chat", documentId);

    return NextResponse.json({
      message: result,
      conversationId: convId,
      success: true,
    });
  } catch (error) {
    console.error("Chat API error:", error);

    if (error instanceof AILimitError) {
      return NextResponse.json(
        { error: "Invalid request", message: error.message },
        { status: error.status },
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    if (errorMessage.includes("temporarily unavailable")) {
      return NextResponse.json(
        { error: "Service unavailable", message: errorMessage },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to process chat message",
        message: errorMessage || "Unable to process your message. Please try again.",
      },
      { status: 500 },
    );
  }
}
