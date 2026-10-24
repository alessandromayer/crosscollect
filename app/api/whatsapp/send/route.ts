import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";

export type WhatsAppTipo =
  | "primeiro_contato"
  | "segundo_aviso"
  | "aviso_final"
  | "confirmacao_pagamento";

export interface SendWhatsAppPayload {
  tipo: WhatsAppTipo;
  destinatario: {
    nome: string;
    telefone: string; // formato: +5511999999999
  };
  divida: {
    id: string;
    descricao: string;
    valor: string;
    moeda: string;
    dataVencimento: string;
    linkPagamento?: string;
  };
  nomeCredor: string;
}


// Safe default: never send WhatsApp messages until per-tenant authorization is tested.
export async function POST() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  return NextResponse.json({ error: "WhatsApp temporariamente desativado para testes de segurança." }, { status: 503 });
}
