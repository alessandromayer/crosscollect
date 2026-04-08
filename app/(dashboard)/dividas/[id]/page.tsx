"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Mail,
  Phone,
  MessageCircle,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  BotMessageSquare,
  Edit2,
  Download,
  MoreHorizontal,
  User,
  MapPin,
  Calendar,
  DollarSign,
  Zap,
  Send,
  QrCode,
  Copy,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { formatCurrency, formatDate, formatDateRelative, getStatusLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import type { Debt, TimelineEvent } from "@/types";

const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  pendente: { label: "Pendente", bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-400" },
  em_negociacao: { label: "Em Negociação", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  pago: { label: "Pago", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  vencido: { label: "Vencido", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  cancelado: { label: "Cancelado", bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
};

const eventTypeConfig: Record<string, { icon: React.ComponentType<{className?: string}>; color: string; bg: string }> = {
  cadastro: { icon: FileText, color: "text-slate-600", bg: "bg-slate-100" },
  contato: { icon: Send, color: "text-blue-600", bg: "bg-blue-100" },
  pagamento: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
  negociacao: { icon: TrendingUp, color: "text-violet-600", bg: "bg-violet-100" },
  vencimento: { icon: AlertCircle, color: "text-red-600", bg: "bg-red-100" },
  atualizacao: { icon: Edit2, color: "text-orange-600", bg: "bg-orange-100" },
  ai_sugestao: { icon: BotMessageSquare, color: "text-indigo-600", bg: "bg-indigo-100" },
};

const canalIcon: Record<string, React.ComponentType<{className?: string}>> = {
  email: Mail,
  whatsapp: MessageCircle,
  telefone: Phone,
  sms: MessageCircle,
};

const canalColors: Record<string, string> = {
  email: "bg-blue-100 text-blue-700",
  whatsapp: "bg-emerald-100 text-emerald-700",
  sms: "bg-violet-100 text-violet-700",
  telefone: "bg-orange-100 text-orange-700",
  carta: "bg-slate-100 text-slate-700",
};

function TimelineItem({ event }: { event: TimelineEvent }) {
  const config = eventTypeConfig[event.tipo] || eventTypeConfig.atualizacao;
  const Icon = config.icon;

  return (
    <div className="relative flex gap-4 pb-6 timeline-item">
      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${config.bg}`}>
        <Icon className={`w-4 h-4 ${config.color}`} />
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p
              className={cn(
                "text-sm font-medium",
                event.tipo === "ai_sugestao" ? "text-indigo-800" : "text-slate-800"
              )}
            >
              {event.descricao}
            </p>
            {event.canal && (
              <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mt-1 ${canalColors[event.canal]}`}>
                {event.canal}
              </span>
            )}
            {event.valor && (
              <p className="text-sm font-semibold text-emerald-700 mt-1">
                {formatCurrency(event.valor)}
              </p>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-slate-400">{formatDateRelative(event.data)}</p>
            <p className="text-xs text-slate-300">{formatDate(event.data, "dd/MM/yyyy HH:mm")}</p>
            {event.autor && (
              <p className="text-xs text-slate-400 mt-0.5">{event.autor}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DebtDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const t = useTranslations("debts");
  const tc = useTranslations("common");
  const [debt, setDebt] = useState<Debt | null>(null);
  const [debtLoading, setDebtLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("pendente");

  useEffect(() => {
    fetch(`/api/dividas/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.id) {
          setDebt(data);
          setSelectedStatus(data.status);
        }
      })
      .catch(() => {})
      .finally(() => setDebtLoading(false));

    // Load saved Asaas payment if exists
    fetch(`/api/dividas/${id}/pagamento`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.boleto || data?.pix) setAsaasData(data);
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Asaas payment state
  const [asaasLoading, setAsaasLoading] = useState(false);
  const [asaasError, setAsaasError] = useState<string | null>(null);
  const [asaasData, setAsaasData] = useState<{
    boleto: { id: string; bankSlipUrl?: string; invoiceUrl?: string; linhaDigitavel: string };
    pix: { id: string; qrCodeBase64: string; copiaCola: string };
  } | null>(null);
  const [copiedBoleto, setCopiedBoleto] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);

  async function gerarCobrancaAsaas() {
    if (!debt) return;
    setAsaasLoading(true);
    setAsaasError(null);
    try {
      const res = await fetch("/api/asaas/criar-cobranca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          devedor: {
            nome: debt.devedor.nome,
            cpf_cnpj: debt.devedor.cpf_cnpj,
            email: debt.devedor.email,
          },
          valor: debt.valor_brl,
          descricao: debt.descricao,
          dataVencimento: debt.data_vencimento,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao gerar cobrança");
      setAsaasData({ boleto: data.boleto, pix: data.pix });
    } catch (err) {
      setAsaasError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setAsaasLoading(false);
    }
  }

  function copyToClipboard(text: string, type: "boleto" | "pix") {
    navigator.clipboard.writeText(text);
    if (type === "boleto") {
      setCopiedBoleto(true);
      setTimeout(() => setCopiedBoleto(false), 2000);
    } else {
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2000);
    }
  }

  async function saveStatus() {
    if (!debt) return;
    await fetch(`/api/dividas/${debt.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: selectedStatus }),
    });
    setDebt({ ...debt, status: selectedStatus as Debt["status"] });
  }

  async function addNote() {
    if (!debt || !newNote.trim()) return;
    await fetch(`/api/dividas/${debt.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nota: newNote }),
    });
    setNewNote("");
    // Refresh debt to get new timeline
    fetch(`/api/dividas/${id}`)
      .then((r) => r.json())
      .then((data) => { if (data?.id) setDebt(data); });
  }

  if (debtLoading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          {tc("loading")}
        </div>
      </div>
    );
  }

  if (!debt) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">{tc("noResults")}</p>
          <Link href="/dividas" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
            {tc("back")}
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[debt.status];
  const diasVencido =
    new Date(debt.data_vencimento) < new Date()
      ? Math.floor((new Date().getTime() - new Date(debt.data_vencimento).getTime()) / 86400000)
      : 0;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-3">
          <Link
            href="/dividas"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all mt-0.5"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">{debt.devedor.nome}</h1>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </span>
            </div>
            <p className="text-slate-500 text-sm">{debt.descricao}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/assistente"
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-xl transition-all text-sm"
          >
            <BotMessageSquare className="w-4 h-4" />
            {t("detail.openAssistant")}
          </Link>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium rounded-xl transition-all text-sm">
            <Download className="w-4 h-4" />
            {t("detail.export")}
          </button>
          <button className="p-2.5 border border-slate-200 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main content */}
        <div className="col-span-2 space-y-6">

          {/* Metrics row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{t("detail.originalValue")}</span>
              </div>
              <p className="text-xl font-bold text-slate-900">
                {formatCurrency(debt.valor_original, debt.moeda_original)}
              </p>
              <p className="text-sm text-slate-400">{formatCurrency(debt.valor_brl)} BRL</p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{t("detail.dueDate")}</span>
              </div>
              <p className={`text-xl font-bold ${diasVencido > 0 ? "text-red-600" : "text-slate-900"}`}>
                {formatDate(debt.data_vencimento)}
              </p>
              {diasVencido > 0 ? (
                <p className="text-sm text-red-500">{t("detail.daysOverdue", { count: diasVencido })}</p>
              ) : (
                <p className="text-sm text-slate-400">{t("detail.onTime")}</p>
              )}
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{t("detail.activeRule")}</span>
              </div>
              <p className="text-xl font-bold text-slate-900">{debt.regime_cobranca.filter(r => r.ativo).length}</p>
              <p className="text-sm text-slate-400">{t("detail.steps", { count: debt.regime_cobranca.length })}</p>
            </div>
          </div>

          {/* Régua de cobrança visual */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-slate-900">{t("detail.collectionRule")}</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">{t("detail.editRule")}</button>
            </div>

            {debt.regime_cobranca.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">{t("detail.noRule")}</p>
              </div>
            ) : (
              <div className="relative">
                {/* Progress line */}
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-slate-100" />
                <div
                  className="absolute top-5 left-5 h-0.5 bg-blue-500 transition-all"
                  style={{
                    width: `${Math.min(
                      (diasVencido /
                        Math.max(...debt.regime_cobranca.map((r) => r.dia))) *
                        100,
                      100
                    )}%`,
                  }}
                />

                <div className="flex items-start justify-between relative">
                  {debt.regime_cobranca.map((step, idx) => {
                    const isPast = diasVencido >= step.dia;
                    const isCurrent =
                      diasVencido >= step.dia &&
                      (idx === debt.regime_cobranca.length - 1 ||
                        diasVencido < debt.regime_cobranca[idx + 1]?.dia);

                    return (
                      <div key={step.id} className="flex flex-col items-center gap-2 max-w-[100px]">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-all",
                            isCurrent
                              ? "border-blue-500 bg-blue-500 text-white ring-4 ring-blue-100"
                              : isPast
                              ? "border-emerald-400 bg-emerald-400 text-white"
                              : "border-slate-200 bg-white text-slate-400"
                          )}
                        >
                          {isPast && !isCurrent ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <span className="text-xs font-bold">+{step.dia}d</span>
                          )}
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${canalColors[step.canal]}`}
                        >
                          {step.canal}
                        </span>
                        <p className="text-xs text-slate-500 text-center leading-tight">{step.template}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-slate-900">{t("detail.history")}</h3>
              <span className="text-xs text-slate-400">{t("detail.events", { count: debt.historico.length })}</span>
            </div>

            {/* Add note */}
            <div className="flex gap-3 mb-6 pb-6 border-b border-slate-100">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">J</span>
              </div>
              <div className="flex-1">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder={t("detail.addNote")}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                {newNote && (
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={addNote}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all"
                    >
                      {tc("add")}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              {[...debt.historico].reverse().map((event) => (
                <TimelineItem key={event.id} event={event} />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Status change */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h4 className="font-semibold text-slate-900 mb-3 text-sm">{t("table.status")}</h4>
            <div className="space-y-2">
              {Object.entries(statusConfig).map(([value, cfg]) => (
                <button
                  key={value}
                  onClick={() => setSelectedStatus(value)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all",
                    selectedStatus === value
                      ? `border-current ${cfg.bg} ${cfg.text}`
                      : "border-transparent hover:bg-slate-50 text-slate-600"
                  )}
                >
                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </button>
              ))}
            </div>
            {selectedStatus !== debt.status && (
              <button
                onClick={saveStatus}
                className="w-full mt-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all"
              >
                {t("detail.saveStatus")}
              </button>
            )}
          </div>

          {/* Debtor info */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-slate-900 text-sm">{t("detail.debtorInfo")}</h4>
              <button className="text-slate-400 hover:text-slate-600">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <User className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Nome</p>
                  <p className="text-sm font-medium text-slate-800">{debt.devedor.nome}</p>
                  <p className="text-xs text-slate-400">{debt.devedor.cpf_cnpj}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">E-mail</p>
                  <a
                    href={`mailto:${debt.devedor.email}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {debt.devedor.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Telefone</p>
                  <p className="text-sm text-slate-800">{debt.devedor.telefone}</p>
                </div>
              </div>

              {debt.devedor.cidade && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Localização</p>
                    <p className="text-sm text-slate-800">
                      {debt.devedor.cidade}/{debt.devedor.estado}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
              <a
                href={`mailto:${debt.devedor.email}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-lg transition-all"
              >
                <Mail className="w-3.5 h-3.5" />
                E-mail
              </a>
              <a
                href={`https://wa.me/55${debt.devedor.telefone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium rounded-lg transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp
              </a>
            </div>
          </div>

          {/* Asaas Payment */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <QrCode className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold text-slate-900 text-sm">Boleto & Pix</h4>
            </div>

            {!asaasData && !asaasLoading && (
              <div>
                <p className="text-xs text-slate-500 mb-3">
                  Gere boleto bancário e QR code Pix para este devedor via Asaas.
                </p>
                {asaasError && (
                  <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-3">
                    {asaasError}
                  </p>
                )}
                <button
                  onClick={gerarCobrancaAsaas}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all"
                >
                  <QrCode className="w-4 h-4" />
                  Gerar Boleto + Pix
                </button>
              </div>
            )}

            {asaasLoading && (
              <div className="flex items-center justify-center gap-2 py-4 text-slate-500 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Gerando cobranças no Asaas...
              </div>
            )}

            {asaasData && (
              <div className="space-y-4">
                {/* Pix QR Code */}
                <div>
                  <p className="text-xs font-semibold text-slate-700 mb-2">QR Code Pix</p>
                  {asaasData.pix.qrCodeBase64 && (
                    <div className="flex justify-center mb-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`data:image/png;base64,${asaasData.pix.qrCodeBase64}`}
                        alt="QR Code Pix"
                        className="w-32 h-32 rounded-lg border border-slate-200"
                      />
                    </div>
                  )}
                  <button
                    onClick={() => copyToClipboard(asaasData.pix.copiaCola, "pix")}
                    className="w-full flex items-center justify-center gap-1.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedPix ? "Copiado!" : "Copiar chave Pix"}
                  </button>
                </div>

                <div className="border-t border-slate-100" />

                {/* Boleto */}
                <div>
                  <p className="text-xs font-semibold text-slate-700 mb-2">Boleto Bancário</p>
                  <p className="text-[10px] text-slate-400 font-mono break-all bg-slate-50 rounded-lg px-2 py-1.5 mb-2 leading-relaxed">
                    {asaasData.boleto.linhaDigitavel}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(asaasData.boleto.linhaDigitavel, "boleto")}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copiedBoleto ? "Copiado!" : "Copiar"}
                    </button>
                    {(asaasData.boleto.bankSlipUrl || asaasData.boleto.invoiceUrl) && (
                      <a
                        href={asaasData.boleto.bankSlipUrl || asaasData.boleto.invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Abrir boleto
                      </a>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => { setAsaasData(null); setAsaasError(null); }}
                  className="w-full text-xs text-slate-400 hover:text-slate-600 transition-colors pt-1"
                >
                  Gerar nova cobrança
                </button>
              </div>
            )}
          </div>

          {/* Documents */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h4 className="font-semibold text-slate-900 text-sm mb-3">{t("detail.documents")}</h4>
            {debt.documentos.length === 0 ? (
              <p className="text-sm text-slate-400">{t("detail.noDocuments")}</p>
            ) : (
              <div className="space-y-2">
                {debt.documentos.map((doc) => (
                  <div
                    key={doc}
                    className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    <div className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-3.5 h-3.5 text-red-600" />
                    </div>
                    <span className="text-xs text-slate-700 font-medium flex-1 truncate">{doc}</span>
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI suggestion */}
          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-5 border border-indigo-100">
            <div className="flex items-center gap-2 mb-3">
              <BotMessageSquare className="w-4 h-4 text-indigo-600" />
              <h4 className="font-semibold text-indigo-900 text-sm">{t("detail.aiSuggestion")}</h4>
            </div>
            <p className="text-sm text-indigo-700 leading-relaxed">
              {t("detail.aiSuggestionText")}
            </p>
            <Link
              href="/assistente"
              className="mt-3 flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              {t("detail.fullAnalysis")}
              <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Need Bell import
function Bell({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}
