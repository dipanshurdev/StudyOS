// Pure Supabase database utilities
import { supabaseAdmin } from "./supabase";
import type { User, Document } from "./models";

export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;
  return data as User;
}

export async function createUser(user: Partial<User>) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .insert(user as any)
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

export async function getOrCreateUser(user: {
  id: string;
  email: string;
  display_name: string;
}): Promise<User> {
  // Use try/catch to handle potential errors including uniqueness violations
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .upsert(
        {
          id: user.id,
          email: user.email,
          display_name: user.display_name,
          updated_at: new Date().toISOString(),
        } as any,
        { onConflict: "id" },
      )
      .select()
      .single();

    if (error) {
      // Check for email uniqueness violation (23505)
      // This happens if the user exists with a different ID
      if (error.code === "23505" && error.message.includes("email")) {
        console.warn(
          "Email conflict detected for",
          user.email,
          "Attempting to fix staleness...",
        );

        // Delete the old record that has this email but different ID
        await supabaseAdmin.from("users").delete().eq("email", user.email);

        // Retry the upsert
        const { data: retryData, error: retryError } = await supabaseAdmin
          .from("users")
          .upsert(
            {
              id: user.id,
              email: user.email,
              display_name: user.display_name,
              updated_at: new Date().toISOString(),
            } as any,
            { onConflict: "id" },
          )
          .select()
          .single();

        if (retryError) throw retryError;
        return retryData as User;
      }
      throw error;
    }

    if (data) return data as User;

    // Fallback: fetch the user
    const existingUser = await getUserById(user.id);
    if (!existingUser) {
      throw new Error("Failed to create or retrieve user");
    }
    return existingUser;
  } catch (error) {
    console.error("Error in getOrCreateUser:", error);
    throw error;
  }
}

export async function getUserDocuments(userId: string): Promise<Document[]> {
  const { data, error } = await supabaseAdmin
    .from("documents")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data || []) as Document[];
}

export async function createDocument(
  userId: string,
  title: string,
  content: string,
): Promise<Document> {
  const { data, error } = await supabaseAdmin
    .from("documents")
    .insert({
      user_id: userId,
      title,
      content,
    } as any)
    .select()
    .single();

  if (error) throw error;
  return data as Document;
}

// Flashcard functions
export async function createFlashcards(
  userId: string,
  documentId: string | null,
  flashcards: Array<{ front: string; back: string }>,
): Promise<any[]> {
  const flashcardsData = flashcards.map((fc) => ({
    user_id: userId,
    document_id: documentId,
    front: fc.front,
    back: fc.back,
    difficulty: 2.5,
    interval_days: 1,
    repetitions: 0,
    ease_factor: 2.5,
    next_review_date: new Date().toISOString(),
  }));

  const { data, error } = await supabaseAdmin
    .from("flashcards")
    .insert(flashcardsData as any)
    .select();

  if (error) throw error;
  return data || [];
}

export async function getUserFlashcards(
  userId: string,
  documentId?: string,
): Promise<any[]> {
  let query = supabaseAdmin
    .from("flashcards")
    .select("*")
    .eq("user_id", userId)
    .order("next_review_date", { ascending: true });

  if (documentId) {
    query = query.eq("document_id", documentId);
  }

  const { data, error } = await query;

  if (error) return [];
  return data || [];
}

export async function updateFlashcardReview(
  flashcardId: string,
  quality: number,
): Promise<any> {
  // SM-2 algorithm implementation
  const { data: card } = await supabaseAdmin
    .from("flashcards")
    .select("*")
    .eq("id", flashcardId)
    .single();

  if (!card) throw new Error("Flashcard not found");

  let { ease_factor, interval_days, repetitions } = card;

  if (quality >= 3) {
    if (repetitions === 0) {
      interval_days = 1;
    } else if (repetitions === 1) {
      interval_days = 6;
    } else {
      interval_days = Math.round(interval_days * ease_factor);
    }
    repetitions += 1;
  } else {
    repetitions = 0;
    interval_days = 1;
  }

  ease_factor = Math.max(
    1.3,
    ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
  );

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval_days);

  const { data, error } = await supabaseAdmin
    .from("flashcards")
    .update({
      ease_factor,
      interval_days,
      repetitions,
      next_review_date: nextReviewDate.toISOString(),
      last_reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as any)
    .eq("id", flashcardId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Study streak functions
export async function updateStudyStreak(userId: string): Promise<void> {
  const { error } = await supabaseAdmin.rpc("update_study_streak", {
    user_id_param: userId,
  });

  if (error) {
    // Fallback manual update if function doesn't exist
    const user = await getUserById(userId);
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];
    const lastStudyDate = user.last_study_date;

    if (!lastStudyDate) {
      await supabaseAdmin
        .from("users")
        .update({
          study_streak: 1,
          last_study_date: today,
          longest_streak: 1,
        } as any)
        .eq("id", userId);
    } else if (lastStudyDate !== today) {
      const lastDate = new Date(lastStudyDate);
      const todayDate = new Date(today);
      const diffDays = Math.floor(
        (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays === 1) {
        // Continue streak
        await supabaseAdmin
          .from("users")
          .update({
            study_streak: (user.study_streak || 0) + 1,
            last_study_date: today,
            longest_streak: Math.max(
              user.longest_streak || 0,
              (user.study_streak || 0) + 1,
            ),
          } as any)
          .eq("id", userId);
      } else {
        // Reset streak
        await supabaseAdmin
          .from("users")
          .update({
            study_streak: 1,
            last_study_date: today,
          } as any)
          .eq("id", userId);
      }
    }
  }
}
