import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";

// Disabled until tenant authorization, portfolio context and usage limits are verified.
// No Anthropic request is made and no client data leaves the application.
export async function POST() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  return NextResponse.json(
    { error: "Assistente temporariamente indisponível durante a validação de segurança." },
    { status: 503 }
  );
}
