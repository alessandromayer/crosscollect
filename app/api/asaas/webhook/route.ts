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
  try {
    const payload = (await req.json()) as AsaasWebhookPayload;
    const { event, payment } = payload;

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
        // Mark pagamento as paid
        if (payment.billingType === "BOLETO") {
          await db
            .from("pagamentos_asaas")
            .update({ status_boleto: "RECEIVED", pago_em: new Date().toISOString() })
            .eq("id", pagamento.id);
        } else {
          await db
            .from("pagamentos_asaas")
            .update({ status_pix: "RECEIVED", pago_em: new Date().toISOString() })
            .eq("id", pagamento.id);
        }

        // Mark the debt as paid
        await db
          .from("dividas")
          .update({ status: "pago", pago_em: new Date().toISOString() })
          .eq("id", pagamento.divida_id);

        // Log in timeline
        await db.from("historico_acoes").insert({
          divida_id: pagamento.divida_id,
          tipo: "pagamento",
          descricao: `Pagamento confirmado via ${payment.billingType} — R$ ${payment.netValue ?? payment.value}`,
          valor: payment.netValue ?? payment.value,
          autor: "Asaas Webhook",
        });

        console.log(`[asaas/webhook] Debt ${pagamento.divida_id} marked as PAID`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[asaas/webhook] Error:", err);
    return NextResponse.json({ received: true });
  }
}
