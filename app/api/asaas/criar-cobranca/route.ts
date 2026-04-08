import { NextRequest, NextResponse } from "next/server";
import {
  createOrFindCustomer,
  createPayment,
  getPixQrCode,
  getBoletoInfo,
} from "@/lib/asaas";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { devedor, valor, descricao, dataVencimento, divida_id } = body as {
      devedor: { nome: string; cpf_cnpj: string; email: string };
      valor: number;
      descricao: string;
      dataVencimento: string;
      divida_id?: string; // optional — passed when creating from nova/page
    };

    if (!devedor?.nome || !devedor?.cpf_cnpj || !valor || !dataVencimento) {
      return NextResponse.json(
        { error: "Campos obrigatórios: devedor (nome, cpf_cnpj), valor, dataVencimento" },
        { status: 400 }
      );
    }

    // Adjust past due dates (Asaas rejects them)
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    const dueDateRaw = new Date(dataVencimento + "T12:00:00");
    const dueDate =
      dueDateRaw <= hoje
        ? amanha.toISOString().split("T")[0]
        : dataVencimento;

    // 1. Create or find customer on Asaas
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
        dueDate,
        description: descricao || "Cobrança CrossCollect",
      }),
      createPayment({
        customer: customer.id,
        billingType: "PIX",
        value: valor,
        dueDate,
        description: descricao || "Cobrança CrossCollect",
      }),
    ]);

    // 3. Fetch QR code and identification field in parallel
    const [pixQrCode, boletoInfo] = await Promise.all([
      getPixQrCode(pix.id),
      getBoletoInfo(boleto.id),
    ]);

    const result = {
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
    };

    // 4. Persist to DB (only if a divida_id was provided)
    if (divida_id) {
      try {
        const db = getSupabaseAdmin();
        await db.from("pagamentos_asaas").insert({
          divida_id,
          asaas_customer_id: customer.id,
          asaas_payment_id_boleto: boleto.id,
          asaas_payment_id_pix: pix.id,
          status_boleto: boleto.status,
          status_pix: pix.status,
          link_boleto: boleto.bankSlipUrl || boleto.invoiceUrl || null,
          linha_digitavel: boletoInfo.identificationField,
          qr_code_pix: pixQrCode.encodedImage,
          chave_pix: pixQrCode.payload,
          data_vencimento: dueDate,
        });

        // Log in timeline
        await db.from("historico_acoes").insert({
          divida_id,
          tipo: "contato",
          descricao: "Boleto bancário e QR code Pix gerados via Asaas",
          autor: "Sistema",
        });
      } catch (dbErr) {
        console.error("[asaas/criar-cobranca] DB persist error:", dbErr);
        // Don't fail the request — payment was created successfully
      }
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[asaas/criar-cobranca]", err);
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
