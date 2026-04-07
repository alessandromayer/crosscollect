import { NextRequest, NextResponse } from "next/server";
import type { SendEmailPayload } from "@/app/api/emails/send/route";
import type { SendWhatsAppPayload } from "@/app/api/whatsapp/send/route";

export interface IniciarCobrancaPayload {
  divida: {
    id: string;
    descricao: string;
    valor: string;
    moeda: string;
    dataVencimento: string;
    linkPagamento?: string;
  };
  devedor: {
    nome: string;
    email: string;
    telefone: string;
  };
  nomeCredor: string;
  baseUrl: string;
}

export interface AcaoCobranca {
  tipo: "email" | "whatsapp";
  subtipo: string;
  diasAposVencimento: number;
  status: "enviado" | "agendado" | "erro";
  timestamp: string;
  detalhes?: unknown;
  erro?: string;
}

async function enviarEmail(
  payload: SendEmailPayload,
  baseUrl: string
): Promise<{ ok: boolean; data?: unknown; erro?: string }> {
  try {
    const res = await fetch(`${baseUrl}/api/emails/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return res.ok ? { ok: true, data } : { ok: false, erro: data.error };
  } catch (err) {
    return { ok: false, erro: String(err) };
  }
}

async function enviarWhatsApp(
  payload: SendWhatsAppPayload,
  baseUrl: string
): Promise<{ ok: boolean; data?: unknown; erro?: string }> {
  try {
    const res = await fetch(`${baseUrl}/api/whatsapp/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return res.ok ? { ok: true, data } : { ok: false, erro: data.error };
  } catch (err) {
    return { ok: false, erro: String(err) };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: IniciarCobrancaPayload = await request.json();
    const { divida, devedor, nomeCredor, baseUrl } = body;

    if (!divida || !devedor || !nomeCredor) {
      return NextResponse.json(
        { error: "Campos obrigatórios: divida, devedor, nomeCredor" },
        { status: 400 }
      );
    }

    const acoes: AcaoCobranca[] = [];
    const now = new Date().toISOString();

    // ─── DIA 0: Ações imediatas ao cadastrar ───────────────────────────────

    // Email — Primeiro contato amigável
    const emailDia0 = await enviarEmail(
      {
        tipo: "primeiro_contato",
        destinatario: { nome: devedor.nome, email: devedor.email },
        divida,
        nomeCredor,
      },
      baseUrl
    );
    acoes.push({
      tipo: "email",
      subtipo: "primeiro_contato",
      diasAposVencimento: 0,
      status: emailDia0.ok ? "enviado" : "erro",
      timestamp: now,
      detalhes: emailDia0.data,
      erro: emailDia0.erro,
    });

    // WhatsApp — Primeiro contato
    const whatsappDia0 = await enviarWhatsApp(
      {
        tipo: "primeiro_contato",
        destinatario: { nome: devedor.nome, telefone: devedor.telefone },
        divida,
        nomeCredor,
      },
      baseUrl
    );
    acoes.push({
      tipo: "whatsapp",
      subtipo: "primeiro_contato",
      diasAposVencimento: 0,
      status: whatsappDia0.ok ? "enviado" : "erro",
      timestamp: now,
      detalhes: whatsappDia0.data,
      erro: whatsappDia0.erro,
    });

    // ─── DIAS 10 e 15: Agendados (requerem cron job / Vercel Cron) ────────
    // Em produção, esses seriam agendados via Vercel Cron, Inngest ou similar.
    // Aqui registramos como "agendado" no histórico para visibilidade.

    acoes.push({
      tipo: "email",
      subtipo: "segundo_aviso",
      diasAposVencimento: 10,
      status: "agendado",
      timestamp: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    });

    acoes.push({
      tipo: "whatsapp",
      subtipo: "segundo_aviso",
      diasAposVencimento: 15,
      status: "agendado",
      timestamp: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const enviados = acoes.filter((a) => a.status === "enviado").length;
    const erros = acoes.filter((a) => a.status === "erro").length;
    const agendados = acoes.filter((a) => a.status === "agendado").length;

    return NextResponse.json({
      success: true,
      divida_id: divida.id,
      acoes,
      resumo: {
        enviados,
        agendados,
        erros,
        total: acoes.length,
      },
      timestamp: now,
    });
  } catch (err) {
    console.error("Erro ao iniciar cobrança:", err);
    return NextResponse.json(
      { error: "Erro interno ao iniciar régua de cobrança" },
      { status: 500 }
    );
  }
}
