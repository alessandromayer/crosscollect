"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Globe2, TrendingUp, Shield, Zap } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    await new Promise((r) => setTimeout(r, 1000));
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Globe2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-2xl font-bold tracking-tight">CrossCollect</span>
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                Cobrança internacional<br />
                <span className="text-blue-400">sem fronteiras</span>
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed">
                Recupere seus ativos no Brasil com eficiência, conformidade jurídica e inteligência artificial.
              </p>
            </div>

            <div className="space-y-5">
              {[
                {
                  icon: TrendingUp,
                  title: "68% de taxa de recuperação",
                  desc: "Régua de cobrança inteligente e automatizada",
                },
                {
                  icon: Shield,
                  title: "100% conforme com a LGPD",
                  desc: "Proteção de dados e segurança jurídica garantida",
                },
                {
                  icon: Zap,
                  title: "Assistente IA incluso",
                  desc: "Estratégias personalizadas para cada devedor",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{title}</p>
                    <p className="text-slate-400 text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8">
          <p className="text-slate-500 text-sm">
            Mais de 200 credores internacionais confiam na CrossCollect para gerenciar
            R$ 50M+ em cobranças ativas no Brasil.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <Globe2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-slate-900 text-xl font-bold">CrossCollect</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Bem-vindo de volta</h2>
              <p className="text-slate-500">Acesse sua conta para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  E-mail
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="seu@email.com"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-slate-700">Senha</label>
                  <Link
                    href="/recuperar-senha"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Esqueceu?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-2.5 pr-12 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-sm">
                Não tem uma conta?{" "}
                <Link href="/cadastro" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Criar conta grátis
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-slate-400 text-xs mt-6">
            Ao entrar, você concorda com nossos{" "}
            <a href="#" className="underline hover:text-slate-600">Termos de Uso</a>
            {" "}e{" "}
            <a href="#" className="underline hover:text-slate-600">Política de Privacidade</a>
          </p>
        </div>
      </div>
    </div>
  );
}
