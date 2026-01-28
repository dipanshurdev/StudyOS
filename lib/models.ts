// Pure Supabase models - no MongoDB dependencies
export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  plan_type: "free" | "pro" | "enterprise";
  ai_credits_used_today: number;
  ai_credits_monthly: number;
  last_credit_reset: string;
  study_streak?: number;
  longest_streak?: number;
  last_study_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface AIRequest {
  id: string;
  user_id: string;
  document_id: string | null;
  action_type:
    | "summarize"
    | "explain"
    | "questions"
    | "flashcards"
    | "mindmap"
    | "chat";
  created_at: string;
}

export interface Flashcard {
  id: string;
  user_id: string;
  document_id: string | null;
  front: string;
  back: string;
  difficulty: number;
  interval_days: number;
  repetitions: number;
  ease_factor: number;
  next_review_date: string;
  last_reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  document_id: string | null;
  session_type: "reading" | "review" | "practice" | "flashcard" | "mindmap";
  duration_minutes: number;
  started_at: string;
  ended_at: string | null;
  created_at: string;
}

export interface MindMap {
  id: string;
  user_id: string;
  document_id: string | null;
  title: string;
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface StudyPlan {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  daily_hours: number;
  plan_data: Record<string, any> | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocumentShare {
  id: string;
  document_id: string;
  shared_by: string;
  shared_with: string | null;
  access_level: "view" | "comment" | "edit";
  share_token: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface AIConversation {
  id: string;
  user_id: string;
  document_id: string | null;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface AIMessage {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface StudyAnalytics {
  id: string;
  user_id: string;
  date: string;
  documents_studied: number;
  flashcards_reviewed: number;
  study_time_minutes: number;
  ai_actions_used: number;
  created_at: string;
}

export {
  getUserById,
  createUser,
  getOrCreateUser,
  getUserDocuments,
  createDocument,
} from "./db";
