import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/require-auth";
import { getOwnCredorId } from "@/lib/tenant";
import { createServerClient } from "@/lib/supabase-server";

// GET /api/dividas/[id]/pagamento — retrieve saved Asaas payment data
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;
  try {
    const credorId = await getOwnCredorId(auth.user!.id);
    if (!credorId) return NextResponse.json({ error: "Empresa não vinculada" }, { status: 403 });
    const { data: debt } = await createServerClient().from("dividas").select("id").eq("id", params.id).eq("credor_id", credorId).maybeSingle();
    if (!debt) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
    const db = createServerClient();
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
