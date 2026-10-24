"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Eye, EyeOff, Globe2, Check } from "lucide-react";

export default function CadastroPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    nome: "",
    email: "",
    empresa: "",
    pais: "",
    password: "",
  });

  const paises = [
    "Estados Unidos", "Reino Unido", "Alemanha", "França", "Espanha",
    "Portugal", "Itália", "Canadá", "Austrália", "Japão", "China",
    "Argentina", "México", "Chile", "Colômbia", "Outro",
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(""); setMessage("");
    try {
      const { data, error: authError } = await createClient().auth.signUp({ email: form.email, password: form.password, options: { data: { full_name: form.nome, company_name: form.empresa, country: form.pais } } });
      if (authError) { setError(authError.message); return; }
      if (!data.user) { setError("Não foi possível criar a conta."); return; }
      setMessage("Cadastro recebido. Confirme seu e-mail, se solicitado. O acesso à empresa será ativado após a validação do piloto.");
    } catch { setError("Erro ao criar conta. Tente novamente."); }
    finally { setIsLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Globe2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-slate-900 text-2xl font-bold">CrossCollect</span>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Criar conta para o piloto</h2>
            <p className="text-slate-500">Solicite acesso ao piloto CrossCollect</p>
          </div>

          {/* Benefits */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold text-blue-800 mb-2">Como funciona o acesso:</p>
            <div className="space-y-1.5">
              {[
                "Cadastro individual com e-mail e senha",
                "Acesso à empresa após validação",
                "Envios e cobranças indisponíveis no piloto",
                "Sem cartão de crédito no cadastro",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span className="text-sm text-blue-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
            {message && <p role="status" className="text-sm text-green-700">{message}</p>}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label htmlFor="signup-name" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nome completo
                </label>
                <input
                  id="signup-name"
                  autoComplete="name"
                  type="text"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  placeholder="Seu nome"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="signup-email" className="block text-sm font-medium text-slate-700 mb-1.5">E-mail</label>
                <input
                  id="signup-email"
                  autoComplete="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="seu@email.com"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="signup-company" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Empresa (opcional)
                </label>
                <input
                  id="signup-company"
                  autoComplete="organization"
                  type="text"
                  value={form.empresa}
                  onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                  placeholder="Nome da empresa"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="signup-country" className="block text-sm font-medium text-slate-700 mb-1.5">País</label>
                <select
                  id="signup-country"
                  autoComplete="country-name"
                  value={form.pais}
                  onChange={(e) => setForm({ ...form, pais: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Selecione...</option>
                  {paises.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label htmlFor="signup-password" className="block text-sm font-medium text-slate-700 mb-1.5">Senha</label>
                <div className="relative">
                  <input
                  id="signup-password"
                  autoComplete="new-password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Mínimo 8 caracteres"
                    minLength={8}
                    required
                    className="w-full px-4 py-2.5 pr-12 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Criando conta...
                </>
              ) : (
                "Criar conta"
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
