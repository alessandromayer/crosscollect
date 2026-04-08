import { createClient } from "@supabase/supabase-js";
import type { Debt, TimelineEvent, ContactChannel, DebtStatus, DebtCurrency } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export function getSupabaseAdmin() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase env vars não configuradas");
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

// ── Default credor ID (until auth) ──────────────────────────────
export const DEFAULT_CREDOR_ID = "00000000-0000-0000-0000-000000000001";

// ── DB row types ────────────────────────────────────────────────
export interface DbDivida {
  id: string;
  credor_id: string | null;
  devedor_nome: string;
  devedor_doc: string;
  devedor_email: string | null;
  devedor_tel: string | null;
  devedor_cidade: string | null;
  devedor_estado: string | null;
  devedor_tipo: string;
  descricao: string;
  valor: number;
  moeda: string;
  valor_brl: number | null;
  taxa_cambio: number | null;
  data_vencimento: string | null;
  status: string;
  observacoes: string | null;
  documentos: string[];
  regime_cobranca: unknown[];
  criado_em: string;
  pago_em: string | null;
}

export interface DbHistorico {
  id: string;
  divida_id: string;
  tipo: string;
  descricao: string;
  canal: string | null;
  valor: number | null;
  autor: string | null;
  criado_em: string;
}

// ── Row → Debt type mapper ───────────────────────────────────────
export function rowToDebt(row: DbDivida, historico: DbHistorico[] = []): Debt {
  return {
    id: row.id,
    credor_id: row.credor_id || "",
    devedor: {
      id: row.id,
      nome: row.devedor_nome,
      cpf_cnpj: row.devedor_doc,
      email: row.devedor_email || "",
      telefone: row.devedor_tel || "",
      cidade: row.devedor_cidade || undefined,
      estado: row.devedor_estado || undefined,
      tipo: row.devedor_tipo as "pessoa_fisica" | "pessoa_juridica",
    },
    descricao: row.descricao,
    valor_original: Number(row.valor),
    moeda_original: row.moeda as DebtCurrency,
    valor_brl: Number(row.valor_brl ?? row.valor),
    taxa_cambio: Number(row.taxa_cambio ?? 5),
    data_vencimento: row.data_vencimento || "",
    data_cadastro: row.criado_em,
    status: row.status as DebtStatus,
    regime_cobranca: (row.regime_cobranca as unknown[]).map((s: unknown) => s as import("@/types").CollectionStep),
    documentos: row.documentos || [],
    observacoes: row.observacoes || undefined,
    historico: historico.map((h) => ({
      id: h.id,
      divida_id: h.divida_id,
      tipo: h.tipo as TimelineEvent["tipo"],
      descricao: h.descricao,
      canal: h.canal as ContactChannel | undefined,
      valor: h.valor ? Number(h.valor) : undefined,
      autor: h.autor || undefined,
      data: h.criado_em,
    })),
  };
}

// ── Exchange rate (fixed until real API) ─────────────────────────
const RATES: Record<string, number> = {
  USD: 5.0, EUR: 5.5, GBP: 6.3, CAD: 3.7, AUD: 3.2, BRL: 1,
};
export function toBRL(valor: number, moeda: string): number {
  return Math.round(valor * (RATES[moeda] ?? 5) * 100) / 100;
}
