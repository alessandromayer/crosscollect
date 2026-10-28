import { requireAuth } from "@/lib/require-auth";
import { NextResponse } from "next/server";

export async function POST() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  return NextResponse.json(
    { error: "Integração temporariamente desativada até a validação de permissões e modo de testes." },
    { status: 503 }
  );
}
