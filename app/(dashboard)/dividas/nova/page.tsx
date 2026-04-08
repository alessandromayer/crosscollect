"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  User,
  DollarSign,
  FileUp,
  Bell,
  Check,
  Plus,
  X,
  Upload,
  Mail,
  MessageCircle,
  AlertCircle,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

const steps = [
  { id: 1, label: "Devedor", icon: User },
  { id: 2, label: "Dívida", icon: DollarSign },
  { id: 3, label: "Documentos", icon: FileUp },
  { id: 4, label: "Régua de Cobrança", icon: Bell },
];

const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "BRL"];

const contactTemplates: Record<string, { canal: string; label: string; template: string }[]> = {
  "": [],
};

const defaultCollectionSteps = [
  { id: "s1", dia: 1, canal: "email", template: "Lembrete amigável — vencimento em breve", ativo: true },
  { id: "s2", dia: 7, canal: "whatsapp", template: "Segundo aviso — pagamento não identificado", ativo: true },
  { id: "s3", dia: 15, canal: "email", template: "Aviso formal de inadimplência", ativo: true },
  { id: "s4", dia: 30, canal: "telefone", template: "Cobrança direta — proposta de acordo", ativo: true },
];

const canalColors: Record<string, string> = {
  email: "bg-blue-100 text-blue-700",
  whatsapp: "bg-emerald-100 text-emerald-700",
  sms: "bg-violet-100 text-violet-700",
  telefone: "bg-orange-100 text-orange-700",
  carta: "bg-slate-100 text-slate-700",
};

export default function NovaDividaPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Devedor
  const [devedor, setDevedor] = useState({
    nome: "",
    tipo: "pessoa_juridica",
    cpf_cnpj: "",
    email: "",
    telefone: "",
    cidade: "",
    estado: "",
  });

  // Step 2: Dívida
  const [divida, setDivida] = useState({
    descricao: "",
    valor: "",
    moeda: "USD",
    dataVencimento: "",
    observacoes: "",
  });

  // Step 3: Documentos
  const [documentos, setDocumentos] = useState<string[]>([]);

  // Step 4: Régua
  const [cobrancaSteps, setCobrancaSteps] = useState(defaultCollectionSteps);
  const [regraStatus, setRegraStatus] = useState<{
    enviados: number;
    agendados: number;
    erros: number;
    acoes: { tipo: string; subtipo: string; status: string; diasAposVencimento: number }[];
  } | null>(null);

  // Asaas payment links state
  const [asaasData, setAsaasData] = useState<{
    boleto: { bankSlipUrl?: string; invoiceUrl?: string; linhaDigitavel: string };
    pix: { qrCodeBase64: string; copiaCola: string };
  } | null>(null);
  const [copiedBoleto, setCopiedBoleto] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);

  function copyToClipboard(text: string, type: "boleto" | "pix") {
    navigator.clipboard.writeText(text);
    if (type === "boleto") {
      setCopiedBoleto(true);
      setTimeout(() => setCopiedBoleto(false), 2000);
    } else {
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2000);
    }
  }

  function nextStep() {
    if (step < 4) setStep(step + 1);
  }

  function prevStep() {
    if (step > 1) setStep(step - 1);
  }

  function toggleStep(id: string) {
    setCobrancaSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ativo: !s.ativo } : s))
    );
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      const dividaId = `d_${Date.now()}`;
      const valorNum = parseFloat(divida.valor) || 0;
      const dataVencFormatted = divida.dataVencimento || new Date().toISOString().split("T")[0];

      // Run collection rule + Asaas charge creation in parallel
      const [regraRes, asaasRes] = await Promise.allSettled([
        fetch("/api/cobranca/iniciar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            divida: {
              id: dividaId,
              descricao: divida.descricao || "Pendência financeira",
              valor: divida.valor || "0",
              moeda: divida.moeda,
              dataVencimento: divida.dataVencimento ? formatDate(divida.dataVencimento) : "—",
              linkPagamento: `${window.location.origin}/pagar/${dividaId}`,
            },
            devedor: {
              nome: devedor.nome || "Devedor",
              email: devedor.email || "",
              telefone: devedor.telefone || "",
            },
            nomeCredor: "CrossCollect",
            baseUrl: window.location.origin,
          }),
        }),
        fetch("/api/asaas/criar-cobranca", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            devedor: {
              nome: devedor.nome || "Devedor",
              cpf_cnpj: devedor.cpf_cnpj || "00000000000",
              email: devedor.email || "",
            },
            valor: valorNum,
            descricao: divida.descricao || "Pendência financeira",
            dataVencimento: dataVencFormatted,
          }),
        }),
      ]);

      // Handle collection rule result
      if (regraRes.status === "fulfilled" && regraRes.value.ok) {
        const data = await regraRes.value.json();
        setRegraStatus(data.resumo ? { ...data.resumo, acoes: data.acoes } : null);
      }

      // Handle Asaas result
      if (asaasRes.status === "fulfilled" && asaasRes.value.ok) {
        const data = await asaasRes.value.json();
        setAsaasData({ boleto: data.boleto, pix: data.pix });
      }

      // Stay on page to show payment links, auto-redirect after 6s
      await new Promise((r) => setTimeout(r, 6000));
    } catch (err) {
      console.error("Erro ao cadastrar dívida:", err);
    }
    router.push("/dividas");
  }

  const estados = [
    "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
    "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
  ];

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/dividas"
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Nova Dívida</h1>
          <p className="text-slate-500 text-sm mt-0.5">Cadastre uma nova cobrança em 4 passos</p>
        </div>
      </div>

      {/* Progress steps */}
      <div className="flex items-center mb-10">
        {steps.map((s, idx) => (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <button
                onClick={() => step > s.id && setStep(s.id)}
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                  step > s.id
                    ? "bg-emerald-500 text-white cursor-pointer hover:bg-emerald-600"
                    : step === s.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "bg-slate-100 text-slate-400 cursor-default"
                )}
              >
                {step > s.id ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <s.icon className="w-4 h-4" />
                )}
              </button>
              <span
                className={cn(
                  "text-xs font-medium mt-1.5",
                  step === s.id
                    ? "text-blue-600"
                    : step > s.id
                    ? "text-emerald-600"
                    : "text-slate-400"
                )}
              >
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-3 mb-4 rounded-full transition-all",
                  step > s.id ? "bg-emerald-300" : "bg-slate-200"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">

        {/* Step 1: Devedor */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Dados do Devedor</h2>
              <p className="text-slate-500 text-sm">Informe os dados de contato do devedor no Brasil</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de pessoa</label>
              <div className="flex gap-3">
                {[
                  { value: "pessoa_juridica", label: "Pessoa Jurídica (CNPJ)" },
                  { value: "pessoa_fisica", label: "Pessoa Física (CPF)" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDevedor({ ...devedor, tipo: opt.value })}
                    className={cn(
                      "flex-1 py-3 px-4 border-2 rounded-xl text-sm font-medium transition-all",
                      devedor.tipo === opt.value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 text-slate-500 hover:border-slate-300"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {devedor.tipo === "pessoa_juridica" ? "Razão Social" : "Nome Completo"}
                </label>
                <input
                  value={devedor.nome}
                  onChange={(e) => setDevedor({ ...devedor, nome: e.target.value })}
                  placeholder={devedor.tipo === "pessoa_juridica" ? "Nome da empresa" : "Nome do devedor"}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {devedor.tipo === "pessoa_juridica" ? "CNPJ" : "CPF"}
                </label>
                <input
                  value={devedor.cpf_cnpj}
                  onChange={(e) => setDevedor({ ...devedor, cpf_cnpj: e.target.value })}
                  placeholder={devedor.tipo === "pessoa_juridica" ? "00.000.000/0001-00" : "000.000.000-00"}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Telefone / WhatsApp</label>
                <input
                  value={devedor.telefone}
                  onChange={(e) => setDevedor({ ...devedor, telefone: e.target.value })}
                  placeholder="(00) 00000-0000"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">E-mail</label>
                <input
                  type="email"
                  value={devedor.email}
                  onChange={(e) => setDevedor({ ...devedor, email: e.target.value })}
                  placeholder="email@devedor.com.br"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Cidade</label>
                <input
                  value={devedor.cidade}
                  onChange={(e) => setDevedor({ ...devedor, cidade: e.target.value })}
                  placeholder="São Paulo"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Estado</label>
                <select
                  value={devedor.estado}
                  onChange={(e) => setDevedor({ ...devedor, estado: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">Selecione...</option>
                  {estados.map((uf) => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Dívida */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Dados da Dívida</h2>
              <p className="text-slate-500 text-sm">Informe o valor, moeda e data de vencimento</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Descrição da dívida</label>
              <input
                value={divida.descricao}
                onChange={(e) => setDivida({ ...divida, descricao: e.target.value })}
                placeholder="Ex: Fornecimento de equipamentos – Contrato #001"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Moeda</label>
                <select
                  value={divida.moeda}
                  onChange={(e) => setDivida({ ...divida, moeda: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  {currencies.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Valor ({divida.moeda})
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                    {divida.moeda === "BRL" ? "R$" : divida.moeda === "EUR" ? "€" : divida.moeda === "GBP" ? "£" : "$"}
                  </span>
                  <input
                    type="number"
                    value={divida.valor}
                    onChange={(e) => setDivida({ ...divida, valor: e.target.value })}
                    placeholder="0,00"
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Data de Vencimento</label>
                <input
                  type="date"
                  value={divida.dataVencimento}
                  onChange={(e) => setDivida({ ...divida, dataVencimento: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {divida.valor && (
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-blue-700 font-medium mb-1">Estimativa de conversão</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-blue-900">
                    R$ {(parseFloat(divida.valor || "0") * 5.0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-blue-500 text-sm">taxa: 5,00 BRL/{divida.moeda}</span>
                </div>
                <p className="text-xs text-blue-500 mt-1">*Taxa de câmbio aproximada. Valor real aplicado no momento do pagamento.</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Observações (opcional)</label>
              <textarea
                value={divida.observacoes}
                onChange={(e) => setDivida({ ...divida, observacoes: e.target.value })}
                placeholder="Contexto adicional sobre a dívida, histórico de relação comercial, etc."
                rows={3}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 3: Documentos */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Documentos</h2>
              <p className="text-slate-500 text-sm">Anexe contratos, notas fiscais ou qualquer documento comprobatório</p>
            </div>

            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer">
              <Upload className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-medium mb-1">Arraste arquivos aqui ou clique para selecionar</p>
              <p className="text-slate-400 text-sm">PDF, JPG, PNG, DOCX — até 25MB por arquivo</p>
              <button
                type="button"
                onClick={() =>
                  setDocumentos([...documentos, `documento_${documentos.length + 1}.pdf`])
                }
                className="mt-4 px-5 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-all"
              >
                Selecionar arquivos
              </button>
            </div>

            {documentos.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">Arquivos selecionados:</p>
                {documentos.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl"
                  >
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileUp className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="flex-1 text-sm text-slate-700 font-medium">{doc}</span>
                    <button
                      onClick={() => setDocumentos(documentos.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <p className="text-sm font-semibold text-amber-800 mb-1">Documentos recomendados</p>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Contrato assinado ou proposta aceita</li>
                <li>• Nota fiscal ou invoice</li>
                <li>• E-mails comprobatórios da relação comercial</li>
                <li>• Protesto em cartório (se aplicável)</li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 4: Régua de Cobrança */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Régua de Cobrança</h2>
              <p className="text-slate-500 text-sm">
                Configure a sequência automática de contatos após o vencimento
              </p>
            </div>

            {/* Visual ruler */}
            <div className="relative">
              <div className="flex items-start gap-0">
                {cobrancaSteps.map((cs, idx) => (
                  <div key={cs.id} className="flex-1 relative">
                    <div className="flex flex-col items-center">
                      {/* Connector line */}
                      {idx < cobrancaSteps.length - 1 && (
                        <div className="absolute top-4 left-1/2 right-0 h-0.5 bg-slate-200 z-0" />
                      )}

                      {/* Step circle */}
                      <div
                        className={cn(
                          "relative z-10 w-9 h-9 rounded-full border-2 flex items-center justify-center mb-3 transition-all",
                          cs.ativo
                            ? "border-blue-500 bg-blue-500 text-white"
                            : "border-slate-300 bg-white text-slate-400"
                        )}
                      >
                        <span className="text-xs font-bold">{idx + 1}</span>
                      </div>

                      {/* Card */}
                      <div
                        className={cn(
                          "w-full border-2 rounded-xl p-3 text-center transition-all cursor-pointer",
                          cs.ativo
                            ? "border-blue-200 bg-blue-50"
                            : "border-slate-100 bg-slate-50 opacity-50"
                        )}
                        onClick={() => toggleStep(cs.id)}
                      >
                        <div className="text-xs font-bold text-slate-500 mb-1">
                          Dia +{cs.dia}
                        </div>
                        <span
                          className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mb-2 ${canalColors[cs.canal] || "bg-slate-100 text-slate-600"}`}
                        >
                          {cs.canal}
                        </span>
                        <p className="text-xs text-slate-600 leading-tight">{cs.template}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <p className="text-sm text-slate-500">
                {cobrancaSteps.filter((s) => s.ativo).length} de {cobrancaSteps.length} etapas ativas
              </p>
              <button className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
                <Plus className="w-3.5 h-3.5" />
                Adicionar etapa
              </button>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
              <p className="text-sm font-semibold text-emerald-800 mb-1">Régua inteligente ativada</p>
              <p className="text-sm text-emerald-700">
                O assistente IA irá personalizar as mensagens com base no perfil do devedor e histórico de interações,
                aumentando a taxa de recuperação em até 40%.
              </p>
            </div>
          </div>
        )}

        {/* Régua feedback */}
        {regraStatus && (
          <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 animate-fade-in">
            <p className="font-semibold text-emerald-800 text-sm mb-3 flex items-center gap-2">
              <Check className="w-4 h-4" />
              Régua de cobrança iniciada com sucesso!
            </p>
            <div className="space-y-2">
              {regraStatus.acoes?.map((acao, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  {acao.tipo === "email" ? (
                    <Mail className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                  ) : (
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  )}
                  <span className={`font-medium ${acao.status === "enviado" ? "text-emerald-700" : acao.status === "agendado" ? "text-blue-600" : "text-red-600"}`}>
                    {acao.status === "enviado" ? "✓ Enviado" : acao.status === "agendado" ? "⏰ Agendado" : "✗ Erro"}
                  </span>
                  <span className="text-slate-500">
                    {acao.tipo === "email" ? "E-mail" : "WhatsApp"} — {acao.subtipo.replace("_", " ")}
                    {acao.diasAposVencimento > 0 ? ` (dia +${acao.diasAposVencimento})` : " (agora)"}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-emerald-600 mt-2">
              {regraStatus.enviados} enviados · {regraStatus.agendados} agendados · {regraStatus.erros} erros
            </p>
          </div>
        )}

        {/* Asaas payment links */}
        {asaasData && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 animate-fade-in">
            <p className="font-semibold text-blue-900 text-sm mb-4 flex items-center gap-2">
              <Check className="w-4 h-4 text-blue-600" />
              Cobrança gerada no Asaas — links de pagamento prontos!
            </p>

            <div className="grid grid-cols-2 gap-4">
              {/* Pix */}
              <div className="bg-white rounded-xl p-3 border border-blue-100">
                <p className="text-xs font-semibold text-slate-700 mb-2">QR Code Pix</p>
                {asaasData.pix.qrCodeBase64 && (
                  <div className="flex justify-center mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`data:image/png;base64,${asaasData.pix.qrCodeBase64}`}
                      alt="QR Code Pix"
                      className="w-24 h-24 rounded-lg border border-slate-200"
                    />
                  </div>
                )}
                <button
                  onClick={() => copyToClipboard(asaasData.pix.copiaCola, "pix")}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg transition-all"
                >
                  {copiedPix ? "✓ Copiado!" : "Copiar Pix copia-e-cola"}
                </button>
              </div>

              {/* Boleto */}
              <div className="bg-white rounded-xl p-3 border border-blue-100">
                <p className="text-xs font-semibold text-slate-700 mb-2">Boleto Bancário</p>
                <p className="text-[9px] text-slate-400 font-mono break-all bg-slate-50 rounded px-1.5 py-1 mb-2 leading-relaxed">
                  {asaasData.boleto.linhaDigitavel}
                </p>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => copyToClipboard(asaasData.boleto.linhaDigitavel, "boleto")}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all"
                  >
                    {copiedBoleto ? "✓ Copiado!" : "Copiar código"}
                  </button>
                  {(asaasData.boleto.bankSlipUrl || asaasData.boleto.invoiceUrl) && (
                    <a
                      href={asaasData.boleto.bankSlipUrl || asaasData.boleto.invoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-semibold rounded-lg transition-all"
                    >
                      Abrir boleto
                    </a>
                  )}
                </div>
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-3 text-center">Redirecionando em alguns segundos...</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>

          <div className="flex items-center gap-1.5">
            {steps.map((s) => (
              <div
                key={s.id}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  step === s.id ? "w-6 bg-blue-600" : step > s.id ? "w-3 bg-emerald-400" : "w-3 bg-slate-200"
                )}
              />
            ))}
          </div>

          {step < 4 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25"
            >
              Próximo
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-600/25 disabled:opacity-60"
            >
              {isSubmitting && !regraStatus ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Cadastrando e disparando régua...
                </>
              ) : regraStatus ? (
                <>
                  <Check className="w-4 h-4" />
                  Régua iniciada! Redirecionando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Cadastrar Dívida
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
