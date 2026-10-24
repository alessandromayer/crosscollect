import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getOwnCredorId } from "@/lib/tenant";
import { rowToDebt, type DbDivida, type DbHistorico } from "@/lib/supabase-admin";
import { createServerClient } from "@/lib/supabase-server";

// GET /api/dividas/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  try {
    const credorId = await getOwnCredorId(auth.user!.id);
    if (!credorId) return NextResponse.json({ error: "Empresa não vinculada" }, { status: 403 });
    const db = createServerClient();
    const { data: divida, error } = await db
      .from("dividas")
      .select("*")
      .eq("id", params.id)
      .eq("credor_id", credorId)
      .single();

    if (error || !divida) {
      return NextResponse.json({ error: "Dívida não encontrada" }, { status: 404 });
    }

    const { data: hist } = await db
      .from("historico_acoes")
      .select("*")
      .eq("divida_id", params.id)
      .order("criado_em", { ascending: false });

    return NextResponse.json(rowToDebt(divida as DbDivida, (hist as DbHistorico[]) || []));
  } catch (err) {
    console.error("[GET /api/dividas/[id]]", err);
    return NextResponse.json({ error: "Erro ao buscar dívida" }, { status: 500 });
  }
}

// PATCH /api/dividas/[id] — administrative status or audit note only.
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  try {
    const credorId = await getOwnCredorId(auth.user!.id);
    if (!credorId) return NextResponse.json({ error: "Empresa não vinculada" }, { status: 403 });
    const db = createServerClient();
    const body = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }
    const validStatuses = ["pendente", "em_negociacao", "vencido", "cancelado"];
    if (body.status !== undefined && (typeof body.status !== "string" || !validStatuses.includes(body.status))) {
      return NextResponse.json({ error: "Status inválido; pagamentos exigem confirmação verificada" }, { status: 400 });
    }
    if (body.nota !== undefined && (typeof body.nota !== "string" || body.nota.trim().length > 2000)) {
      return NextResponse.json({ error: "Observação inválida" }, { status: 400 });
    }
    const nota = typeof body.nota === "string" ? body.nota.trim() : "";
    if (!body.status && !nota) return NextResponse.json({ error: "Nenhuma alteração" }, { status: 400 });

    // The database commits the status and its audit events together.
    const { data: updated, error } = await db.rpc("update_debt_with_history", {
      p_divida_id: params.id,
      p_status: body.status ?? null,
      p_nota: nota || null,
    }).single();
    if (error) {
      if (error.code === "PT404") return NextResponse.json({ error: "Dívida não encontrada" }, { status: 404 });
      if (error.code === "PT409") return NextResponse.json({ error: "Dívidas pagas não podem ter o status alterado por esta operação" }, { status: 409 });
      if (error.code === "22023" || error.code === "22P02") return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
      if (error.code === "PGRST202") return NextResponse.json({ error: "Atualização temporariamente indisponível" }, { status: 503 });
      throw error;
    }
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PATCH /api/dividas/[id]]", err);
    return NextResponse.json({ error: "Erro ao atualizar dívida" }, { status: 500 });
  }
}
