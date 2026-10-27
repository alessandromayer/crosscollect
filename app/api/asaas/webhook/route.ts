import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

// Payment processing stays disabled until event persistence, idempotency and
// atomic reconciliation have been implemented and tested in the Asaas sandbox.
export async function POST(req: NextRequest) {
  const expected = process.env.ASAAS_WEBHOOK_AUTH_TOKEN;
  const supplied = req.headers.get("asaas-access-token");
  if (!expected || !supplied) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const expectedBytes = Buffer.from(expected);
  const suppliedBytes = Buffer.from(supplied);
  if (expectedBytes.length !== suppliedBytes.length || !timingSafeEqual(expectedBytes, suppliedBytes)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  return NextResponse.json({ error: "Processamento de pagamentos temporariamente indisponível" }, { status: 503 });
}
