"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
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

const MODULES = [
  {
    icon: FileSignature,
    name: "Contracts",
    color: "bg-blue-50 text-blue-600 border-blue-100",
    desc: "Bilingual contract management built for the Brazilian market — local clauses, tax fields, and e-signature in one place.",
  },
  {
    icon: Wallet,
    name: "Payments",
    color: "bg-cyan-50 text-cyan-600 border-cyan-100",
    desc: "Accept Pix, boleto, and card payments from Brazilian buyers without forcing them onto U.S. rails they don't use.",
  },
  {
    icon: BarChart3,
    name: "Receivables",
    color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    desc: "One currency-normalized dashboard for everything owed to you in Brazil — no more spreadsheets across two languages.",
  },
  {
    icon: Scale,
    name: "Recovery",
    color: "bg-slate-100 text-slate-600 border-slate-200",
    desc: "A structured, compliant escalation path for the accounts that go sideways — one module among five, not the whole product.",
  },
  {
    icon: RefreshCw,
    name: "Renewals",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    desc: "Track renewal dates and expansion signals so Brazil-based revenue doesn't quietly churn out from under you.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: FileText,
    title: "Connect your contracts",
    desc: "Bring in the agreements and invoices tied to your Brazilian customers.",
  },
  {
    step: "02",
    icon: Layers,
    title: "Standardize for Brazil",
    desc: "We map currency, tax fields, and contract clauses to what's actually required locally.",
  },
  {
    step: "03",
    icon: Wallet,
    title: "Collect via local rails",
    desc: "Pix and boleto payment links go out in the format Brazilian buyers actually use.",
  },
  {
    step: "04",
    icon: BarChart3,
    title: "Track it in one dashboard",
    desc: "Receivables, aging, and FX-normalized totals in a single bilingual view.",
  },
  {
    step: "05",
    icon: Scale,
    title: "Escalate only when needed",
    desc: "Structured, compliant recovery kicks in for the exceptions — not by default.",
  },
  {
    step: "06",
    icon: RefreshCw,
    title: "Manage renewals proactively",
    desc: "See what's coming up for renewal or expansion before it becomes a surprise.",
  },
];

const WHO_ITS_FOR = [
  {
    icon: Code2,
    title: "U.S. SaaS companies",
    desc: "Selling subscriptions to Brazilian customers without a local billing or collections setup.",
  },
  {
    icon: Briefcase,
    title: "Professional & consulting services",
    desc: "Invoicing Brazilian clients under contracts drafted for a U.S. legal context.",
  },
  {
    icon: Building2,
    title: "Equipment & machinery exporters",
    desc: "Managing multi-installment receivables tied to physical goods sold into Brazil.",
  },
  {
    icon: Landmark,
    title: "Licensors & franchisors",
    desc: "Collecting recurring royalties or license fees from Brazilian partners and operators.",
  },
];

const MVP_STATUS = [
  {
    label: "Contract intake & standardization",
    status: "In active pilot",
  },
  {
    label: "Pix & boleto payment links",
    status: "In active pilot",
  },
  {
    label: "Receivables dashboard",
    status: "In active pilot",
  },
  {
    label: "Structured recovery workflows",
    status: "In development",
  },
  {
    label: "Renewals & expansion tracking",
    status: "In development",
  },
];

function PilotForm() {
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
        <h3 className="text-xl font-bold text-slate-900 mb-2">You're on the list</h3>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">
          Thanks, {form.name.split(" ")[0] || "there"}. We review pilot applications personally and
          will follow up by email to talk through fit and timing.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-8 space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full name</label>
          <input
            required
            value={form.name}
            onChange={update("name")}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            placeholder="Jane Smith"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Work email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={update("email")}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            placeholder="jane@company.com"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Company</label>
          <input
            required
            value={form.company}
            onChange={update("company")}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            placeholder="Company, Inc."
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Company size</label>
          <select
            value={form.size}
            onChange={update("size")}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
          >
            <option value="">Select...</option>
            <option value="1-10">1–10 employees</option>
            <option value="11-50">11–50 employees</option>
            <option value="51-200">51–200 employees</option>
            <option value="201+">201+ employees</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          What are you using today to manage Brazilian contracts or payments?
        </label>
        <textarea
          value={form.context}
          onChange={update("context")}
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none"
          placeholder="Spreadsheets, a local partner, nothing formal yet..."
        />
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20"
      >
        Join the Pilot Program
        <ArrowRight className="w-4 h-4" />
      </button>
      <p className="text-xs text-slate-400 text-center">
        We're onboarding a small number of design partners. No cost to apply.
      </p>
    </form>
  );
}

function ResearchForm() {
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
        <p className="font-semibold text-slate-900">Thanks — we'll be in touch.</p>
        <p className="text-slate-500 text-sm mt-1">
          We'll reach out from a real person, not a mailing list.
        </p>
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
          placeholder="Name"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
        />
        <input
          required
          type="email"
          value={form.email}
          onChange={update("email")}
          placeholder="Email"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
        />
      </div>
      <input
        value={form.focus}
        onChange={update("focus")}
        placeholder="What are you researching? (e.g. cross-border payments, market entry, LATAM ops)"
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
      />
      <button
        type="submit"
        className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-all"
      >
        <Send className="w-4 h-4" />
        Request Research Access
      </button>
    </form>
  );
}

export default function LandingPage() {
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
              ["The Platform", "#platform"],
              ["How it Works", "#how-it-works"],
              ["Who it's for", "#who-its-for"],
              ["Pilot Program", "#pilot"],
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
            <Link
              href="/login"
              className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Log in
            </Link>
            <a
              href="#pilot"
              className="text-sm font-semibold px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-600/20"
            >
              Join the Pilot Program
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
            Currently in MVP / Pilot Stage
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-6">
            Sell to Brazil.{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              We manage what comes next.
            </span>
          </h1>

          <p className="text-blue-300 font-semibold text-sm uppercase tracking-widest mb-6">
            Cross-Border Contract &amp; Revenue Operations
          </p>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            For U.S. companies doing business in Brazil: one platform for contracts, Pix and boleto
            payments, receivables, and renewals — built around how Brazil actually works, not how
            the U.S. assumes it does.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href="#pilot"
              className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-base rounded-2xl transition-all shadow-2xl shadow-blue-600/40 group"
            >
              Join the Pilot Program
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold text-base rounded-2xl border border-white/20 transition-all backdrop-blur-sm"
            >
              See How It Works
            </a>
          </div>

          <p className="text-slate-500 text-sm max-w-lg mx-auto">
            We're an early-stage platform working with a small group of design partners. No public
            case studies or customer numbers yet — and we'd rather tell you that than make them up.
          </p>
        </div>
      </section>

      {/* ── THE PROBLEM ──────────────────────────────────────── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">
              The Problem
            </p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Closing the deal in Brazil is the easy part.
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Most U.S. companies expand into Brazil with a signed contract and no operational plan
              for what happens after — different currency, different payment habits, different legal
              system, different language.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: FileSignature,
                color: "bg-blue-50 text-blue-600",
                border: "border-blue-100",
                title: "Contracts built for the wrong jurisdiction",
                desc: "U.S.-style agreements don't map cleanly onto Brazilian tax, invoicing, and legal requirements.",
              },
              {
                icon: Wallet,
                color: "bg-cyan-50 text-cyan-600",
                border: "border-cyan-100",
                title: "Payment rails that don't fit",
                desc: "Brazilian buyers pay via Pix and boleto — not U.S. credit cards or wire transfers.",
              },
              {
                icon: Search,
                color: "bg-orange-50 text-orange-600",
                border: "border-orange-100",
                title: "No unified view of receivables",
                desc: "Brazil-based revenue lives in spreadsheets and email threads, disconnected from the rest of the business.",
              },
              {
                icon: AlertTriangle,
                color: "bg-amber-50 text-amber-600",
                border: "border-amber-100",
                title: "Compliance risk when things slip",
                desc: "Without local process, a late payment can escalate into a legal and reputational problem fast.",
              },
            ].map(({ icon: Icon, color, border, title, desc }) => (
              <div key={title} className={`bg-white rounded-2xl p-6 border-2 ${border} shadow-sm`}>
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
              The Platform
            </p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Five modules. One operating layer for Brazil.
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              CrossCollect isn't a collections tool with extra features bolted on. Recovery is one
              module of five — most of the platform is about never needing it.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-5">
            {MODULES.map(({ icon: Icon, name, color, desc }) => (
              <div key={name} className={`rounded-2xl p-6 border-2 ${color} bg-white`}>
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
              How It Works
            </p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">From signed contract to paid invoice</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Six steps, built around the way Brazilian buyers actually transact.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="bg-white rounded-2xl p-6 border border-slate-200 flex gap-4">
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
                Built for Pix
              </p>
              <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                Get paid the way Brazil actually pays.
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-8">
                Pix is Brazil's instant payment system, run by the Central Bank, and it's how the
                large majority of Brazilians and Brazilian businesses move money — settled in
                seconds, available 24/7, at effectively no cost to the payer. Asking a Brazilian
                buyer to pay by U.S. card or international wire adds friction most won't tolerate.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Zap, title: "Real-time settlement", desc: "Payments confirm in seconds, any day, any hour." },
                  { icon: ShieldCheck, title: "Central Bank-backed rail", desc: "Not a private processor — the national instant payment system." },
                  { icon: Banknote, title: "Boleto as fallback", desc: "For buyers and use cases where Pix isn't the fit." },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{title}</p>
                      <p className="text-slate-500 text-sm">{desc}</p>
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
                    <span className="text-white font-semibold text-sm">Payment link</span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wide bg-white/10 text-slate-300 px-2 py-1 rounded-md">
                    Demo Data
                  </span>
                </div>

                <div className="bg-white/5 rounded-xl p-4 mb-3">
                  <p className="text-slate-400 text-xs mb-1">Amount due</p>
                  <p className="text-white font-bold text-2xl">R$ 12.480,00</p>
                  <p className="text-slate-500 text-xs mt-0.5">≈ USD equivalent shown to your team</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-xl p-3 border border-cyan-400/30">
                    <p className="text-cyan-300 text-xs font-semibold mb-1">Pix</p>
                    <p className="text-slate-400 text-[11px]">Instant · 24/7</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <p className="text-slate-300 text-xs font-semibold mb-1">Boleto</p>
                    <p className="text-slate-400 text-[11px]">1–3 business days</p>
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
              Phase One
            </p>
            <h2 className="text-4xl font-bold text-white mb-4">The U.S.–Brazil corridor, first</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              We're starting narrow on purpose: U.S. companies with customers, partners, or
              distributors in Brazil. One corridor, done properly, before we go anywhere else.
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 mb-14">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-white font-semibold text-sm">United States</span>
              <span className="text-slate-500 text-xs">Where you sell from</span>
            </div>
            <ArrowRightLeft className="w-6 h-6 text-slate-600" />
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-white font-semibold text-sm">Brazil</span>
              <span className="text-slate-500 text-xs">Where your customers pay from</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Globe2,
                title: "A distinct legal & tax environment",
                desc: "Brazilian contract law, invoicing (NF-e), and consumer protection rules differ meaningfully from U.S. norms.",
              },
              {
                icon: Wallet,
                title: "A distinct payment culture",
                desc: "Pix and boleto dominate; U.S. card and wire habits don't transfer directly.",
              },
              {
                icon: Users,
                title: "Real, growing commercial ties",
                desc: "More U.S. companies are selling software, equipment, and services into Brazil — often without local infrastructure.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-6">
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
              Who It's For
            </p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Built for U.S. teams selling into Brazil</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              If any of this sounds familiar, we'd like to talk to you.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {WHO_ITS_FOR.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 bg-slate-50 rounded-2xl p-6 border border-slate-100">
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
              Where we are today
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">This is an early-stage platform</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              CrossCollect is in MVP / pilot stage. We're building it directly with a small group of
              U.S. companies doing business in Brazil, not shipping it finished and hoping it fits.
              Some modules are live in the pilot; others are still in development.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
            {MVP_STATUS.map(({ label, status }) => (
              <div key={label} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-900">{label}</span>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    status === "In active pilot"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {status}
                </span>
              </div>
            ))}
          </div>
          <p className="text-slate-400 text-xs text-center mt-6">
            No published customer list, revenue figures, or case studies yet — we'll share those
            when we have real ones to show.
          </p>
        </div>
      </section>

      {/* ── PILOT PROGRAM ─────────────────────────────────────── */}
      <section id="pilot" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">
              Pilot Program
            </p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Join the Pilot Program</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              We're onboarding a small number of U.S. companies with active or upcoming business in
              Brazil. You'll work directly with the team building the product.
            </p>
          </div>
          <PilotForm />
        </div>
      </section>

      {/* ── RESEARCH LIST ─────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Not ready for a pilot?</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              If you're researching cross-border payments, market entry, or Brazil operations and
              want to stay in the loop, join our research list instead.
            </p>
          </div>
          <ResearchForm />
        </div>
      </section>

      {/* ── VISION ────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-blue-400 font-semibold text-sm uppercase tracking-widest mb-3">
            Where We're Headed
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
            The operating layer for cross-border revenue between the U.S. and Brazil
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            We're starting with the U.S.–Brazil corridor and five core modules — contracts,
            payments, receivables, recovery, and renewals — because that's the problem we understand
            best today. Over time, the goal is a single operating layer for the full lifecycle of a
            cross-border commercial relationship, expanding to new corridors and workflows as the
            platform matures and as pilot partners tell us what's actually needed next.
          </p>
        </div>
      </section>

      {/* ── FOUNDER ───────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-slate-50 rounded-3xl border border-slate-200 p-10 md:p-12">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-6">
              Founder
            </p>
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center flex-shrink-0 text-white font-bold text-2xl">
                AM
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Alessandro Mayer</h3>
                <p className="text-slate-500 text-sm mb-4">Founder, CrossCollect</p>
                <p className="text-slate-600 leading-relaxed">
                  Alessandro has spent his career in Customer Success and SaaS, working closely with
                  companies on retention, expansion, and the operational realities of growing revenue
                  across borders. Having lived and worked in both Brazil and the United States, he
                  saw the same gap repeat itself: U.S. companies win business in Brazil, then have no
                  reliable way to manage the contracts, payments, and receivables that follow. He
                  started CrossCollect to close that gap — built as a working platform with early
                  partners, not a pitch deck.
                </p>
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
            Selling to Brazil?
            <br />
            Let's build the back office for it together.
          </h2>
          <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto">
            Currently in MVP / pilot stage — a handful of design partner seats are open.
          </p>
          <a
            href="#pilot"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white hover:bg-blue-50 text-blue-700 font-bold text-base rounded-2xl transition-all shadow-2xl group"
          >
            Join the Pilot Program
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
              <p className="text-sm leading-relaxed max-w-xs">
                Cross-Border Contract &amp; Revenue Operations for U.S. companies doing business in
                Brazil. Currently in MVP / pilot stage.
              </p>
            </div>

            {[
              {
                title: "Platform",
                links: [
                  ["Contracts", "#platform"],
                  ["Payments", "#platform"],
                  ["Receivables", "#platform"],
                  ["Recovery", "#platform"],
                  ["Renewals", "#platform"],
                ],
              },
              {
                title: "Company",
                links: [
                  ["How it Works", "#how-it-works"],
                  ["Who it's for", "#who-its-for"],
                  ["Pilot Program", "#pilot"],
                  ["Research List", "#pilot"],
                ],
              },
              {
                title: "Account",
                links: [
                  ["Log in", "/login"],
                  ["Dashboard", "/dashboard"],
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
              <strong className="text-slate-400">Disclaimer:</strong> CrossCollect is an early-stage
              product currently in MVP / pilot phase. Features described on this page reflect our
              product roadmap and intended functionality; some modules are in active pilot use while
              others are still in development and not yet generally available. Availability, exact
              functionality, and timelines may change. CrossCollect is not a law firm, collections
              agency, bank, or financial institution, and nothing on this page constitutes legal,
              tax, financial, or investment advice. Payment processing (including Pix and boleto) is
              enabled through third-party licensed providers, not held directly by CrossCollect.
              Recovery-related functionality is one module of the platform and is designed to operate
              within applicable Brazilian consumer protection and data protection (LGPD) law. Company
              names, figures, and dashboard views shown on this page are illustrative demo data,
              not real customer information, unless explicitly stated otherwise.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-900">
              <p className="text-xs text-slate-600">
                © {new Date().getFullYear()} CrossCollect. All rights reserved.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Clock className="w-3.5 h-3.5" />
                <span>MVP / Pilot Stage — building in the open</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
