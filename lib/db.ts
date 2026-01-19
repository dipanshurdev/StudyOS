// Pure Supabase database utilities
import { supabaseAdmin } from "./supabase"
import type { User, Document } from "./models"

export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await supabaseAdmin.from("users").select("*").eq("id", userId).single()

  if (error) return null
  return data as User
}

export async function createUser(user: Partial<User>) {
  const { data, error } = await supabaseAdmin.from("users").insert(user as any).select().single()

  if (error) throw error
  return data as User
}

export async function getOrCreateUser(user: { id: string; email: string; display_name: string }): Promise<User> {
  // Use try/catch to handle potential errors including uniqueness violations
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .upsert({
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        updated_at: new Date().toISOString(),
      } as any, { onConflict: 'id' })
      .select()
      .single()

    if (error) {
      // Check for email uniqueness violation (23505)
      // This happens if the user exists with a different ID
      if (error.code === '23505' && error.message.includes('email')) {
         console.warn("Email conflict detected for", user.email, "Attempting to fix staleness...")
         
         // Delete the old record that has this email but different ID
         await supabaseAdmin.from("users").delete().eq("email", user.email)
         
         // Retry the upsert
         const { data: retryData, error: retryError } = await supabaseAdmin
           .from("users")
           .upsert({
             id: user.id,
             email: user.email,
             display_name: user.display_name,
             updated_at: new Date().toISOString(),
           } as any, { onConflict: 'id' })
           .select()
           .single()
           
         if (retryError) throw retryError
         return retryData as User
      }
      throw error
    }
    
    if (data) return data as User

    // Fallback: fetch the user
    const existingUser = await getUserById(user.id)
    if (!existingUser) {
       throw new Error("Failed to create or retrieve user")
    }
    return existingUser
  } catch (error) {
    console.error("Error in getOrCreateUser:", error)
    throw error
  }
}


export async function getUserDocuments(userId: string): Promise<Document[]> {
  const { data, error } = await supabaseAdmin
    .from("documents")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) return []
  return (data || []) as Document[]
}

export async function createDocument(userId: string, title: string, content: string): Promise<Document> {
  const { data, error } = await supabaseAdmin
    .from("documents")
    .insert({
      user_id: userId,
      title,
      content,
    } as any)
    .select()
    .single()

  if (error) throw error
  return data as Document
}
