import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { checkAndResetCredits } from "@/lib/api-limits";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure credits are reset if new day
    await checkAndResetCredits(user.id);

    // Fetch real usage stats from public.users table
    const { data: userData, error } = await supabase
      .from("users")
      .select("plan_type, ai_credits_used_today")
      .eq("id", user.id)
      .single();

    if (error || !userData) {
      return NextResponse.json({
        allowed: true,
        remaining: 10,
        used: 0,
        limit: 10,
        plan_type: "free",
        message: "Welcome! Start your study session today.",
      });
    }

    const limit = userData.plan_type === "pro" ? 100 : 10;
    const used = userData.ai_credits_used_today || 0;
    const remaining = Math.max(0, limit - used);

    return NextResponse.json({
      allowed: remaining > 0,
      remaining,
      usage: used,
      used,
      limit,
      plan_type: userData.plan_type,
      message:
        remaining > 0
          ? `You have ${remaining} AI actions remaining today.`
          : "Daily limit reached. Upgrade to Pro for 100 actions/day!",
    });
  } catch (error) {
    console.error("[v0] Usage API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage" },
      { status: 500 },
    );
  }
}
