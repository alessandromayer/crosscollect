import { createServerClient } from "@/lib/supabase-server";
export async function getOwnCredorId(userId: string) {
  const db = createServerClient();
  const { data, error } = await db.from("credores").select("id").eq("owner_user_id", userId).maybeSingle();
  if (error) throw error;
  return data?.id as string | undefined;
}
