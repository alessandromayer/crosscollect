import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// GET /api/dividas/[id]/pagamento — retrieve saved Asaas payment data
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getSupabaseAdmin();
    const { data, error } = await db
      .from("pagamentos_asaas")
      .select("*")
      .eq("divida_id", params.id)
      .order("criado_em", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json(null);
    }

    return NextResponse.json({
      boleto: {
        id: data.asaas_payment_id_boleto,
        status: data.status_boleto,
        bankSlipUrl: data.link_boleto,
        linhaDigitavel: data.linha_digitavel,
      },
      pix: {
        id: data.asaas_payment_id_pix,
        status: data.status_pix,
        qrCodeBase64: data.qr_code_pix,
        copiaCola: data.chave_pix,
      },
    });
  } catch (err) {
    console.error("[GET /api/dividas/[id]/pagamento]", err);
    return NextResponse.json(null);
  }
}
