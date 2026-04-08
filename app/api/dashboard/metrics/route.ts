import { NextResponse } from "next/server";
import { getSupabaseAdmin, DEFAULT_CREDOR_ID } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const db = getSupabaseAdmin();

    const { data: dividas, error } = await db
      .from("dividas")
      .select("id, status, valor, moeda, valor_brl, criado_em, pago_em")
      .eq("credor_id", DEFAULT_CREDOR_ID);

    if (error) throw error;

    const all = dividas || [];
    const agora = new Date();
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);

    const abertos = all.filter((d) => d.status !== "pago" && d.status !== "cancelado");
    const pagosEsseMes = all.filter(
      (d) => d.status === "pago" && d.pago_em && new Date(d.pago_em) >= inicioMes
    );

    const total_em_aberto = abertos.reduce((s: number, d) => s + Number(d.valor || 0), 0);
    const total_em_aberto_brl = abertos.reduce((s: number, d) => s + Number(d.valor_brl || 0), 0);
    const recuperado_mes = pagosEsseMes.reduce((s: number, d) => s + Number(d.valor || 0), 0);
    const recuperado_mes_brl = pagosEsseMes.reduce((s: number, d) => s + Number(d.valor_brl || 0), 0);
    const n_pendente = all.filter((d) => d.status === "pendente").length;
    const n_negociacao = all.filter((d) => d.status === "em_negociacao").length;
    const casos_ativos = n_pendente + n_negociacao;
    const casos_vencidos = all.filter((d) => d.status === "vencido").length;
    const pagos_total = all.filter((d) => d.status === "pago").length;
    const taxa_sucesso = all.length > 0 ? Math.round((pagos_total / all.length) * 1000) / 10 : 0;

    // Recent debts (last 5)
    const { data: recent } = await db
      .from("dividas")
      .select("id, devedor_nome, devedor_doc, descricao, valor, moeda, valor_brl, data_vencimento, status")
      .eq("credor_id", DEFAULT_CREDOR_ID)
      .order("criado_em", { ascending: false })
      .limit(5);

    return NextResponse.json({
      metrics: {
        total_em_aberto,
        total_em_aberto_brl,
        recuperado_mes,
        recuperado_mes_brl,
        taxa_sucesso,
        casos_ativos,
        casos_vencidos,
        variacao_mensal: 0,
        portfolio: {
          pendente: n_pendente,
          em_negociacao: n_negociacao,
          vencido: casos_vencidos,
          pago: pagos_total,
          total: all.length,
        },
      },
      recentDebts: recent || [],
      totalDebts: all.length,
    });
  } catch (err) {
    console.error("[GET /api/dashboard/metrics]", err);
    return NextResponse.json({ error: "Erro ao buscar métricas" }, { status: 500 });
  }
}
