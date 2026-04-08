import { NextRequest, NextResponse } from "next/server";
import {
  createOrFindCustomer,
  createPayment,
  getPixQrCode,
  getBoletoInfo,
} from "@/lib/asaas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { devedor, valor, descricao, dataVencimento } = body as {
      devedor: { nome: string; cpf_cnpj: string; email: string };
      valor: number;
      descricao: string;
      dataVencimento: string; // YYYY-MM-DD
    };

    if (!devedor?.nome || !devedor?.cpf_cnpj || !valor || !dataVencimento) {
      return NextResponse.json(
        { error: "Campos obrigatórios: devedor (nome, cpf_cnpj), valor, dataVencimento" },
        { status: 400 }
      );
    }

    // 1. Create or find customer
    const customer = await createOrFindCustomer({
      name: devedor.nome,
      cpfCnpj: devedor.cpf_cnpj,
      email: devedor.email || "sem-email@crosscollect.com",
    });

    // 2. Create boleto + pix in parallel
    const [boleto, pix] = await Promise.all([
      createPayment({
        customer: customer.id,
        billingType: "BOLETO",
        value: valor,
        dueDate: dataVencimento,
        description: descricao || "Cobrança CrossCollect",
      }),
      createPayment({
        customer: customer.id,
        billingType: "PIX",
        value: valor,
        dueDate: dataVencimento,
        description: descricao || "Cobrança CrossCollect",
      }),
    ]);

    // 3. Fetch QR code and boleto details in parallel
    const [pixQrCode, boletoInfo] = await Promise.all([
      getPixQrCode(pix.id),
      getBoletoInfo(boleto.id),
    ]);

    return NextResponse.json({
      ok: true,
      customerId: customer.id,
      boleto: {
        id: boleto.id,
        status: boleto.status,
        bankSlipUrl: boleto.bankSlipUrl,
        invoiceUrl: boleto.invoiceUrl,
        linhaDigitavel: boletoInfo.identificationField,
        barCode: boletoInfo.barCode,
      },
      pix: {
        id: pix.id,
        status: pix.status,
        qrCodeBase64: pixQrCode.encodedImage,
        copiaCola: pixQrCode.payload,
        expirationDate: pixQrCode.expirationDate,
      },
    });
  } catch (err) {
    console.error("[asaas/criar-cobranca]", err);
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
