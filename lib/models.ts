// Pure Supabase models - no MongoDB dependencies
export interface User {
  id: string
  email: string
  display_name: string
  avatar_url: string | null
  plan_type: "free" | "pro" | "enterprise"
  ai_credits_used_today: number
  ai_credits_monthly: number
  last_credit_reset: string
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  user_id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

export interface AIRequest {
  id: string
  user_id: string
  document_id: string | null
  action_type: "summarize" | "explain" | "questions"
  created_at: string
}

export { getUserById, createUser, getOrCreateUser, getUserDocuments, createDocument } from "./db"
