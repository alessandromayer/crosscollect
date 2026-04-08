const ASAAS_BASE_URL = "https://www.asaas.com/api/v3";

function asaasHeaders() {
  // Strip surrounding quotes and leading backslash that can come from dotenv-expand
  const raw = process.env.ASAAS_API_KEY ?? "";
  const key = raw.replace(/^\\/, "").replace(/^['"]|['"]$/g, "").trim();
  if (!key) throw new Error("ASAAS_API_KEY não configurada");
  return {
    "Content-Type": "application/json",
    access_token: key,
  };
}

async function asaasRequest<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(`${ASAAS_BASE_URL}${path}`, {
    method,
    headers: asaasHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const errJson = await res.json().catch(() => null);
    if (errJson?.errors?.length) {
      const msgs = errJson.errors.map((e: { code: string; description: string }) => e.description).join("; ");
      throw new Error(`Asaas: ${msgs}`);
    }
    throw new Error(`Asaas API error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export interface AsaasCustomer {
  id: string;
  name: string;
  cpfCnpj: string;
  email: string;
}

export interface AsaasPayment {
  id: string;
  customer: string;
  billingType: "BOLETO" | "PIX";
  value: number;
  dueDate: string;
  status: string;
  bankSlipUrl?: string;
  invoiceUrl?: string;
}

export interface AsaasPixQrCode {
  encodedImage: string; // base64 PNG
  payload: string;      // copia-e-cola
  expirationDate: string;
}

export interface AsaasBoletoInfo {
  identificationField: string;
  nossoNumero: string;
  barCode: string;
}

export async function createOrFindCustomer(data: {
  name: string;
  cpfCnpj: string;
  email: string;
}): Promise<AsaasCustomer> {
  // Try to find existing customer by CPF/CNPJ first
  const cpfCnpjClean = data.cpfCnpj.replace(/\D/g, "");
  const search = await asaasRequest<{ data: AsaasCustomer[] }>(
    "GET",
    `/customers?cpfCnpj=${cpfCnpjClean}`
  );
  if (search.data && search.data.length > 0) {
    return search.data[0];
  }
  return asaasRequest<AsaasCustomer>("POST", "/customers", {
    name: data.name,
    cpfCnpj: cpfCnpjClean,
    email: data.email,
  });
}

export async function createPayment(data: {
  customer: string;
  billingType: "BOLETO" | "PIX";
  value: number;
  dueDate: string;
  description: string;
}): Promise<AsaasPayment> {
  return asaasRequest<AsaasPayment>("POST", "/payments", data);
}

export async function getPixQrCode(paymentId: string): Promise<AsaasPixQrCode> {
  return asaasRequest<AsaasPixQrCode>("GET", `/payments/${paymentId}/pixQrCode`);
}

export async function getBoletoInfo(paymentId: string): Promise<AsaasBoletoInfo> {
  return asaasRequest<AsaasBoletoInfo>(
    "GET",
    `/payments/${paymentId}/identificationField`
  );
}

export async function getPaymentStatus(paymentId: string): Promise<AsaasPayment> {
  return asaasRequest<AsaasPayment>("GET", `/payments/${paymentId}`);
}
