import { Resend } from "resend";

export function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY não configurada");
  }
  return new Resend(key);
}

export const FROM_EMAIL = "CrossCollect <cobranca@crosscollect.com>";
