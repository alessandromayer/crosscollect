import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

interface AsaasWebhookPayload {
  event: string;
  payment: {
    id: string;
    customer: string;
    billingType: string;
    value: number;
    netValue?: number;
    dueDate: string;
    status: string;
    paymentDate?: string;
    description?: string;
    externalReference?: string;
  };
}

const PAID_EVENTS = ["PAYMENT_RECEIVED", "PAYMENT_CONFIRMED"];

export async function POST(req: NextRequest) {
  const expected = process.env.ASAAS_WEBHOOK_AUTH_TOKEN;
  const supplied = req.headers.get("asaas-access-token");
  if (!expected || !supplied || supplied.length !== expected.length) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const { timingSafeEqual } = await import("node:crypto");
  if (!timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  try {
    const payload = (await req.json()) as AsaasWebhookPayload;
    const { event, payment } = payload;
    if (typeof event !== "string" || !payment || typeof payment.id !== "string" ||
        !/^[a-zA-Z0-9_-]{1,100}$/.test(payment.id) ||
        typeof payment.billingType !== "string" || !Number.isFinite(payment.value)) {
      return NextResponse.json({ error: "Evento inválido" }, { status: 400 });
    }

    console.log(`[asaas/webhook] ${event} | ${payment.id} | ${payment.status}`);

    if (PAID_EVENTS.includes(event)) {
      const db = getSupabaseAdmin();

      // Find the pagamento row by Asaas payment ID (boleto or pix)
      const { data: pagamento } = await db
        .from("pagamentos_asaas")
        .select("id, divida_id")
        .or(
          `asaas_payment_id_boleto.eq.${payment.id},asaas_payment_id_pix.eq.${payment.id}`
        )
        .single();

      if (pagamento) {
        const { data: existingDebt, error: debtReadError } = await db
          .from("dividas").select("id, status").eq("id", pagamento.divida_id).single();
        if (debtReadError || !existingDebt) throw debtReadError || new Error("Dívida não encontrada");
        // Duplicate webhook delivery must not repeat payment updates or audit events.
        if (existingDebt.status === "pago") return NextResponse.json({ received: true, duplicate: true });
        // Mark pagamento as paid
        if (payment.billingType === "BOLETO") {
          const { error: paymentError } = await db
            .from("pagamentos_asaas")
            .update({ status_boleto: "RECEIVED", pago_em: new Date().toISOString() })
            .eq("id", pagamento.id);
          if (paymentError) throw paymentError;
        } else {
          const { error: paymentError } = await db
            .from("pagamentos_asaas")
            .update({ status_pix: "RECEIVED", pago_em: new Date().toISOString() })
            .eq("id", pagamento.id);
          if (paymentError) throw paymentError;
        }

        // Mark the debt as paid
        const { error: debtError } = await db
          .from("dividas")
          .update({ status: "pago", pago_em: new Date().toISOString() })
          .eq("id", pagamento.divida_id);
        if (debtError) throw debtError;

        // Log in timeline
        const { error: historyError } = await db.from("historico_acoes").insert({
          divida_id: pagamento.divida_id,
          tipo: "pagamento",
          descricao: `Pagamento confirmado via ${payment.billingType} — R$ ${payment.netValue ?? payment.value}`,
          valor: payment.netValue ?? payment.value,
          autor: "Asaas Webhook",
        });
        if (historyError) throw historyError;

        console.log(`[asaas/webhook] Debt ${pagamento.divida_id} marked as PAID`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[asaas/webhook] Error:", err);
    return NextResponse.json({ error: "Falha ao processar evento" }, { status: 500 });
  }
}
