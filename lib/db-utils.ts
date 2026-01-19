import { supabaseAdmin } from "./supabase"

export async function getUserPlan(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("plan_type, ai_credits_used_today, ai_credits_monthly, last_credit_reset")
    .eq("id", userId)
    .single()

  if (error) {
    console.error("Error getting user plan:", error)
    return { plan_type: "free", ai_credits_used_today: 0, ai_credits_monthly: 5 }
  }

  // Reset credits if it's a new day
  const now = new Date()
  const lastReset = data?.last_credit_reset ? new Date(data.last_credit_reset) : new Date(0)
  const isNewDay = lastReset.getDate() !== now.getDate()

  if (isNewDay) {
    await supabaseAdmin
      .from("users")
      .update({ ai_credits_used_today: 0, last_credit_reset: now.toISOString() })
      .eq("id", userId)

    return { plan_type: data?.plan_type || "free", ai_credits_used_today: 0, ai_credits_monthly: 5 }
  }

  return data || { plan_type: "free", ai_credits_used_today: 0, ai_credits_monthly: 5 }
}

export async function checkAILimits(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  const userPlan = await getUserPlan(userId)

  const limit = userPlan.plan_type === "free" ? 5 : userPlan.plan_type === "pro" ? 50 : 999

  const remaining = limit - userPlan.ai_credits_used_today

  return {
    allowed: remaining > 0,
    remaining: Math.max(0, remaining),
  }
}

export async function incrementAIUsage(userId: string) {
  const { error } = await supabaseAdmin
    .from("users")
    .update({ ai_credits_used_today: supabaseAdmin.rpc("increment", { x: 1 }) })
    .eq("id", userId)

  if (error) console.error("Error incrementing AI usage:", error)
}

export async function logAIRequest(userId: string, action: string, documentId?: string) {
  const { error } = await supabaseAdmin.from("ai_requests").insert({
    user_id: userId,
    document_id: documentId,
    action_type: action,
  })

  if (error) console.error("Error logging AI request:", error)
}

export async function getOrCreateUser(user: any) {
  const { data: existingUser } = await supabaseAdmin.from("users").select("*").eq("id", user.id).single()

  if (existingUser) return existingUser

  const { data: newUser, error } = await supabaseAdmin
    .from("users")
    .insert({
      id: user.id,
      email: user.email,
      display_name: user.name,
      avatar_url: user.image,
    })
    .select()
    .single()

  if (error) console.error("Error creating user:", error)
  return newUser
}
