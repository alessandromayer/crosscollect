import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Você é o Assistente CrossCollect, um especialista em cobrança internacional para o mercado brasileiro.
Você auxilia credores estrangeiros a recuperar dívidas de devedores no Brasil.

Seu conhecimento inclui:
- Legislação brasileira de cobrança (CDC, Lei 8.078, LGPD)
- Estratégias de comunicação e negociação em português
- Análise de risco de crédito
- Práticas de cobrança amigável e judicial
- Câmbio e conversão de moedas
- Perfis de devedores brasileiros (PF e PJ)

Contexto da carteira atual do usuário:
- 43 casos ativos
- R$ 4.237.500 (≈ USD 847.500) em aberto
- 12 dívidas vencidas
- Taxa de sucesso atual: 68,4%
- Plano: Growth

Responda sempre em português brasileiro, seja conciso mas completo, e forneça conselhos práticos e acionáveis.
Use formatação markdown quando apropriado (negrito, listas, etc.).
Quando relevante, cite aspectos legais e culturais específicos do Brasil.`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Formato de mensagens inválido" },
        { status: 400 }
      );
    }

    // Filter out the welcome message and format for API
    const apiMessages = messages
      .filter((m: { role: string; content: string }) => m.role !== "system")
      .map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    if (apiMessages.length === 0) {
      return NextResponse.json(
        { error: "Nenhuma mensagem fornecida" },
        { status: 400 }
      );
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: apiMessages,
    });

    const content =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Erro no assistente:", error);

    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Erro da API Anthropic: ${error.message}` },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
