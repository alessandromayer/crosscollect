import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";

export type EmailTipo = "primeiro_contato" | "segundo_aviso" | "aviso_serasa";

export interface SendEmailPayload {
  tipo: EmailTipo;
  destinatario: { nome: string; email: string };
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

// Disabled until message authorization, consent and sandbox tests are complete.
export async function POST() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  return NextResponse.json(
    { error: "Envio de e-mails temporariamente desativado para testes de segurança." },
    { status: 503 }
  );
}
