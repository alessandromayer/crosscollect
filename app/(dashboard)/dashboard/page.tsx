"use client";

import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Plus,
  Clock,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { formatCurrency, formatDate, getStatusLabel } from "@/lib/utils";
import { CotacoesPanel } from "@/components/cotacoes-panel";
import { useCotacoes, getBid } from "@/hooks/use-cotacoes";
import { DataLoadState } from "@/components/data-load-state";
import type { DashboardMetrics } from "@/types";

const statusBadgeClass: Record<string, string> = {
  pendente: "bg-yellow-50 text-yellow-700 border border-yellow-100",
  em_negociacao: "bg-blue-50 text-blue-700 border border-blue-100",
  pago: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  vencido: "bg-red-50 text-red-700 border border-red-100",
  cancelado: "bg-slate-100 text-slate-600",
};

function MetricCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon: Icon,
  color,
  conversions,
}: {
  title: string;
  value: string;
  subtitle?: string;
  trend?: "up" | "down";
  trendValue?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: "blue" | "green" | "orange" | "purple";
  conversions?: { code: string; value: string }[];
}) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-violet-50 text-violet-600",
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && trendValue && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
              trend === "up" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
            }`}
          >
            {trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        {subtitle && <p className="text-slate-400 text-xs mt-1">{subtitle}</p>}
        {conversions && conversions.length > 0 && (
          <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex flex-col gap-1">
            {conversions.map(({ code, value: v }) => (
              <div key={code} className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{code}</span>
                <span className="text-xs font-semibold text-slate-600">{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface RecentDebt {
  id: string;
  devedor_nome: string;
  descricao: string;
  valor: number;
  moeda: string;
  valor_brl: number;
  data_vencimento: string;
  status: string;
}

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const [chartMonths, setChartMonths] = useState(6);
  const { cotacoes } = useCotacoes();

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentDebts, setRecentDebts] = useState<RecentDebt[]>([]);

  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setErrorStatus(null);
    fetch("/api/dashboard/metrics", { signal: controller.signal })
      .then(async (response) => {
        if (controller.signal.aborted) return;
        if (!response.ok) {
          setErrorStatus(response.status);
          throw new Error("Metrics request failed");
        }
        const data = await response.json();
        if (!data.metrics || !Array.isArray(data.metrics.monthly_recovery) || !Array.isArray(data.recentDebts)) throw new Error("Invalid metrics response");
        if (!controller.signal.aborted) {
          setMetrics(data.metrics);
          setRecentDebts(data.recentDebts);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setErrorStatus((status) => status ?? 0);
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [attempt]);

  if (loading || errorStatus !== null || !metrics) {
    return <DataLoadState loading={loading} status={errorStatus ?? 0}
      onRetry={() => setAttempt((value) => value + 1)} />;
  }

  const m = metrics;

  // Live-rate conversions of the BRL open balance
  const openBalanceConversions = cotacoes
    ? [
        { code: "USD", value: formatCurrency(m.total_em_aberto_brl / getBid(cotacoes, "USD"), "USD") },
        { code: "EUR", value: formatCurrency(m.total_em_aberto_brl / getBid(cotacoes, "EUR"), "EUR") },
        { code: "GBP", value: formatCurrency(m.total_em_aberto_brl / getBid(cotacoes, "GBP"), "GBP") },
      ]
    : undefined;

  const chartData = m.monthly_recovery.slice(-chartMonths).map((item) => ({
    ...item,
    label: new Intl.DateTimeFormat(locale, { month: "short", year: "2-digit", timeZone: "UTC" })
      .format(new Date(item.month + "-01T00:00:00Z")),
  }));
  const maxVal = Math.max(...chartData.map((item) => item.total_brl), 1);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
          <p className="text-slate-500 mt-0.5">{t("overview")}</p>
        </div>
        <Link
          href="/dividas/nova"
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25"
        >
          <Plus className="w-4 h-4" />
          {t("newDebt")}
        </Link>
      </div>

      {/* Live exchange rates strip */}
      <CotacoesPanel />

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        <MetricCard
          title={t("metrics.openBalance")}
          value={`≈ ${formatCurrency(m.total_em_aberto_brl)}`}
          subtitle={t("metrics.openBalanceSub", { value: formatCurrency(m.total_em_aberto_brl) })}
          icon={DollarSign}
          color="blue"
          conversions={openBalanceConversions}
        />
        <MetricCard
          title={t("metrics.recoveredMonth")}
          value={`≈ ${formatCurrency(m.recuperado_mes_brl)}`}
          subtitle={t("metrics.storedConversion")}
          icon={TrendingUp}
          color="green"
        />
        <MetricCard
          title={t("metrics.successRate")}
          value={`${m.taxa_sucesso}%`}
          subtitle={t("metrics.successRateSub")}
          icon={CheckCircle2}
          color="purple"
        />
        <MetricCard
          title={t("metrics.activeCases")}
          value={String(m.casos_ativos)}
          subtitle={t("metrics.activeCasesSub", { count: m.casos_vencidos })}
          icon={FileText}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Chart */}
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-slate-900">{t("chart.title")}</h3>
              <p className="text-slate-400 text-sm">{t("chart.sub")}</p>
            </div>
            <select value={chartMonths} onChange={(event) => setChartMonths(Number(event.target.value))}
              aria-label={t("chart.period")} className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value={6}>{t("chart.last6")}</option>
              <option value={12}>{t("chart.lastYear")}</option>
            </select>
          </div>
          <div className="flex items-end gap-3 h-40">
            {chartData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-xs text-slate-500 font-medium">
                  {formatCurrency(d.total_brl)}
                </span>
                <div className="w-full flex items-end justify-center">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:from-blue-700 hover:to-blue-500 cursor-pointer"
                    style={{ height: `${(d.total_brl / maxVal) * 120}px`, minHeight: d.total_brl > 0 ? "2px" : "0px" }}
                  />
                </div>
                <span className="text-xs text-slate-400">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-900 mb-5">{t("portfolio.title")}</h3>
          <div className="space-y-4">
            {(() => {
              const p = m.portfolio;
              const total = p?.total ?? 0;
              const pct = (n: number) => total > 0 ? Math.round((n / total) * 100) : 0;
              return [
                { label: t("portfolio.pending"),     count: p?.pendente     ?? 0, pct: pct(p?.pendente     ?? 0), color: "bg-yellow-400" },
                { label: t("portfolio.negotiating"), count: p?.em_negociacao ?? 0, pct: pct(p?.em_negociacao ?? 0), color: "bg-blue-500"   },
                { label: t("portfolio.overdue"),     count: p?.vencido       ?? 0, pct: pct(p?.vencido       ?? 0), color: "bg-red-500"    },
                { label: t("portfolio.paid"),        count: p?.pago          ?? 0, pct: pct(p?.pago          ?? 0), color: "bg-emerald-500"},
              ];
            })().map((item) => (
              <div key={item.label}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm text-slate-600">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{item.count}</span>
                    <span className="text-xs text-slate-400">{item.pct}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div
                    className={`${item.color} h-1.5 rounded-full transition-all`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-5 border-t border-slate-100">
            <Link
              href="/dividas"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              {t("recentDebts.viewAll")}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent debts */}
      <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">{t("recentDebts.title")}</h3>
            <p className="text-slate-400 text-sm">{t("recentDebts.sub")}</p>
          </div>
          <Link
            href="/dividas"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            {t("recentDebts.viewAll")}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-slate-50">
          {recentDebts.map((debt) => {
            const liveBid = getBid(cotacoes, debt.moeda);
            const liveValue = liveBid > 0 ? Number(debt.valor_brl) / liveBid : null;

            return (
              <Link
                key={debt.id}
                href={`/dividas/${debt.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-slate-600 font-bold text-sm">{debt.devedor_nome.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                    {debt.devedor_nome}
                  </p>
                  <p className="text-slate-400 text-xs truncate">{debt.descricao}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-slate-900 text-sm">
                    {formatCurrency(Number(debt.valor), debt.moeda)}
                  </p>
                  <p className="text-slate-400 text-xs">{formatCurrency(Number(debt.valor_brl))}</p>
                  {liveValue !== null && debt.moeda !== "BRL" && (
                    <p className="text-blue-500 text-xs">
                      ≈ {formatCurrency(liveValue, debt.moeda)} atual
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <span className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full ${statusBadgeClass[debt.status]}`}>
                    {getStatusLabel(debt.status)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-xs flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  {debt.data_vencimento ? formatDate(debt.data_vencimento) : "—"}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-100 bg-white p-5">
        <h2 className="font-semibold text-slate-900">{t("communications.title")}</h2>
        <p className="mt-2 text-sm text-slate-500">{t("communications.disabled")}</p>
      </section>

      {/* Alert */}
      {m.casos_vencidos > 0 && <div className="mt-6 bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-start gap-4">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-900 text-sm">
            {t("alert.title", { count: m.casos_vencidos })}
          </p>
          <p className="text-amber-700 text-sm mt-0.5">{t("alert.sub")}</p>
        </div>
        <Link
          href="/dividas"
          className="ml-auto flex-shrink-0 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-all"
        >
          {t("alert.cta")}
        </Link>
      </div>}
    </div>
  );
}
