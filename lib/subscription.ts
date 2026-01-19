import { supabaseAdmin } from "./supabase"

export type PlanType = "free" | "pro" | "enterprise"

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    monthlyCredits: 5,
    features: ["5 AI actions per day", "Unlimited documents", "Basic summaries", "Limited explanations"],
  },
  pro: {
    name: "Pro",
    price: 9.99,
    monthlyCredits: 50,
    features: [
      "50 AI actions per day",
      "Priority support",
      "Advanced explanations",
      "Interview prep",
      "PDF export",
      "Custom AI instructions",
    ],
  },
  enterprise: {
    name: "Enterprise",
    price: 29.99,
    monthlyCredits: 999,
    features: [
      "Unlimited AI actions",
      "24/7 priority support",
      "Custom integrations",
      "Team collaboration",
      "Advanced analytics",
      "SLA guarantee",
    ],
  },
}

export async function upgradePlan(userId: string, newPlan: PlanType) {
  const { error } = await supabaseAdmin
    .from("users")
    .update({
      plan_type: newPlan,
      ai_credits_monthly: PLANS[newPlan].monthlyCredits,
    })
    .eq("id", userId)

  if (error) {
    console.error("[v0] Error upgrading plan:", error)
    throw error
  }
}

export async function downgradeToFree(userId: string) {
  await upgradePlan(userId, "free")
}

export async function getUserSubscription(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("plan_type, ai_credits_monthly, ai_credits_used_today")
    .eq("id", userId)
    .single()

  if (error) {
    console.error("[v0] Error fetching subscription:", error)
    return {
      plan: "free",
      monthlyCredits: PLANS.free.monthlyCredits,
      creditsUsed: 0,
    }
  }

  return {
    plan: data?.plan_type || "free",
    monthlyCredits: data?.ai_credits_monthly || PLANS.free.monthlyCredits,
    creditsUsed: data?.ai_credits_used_today || 0,
  }
}
