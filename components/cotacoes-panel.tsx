"use client";

import { TrendingUp, TrendingDown, RefreshCw, Clock } from "lucide-react";
import { useCotacoes, Cotacoes } from "@/hooks/use-cotacoes";
import { cn } from "@/lib/utils";

const CURRENCIES: {
  key: keyof Cotacoes;
  code: string;
  label: string;
  flag: string;
}[] = [
  { key: "USDBRL", code: "USD", label: "Dólar", flag: "🇺🇸" },
  { key: "EURBRL", code: "EUR", label: "Euro", flag: "🇪🇺" },
  { key: "GBPBRL", code: "GBP", label: "Libra", flag: "🇬🇧" },
  { key: "CHFBRL", code: "CHF", label: "Franco Suíço", flag: "🇨🇭" },
];

function formatRate(bid: string): string {
  return parseFloat(bid).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function CotacoesPanel() {
  const { cotacoes, loading, error, lastUpdate, countdown, refresh } = useCotacoes();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-5 py-3.5 mb-6">
      <div className="flex items-center justify-between">
        {/* Currency rates */}
        <div className="flex items-center gap-6">
          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Carregando cotações...
            </div>
          )}
          {error && !loading && (
            <span className="text-red-500 text-sm">Erro ao carregar cotações.</span>
          )}
          {!loading && !error && cotacoes &&
            CURRENCIES.map(({ key, code, label, flag }) => {
              const item = cotacoes[key];
              if (!item) return null;
              const pct = parseFloat(item.pctChange);
              const isUp = pct >= 0;

              return (
                <div key={code} className="flex items-center gap-2.5">
                  <span className="text-base leading-none">{flag}</span>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-semibold text-slate-500">{code}</span>
                      <span className="text-sm font-bold text-slate-900">
                        R$ {formatRate(item.bid)}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "flex items-center gap-0.5 text-xs font-semibold",
                        isUp ? "text-emerald-600" : "text-red-500"
                      )}
                    >
                      {isUp ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {isUp ? "+" : ""}{pct.toFixed(2)}%
                    </div>
                  </div>
                  <div className="h-6 w-px bg-slate-100 last:hidden" />
                </div>
              );
            })}
        </div>

        {/* Footer info */}
        <div className="flex items-center gap-3 text-xs text-slate-400 flex-shrink-0">
          {lastUpdate && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(lastUpdate)}
            </span>
          )}
          <span className="text-slate-300">·</span>
          <span>
            Atualiza em{" "}
            <span className="font-medium text-slate-500">{formatCountdown(countdown)}</span>
          </span>
          <button
            onClick={refresh}
            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="Atualizar agora"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
