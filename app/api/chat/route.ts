import { createClient } from "@/lib/supabase/server";
import { generateAIResponse } from "@/lib/ai";
import { recordAIUsage } from "@/lib/api-limits";
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
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 },
    );
  }
}
