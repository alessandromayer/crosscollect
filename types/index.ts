export type DebtStatus =
  | "pendente"
  | "em_negociacao"
  | "pago"
  | "vencido"
  | "cancelado";

export type DebtCurrency = "USD" | "EUR" | "GBP" | "BRL" | "CAD" | "AUD";

export type ContactChannel = "email" | "whatsapp" | "sms" | "telefone" | "carta";

export interface Debtor {
  id: string;
  nome: string;
  cpf_cnpj: string;
  email: string;
  telefone: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  tipo: "pessoa_fisica" | "pessoa_juridica";
}

export interface CollectionStep {
  id: string;
  dia: number;
  canal: ContactChannel;
  template: string;
  ativo: boolean;
}

export interface Debt {
  id: string;
  credor_id: string;
  devedor: Debtor;
  descricao: string;
  valor_original: number;
  moeda_original: DebtCurrency;
  valor_brl: number;
  taxa_cambio: number;
  data_vencimento: string;
  data_cadastro: string;
  status: DebtStatus;
  regime_cobranca: CollectionStep[];
  documentos: string[];
  observacoes?: string;
  historico: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  divida_id: string;
  tipo:
    | "cadastro"
    | "contato"
    | "pagamento"
    | "negociacao"
    | "vencimento"
    | "atualizacao"
    | "ai_sugestao";
  descricao: string;
  data: string;
  canal?: ContactChannel;
  valor?: number;
  autor?: string;
  metadata?: Record<string, unknown>;
}

export interface DashboardMetrics {
  total_em_aberto: number;
  total_em_aberto_brl: number;
  recuperado_mes: number;
  recuperado_mes_brl: number;
  taxa_sucesso: number;
  casos_ativos: number;
  casos_vencidos: number;
  variacao_mensal: number;
  portfolio?: {
    pendente: number;
    em_negociacao: number;
    vencido: number;
    pago: number;
    total: number;
  };
}

export interface PlanTier {
  id: string;
  nome: string;
  preco: number;
  moeda: string;
  periodo: "mensal" | "anual";
  stripe_price_id: string;
  recursos: string[];
  limite_dividas: number;
  limite_usuarios: number;
  destaque?: boolean;
}

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  empresa?: string;
  cargo?: string;
  pais: string;
  telefone?: string;
  avatar_url?: string;
  plano: string;
  api_key?: string;
  created_at: string;
}

export interface BankAccount {
  id: string;
  banco: string;
  agencia: string;
  conta: string;
  tipo: "corrente" | "poupanca";
  titular: string;
  cpf_cnpj: string;
  pix_key?: string;
  swift?: string;
  iban?: string;
  ativo: boolean;
}

export interface NotificationSettings {
  email_novo_pagamento: boolean;
  email_divida_vencida: boolean;
  email_relatorio_semanal: boolean;
  whatsapp_alertas: boolean;
  push_atividade: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ComunicacaoMetrics {
  emails_enviados_semana: number;
  whatsapp_enviados_semana: number;
  emails_abertos_semana: number;
  whatsapp_respondidos_semana: number;
  taxa_abertura_email: number;
  taxa_resposta_whatsapp: number;
  por_dia: {
    dia: string;
    emails: number;
    whatsapp: number;
  }[];
}
