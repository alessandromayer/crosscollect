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
import { useTranslations } from "next-intl";

type Period = "mensal" | "anual";

type PlanFeatureKey =
  | "debts5" | "debts50" | "debtsUnlimited"
  | "ai50" | "ai1000" | "aiUnlimited"
  | "rule" | "ruleAdv" | "rulePro"
  | "dashboard" | "dashboardFull" | "dashboardAdv"
  | "user1" | "user3" | "user10" | "usersUnlimited"
  | "pdf" | "pdfExcel"
  | "transfer" | "api"
  | "support" | "supportPriority" | "support247"
  | "sla" | "onboarding" | "integrations"
  | "manager" | "training" | "contract" | "everything";

const plansData = [
  {
    id: "starter",
    nome: "Starter",
    icon: Globe2,
    preco: { mensal: 0, anual: 0 },
    cor: "slate",
    recursos: [
      { key: "debts5" as PlanFeatureKey, ok: true },
      { key: "ai50" as PlanFeatureKey, ok: true },
      { key: "rule" as PlanFeatureKey, ok: true },
      { key: "dashboard" as PlanFeatureKey, ok: true },
      { key: "user1" as PlanFeatureKey, ok: true },
      { key: "dashboardAdv" as PlanFeatureKey, ok: false },
      { key: "transfer" as PlanFeatureKey, ok: false },
      { key: "api" as PlanFeatureKey, ok: false },
      { key: "supportPriority" as PlanFeatureKey, ok: false },
    ],
    ctaKey: "starter" as const,
    destaque: false,
  },
  {
    id: "growth",
    nome: "Growth",
    icon: Zap,
    preco: { mensal: 49, anual: 39 },
    cor: "blue",
    recursos: [
      { key: "debts50" as PlanFeatureKey, ok: true },
      { key: "ai1000" as PlanFeatureKey, ok: true },
      { key: "ruleAdv" as PlanFeatureKey, ok: true },
      { key: "dashboardFull" as PlanFeatureKey, ok: true },
      { key: "user3" as PlanFeatureKey, ok: true },
      { key: "pdf" as PlanFeatureKey, ok: true },
      { key: "transfer" as PlanFeatureKey, ok: false },
      { key: "api" as PlanFeatureKey, ok: false },
      { key: "support" as PlanFeatureKey, ok: true },
    ],
    ctaKey: "growth" as const,
    destaque: true,
  },
  {
    id: "professional",
    nome: "Professional",
    icon: Building2,
    preco: { mensal: 149, anual: 119 },
    cor: "violet",
    recursos: [
      { key: "debtsUnlimited" as PlanFeatureKey, ok: true },
      { key: "aiUnlimited" as PlanFeatureKey, ok: true },
      { key: "rulePro" as PlanFeatureKey, ok: true },
      { key: "dashboardAdv" as PlanFeatureKey, ok: true },
      { key: "user10" as PlanFeatureKey, ok: true },
      { key: "pdfExcel" as PlanFeatureKey, ok: true },
      { key: "transfer" as PlanFeatureKey, ok: true },
      { key: "api" as PlanFeatureKey, ok: true },
      { key: "supportPriority" as PlanFeatureKey, ok: true },
    ],
    ctaKey: "professional" as const,
    destaque: false,
  },
  {
    id: "enterprise",
    nome: "Enterprise",
    icon: Crown,
    preco: { mensal: 0, anual: 0 },
    cor: "amber",
    recursos: [
      { key: "everything" as PlanFeatureKey, ok: true },
      { key: "usersUnlimited" as PlanFeatureKey, ok: true },
      { key: "sla" as PlanFeatureKey, ok: true },
      { key: "onboarding" as PlanFeatureKey, ok: true },
      { key: "integrations" as PlanFeatureKey, ok: true },
      { key: "manager" as PlanFeatureKey, ok: true },
      { key: "training" as PlanFeatureKey, ok: true },
      { key: "contract" as PlanFeatureKey, ok: true },
      { key: "support247" as PlanFeatureKey, ok: true },
    ],
    ctaKey: "enterprise" as const,
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
  const t = useTranslations("plans");
  const [period, setPeriod] = useState<Period>("mensal");
  const currentPlan = "growth";

  const faqItems = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-4">
          <Star className="w-3.5 h-3.5" />
          {t("badge")}
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          {t("title")}
        </h1>
        <p className="text-slate-500 text-lg max-w-xl mx-auto">
          {t("sub")}
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
            {t("monthly")}
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
            {t("annual")}
            <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
              {t("discount")}
            </span>
          </button>
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-4 gap-5 max-w-6xl mx-auto">
        {plansData.map((plan) => {
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
                    {t("mostPopular")}
                  </span>
                </div>
              )}

              {isCurrentPlan && !plan.destaque && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {t("currentPlan")}
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
              </div>

              {/* Price */}
              <div className="mb-6">
                {isEnterprise ? (
                  <div>
                    <p className={cn("text-3xl font-bold", plan.destaque ? "text-white" : "text-slate-900")}>
                      {t("custom")}
                    </p>
                    <p className={cn("text-sm mt-1", plan.destaque ? "text-blue-200" : "text-slate-400")}>
                      {t("customSub")}
                    </p>
                  </div>
                ) : price === 0 ? (
                  <div>
                    <p className={cn("text-3xl font-bold", plan.destaque ? "text-white" : "text-slate-900")}>
                      {t("forever")}
                    </p>
                    <p className={cn("text-sm mt-1", plan.destaque ? "text-blue-200" : "text-slate-400")}>
                      {t("forever")}
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
                        {t("perMonth")}
                      </span>
                    </div>
                    {period === "anual" && (
                      <p className={cn("text-xs mt-1", plan.destaque ? "text-blue-200" : "text-slate-400")}>
                        {t("billedAnnually", { value: price * 12 })}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.recursos.map((recurso) => (
                  <li key={recurso.key} className="flex items-start gap-2">
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
                      {t(`features.${recurso.key}`)}
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
                {isCurrentPlan ? t("currentPlan") : t(`cta.${plan.ctaKey}`)}
                {!isCurrentPlan && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          );
        })}
      </div>

      {/* FAQ / Trust */}
      <div className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-slate-900 text-center mb-8">{t("faq.title")}</h2>
        <div className="grid grid-cols-2 gap-6">
          {faqItems.map(({ q, a }) => (
            <div key={q} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <h4 className="font-semibold text-slate-900 mb-2 text-sm">{q}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center bg-slate-50 rounded-2xl p-8 border border-slate-100">
          <p className="text-slate-600 font-medium mb-1">{t("enterprise.title")}</p>
          <p className="text-slate-400 text-sm mb-4">
            {t("enterprise.sub")}
          </p>
          <button className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all">
            {t("enterprise.cta")}
          </button>
        </div>
      </div>
    </div>
  );
}
