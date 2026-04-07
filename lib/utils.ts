import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  value: number,
  currency: string = "BRL",
  locale: string = "pt-BR"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatDate(dateString: string, formatStr: string = "dd/MM/yyyy"): string {
  try {
    return format(parseISO(dateString), formatStr, { locale: ptBR });
  } catch {
    return dateString;
  }
}

export function formatDateRelative(dateString: string): string {
  try {
    return formatDistanceToNow(parseISO(dateString), {
      addSuffix: true,
      locale: ptBR,
    });
  } catch {
    return dateString;
  }
}

export function formatCPFCNPJ(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pendente: "Pendente",
    em_negociacao: "Em Negociação",
    pago: "Pago",
    vencido: "Vencido",
    cancelado: "Cancelado",
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pendente: "yellow",
    em_negociacao: "blue",
    pago: "green",
    vencido: "red",
    cancelado: "gray",
  };
  return colors[status] || "gray";
}

export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    BRL: "R$",
    CAD: "C$",
    AUD: "A$",
  };
  return symbols[currency] || currency;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function maskApiKey(key: string): string {
  if (!key || key.length < 8) return "••••••••";
  return key.substring(0, 8) + "••••••••••••••••" + key.substring(key.length - 4);
}
