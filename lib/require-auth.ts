import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function requireAuth() {
  const supabase = createServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { user: null, error: NextResponse.json({ error: "Não autorizado" }, { status: 401 }) };
  return { user, error: null };
}
