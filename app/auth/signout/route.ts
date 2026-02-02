import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

async function signOutAndRedirect() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
}

export async function GET() {
  return signOutAndRedirect();
}

export async function POST() {
  return signOutAndRedirect();
}
