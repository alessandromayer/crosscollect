import type { DashboardMetrics } from "@/types";

export interface DashboardDebtRow {
  id: string;
  status: string;
  moeda: string;
  valor: number | string;
  valor_brl: number | string | null;
  pago_em: string | null;
}

// Use stored BRL conversions; never add amounts denominated in different currencies.
function storedBrlCents(row: DashboardDebtRow): number {
  const amount = row.valor_brl ?? (row.moeda === "BRL" ? row.valor : null);
  if (amount === null || amount === "") throw new Error("Missing stored BRL conversion");
  const value = Number(amount);
  const cents = Math.round(value * 100);
  if (!Number.isFinite(value) || value < 0 || !Number.isSafeInteger(cents)) {
    throw new Error("Invalid stored BRL amount");
  }
  return cents;
}

function addCents(total: number, value: number): number {
  const next = total + value;
  if (!Number.isSafeInteger(next)) throw new Error("BRL total exceeds safe precision");
  return next;
}

export function calculateDashboardMetrics(rows: DashboardDebtRow[], now = new Date()): DashboardMetrics {
  if (!Number.isFinite(now.getTime())) throw new Error("Invalid reporting date");
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const monthly = Array.from({ length: 12 }, (_, index) => ({
    month: new Date(Date.UTC(year, month - 11 + index, 1)).toISOString().slice(0, 7),
    cents: 0,
  }));
  const byMonth = new Map(monthly.map((item) => [item.month, item]));
  let openCents = 0;
  let active = 0;
  for (const row of rows) {
    if (row.status !== "pago" && row.status !== "cancelado") {
      openCents = addCents(openCents, storedBrlCents(row));
      active++;
    }
    if (row.status === "pago") {
      const cents = storedBrlCents(row);
      const paidAt = row.pago_em ? new Date(row.pago_em) : null;
      if (!paidAt || !Number.isFinite(paidAt.getTime()) || paidAt > now) {
        throw new Error("Invalid payment reporting date");
      }
      const bucket = byMonth.get(paidAt.toISOString().slice(0, 7));
      if (bucket) bucket.cents = addCents(bucket.cents, cents);
    }
  }
  const count = (status: string) => rows.filter((row) => row.status === status).length;
  const paid = count("pago");
  return {
    total_em_aberto_brl: openCents / 100,
    recuperado_mes_brl: monthly[11].cents / 100,
    monthly_recovery: monthly.map((item) => ({ month: item.month, total_brl: item.cents / 100 })),
    taxa_sucesso: rows.length ? Math.round(paid / rows.length * 1000) / 10 : 0,
    casos_ativos: active,
    casos_vencidos: count("vencido"),
    portfolio: { pendente: count("pendente"), em_negociacao: count("em_negociacao"), vencido: count("vencido"), pago: paid, total: rows.length },
  };
}
