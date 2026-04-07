import { NextRequest, NextResponse } from "next/server";
import { getResend, FROM_EMAIL } from "@/lib/resend";
import {
  templatePrimeiroContato,
  templateSegundoAviso,
  templateAvisoSerasa,
} from "@/lib/email-templates";

export type EmailTipo = "primeiro_contato" | "segundo_aviso" | "aviso_serasa";

export interface SendEmailPayload {
  tipo: EmailTipo;
  destinatario: {
    nome: string;
    email: string;
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

export async function POST(request: NextRequest) {
  try {
    const body: SendEmailPayload = await request.json();
    const { tipo, destinatario, divida, nomeCredor } = body;

    if (!tipo || !destinatario?.email || !divida) {
      return NextResponse.json(
        { error: "Campos obrigatórios: tipo, destinatario, divida" },
        { status: 400 }
      );
    }

    const templateData = {
      nomeDevedor: destinatario.nome,
      valor: divida.valor,
      moeda: divida.moeda,
      dataVencimento: divida.dataVencimento,
      descricao: divida.descricao,
      linkPagamento: divida.linkPagamento,
      nomeCredor,
    };

    let template: { subject: string; html: string };
    switch (tipo) {
      case "primeiro_contato":
        template = templatePrimeiroContato(templateData);
        break;
      case "segundo_aviso":
        template = templateSegundoAviso(templateData);
        break;
      case "aviso_serasa":
        template = templateAvisoSerasa(templateData);
        break;
      default:
        return NextResponse.json({ error: "Tipo de e-mail inválido" }, { status: 400 });
    }

    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [destinatario.email],
      subject: template.subject,
      html: template.html,
      tags: [
        { name: "divida_id", value: divida.id },
        { name: "tipo", value: tipo },
      ],
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      messageId: data?.id,
      tipo,
      destinatario: destinatario.email,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Erro ao enviar e-mail:", err);
    return NextResponse.json({ error: "Erro interno ao enviar e-mail" }, { status: 500 });
  }
}
