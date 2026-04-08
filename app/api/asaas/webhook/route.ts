import { NextRequest, NextResponse } from "next/server";

// Asaas webhook event payload (simplified)
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
    externalReference?: string; // We store our debt ID here when creating
  };
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as AsaasWebhookPayload;
    const { event, payment } = payload;

    console.log(`[asaas/webhook] Event: ${event} | Payment: ${payment.id} | Status: ${payment.status}`);

    // Events that indicate full payment
    const PAID_EVENTS = [
      "PAYMENT_RECEIVED",
      "PAYMENT_CONFIRMED",
    ];

    // Events that indicate failure or reversal
    const FAILED_EVENTS = [
      "PAYMENT_OVERDUE",
      "PAYMENT_DELETED",
      "PAYMENT_CHARGEBACK_DISPUTE",
      "PAYMENT_CHARGEBACK_REQUESTED",
    ];

    if (PAID_EVENTS.includes(event)) {
      // In a real app, look up the debt by payment.externalReference or payment.id
      // and update its status to "pago" in the database.
      // Example with Supabase:
      //   await supabase
      //     .from("debts")
      //     .update({ status: "pago", asaas_payment_id: payment.id })
      //     .eq("asaas_payment_id", payment.id);
      console.log(
        `[asaas/webhook] Payment ${payment.id} CONFIRMED — R$ ${payment.netValue ?? payment.value} received on ${payment.paymentDate}`
      );
    } else if (FAILED_EVENTS.includes(event)) {
      console.log(`[asaas/webhook] Payment ${payment.id} event: ${event}`);
    } else {
      console.log(`[asaas/webhook] Unhandled event: ${event}`);
    }

    // Asaas expects HTTP 200 to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[asaas/webhook] Error processing webhook:", err);
    // Return 200 anyway to prevent Asaas from retrying on our parse error
    return NextResponse.json({ received: true, error: "parse error" });
  }
}
