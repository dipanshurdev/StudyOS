import { supabaseAdmin } from "./supabase";

const PLAN_LIMITS = {
  free: 10, // Increased from 5 for better free tier experience
  pro: 100, // Increased from 50 for better value
  enterprise: 999,
};

export async function checkAndResetCredits(userId: string) {
  const { data: user } = await supabaseAdmin
    .from("users")
    .select("last_credit_reset, plan_type")
    .eq("id", userId)
    .single();

  if (!user) return;

  const now = new Date();
  const lastReset = user.last_credit_reset
    ? new Date(user.last_credit_reset)
    : new Date(0);

  // Local day check
  const isNewDay = lastReset.toDateString() !== now.toDateString();

  if (isNewDay) {
    await supabaseAdmin
      .from("users")
      .update({
        ai_credits_used_today: 0,
        last_credit_reset: now.toISOString(),
      })
      .eq("id", userId);

    return true;
  }
  return false;
}

export async function checkRateLimit(
  userId: string,
): Promise<{ allowed: boolean; remaining: number }> {
  await checkAndResetCredits(userId);

  const { data: user, error } = await supabaseAdmin
    .from("users")
    .select("plan_type, ai_credits_used_today")
    .eq("id", userId)
    .single();

  if (error || !user) {
    console.error("[v0] Error checking rate limit:", error);
    return { allowed: false, remaining: 0 };
  }

  const limit =
    PLAN_LIMITS[(user.plan_type as keyof typeof PLAN_LIMITS) || "free"];
  const used = user.ai_credits_used_today || 0;
  const remaining = Math.max(0, limit - used);

  return {
    allowed: remaining > 0,
    remaining,
  };
}

export async function recordAIUsage(
  userId: string,
  actionType:
    | "summarize"
    | "explain"
    | "questions"
    | "flashcards"
    | "mindmap"
    | "chat",
  documentId?: string,
) {
  const { data: user } = await supabaseAdmin
    .from("users")
    .select("ai_credits_used_today")
    .eq("id", userId)
    .single();

  const newCount = (user?.ai_credits_used_today || 0) + 1;

  // Insert AI request log
  const { error: logError } = await supabaseAdmin.from("ai_requests").insert({
    user_id: userId,
    document_id: documentId || null,
    action_type: actionType,
  });

  if (logError) {
    console.error("[v0] Error logging AI request:", logError);
  }

  // Update usage count and study streak
  const today = new Date().toISOString().split("T")[0];
  const lastStudyDate = user?.last_study_date || null;

  let streakUpdate: any = {};
  if (!lastStudyDate || lastStudyDate !== today) {
    const lastDate = lastStudyDate ? new Date(lastStudyDate) : null;
    const todayDate = new Date(today);

    if (!lastDate) {
      // First study session
      streakUpdate = {
        study_streak: 1,
        last_study_date: today,
        longest_streak: 1,
      };
    } else {
      const diffDays = Math.floor(
        (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays === 1) {
        // Continue streak
        const currentStreak = (user?.study_streak || 0) + 1;
        streakUpdate = {
          study_streak: currentStreak,
          last_study_date: today,
          longest_streak: Math.max(user?.longest_streak || 0, currentStreak),
        };
      } else {
        // Reset streak
        streakUpdate = {
          study_streak: 1,
          last_study_date: today,
        };
      }
    }
  }

  const { error: updateError } = await supabaseAdmin
    .from("users")
    .update({
      ai_credits_used_today: newCount,
      ...streakUpdate,
    })
    .eq("id", userId);

  if (updateError) {
    console.error("[v0] Error incrementing AI credits:", updateError);
  }
}

export async function getUserPlan(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("plan_type, ai_credits_used_today, ai_credits_monthly")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("[v0] Error getting user plan:", error);
    return {
      plan_type: "free",
      ai_credits_used_today: 0,
      ai_credits_monthly: 5,
    };
  }

  return data;
}
