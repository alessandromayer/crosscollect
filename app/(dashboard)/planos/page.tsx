"use client";

import { useState } from "react";
import {
  Check,
  X,
  Zap,
  Globe2,
  Building2,
  Crown,
  ChevronRight,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Period = "mensal" | "anual";

const plans = [
  {
    id: "starter",
    nome: "Starter",
    descricao: "Para credores individuais começando",
    icon: Globe2,
    preco: { mensal: 0, anual: 0 },
    moeda: "USD",
    cor: "slate",
    recursos: [
      { label: "Até 5 dívidas ativas", ok: true },
      { label: "Assistente IA (50 msg/mês)", ok: true },
      { label: "Régua de cobrança básica", ok: true },
      { label: "Dashboard de métricas", ok: true },
      { label: "1 usuário", ok: true },
      { label: "Relatórios avançados", ok: false },
      { label: "Repasse bancário automático", ok: false },
      { label: "API de integração", ok: false },
      { label: "Suporte prioritário", ok: false },
    ],
    limite_dividas: 5,
    limite_usuarios: 1,
    cta: "Começar grátis",
    destaque: false,
  },
  {
    id: "growth",
    nome: "Growth",
    descricao: "Para equipes em crescimento",
    icon: Zap,
    preco: { mensal: 49, anual: 39 },
    moeda: "USD",
    cor: "blue",
    recursos: [
      { label: "Até 50 dívidas ativas", ok: true },
      { label: "Assistente IA (1.000 msg/mês)", ok: true },
      { label: "Régua de cobrança avançada", ok: true },
      { label: "Dashboard completo + relatórios", ok: true },
      { label: "Até 3 usuários", ok: true },
      { label: "Relatórios PDF exportáveis", ok: true },
      { label: "Repasse bancário automático", ok: false },
      { label: "API de integração", ok: false },
      { label: "Suporte por e-mail", ok: true },
    ],
    limite_dividas: 50,
    limite_usuarios: 3,
    cta: "Assinar Growth",
    destaque: true,
  },
  {
    id: "professional",
    nome: "Professional",
    descricao: "Para empresas com alto volume",
    icon: Building2,
    preco: { mensal: 149, anual: 119 },
    moeda: "USD",
    cor: "violet",
    recursos: [
      { label: "Dívidas ilimitadas", ok: true },
      { label: "Assistente IA ilimitado", ok: true },
      { label: "Régua de cobrança personalizada", ok: true },
      { label: "Dashboard + relatórios avançados", ok: true },
      { label: "Até 10 usuários", ok: true },
      { label: "Relatórios PDF e Excel", ok: true },
      { label: "Repasse bancário automático", ok: true },
      { label: "API REST completa", ok: true },
      { label: "Suporte prioritário (chat)", ok: true },
    ],
    limite_dividas: -1,
    limite_usuarios: 10,
    cta: "Assinar Professional",
    destaque: false,
  },
  {
    id: "enterprise",
    nome: "Enterprise",
    descricao: "Solução sob medida para grandes carteiras",
    icon: Crown,
    preco: { mensal: 0, anual: 0 },
    moeda: "USD",
    cor: "amber",
    recursos: [
      { label: "Tudo do Professional", ok: true },
      { label: "Usuários ilimitados", ok: true },
      { label: "SLA garantido 99,9%", ok: true },
      { label: "Onboarding dedicado", ok: true },
      { label: "Integrações customizadas", ok: true },
      { label: "Gerente de conta exclusivo", ok: true },
      { label: "Treinamento da equipe", ok: true },
      { label: "Contrato personalizado", ok: true },
      { label: "Suporte 24/7", ok: true },
    ],
    limite_dividas: -1,
    limite_usuarios: -1,
    cta: "Falar com vendas",
    destaque: false,
  },
];

const colorMap: Record<string, {
  bg: string; text: string; border: string; badge: string; cta: string; icon: string;
}> = {
  slate: {
    bg: "bg-white",
    text: "text-slate-900",
    border: "border-slate-200",
    badge: "bg-slate-100 text-slate-600",
    cta: "bg-slate-900 hover:bg-slate-800 text-white",
    icon: "text-slate-500 bg-slate-100",
  },
  blue: {
    bg: "bg-blue-600",
    text: "text-white",
    border: "border-blue-600",
    badge: "bg-blue-500 text-white",
    cta: "bg-white hover:bg-blue-50 text-blue-700",
    icon: "text-white bg-blue-500",
  },
  violet: {
    bg: "bg-white",
    text: "text-slate-900",
    border: "border-violet-200",
    badge: "bg-violet-100 text-violet-700",
    cta: "bg-violet-600 hover:bg-violet-700 text-white",
    icon: "text-violet-600 bg-violet-100",
  },
  amber: {
    bg: "bg-white",
    text: "text-slate-900",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    cta: "bg-amber-600 hover:bg-amber-700 text-white",
    icon: "text-amber-600 bg-amber-100",
  },
};

export default function PlanosPage() {
  const [period, setPeriod] = useState<Period>("mensal");
  const currentPlan = "growth";

  return (
    <div className="p-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-4">
          <Star className="w-3.5 h-3.5" />
          Plano atual: Growth
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          Escolha o plano ideal para sua carteira
        </h1>
        <p className="text-slate-500 text-lg max-w-xl mx-auto">
          Escale sua operação de cobrança internacional com as ferramentas certas
        </p>

        {/* Period toggle */}
        <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-xl mt-6">
          <button
            onClick={() => setPeriod("mensal")}
            className={cn(
              "px-5 py-2 rounded-lg text-sm font-semibold transition-all",
              period === "mensal"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            Mensal
          </button>
          <button
            onClick={() => setPeriod("anual")}
            className={cn(
              "px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
              period === "anual"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            Anual
            <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-4 gap-5 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const colors = colorMap[plan.cor];
          const isCurrentPlan = plan.id === currentPlan;
          const isEnterprise = plan.id === "enterprise";
          const price = plan.preco[period];

          return (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-2xl border-2 p-6 flex flex-col transition-all",
                plan.destaque
                  ? `${colors.bg} ${colors.border} shadow-2xl shadow-blue-600/20 scale-105`
                  : `bg-white ${colors.border} shadow-sm hover:shadow-md`
              )}
            >
              {/* Badge */}
              {plan.destaque && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-white text-blue-600 text-xs font-bold px-3 py-1 rounded-full shadow-md border border-blue-100">
                    Mais popular
                  </span>
                </div>
              )}

              {isCurrentPlan && !plan.destaque && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Plano atual
                  </span>
                </div>
              )}

              {/* Icon & Name */}
              <div className="mb-4">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", colors.icon)}>
                  <plan.icon className="w-5 h-5" />
                </div>
                <h3 className={cn("text-xl font-bold", plan.destaque ? "text-white" : "text-slate-900")}>
                  {plan.nome}
                </h3>
                <p className={cn("text-sm mt-1", plan.destaque ? "text-blue-100" : "text-slate-500")}>
                  {plan.descricao}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                {isEnterprise ? (
                  <div>
                    <p className={cn("text-3xl font-bold", plan.destaque ? "text-white" : "text-slate-900")}>
                      Sob consulta
                    </p>
                    <p className={cn("text-sm mt-1", plan.destaque ? "text-blue-200" : "text-slate-400")}>
                      Contrato personalizado
                    </p>
                  </div>
                ) : price === 0 ? (
                  <div>
                    <p className={cn("text-3xl font-bold", plan.destaque ? "text-white" : "text-slate-900")}>
                      Grátis
                    </p>
                    <p className={cn("text-sm mt-1", plan.destaque ? "text-blue-200" : "text-slate-400")}>
                      Para sempre
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className={cn("text-sm font-medium", plan.destaque ? "text-blue-200" : "text-slate-400")}>
                        USD
                      </span>
                      <span className={cn("text-3xl font-bold", plan.destaque ? "text-white" : "text-slate-900")}>
                        ${price}
                      </span>
                      <span className={cn("text-sm", plan.destaque ? "text-blue-200" : "text-slate-400")}>
                        /mês
                      </span>
                    </div>
                    {period === "anual" && (
                      <p className={cn("text-xs mt-1", plan.destaque ? "text-blue-200" : "text-slate-400")}>
                        Cobrado anualmente (${price * 12}/ano)
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.recursos.map((recurso) => (
                  <li key={recurso.label} className="flex items-start gap-2">
                    {recurso.ok ? (
                      <Check
                        className={cn(
                          "w-4 h-4 flex-shrink-0 mt-0.5",
                          plan.destaque ? "text-blue-200" : "text-emerald-500"
                        )}
                      />
                    ) : (
                      <X className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-300" />
                    )}
                    <span
                      className={cn(
                        "text-sm",
                        recurso.ok
                          ? plan.destaque
                            ? "text-blue-50"
                            : "text-slate-700"
                          : "text-slate-300"
                      )}
                    >
                      {recurso.label}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                className={cn(
                  "w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2",
                  colors.cta,
                  isCurrentPlan && "opacity-60 cursor-not-allowed"
                )}
                disabled={isCurrentPlan}
              >
                {isCurrentPlan ? "Plano atual" : plan.cta}
                {!isCurrentPlan && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          );
        })}
      </div>

      {/* FAQ / Trust */}
      <div className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-slate-900 text-center mb-8">Perguntas frequentes</h2>
        <div className="grid grid-cols-2 gap-6">
          {[
            {
              q: "Posso cancelar a qualquer momento?",
              a: "Sim. Não há fidelidade. Você pode cancelar ou fazer downgrade a qualquer momento pela página de configurações.",
            },
            {
              q: "Quais formas de pagamento são aceitas?",
              a: "Aceitamos cartões de crédito internacionais (Visa, Mastercard, Amex) e transferência bancária para planos Enterprise.",
            },
            {
              q: "O que acontece se eu ultrapassar os limites?",
              a: "Você receberá uma notificação e poderá fazer upgrade imediatamente. Não há cobranças extras inesperadas.",
            },
            {
              q: "Posso mudar de plano no meio do mês?",
              a: "Sim. O upgrade é imediato e o valor é proporcional ao período restante. O downgrade ocorre no próximo ciclo.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <h4 className="font-semibold text-slate-900 mb-2 text-sm">{q}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center bg-slate-50 rounded-2xl p-8 border border-slate-100">
          <p className="text-slate-600 font-medium mb-1">Precisa de uma solução personalizada?</p>
          <p className="text-slate-400 text-sm mb-4">
            Nossa equipe de vendas pode criar um plano sob medida para grandes carteiras.
          </p>
          <button className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all">
            Falar com um especialista
          </button>
        </div>
      </div>
    </div>
  );
}
