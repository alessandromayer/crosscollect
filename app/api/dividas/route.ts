import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getOwnCredorId } from "@/lib/tenant";
import { rowToDebt, toBRL, type DbDivida, type DbHistorico } from "@/lib/supabase-admin";
import { createServerClient } from "@/lib/supabase-server";

// GET /api/dividas — list all debts for default creditor
export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  try {
    const credorId = await getOwnCredorId(auth.user!.id);
    if (!credorId) return NextResponse.json({ error: "Empresa não vinculada" }, { status: 403 });
    const db = createServerClient();
    const { data, error } = await db
      .from("dividas")
      .select("*")
      .eq("credor_id", credorId)
      .order("criado_em", { ascending: false });

    if (error) throw error;

    const debts = (data as DbDivida[]).map((row) => rowToDebt(row, []));
    return NextResponse.json(debts);
  } catch (err) {
    console.error("[GET /api/dividas]", err);
    return NextResponse.json({ error: "Erro ao buscar dívidas" }, { status: 500 });
  }
}

// POST /api/dividas — create a new debt
export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  try {
    const credorId = await getOwnCredorId(auth.user!.id);
    if (!credorId) return NextResponse.json({ error: "Empresa não vinculada" }, { status: 403 });
    const db = createServerClient();
    const body = await req.json();

    if (!Number.isFinite(Number(body.valor)) || Number(body.valor) <= 0 || !body.devedor_nome || !body.devedor_doc || !body.descricao) return NextResponse.json({ error: "Dados obrigatórios inválidos" }, { status: 400 });
    const valorBrl = toBRL(Number(body.valor), body.moeda || "USD");

    const { data, error } = await db
      .from("dividas")
      .insert({
        credor_id: credorId,
        devedor_nome: body.devedor_nome,
        devedor_doc: body.devedor_doc,
        devedor_email: body.devedor_email || null,
        devedor_tel: body.devedor_tel || null,
        devedor_cidade: body.devedor_cidade || null,
        devedor_estado: body.devedor_estado || null,
        devedor_tipo: body.devedor_tipo || "pessoa_juridica",
        descricao: body.descricao,
        valor: Number(body.valor),
        moeda: body.moeda || "USD",
        valor_brl: valorBrl,
        taxa_cambio: valorBrl / Number(body.valor),
        data_vencimento: body.data_vencimento || null,
        observacoes: body.observacoes || null,
        regime_cobranca: body.regime_cobranca || [],
        status: "pendente",
      })
      .select()
      .single();

    if (error) throw error;

    // Insert initial timeline event
    const { error: historyError } = await db.from("historico_acoes").insert({
      divida_id: (data as DbDivida).id,
      tipo: "cadastro",
      descricao: "Dívida cadastrada no sistema",
      autor: auth.user!.email || auth.user!.id,
    });
    if (historyError) console.error("[POST /api/dividas] historical event not saved", historyError);

    const { data: hist } = await db
      .from("historico_acoes")
      .select("*")
      .eq("divida_id", (data as DbDivida).id);

    return NextResponse.json(rowToDebt(data as DbDivida, (hist as DbHistorico[]) || []), { status: 201 });
  } catch (err) {
    console.error("[POST /api/dividas]", err);
    const msg = err instanceof Error ? err.message : "Erro ao criar dívida";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
