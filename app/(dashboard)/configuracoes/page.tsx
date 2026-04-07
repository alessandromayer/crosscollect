"use client";

import { useState } from "react";
import {
  User,
  Bell,
  Building2,
  Key,
  Camera,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Check,
  Plus,
  Trash2,
  Shield,
  Globe2,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { cn, maskApiKey } from "@/lib/utils";

type Tab = "perfil" | "notificacoes" | "repasse" | "api";

const tabs: { id: Tab; label: string; icon: React.ComponentType<{className?: string}> }[] = [
  { id: "perfil", label: "Perfil", icon: User },
  { id: "notificacoes", label: "Notificações", icon: Bell },
  { id: "repasse", label: "Repasse Bancário", icon: Building2 },
  { id: "api", label: "Chave de API", icon: Key },
];

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex w-11 h-6 rounded-full transition-all duration-200 focus:outline-none",
        checked ? "bg-blue-600" : "bg-slate-200"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("perfil");
  const [saved, setSaved] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  const mockApiKey = "cc_live_xK9mN3pQ8vR2wL5tY7aB4dF6jH1cE0sZ";

  // Perfil state
  const [perfil, setPerfil] = useState({
    nome: "João Silva",
    email: "joao.silva@empresa.com",
    empresa: "Global Trade Partners LLC",
    cargo: "Diretor Financeiro",
    pais: "Estados Unidos",
    telefone: "+1 (555) 123-4567",
  });

  // Notificações state
  const [notifs, setNotifs] = useState({
    email_novo_pagamento: true,
    email_divida_vencida: true,
    email_relatorio_semanal: false,
    whatsapp_alertas: true,
    push_atividade: false,
  });

  // Contas bancárias
  const [contas, setContas] = useState([
    {
      id: "b1",
      banco: "Banco do Brasil",
      agencia: "1234",
      conta: "12345-6",
      tipo: "corrente",
      titular: "Global Trade Partners LLC",
      cpf_cnpj: "12.345.678/0001-90",
      pix_key: "financeiro@globaltp.com",
      ativo: true,
    },
  ]);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function copyApiKey() {
    navigator.clipboard.writeText(mockApiKey);
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  }

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
        <p className="text-slate-500 mt-0.5">Gerencie sua conta, notificações e integrações</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar tabs */}
        <div className="w-52 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                )}
              >
                <tab.icon className="w-4 h-4 flex-shrink-0" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">

          {/* Perfil */}
          {activeTab === "perfil" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="font-semibold text-slate-900 mb-6">Informações do Perfil</h2>

              {/* Avatar */}
              <div className="flex items-center gap-5 mb-8 pb-8 border-b border-slate-100">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">JS</span>
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50 transition-all">
                    <Camera className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{perfil.nome}</p>
                  <p className="text-slate-400 text-sm">{perfil.email}</p>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1">
                    Alterar foto
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome completo</label>
                  <input
                    value={perfil.nome}
                    onChange={(e) => setPerfil({ ...perfil, nome: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">E-mail</label>
                  <input
                    type="email"
                    value={perfil.email}
                    onChange={(e) => setPerfil({ ...perfil, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Empresa</label>
                  <input
                    value={perfil.empresa}
                    onChange={(e) => setPerfil({ ...perfil, empresa: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Cargo</label>
                  <input
                    value={perfil.cargo}
                    onChange={(e) => setPerfil({ ...perfil, cargo: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">País</label>
                  <div className="relative">
                    <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      value={perfil.pais}
                      onChange={(e) => setPerfil({ ...perfil, pais: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Telefone</label>
                  <input
                    value={perfil.telefone}
                    onChange={(e) => setPerfil({ ...perfil, telefone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="font-medium text-slate-900 mb-4">Segurança</h3>
                <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium rounded-xl transition-all">
                  <Shield className="w-4 h-4" />
                  Alterar senha
                </button>
              </div>

              <div className="flex justify-end mt-6 pt-6 border-t border-slate-100">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all"
                >
                  {saved ? <Check className="w-4 h-4" /> : null}
                  {saved ? "Salvo!" : "Salvar alterações"}
                </button>
              </div>
            </div>
          )}

          {/* Notificações */}
          {activeTab === "notificacoes" && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="font-semibold text-slate-900 mb-6">Preferências de Notificação</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">E-mail</h3>
                  <div className="space-y-4">
                    {[
                      { key: "email_novo_pagamento", label: "Novo pagamento recebido", desc: "Notificação imediata quando um pagamento é confirmado" },
                      { key: "email_divida_vencida", label: "Dívida vencida", desc: "Alerta quando uma dívida passa do prazo sem pagamento" },
                      { key: "email_relatorio_semanal", label: "Relatório semanal", desc: "Resumo da carteira enviado toda segunda-feira" },
                    ].map((n) => (
                      <div key={n.key} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-slate-800">{n.label}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{n.desc}</p>
                        </div>
                        <Toggle
                          checked={notifs[n.key as keyof typeof notifs]}
                          onChange={(v) => setNotifs({ ...notifs, [n.key]: v })}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">WhatsApp & Push</h3>
                  <div className="space-y-4">
                    {[
                      { key: "whatsapp_alertas", label: "Alertas via WhatsApp", desc: "Receba alertas críticos no WhatsApp" },
                      { key: "push_atividade", label: "Notificações push", desc: "Notificações no navegador sobre atividades" },
                    ].map((n) => (
                      <div key={n.key} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-slate-800">{n.label}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{n.desc}</p>
                        </div>
                        <Toggle
                          checked={notifs[n.key as keyof typeof notifs]}
                          onChange={(v) => setNotifs({ ...notifs, [n.key]: v })}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-6 border-t border-slate-100">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all"
                >
                  {saved ? <Check className="w-4 h-4" /> : null}
                  {saved ? "Salvo!" : "Salvar preferências"}
                </button>
              </div>
            </div>
          )}

          {/* Repasse Bancário */}
          {activeTab === "repasse" && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-semibold text-slate-900">Contas para Repasse</h2>
                    <p className="text-slate-400 text-sm mt-0.5">
                      Defina onde os valores recuperados serão creditados
                    </p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium rounded-xl transition-all">
                    <Plus className="w-4 h-4" />
                    Adicionar conta
                  </button>
                </div>

                <div className="space-y-4">
                  {contas.map((conta) => (
                    <div
                      key={conta.id}
                      className={cn(
                        "border-2 rounded-2xl p-5 transition-all",
                        conta.ativo ? "border-blue-200 bg-blue-50/30" : "border-slate-100"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-slate-900">{conta.banco}</p>
                              {conta.ativo && (
                                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                                  Principal
                                </span>
                              )}
                            </div>
                            <p className="text-slate-500 text-sm">{conta.titular}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
                        <div>
                          <p className="text-xs text-slate-400 mb-0.5">Agência</p>
                          <p className="text-sm font-medium text-slate-800">{conta.agencia}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 mb-0.5">Conta</p>
                          <p className="text-sm font-medium text-slate-800">{conta.conta} ({conta.tipo})</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 mb-0.5">CPF/CNPJ</p>
                          <p className="text-sm font-medium text-slate-800">{conta.cpf_cnpj}</p>
                        </div>
                        {conta.pix_key && (
                          <div className="col-span-3">
                            <p className="text-xs text-slate-400 mb-0.5">Chave PIX</p>
                            <p className="text-sm font-medium text-slate-800">{conta.pix_key}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* International transfer info */}
              <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900 text-sm mb-1">
                      Transferência Internacional
                    </p>
                    <p className="text-amber-700 text-sm leading-relaxed">
                      Para receber em contas no exterior via SWIFT/SEPA, entre em contato com o suporte.
                      Trabalhamos com Wise, Payoneer e transferências bancárias internacionais diretas.
                    </p>
                    <button className="mt-2 text-amber-700 hover:text-amber-900 font-medium text-sm underline">
                      Configurar conta internacional
                    </button>
                  </div>
                </div>
              </div>

              {/* Repasse schedule */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Cronograma de Repasse</h3>
                <div className="space-y-3">
                  {[
                    { label: "Frequência de repasse", value: "Semanal (toda sexta-feira)" },
                    { label: "Valor mínimo para repasse", value: "R$ 500,00" },
                    { label: "Taxa de repasse", value: "1,5% do valor transferido" },
                    { label: "Prazo de processamento", value: "1-3 dias úteis" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                      <span className="text-sm text-slate-500">{label}</span>
                      <span className="text-sm font-medium text-slate-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* API Key */}
          {activeTab === "api" && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-start gap-3 mb-6 pb-6 border-b border-slate-100">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Key className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900">Chave de API</h2>
                    <p className="text-slate-400 text-sm mt-0.5">
                      Use esta chave para integrar o CrossCollect ao seu sistema via REST API
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Sua chave de API</label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type={showApiKey ? "text" : "password"}
                        value={showApiKey ? mockApiKey : maskApiKey(mockApiKey)}
                        readOnly
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm bg-slate-50 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="p-2.5 border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                      title={showApiKey ? "Ocultar" : "Mostrar"}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={copyApiKey}
                      className={cn(
                        "p-2.5 border rounded-xl transition-all",
                        apiKeyCopied
                          ? "border-emerald-300 bg-emerald-50 text-emerald-600"
                          : "border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                      )}
                      title="Copiar"
                    >
                      {apiKeyCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Criada em 15/01/2024 · Nunca expira · Último uso: há 2 dias
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium rounded-xl transition-all">
                    <RefreshCw className="w-4 h-4" />
                    Regenerar chave
                  </button>
                  <p className="text-xs text-slate-400">
                    Atenção: regenerar invalida a chave atual imediatamente.
                  </p>
                </div>
              </div>

              {/* API Docs */}
              <div className="bg-slate-900 rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-4">Exemplo de uso</h3>
                <pre className="text-sm text-slate-300 font-mono overflow-x-auto">
{`curl -X GET \\
  https://api.crosscollect.com/v1/dividas \\
  -H "Authorization: Bearer cc_live_xK9m..." \\
  -H "Content-Type: application/json"`}
                </pre>
              </div>

              {/* Endpoints */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Endpoints disponíveis</h3>
                <div className="space-y-2">
                  {[
                    { method: "GET", path: "/v1/dividas", desc: "Listar todas as dívidas" },
                    { method: "POST", path: "/v1/dividas", desc: "Criar nova dívida" },
                    { method: "GET", path: "/v1/dividas/:id", desc: "Obter detalhes de uma dívida" },
                    { method: "PATCH", path: "/v1/dividas/:id", desc: "Atualizar status da dívida" },
                    { method: "GET", path: "/v1/metricas", desc: "Dashboard de métricas" },
                    { method: "POST", path: "/v1/webhooks", desc: "Configurar webhooks" },
                  ].map(({ method, path, desc }) => (
                    <div key={path} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
                      <span
                        className={cn(
                          "text-xs font-bold px-2 py-0.5 rounded-md w-12 text-center flex-shrink-0",
                          method === "GET" ? "bg-emerald-100 text-emerald-700" :
                          method === "POST" ? "bg-blue-100 text-blue-700" :
                          "bg-amber-100 text-amber-700"
                        )}
                      >
                        {method}
                      </span>
                      <code className="text-sm font-mono text-slate-700 flex-1">{path}</code>
                      <span className="text-sm text-slate-400">{desc}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    Ver documentação completa da API
                    <CreditCard className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
