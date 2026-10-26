import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/require-auth";
import { calculateDashboardMetrics, type DashboardDebtRow } from "@/lib/dashboard-metrics";
import { getOwnCredorId } from "@/lib/tenant";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  try {
    const credorId = await getOwnCredorId(auth.user!.id);
    if (!credorId) return NextResponse.json({ error: "Empresa não vinculada à conta" }, { status: 403 });
    const db = createServerClient();

    // Supabase limits each response. Read all tenant pages before computing totals.
    const all: DashboardDebtRow[] = [];
    let expectedCount: number | null = null;
    do {
      const { data, error, count } = await db.from("dividas")
        .select("id, status, valor, moeda, valor_brl, pago_em", { count: "exact" })
        .eq("credor_id", credorId).order("id", { ascending: true })
        .range(all.length, all.length + 499);
      if (error) throw error;
      if (count === null || (expectedCount !== null && count !== expectedCount)) {
        throw new Error("Portfolio changed while loading metrics");
      }
      expectedCount = count;
      if (!data || (!data.length && all.length < count)) throw new Error("Incomplete metrics response");
      all.push(...data);
    } while (all.length < expectedCount!);
    if (all.length !== expectedCount || new Set(all.map((row) => row.id)).size !== all.length) {
      throw new Error("Incomplete or duplicated metrics data");
    }
    const metrics = calculateDashboardMetrics(all);

    // Recent debts (last 5)
    const { data: recent, error: recentError } = await db
      .from("dividas")
      .select("id, devedor_nome, devedor_doc, descricao, valor, moeda, valor_brl, data_vencimento, status")
      .eq("credor_id", credorId)
      .order("criado_em", { ascending: false })
      .limit(5);

    if (recentError) throw recentError;

    return NextResponse.json({
      metrics,
      recentDebts: recent || [],
      totalDebts: all.length,
    });
  } catch (err) {
    console.error("[GET /api/dashboard/metrics]", err);
    return NextResponse.json({ error: "Erro ao buscar métricas" }, { status: 500 });
  }
}
