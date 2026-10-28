// Production transport remains unavailable until payment reconciliation is validated.
const ASAAS_SANDBOX_URL = "https://api-sandbox.asaas.com/v3";
const REQUEST_TIMEOUT_MS = 8_000;

function asaasHeaders() {
  if (process.env.ASAAS_ENVIRONMENT !== "sandbox") {
    throw new Error("Asaas disponível apenas com ASAAS_ENVIRONMENT=sandbox");
  }
  // Use a separate secret so an existing production key cannot be used by default.
  const key = process.env.ASAAS_SANDBOX_API_KEY;
  if (!key || key !== key.trim() || /[\r\n]/.test(key)) {
    throw new Error("ASAAS_SANDBOX_API_KEY ausente ou inválida");
  }
  return {
    "Content-Type": "application/json",
    "User-Agent": "CrossCollect/0.1 sandbox",
    access_token: key,
  };
}

async function asaasRequest<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  // Validate configuration before allocating a timer or making any request.
  const headers = asaasHeaders();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(`${ASAAS_SANDBOX_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
      redirect: "error",
      cache: "no-store",
    });
    // Never propagate provider bodies: they can contain customer data or secrets.
    if (!res.ok) throw new Error(`Asaas sandbox: HTTP ${res.status}`);
    return await res.json() as T;
  } catch (error) {
    if (controller.signal.aborted) throw new Error("Asaas sandbox: tempo limite excedido");
    if (error instanceof Error && /^Asaas sandbox: HTTP \d{3}$/.test(error.message)) throw error;
    throw new Error("Asaas sandbox: falha na comunicação");
  } finally {
    clearTimeout(timeout);
  }
}

function paymentPath(paymentId: string): string {
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(paymentId)) throw new Error("Identificador de pagamento inválido");
  return `/payments/${paymentId}`;
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
  return asaasRequest<AsaasPixQrCode>("GET", `${paymentPath(paymentId)}/pixQrCode`);
}

export async function getBoletoInfo(paymentId: string): Promise<AsaasBoletoInfo> {
  return asaasRequest<AsaasBoletoInfo>(
    "GET",
    `${paymentPath(paymentId)}/identificationField`
  );
}

export async function getPaymentStatus(paymentId: string): Promise<AsaasPayment> {
  return asaasRequest<AsaasPayment>("GET", paymentPath(paymentId));
}
