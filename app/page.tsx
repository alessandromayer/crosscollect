"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { LanguageToggle } from "@/components/language-toggle";
import {
  Globe2,
  ArrowRight,
  CheckCircle2,
  FileSignature,
  Wallet,
  BarChart3,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  Search,
  Scale,
  Banknote,
  Zap,
  Building2,
  Briefcase,
  Code2,
  Layers,
  Users,
  ClipboardList,
  Send,
  Mail,
  Rocket,
  MapPin,
  ArrowRightLeft,
  Clock,
  FileText,
  Landmark,
} from "lucide-react";

function PilotForm() {
  const t = useTranslations("landingV2.pilot.form");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    size: "",
    context: "",
  });

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{t("successTitle")}</h3>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">
          {t("successBody", { name: form.name.split(" ")[0] || t("successBodyFallback") })}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-8 space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t("nameLabel")}</label>
          <input
            required
            value={form.name}
            onChange={update("name")}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            placeholder={t("namePlaceholder")}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t("emailLabel")}</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={update("email")}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            placeholder={t("emailPlaceholder")}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t("companyLabel")}</label>
          <input
            required
            value={form.company}
            onChange={update("company")}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            placeholder={t("companyPlaceholder")}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t("sizeLabel")}</label>
          <select
            value={form.size}
            onChange={update("size")}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
          >
            <option value="">{t("sizePlaceholder")}</option>
            <option value="1-10">{t("size1")}</option>
            <option value="11-50">{t("size2")}</option>
            <option value="51-200">{t("size3")}</option>
            <option value="201+">{t("size4")}</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t("contextLabel")}</label>
        <textarea
          value={form.context}
          onChange={update("context")}
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none"
          placeholder={t("contextPlaceholder")}
        />
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20"
      >
        {t("submit")}
        <ArrowRight className="w-4 h-4" />
      </button>
      <p className="text-xs text-slate-400 text-center">{t("note")}</p>
    </form>
  );
}

function ResearchForm() {
  const t = useTranslations("landingV2.research");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", focus: "" });

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center">
        <Mail className="w-6 h-6 text-blue-600 mx-auto mb-3" />
        <p className="font-semibold text-slate-900">{t("successTitle")}</p>
        <p className="text-slate-500 text-sm mt-1">{t("successBody")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 rounded-2xl border border-slate-200 p-8 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          required
          value={form.name}
          onChange={update("name")}
          placeholder={t("namePlaceholder")}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
        />
        <input
          required
          type="email"
          value={form.email}
          onChange={update("email")}
          placeholder={t("emailPlaceholder")}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
        />
      </div>
      <input
        value={form.focus}
        onChange={update("focus")}
        placeholder={t("focusPlaceholder")}
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
      />
      <button
        type="submit"
        className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-all"
      >
        <Send className="w-4 h-4" />
        {t("submit")}
      </button>
    </form>
  );
}

export default function LandingPage() {
  const t = useTranslations("landingV2");

  const modules = [
    { key: "contracts", icon: FileSignature, color: "bg-blue-50 text-blue-600 border-blue-100" },
    { key: "payments", icon: Wallet, color: "bg-cyan-50 text-cyan-600 border-cyan-100" },
    { key: "receivables", icon: BarChart3, color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    { key: "recovery", icon: Scale, color: "bg-slate-100 text-slate-600 border-slate-200" },
    { key: "renewals", icon: RefreshCw, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  ].map((m) => ({
    ...m,
    name: t(`platform.modules.${m.key}.name`),
    desc: t(`platform.modules.${m.key}.desc`),
  }));

  const howItWorksSteps = [
    { key: "step1", icon: FileText },
    { key: "step2", icon: Layers },
    { key: "step3", icon: Wallet },
    { key: "step4", icon: BarChart3 },
    { key: "step5", icon: Scale },
    { key: "step6", icon: RefreshCw },
  ].map((s, i) => ({
    ...s,
    step: String(i + 1).padStart(2, "0"),
    title: t(`howItWorks.steps.${s.key}.title`),
    desc: t(`howItWorks.steps.${s.key}.desc`),
  }));

  const problemCards = [
    { key: "card1", icon: FileSignature, color: "bg-blue-50 text-blue-600", border: "border-blue-100" },
    { key: "card2", icon: Wallet, color: "bg-cyan-50 text-cyan-600", border: "border-cyan-100" },
    { key: "card3", icon: Search, color: "bg-orange-50 text-orange-600", border: "border-orange-100" },
    { key: "card4", icon: AlertTriangle, color: "bg-amber-50 text-amber-600", border: "border-amber-100" },
  ].map((c) => ({
    ...c,
    title: t(`problem.${c.key}.title`),
    desc: t(`problem.${c.key}.desc`),
  }));

  const whoItsForCards = [
    { key: "card1", icon: Code2 },
    { key: "card2", icon: Briefcase },
    { key: "card3", icon: Building2 },
    { key: "card4", icon: Landmark },
  ].map((c) => ({
    ...c,
    title: t(`whoItsFor.${c.key}.title`),
    desc: t(`whoItsFor.${c.key}.desc`),
  }));

  const mvpStatus = [
    { key: "item1", statusKey: "pilot" as const },
    { key: "item2", statusKey: "pilot" as const },
    { key: "item3", statusKey: "pilot" as const },
    { key: "item4", statusKey: "dev" as const },
    { key: "item5", statusKey: "dev" as const },
  ].map((s) => ({
    ...s,
    label: t(`mvp.items.${s.key}`),
    status: s.statusKey === "pilot" ? t("mvp.statusPilot") : t("mvp.statusDev"),
  }));

  const corridorCards = [
    { key: "card1", icon: Globe2 },
    { key: "card2", icon: Wallet },
    { key: "card3", icon: Users },
  ].map((c) => ({
    ...c,
    title: t(`corridor.${c.key}.title`),
    desc: t(`corridor.${c.key}.desc`),
  }));

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── NAV ───────────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Globe2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg">CrossCollect</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {[
              [t("nav.platform"), "#platform"],
              [t("nav.howItWorks"), "#how-it-works"],
              [t("nav.whoItsFor"), "#who-its-for"],
              [t("nav.pilotProgram"), "#pilot"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageToggle variant="light" />
            <Link
              href="/login"
              className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {t("nav.login")}
            </Link>
            <a
              href="#pilot"
              className="text-sm font-semibold px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-600/20"
            >
              {t("nav.cta")}
            </a>
          </div>
        </div>
      </header>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-400/20 rounded-full text-amber-300 text-sm font-medium mb-8">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
            {t("hero.badge")}
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-6">
            {t("hero.headline1")}{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              {t("hero.headline2")}
            </span>
          </h1>

          <p className="text-blue-300 font-semibold text-sm uppercase tracking-widest mb-6">
            {t("hero.descriptor")}
          </p>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">{t("hero.sub")}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href="#pilot"
              className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-base rounded-2xl transition-all shadow-2xl shadow-blue-600/40 group"
            >
              {t("hero.cta1")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold text-base rounded-2xl border border-white/20 transition-all backdrop-blur-sm"
            >
              {t("hero.cta2")}
            </a>
          </div>

          <p className="text-slate-500 text-sm max-w-lg mx-auto">{t("hero.note")}</p>
        </div>
      </section>

      {/* ── THE PROBLEM ──────────────────────────────────────── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">
              {t("problem.badge")}
            </p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{t("problem.title")}</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">{t("problem.sub")}</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {problemCards.map(({ key, icon: Icon, color, border, title, desc }) => (
              <div key={key} className={`bg-white rounded-2xl p-6 border-2 ${border} shadow-sm`}>
                <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE PLATFORM ─────────────────────────────────────── */}
      <section id="platform" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">
              {t("platform.badge")}
            </p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{t("platform.title")}</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">{t("platform.sub")}</p>
          </div>

          <div className="grid md:grid-cols-5 gap-5">
            {modules.map(({ key, icon: Icon, name, color, desc }) => (
              <div key={key} className={`rounded-2xl p-6 border-2 ${color} bg-white`}>
                <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{name}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">
              {t("howItWorks.badge")}
            </p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{t("howItWorks.title")}</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">{t("howItWorks.sub")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorksSteps.map(({ key, step, icon: Icon, title, desc }) => (
              <div key={key} className="bg-white rounded-2xl p-6 border border-slate-200 flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center relative">
                  <Icon className="w-5 h-5 text-white" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-slate-100 rounded-full text-slate-700 text-[11px] font-bold flex items-center justify-center shadow">
                    {step}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PIX ───────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-cyan-600 font-semibold text-sm uppercase tracking-widest mb-3">
                {t("pix.badge")}
              </p>
              <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">{t("pix.title")}</h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-8">{t("pix.sub")}</p>
              <div className="space-y-4">
                {[
                  { key: "point1", icon: Zap },
                  { key: "point2", icon: ShieldCheck },
                  { key: "point3", icon: Banknote },
                ].map(({ key, icon: Icon }) => (
                  <div key={key} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{t(`pix.${key}.title`)}</p>
                      <p className="text-slate-500 text-sm">{t(`pix.${key}.desc`)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-slate-900 to-cyan-950 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-cyan-500 rounded-lg flex items-center justify-center">
                      <Wallet className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-semibold text-sm">{t("pix.demoCard.label")}</span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wide bg-white/10 text-slate-300 px-2 py-1 rounded-md">
                    {t("pix.demoCard.demoTag")}
                  </span>
                </div>

                <div className="bg-white/5 rounded-xl p-4 mb-3">
                  <p className="text-slate-400 text-xs mb-1">{t("pix.demoCard.amountLabel")}</p>
                  <p className="text-white font-bold text-2xl">R$ 12.480,00</p>
                  <p className="text-slate-500 text-xs mt-0.5">{t("pix.demoCard.amountNote")}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-xl p-3 border border-cyan-400/30">
                    <p className="text-cyan-300 text-xs font-semibold mb-1">{t("pix.demoCard.pixLabel")}</p>
                    <p className="text-slate-400 text-[11px]">{t("pix.demoCard.pixNote")}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-slate-300 text-xs font-semibold mb-1">{t("pix.demoCard.boletoLabel")}</p>
                    <p className="text-slate-400 text-[11px]">{t("pix.demoCard.boletoNote")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── U.S.–BRAZIL CORRIDOR ─────────────────────────────── */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-blue-400 font-semibold text-sm uppercase tracking-widest mb-3">
              {t("corridor.badge")}
            </p>
            <h2 className="text-4xl font-bold text-white mb-4">{t("corridor.title")}</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t("corridor.sub")}</p>
          </div>

          <div className="flex items-center justify-center gap-6 mb-14">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-white font-semibold text-sm">{t("corridor.us")}</span>
              <span className="text-slate-500 text-xs">{t("corridor.usNote")}</span>
            </div>
            <ArrowRightLeft className="w-6 h-6 text-slate-600" />
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-white font-semibold text-sm">{t("corridor.brazil")}</span>
              <span className="text-slate-500 text-xs">{t("corridor.brazilNote")}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {corridorCards.map(({ key, icon: Icon, title, desc }) => (
              <div key={key} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <Icon className="w-6 h-6 text-blue-400 mb-4" />
                <h3 className="text-white font-bold text-sm mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ──────────────────────────────────────── */}
      <section id="who-its-for" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">
              {t("whoItsFor.badge")}
            </p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{t("whoItsFor.title")}</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">{t("whoItsFor.sub")}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {whoItsForCards.map(({ key, icon: Icon, title, desc }) => (
              <div key={key} className="flex items-start gap-4 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MVP STATUS ────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-amber-700 text-sm font-semibold mb-6">
              <Rocket className="w-4 h-4" />
              {t("mvp.badge")}
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{t("mvp.title")}</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">{t("mvp.sub")}</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
            {mvpStatus.map(({ key, label, status, statusKey }) => (
              <div key={key} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-900">{label}</span>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    statusKey === "pilot" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {status}
                </span>
              </div>
            ))}
          </div>
          <p className="text-slate-400 text-xs text-center mt-6">{t("mvp.footnote")}</p>
        </div>
      </section>

      {/* ── PILOT PROGRAM ─────────────────────────────────────── */}
      <section id="pilot" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">
              {t("pilot.badge")}
            </p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{t("pilot.title")}</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">{t("pilot.sub")}</p>
          </div>
          <PilotForm />
        </div>
      </section>

      {/* ── RESEARCH LIST ─────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{t("research.title")}</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">{t("research.sub")}</p>
          </div>
          <ResearchForm />
        </div>
      </section>

      {/* ── VISION ────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-blue-400 font-semibold text-sm uppercase tracking-widest mb-3">
            {t("vision.badge")}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">{t("vision.title")}</h2>
          <p className="text-slate-400 text-lg leading-relaxed">{t("vision.body")}</p>
        </div>
      </section>

      {/* ── FOUNDER ───────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-slate-50 rounded-3xl border border-slate-200 p-10 md:p-12">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-6">
              {t("founder.badge")}
            </p>
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center flex-shrink-0 text-white font-bold text-2xl">
                AM
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{t("founder.name")}</h3>
                <p className="text-slate-500 text-sm mb-4">{t("founder.role")}</p>
                <p className="text-slate-600 leading-relaxed">{t("founder.bio")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            {t("finalCta.title1")}
            <br />
            {t("finalCta.title2")}
          </h2>
          <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto">{t("finalCta.sub")}</p>
          <a
            href="#pilot"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white hover:bg-blue-50 text-blue-700 font-bold text-base rounded-2xl transition-all shadow-2xl group"
          >
            {t("finalCta.cta")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="bg-slate-950 text-slate-400 py-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Globe2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white text-lg">CrossCollect</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">{t("footer.tagline")}</p>
            </div>

            {[
              {
                title: t("footer.platformTitle"),
                links: [
                  [t("footer.platformLinks.contracts"), "#platform"],
                  [t("footer.platformLinks.payments"), "#platform"],
                  [t("footer.platformLinks.receivables"), "#platform"],
                  [t("footer.platformLinks.recovery"), "#platform"],
                  [t("footer.platformLinks.renewals"), "#platform"],
                ],
              },
              {
                title: t("footer.companyTitle"),
                links: [
                  [t("footer.companyLinks.how"), "#how-it-works"],
                  [t("footer.companyLinks.who"), "#who-its-for"],
                  [t("footer.companyLinks.pilot"), "#pilot"],
                  [t("footer.companyLinks.research"), "#pilot"],
                ],
              },
              {
                title: t("footer.accountTitle"),
                links: [
                  [t("footer.accountLinks.login"), "/login"],
                  [t("footer.accountLinks.dashboard"), "/dashboard"],
                ],
              },
            ].map(({ title, links }) => (
              <div key={title}>
                <p className="font-semibold text-white text-sm mb-4">{title}</p>
                <ul className="space-y-2.5">
                  {links.map(([label, href]) => (
                    <li key={label}>
                      <a href={href} className="text-sm hover:text-white transition-colors">
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-800 space-y-4">
            <p className="text-xs text-slate-500 leading-relaxed max-w-4xl">
              <strong className="text-slate-400">{t("footer.disclaimerLabel")}</strong> {t("footer.disclaimer")}
            </p>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-900">
              <p className="text-xs text-slate-600">
                © {new Date().getFullYear()} CrossCollect. {t("footer.rights")}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Clock className="w-3.5 h-3.5" />
                <span>{t("footer.statusLabel")}</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
