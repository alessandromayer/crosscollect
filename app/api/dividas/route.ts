import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getOwnCredorId } from "@/lib/tenant";
import { rowToDebt, toBRL, type DbDivida, type DbHistorico } from "@/lib/supabase-admin";
import { createServerClient } from "@/lib/supabase-server";

// GET /api/dividas — list debts for the authenticated creditor
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

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }
    if ((typeof body.valor !== "number" && typeof body.valor !== "string")
      || ["devedor_nome", "devedor_doc", "descricao"].some((field) => typeof body[field] !== "string" || !body[field].trim())
      || !Number.isFinite(Number(body.valor)) || Number(body.valor) <= 0 || !body.devedor_nome || !body.devedor_doc || !body.descricao) return NextResponse.json({ error: "Dados obrigatórios inválidos" }, { status: 400 });
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

    if (error) {
      if (["22023", "22P02", "22007", "22008", "23514"].includes(error.code)) {
        return NextResponse.json({ error: "Dados inválidos para cadastro" }, { status: 400 });
      }
      throw error;
    }

    // The database trigger inserts the creation event in the same transaction.
    const { data: hist } = await db
      .from("historico_acoes")
      .select("*")
      .eq("divida_id", (data as DbDivida).id);

    return NextResponse.json(rowToDebt(data as DbDivida, (hist as DbHistorico[]) || []), { status: 201 });
  } catch (err) {
    if (err instanceof SyntaxError) return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
    console.error("[POST /api/dividas]", err);
    return NextResponse.json({ error: "Erro ao criar dívida" }, { status: 500 });
  }
}
