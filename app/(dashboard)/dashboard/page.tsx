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
import { mockMetrics, mockDebts } from "@/lib/mock-data";
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from "@/lib/utils";

function MetricCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  subtitle?: string;
  trend?: "up" | "down";
  trendValue?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: "blue" | "green" | "orange" | "purple";
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
              trend === "up"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {trend === "up" ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        {subtitle && <p className="text-slate-400 text-xs mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

const statusBadgeClass: Record<string, string> = {
  pendente: "bg-yellow-50 text-yellow-700 border border-yellow-100",
  em_negociacao: "bg-blue-50 text-blue-700 border border-blue-100",
  pago: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  vencido: "bg-red-50 text-red-700 border border-red-100",
  cancelado: "bg-slate-100 text-slate-600",
};

export default function DashboardPage() {
  const recentDebts = mockDebts.slice(0, 5);

  const chartData = [
    { mes: "Out", valor: 48000 },
    { mes: "Nov", valor: 62000 },
    { mes: "Dez", valor: 55000 },
    { mes: "Jan", valor: 78000 },
    { mes: "Fev", valor: 91000 },
    { mes: "Mar", valor: 125000 },
  ];
  const maxVal = Math.max(...chartData.map((d) => d.valor));

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-0.5">Bem-vindo de volta, João. Aqui está o resumo da sua carteira.</p>
        </div>
        <Link
          href="/dividas/nova"
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25"
        >
          <Plus className="w-4 h-4" />
          Nova Dívida
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        <MetricCard
          title="Total em Aberto"
          value={formatCurrency(mockMetrics.total_em_aberto, "USD")}
          subtitle={`≈ ${formatCurrency(mockMetrics.total_em_aberto_brl)} em BRL`}
          trend="up"
          trendValue="+8.2%"
          icon={DollarSign}
          color="blue"
        />
        <MetricCard
          title="Recuperado este mês"
          value={formatCurrency(mockMetrics.recuperado_mes, "USD")}
          subtitle={`≈ ${formatCurrency(mockMetrics.recuperado_mes_brl)}`}
          trend="up"
          trendValue={`+${mockMetrics.variacao_mensal}%`}
          icon={TrendingUp}
          color="green"
        />
        <MetricCard
          title="Taxa de Sucesso"
          value={`${mockMetrics.taxa_sucesso}%`}
          subtitle="Últimos 90 dias"
          trend="up"
          trendValue="+3.1%"
          icon={CheckCircle2}
          color="purple"
        />
        <MetricCard
          title="Casos Ativos"
          value={String(mockMetrics.casos_ativos)}
          subtitle={`${mockMetrics.casos_vencidos} vencidos`}
          icon={FileText}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Chart */}
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-slate-900">Recuperação Mensal</h3>
              <p className="text-slate-400 text-sm">Últimos 6 meses (USD)</p>
            </div>
            <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Últimos 6 meses</option>
              <option>Último ano</option>
            </select>
          </div>

          <div className="flex items-end gap-3 h-40">
            {chartData.map((d) => (
              <div key={d.mes} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-xs text-slate-500 font-medium">
                  ${(d.valor / 1000).toFixed(0)}k
                </span>
                <div className="w-full flex items-end justify-center">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:from-blue-700 hover:to-blue-500 cursor-pointer"
                    style={{ height: `${(d.valor / maxVal) * 120}px`, minHeight: "8px" }}
                  />
                </div>
                <span className="text-xs text-slate-400">{d.mes}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-900 mb-5">Status da Carteira</h3>
          <div className="space-y-4">
            {[
              { label: "Pendentes", count: 18, pct: 42, color: "bg-yellow-400" },
              { label: "Em Negociação", count: 12, pct: 28, color: "bg-blue-500" },
              { label: "Vencidas", count: 8, pct: 19, color: "bg-red-500" },
              { label: "Pagas", count: 5, pct: 11, color: "bg-emerald-500" },
            ].map((item) => (
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
              Ver todas as dívidas
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent debts */}
      <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">Dívidas Recentes</h3>
            <p className="text-slate-400 text-sm">Adicionadas nos últimos 30 dias</p>
          </div>
          <Link
            href="/dividas"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            Ver todas
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-50">
          {recentDebts.map((debt) => (
            <Link
              key={debt.id}
              href={`/dividas/${debt.id}`}
              className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-slate-600 font-bold text-sm">
                  {debt.devedor.nome.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                  {debt.devedor.nome}
                </p>
                <p className="text-slate-400 text-xs truncate">{debt.descricao}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-slate-900 text-sm">
                  {formatCurrency(debt.valor_original, debt.moeda_original)}
                </p>
                <p className="text-slate-400 text-xs">{formatCurrency(debt.valor_brl)}</p>
              </div>
              <div className="flex-shrink-0">
                <span
                  className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full ${statusBadgeClass[debt.status]}`}
                >
                  {getStatusLabel(debt.status)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-slate-400 text-xs flex-shrink-0">
                <Clock className="w-3 h-3" />
                {formatDate(debt.data_vencimento)}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div className="mt-6 bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-start gap-4">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-900 text-sm">
            {mockMetrics.casos_vencidos} dívidas vencidas precisam de atenção
          </p>
          <p className="text-amber-700 text-sm mt-0.5">
            Ative o assistente IA para receber sugestões de estratégia de cobrança personalizadas.
          </p>
        </div>
        <Link
          href="/assistente"
          className="ml-auto flex-shrink-0 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-all"
        >
          Abrir Assistente
        </Link>
      </div>
    </div>
  );
}
