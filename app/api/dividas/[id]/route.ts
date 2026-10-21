import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getOwnCredorId } from "@/lib/tenant";
import { getSupabaseAdmin, rowToDebt, type DbDivida, type DbHistorico } from "@/lib/supabase-admin";

// GET /api/dividas/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  try {
    const credorId = await getOwnCredorId(auth.user!.id);
    if (!credorId) return NextResponse.json({ error: "Empresa não vinculada" }, { status: 403 });
    const db = getSupabaseAdmin();
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

// PATCH /api/dividas/[id] — update status or add timeline event
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  try {
    const credorId = await getOwnCredorId(auth.user!.id);
    if (!credorId) return NextResponse.json({ error: "Empresa não vinculada" }, { status: 403 });
    const db = getSupabaseAdmin();
    const body = await req.json();

    const updates: Record<string, unknown> = {};
    if (body.status) {
      if (!["pendente", "em_negociacao", "pago", "vencido", "cancelado"].includes(body.status)) return NextResponse.json({ error: "Status inválido" }, { status: 400 });
      updates.status = body.status;
      if (body.status === "pago") updates.pago_em = new Date().toISOString();
    }

    if (!body.status && !body.nota) return NextResponse.json({ error: "Nenhuma alteração" }, { status: 400 });
    const { data, error } = await db
      .from("dividas")
      .update(updates)
      .eq("id", params.id)
      .eq("credor_id", credorId)
      .select()
      .single();

    if (error) throw error;

    // Log timeline event
    if (body.status) {
      await db.from("historico_acoes").insert({
        divida_id: params.id,
        tipo: "atualizacao",
        descricao: `Status alterado para "${body.status}"`,
        autor: auth.user!.email || auth.user!.id,
      });
    }
    if (body.nota) {
      await db.from("historico_acoes").insert({
        divida_id: params.id,
        tipo: "atualizacao",
        descricao: body.nota,
        autor: auth.user!.email || auth.user!.id,
      });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[PATCH /api/dividas/[id]]", err);
    return NextResponse.json({ error: "Erro ao atualizar dívida" }, { status: 500 });
  }
}
