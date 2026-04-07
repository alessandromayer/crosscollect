"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { LanguageToggle } from "@/components/language-toggle";
import {
  Globe2,
  ArrowRight,
  ShieldX,
  Building2,
  Gavel,
  CheckCircle2,
  FileText,
  Bell,
  Landmark,
  DollarSign,
  Star,
  TrendingUp,
  Zap,
  Users,
  ShoppingCart,
  BookOpen,
  Package,
  Home,
  Briefcase,
  Code2,
  Stethoscope,
  ChevronRight,
  Play,
  Lock,
  BarChart3,
  Clock,
  Award,
  Globe,
} from "lucide-react";

export default function LandingPage() {
  const t = useTranslations("landing");

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
              [t("nav.howItWorks"), "#como-funciona"],
              [t("nav.segments"), "#segmentos"],
              [t("nav.pricing"), "/planos"],
              [t("nav.blog"), "#"],
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
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {t("nav.login")}
            </Link>
            <Link
              href="/cadastro"
              className="text-sm font-semibold px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-600/20"
            >
              {t("nav.cta")}
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900">
        {/* Grid bg */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-400/20 rounded-full text-blue-300 text-sm font-medium mb-8">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
            {t("hero.badge")}
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-6">
            {t("hero.headline1")}{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              {t("hero.headline2")}
            </span>
            <br />
            {t("hero.headline3")}
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            {t("hero.sub")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/cadastro"
              className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-base rounded-2xl transition-all shadow-2xl shadow-blue-600/40 group"
            >
              {t("hero.cta1")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold text-base rounded-2xl border border-white/20 transition-all backdrop-blur-sm"
            >
              <Play className="w-4 h-4" />
              {t("hero.cta2")}
            </Link>
          </div>

          {/* Social proof numbers */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-10 border-t border-white/10">
            {[
              { value: t("hero.stat1value"), label: t("hero.stat1label") },
              { value: t("hero.stat2value"), label: t("hero.stat2label") },
              { value: t("hero.stat3value"), label: t("hero.stat3label") },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl font-bold text-white">{value}</p>
                <p className="text-slate-400 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEMA ──────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">
              {t("problem.badge")}
            </p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{t("problem.title")}</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">{t("problem.sub")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: ShieldX,
                color: "bg-red-50 text-red-600",
                border: "border-red-100",
                title: t("problem.card1title"),
                desc: t("problem.card1desc"),
              },
              {
                icon: Gavel,
                color: "bg-orange-50 text-orange-600",
                border: "border-orange-100",
                title: t("problem.card2title"),
                desc: t("problem.card2desc"),
              },
              {
                icon: Building2,
                color: "bg-amber-50 text-amber-600",
                border: "border-amber-100",
                title: t("problem.card3title"),
                desc: t("problem.card3desc"),
              },
            ].map(({ icon: Icon, color, border, title, desc }) => (
              <div
                key={title}
                className={`bg-white rounded-2xl p-7 border-2 ${border} shadow-sm`}
              >
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-5`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUÇÃO / COMO FUNCIONA ───────────────────────────── */}
      <section id="como-funciona" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">
              {t("solution.badge")}
            </p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{t("solution.title")}</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">{t("solution.sub")}</p>
          </div>

          <div className="grid md:grid-cols-4 gap-0 relative">
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200" />

            {[
              { step: "01", icon: FileText, color: "bg-blue-600", title: t("solution.step1title"), desc: t("solution.step1desc") },
              { step: "02", icon: Bell, color: "bg-indigo-600", title: t("solution.step2title"), desc: t("solution.step2desc") },
              { step: "03", icon: Landmark, color: "bg-violet-600", title: t("solution.step3title"), desc: t("solution.step3desc") },
              { step: "04", icon: DollarSign, color: "bg-emerald-600", title: t("solution.step4title"), desc: t("solution.step4desc") },
            ].map(({ step, icon: Icon, color, title, desc }) => (
              <div key={step} className="relative flex flex-col items-center text-center px-6">
                <div
                  className={`relative z-10 w-20 h-20 ${color} rounded-2xl flex items-center justify-center shadow-xl mb-6`}
                >
                  <Icon className="w-8 h-8 text-white" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-slate-100 rounded-full text-slate-700 text-xs font-bold flex items-center justify-center shadow">
                    {step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/cadastro"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-600/25"
            >
              {t("solution.cta")}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-slate-400 text-sm mt-3">{t("solution.ctasub")}</p>
          </div>
        </div>
      </section>

      {/* ── SEGMENTOS ─────────────────────────────────────────── */}
      <section id="segmentos" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">
              {t("segments.badge")}
            </p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{t("segments.title")}</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">{t("segments.sub")}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: Code2,
                label: t("segments.saas"),
                desc: t("segments.saasdesc"),
                color: "from-blue-50 to-indigo-50 border-blue-100",
                iconColor: "text-blue-600 bg-blue-100",
              },
              {
                icon: ShoppingCart,
                label: t("segments.ecommerce"),
                desc: t("segments.ecommercedesc"),
                color: "from-violet-50 to-purple-50 border-violet-100",
                iconColor: "text-violet-600 bg-violet-100",
              },
              {
                icon: Briefcase,
                label: t("segments.consulting"),
                desc: t("segments.consultingdesc"),
                color: "from-slate-50 to-gray-50 border-slate-200",
                iconColor: "text-slate-600 bg-slate-100",
              },
              {
                icon: BookOpen,
                label: t("segments.education"),
                desc: t("segments.educationdesc"),
                color: "from-amber-50 to-yellow-50 border-amber-100",
                iconColor: "text-amber-600 bg-amber-100",
              },
              {
                icon: Package,
                label: t("segments.equipment"),
                desc: t("segments.equipmentdesc"),
                color: "from-orange-50 to-red-50 border-orange-100",
                iconColor: "text-orange-600 bg-orange-100",
              },
              {
                icon: Home,
                label: t("segments.realestate"),
                desc: t("segments.realestate desc"),
                color: "from-emerald-50 to-green-50 border-emerald-100",
                iconColor: "text-emerald-600 bg-emerald-100",
              },
              {
                icon: Stethoscope,
                label: t("segments.health"),
                desc: t("segments.healthdesc"),
                color: "from-cyan-50 to-teal-50 border-cyan-100",
                iconColor: "text-cyan-600 bg-cyan-100",
              },
              {
                icon: Globe,
                label: t("segments.other"),
                desc: t("segments.otherdesc"),
                color: "from-pink-50 to-rose-50 border-pink-100",
                iconColor: "text-pink-600 bg-pink-100",
              },
            ].map(({ icon: Icon, label, desc, color, iconColor }) => (
              <div
                key={label}
                className={`bg-gradient-to-br ${color} border rounded-2xl p-5 hover:shadow-md transition-all group cursor-pointer`}
              >
                <div className={`w-10 h-10 rounded-xl ${iconColor} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="font-semibold text-slate-900 text-sm mb-1">{label}</p>
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIFERENCIAIS ──────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">
                {t("features.badge")}
              </p>
              <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                {t("features.title")}
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-10">
                {t("features.sub")}
              </p>

              <div className="space-y-5">
                {[
                  {
                    icon: Zap,
                    color: "bg-yellow-50 text-yellow-600",
                    title: t("features.f1title"),
                    desc: t("features.f1desc"),
                  },
                  {
                    icon: Lock,
                    color: "bg-blue-50 text-blue-600",
                    title: t("features.f2title"),
                    desc: t("features.f2desc"),
                  },
                  {
                    icon: BarChart3,
                    color: "bg-emerald-50 text-emerald-600",
                    title: t("features.f3title"),
                    desc: t("features.f3desc"),
                  },
                  {
                    icon: Globe2,
                    color: "bg-violet-50 text-violet-600",
                    title: t("features.f4title"),
                    desc: t("features.f4desc"),
                  },
                ].map(({ icon: Icon, color, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{title}</p>
                      <p className="text-slate-500 text-sm mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard preview card */}
            <div className="relative">
              <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-6 shadow-2xl">
                {/* Fake dashboard */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Globe2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-semibold text-sm">CrossCollect</span>
                  <span className="ml-auto text-slate-400 text-xs">Dashboard</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: "Em aberto", value: "$ 847.5k", up: true },
                    { label: "Recuperado", value: "$ 125k", up: true },
                    { label: "Taxa sucesso", value: "68.4%", up: true },
                    { label: "Casos ativos", value: "43", up: false },
                  ].map(({ label, value, up }) => (
                    <div key={label} className="bg-white/5 rounded-xl p-3">
                      <p className="text-slate-400 text-xs">{label}</p>
                      <p className="text-white font-bold text-lg mt-0.5">{value}</p>
                      <span className={`text-xs font-medium ${up ? "text-emerald-400" : "text-slate-400"}`}>
                        {up ? "↑ +12.5%" : "ativos"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Fake bars */}
                <div className="bg-white/5 rounded-xl p-3 mb-3">
                  <p className="text-slate-400 text-xs mb-2">Recuperação mensal (USD)</p>
                  <div className="flex items-end gap-1.5 h-12">
                    {[30, 45, 38, 60, 72, 88].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Fake list */}
                <div className="space-y-2">
                  {[
                    { name: "Carlos Mendonça Ltda", val: "$ 45k", status: "Em negociação", dot: "bg-blue-400" },
                    { name: "Tech Solutions Brasil", val: "$ 8.5k", status: "Pago", dot: "bg-emerald-400" },
                    { name: "Ana Paula Ferreira", val: "$ 15k", status: "Vencido", dot: "bg-red-400" },
                  ].map(({ name, val, status, dot }) => (
                    <div key={name} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                      <div className="w-6 h-6 bg-slate-600 rounded-md flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{name[0]}</span>
                      </div>
                      <span className="text-slate-300 text-xs flex-1 truncate">{name}</span>
                      <span className="text-white text-xs font-semibold">{val}</span>
                      <div className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                        <span className="text-slate-400 text-[10px]">{status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 border border-slate-100">
                <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-slate-900 font-bold text-sm">+$ 12.400</p>
                  <p className="text-slate-400 text-xs">recuperado hoje</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ───────────────────────────────────────── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">
              {t("testimonials.badge")}
            </p>
            <h2 className="text-4xl font-bold text-slate-900">
              {t("testimonials.title")}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                texto: t("testimonials.t1text"),
                nome: t("testimonials.t1name"),
                cargo: t("testimonials.t1role"),
                pais: t("testimonials.t1country"),
                stars: 5,
              },
              {
                texto: t("testimonials.t2text"),
                nome: t("testimonials.t2name"),
                cargo: t("testimonials.t2role"),
                pais: t("testimonials.t2country"),
                stars: 5,
              },
              {
                texto: t("testimonials.t3text"),
                nome: t("testimonials.t3name"),
                cargo: t("testimonials.t3role"),
                pais: t("testimonials.t3country"),
                stars: 5,
              },
            ].map(({ texto, nome, cargo, pais, stars }) => (
              <div key={nome} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">"{texto}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">{nome[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{nome}</p>
                    <p className="text-slate-400 text-xs">{cargo}</p>
                  </div>
                  <span className="ml-auto text-sm">{pais}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANOS PREVIEW ────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">
            {t("pricing.badge")}
          </p>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            {t("pricing.title")}
          </h2>
          <p className="text-slate-500 text-lg mb-12">
            {t("pricing.sub")}
          </p>

          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {[
              {
                nome: t("pricing.starter"),
                preco: t("pricing.starterPrice"),
                sub: t("pricing.starterSub"),
                recursos: [t("pricing.r1"), t("pricing.r2"), t("pricing.r3"), t("pricing.r4")],
                cta: t("pricing.cta1"),
                destaque: false,
              },
              {
                nome: t("pricing.growth"),
                preco: "$ 49",
                sub: t("pricing.month"),
                recursos: [t("pricing.r5"), t("pricing.r6"), t("pricing.r7"), t("pricing.r8")],
                cta: t("pricing.cta2"),
                destaque: true,
              },
              {
                nome: t("pricing.professional"),
                preco: "$ 149",
                sub: t("pricing.month"),
                recursos: [t("pricing.r9"), t("pricing.r10"), t("pricing.r11"), t("pricing.r12")],
                cta: t("pricing.cta3"),
                destaque: false,
              },
            ].map(({ nome, preco, sub, recursos, cta, destaque }) => (
              <div
                key={nome}
                className={`rounded-2xl p-6 border-2 text-left ${
                  destaque
                    ? "bg-blue-600 border-blue-600 shadow-2xl shadow-blue-600/30 scale-105"
                    : "bg-white border-slate-200"
                }`}
              >
                <p className={`font-bold text-lg mb-1 ${destaque ? "text-white" : "text-slate-900"}`}>
                  {nome}
                </p>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className={`text-3xl font-bold ${destaque ? "text-white" : "text-slate-900"}`}>
                    {preco}
                  </span>
                  <span className={`text-sm ${destaque ? "text-blue-200" : "text-slate-400"}`}>{sub}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {recursos.map((r) => (
                    <li key={r} className="flex items-center gap-2 text-sm">
                      <CheckCircle2
                        className={`w-4 h-4 flex-shrink-0 ${destaque ? "text-blue-200" : "text-emerald-500"}`}
                      />
                      <span className={destaque ? "text-blue-50" : "text-slate-600"}>{r}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/cadastro"
                  className={`block text-center py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    destaque
                      ? "bg-white text-blue-700 hover:bg-blue-50"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  {cta}
                </Link>
              </div>
            ))}
          </div>

          <Link
            href="/planos"
            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            {t("pricing.allPlans")}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── MÉTRICAS ──────────────────────────────────────────── */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: t("metrics.m1"), label: t("metrics.m1label"), icon: TrendingUp },
              { value: t("metrics.m2"), label: t("metrics.m2label"), icon: Clock },
              { value: t("metrics.m3"), label: t("metrics.m3label"), icon: Users },
              { value: t("metrics.m4"), label: t("metrics.m4label"), icon: Award },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <Icon className="w-5 h-5 text-blue-400 mb-1" />
                <p className="text-4xl font-bold text-white">{value}</p>
                <p className="text-slate-400 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────── */}
      <section className="py-28 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
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
            {t("finalCta.title")}<br />{t("finalCta.titleHighlight")}
          </h2>
          <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto">{t("finalCta.sub")}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/cadastro"
              className="flex items-center gap-2 px-10 py-4 bg-white hover:bg-blue-50 text-blue-700 font-bold text-base rounded-2xl transition-all shadow-2xl group"
            >
              {t("finalCta.cta1")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-base rounded-2xl border border-white/30 transition-all"
            >
              <Play className="w-4 h-4" />
              {t("finalCta.cta2")}
            </Link>
          </div>
          <p className="text-blue-300 text-sm mt-6">{t("finalCta.disclaimer")}</p>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="bg-slate-950 text-slate-400 py-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Globe2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white text-lg">CrossCollect</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                {t("footer.tagline")}
              </p>
              <div className="flex gap-3 mt-5">
                {["LinkedIn", "Twitter", "YouTube"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="text-xs text-slate-500 hover:text-white border border-slate-800 hover:border-slate-600 px-3 py-1.5 rounded-lg transition-all"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              {
                title: t("footer.product"),
                links: [t("footer.howItWorks"), t("footer.pricing"), t("footer.aiAssistant"), t("footer.collectionRule"), t("footer.api")],
              },
              {
                title: t("footer.company"),
                links: [t("footer.about"), t("footer.blog"), t("footer.partners"), t("footer.press"), t("footer.careers")],
              },
              {
                title: t("footer.legal"),
                links: [t("footer.terms"), t("footer.privacy"), t("footer.lgpd"), t("footer.cookies"), t("footer.sla")],
              },
            ].map(({ title, links }) => (
              <div key={title}>
                <p className="font-semibold text-white text-sm mb-4">{title}</p>
                <ul className="space-y-2.5">
                  {links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-sm hover:text-white transition-colors">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-800">
            <p className="text-xs text-slate-600">
              © {new Date().getFullYear()} CrossCollect. {t("footer.rights")}
            </p>
            <div className="flex items-center gap-6 text-xs text-slate-600">
              <span>{t("footer.compliance1")}</span>
              <span>{t("footer.compliance2")}</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-emerald-600">{t("footer.status")}</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
