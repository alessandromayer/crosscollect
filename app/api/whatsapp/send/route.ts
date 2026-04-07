import { NextRequest, NextResponse } from "next/server";
import { getTwilioClient, WHATSAPP_FROM } from "@/lib/twilio";

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

function buildMessage(payload: SendWhatsAppPayload): string {
  const { tipo, destinatario, divida, nomeCredor } = payload;
  const link = divida.linkPagamento ? `\n\n🔗 *Link para pagamento:*\n${divida.linkPagamento}` : "";

  const messages: Record<WhatsAppTipo, string> = {
    primeiro_contato: `Olá, *${destinatario.nome}*! 👋

Sou da equipe de cobrança da *CrossCollect*, representando *${nomeCredor}*.

Identificamos uma pendência financeira em seu nome:

📋 *Origem:* ${divida.descricao}
💰 *Valor:* ${divida.valor} ${divida.moeda}
📅 *Vencimento:* ${divida.dataVencimento}

Gostaríamos de resolver isso de forma amigável. Caso queira negociar condições de pagamento, estamos à disposição.${link}

Para dúvidas, responda esta mensagem. ✅`,

    segundo_aviso: `⚠️ *SEGUNDO AVISO — ${destinatario.nome}*

Em nome de *${nomeCredor}*, informamos que sua pendência ainda não foi regularizada:

📋 *${divida.descricao}*
💰 *${divida.valor} ${divida.moeda}*
📅 Venceu em: ${divida.dataVencimento}

*Regularize em até 5 dias úteis* para evitar encaminhamento ao departamento jurídico.

Negociações disponíveis — responda aqui para falar com um especialista.${link}`,

    aviso_final: `🔴 *NOTIFICAÇÃO FINAL — Ação Imediata Necessária*

*${destinatario.nome}*, representamos *${nomeCredor}* e precisamos informar:

Sua pendência de *${divida.valor} ${divida.moeda}* referente a "${divida.descricao}" não foi regularizada.

⚠️ Em 48h iniciaremos o processo de *inclusão em cadastros de proteção ao crédito* (Serasa/SPC).

*Para evitar a negativação*, regularize agora:${link}

Esta é a última notificação antes das medidas formais.`,

    confirmacao_pagamento: `✅ *Pagamento confirmado!*

Olá, *${destinatario.nome}*!

Confirmamos o recebimento do pagamento referente a:
📋 ${divida.descricao}
💰 ${divida.valor} ${divida.moeda}

Sua situação financeira com *${nomeCredor}* está regularizada.

Obrigado pela colaboração! 🙏`,
  };

  return messages[tipo] || messages.primeiro_contato;
}

export async function POST(request: NextRequest) {
  try {
    const body: SendWhatsAppPayload = await request.json();
    const { tipo, destinatario } = body;

    if (!tipo || !destinatario?.telefone || !body.divida) {
      return NextResponse.json(
        { error: "Campos obrigatórios: tipo, destinatario.telefone, divida" },
        { status: 400 }
      );
    }

    // Format phone to WhatsApp format
    let telefone = destinatario.telefone.replace(/\D/g, "");
    if (!telefone.startsWith("+")) {
      // Add Brazil country code if not present
      if (!telefone.startsWith("55")) {
        telefone = "55" + telefone;
      }
      telefone = "+" + telefone;
    }

    const message = buildMessage(body);
    const client = getTwilioClient();

    const result = await client.messages.create({
      from: WHATSAPP_FROM,
      to: `whatsapp:${telefone}`,
      body: message,
    });

    return NextResponse.json({
      success: true,
      messageSid: result.sid,
      status: result.status,
      tipo,
      destinatario: telefone,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const error = err as Error;
    console.error("Erro ao enviar WhatsApp:", error);

    // Return structured error for Twilio errors
    if (error.message?.includes("TWILIO")) {
      return NextResponse.json(
        { error: "Erro na configuração do Twilio. Verifique as credenciais." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Erro interno ao enviar WhatsApp" },
      { status: 500 }
    );
  }
}
