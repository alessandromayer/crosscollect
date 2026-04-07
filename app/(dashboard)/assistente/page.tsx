"use client";

import { useState, useRef, useEffect } from "react";
import {
  BotMessageSquare,
  Send,
  Sparkles,
  RefreshCw,
  FileText,
  TrendingUp,
  MessageSquare,
  AlertCircle,
  User,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

const SUGGESTIONS = [
  "Quais dívidas têm maior risco de inadimplência?",
  "Sugira uma estratégia para negociar com Carlos Mendonça Ltda",
  "Como melhorar minha taxa de recuperação?",
  "Quais devedores devo priorizar esta semana?",
  "Gere um modelo de e-mail de cobrança formal",
];

const QUICK_ACTIONS = [
  { icon: TrendingUp, label: "Analisar carteira", prompt: "Analise minha carteira de cobranças e identifique os principais riscos e oportunidades." },
  { icon: FileText, label: "Gerar relatório", prompt: "Gere um relatório resumido da situação atual das minhas cobranças." },
  { icon: AlertCircle, label: "Dívidas vencidas", prompt: "Quais estratégias você recomenda para as dívidas que já venceram?" },
  { icon: MessageSquare, label: "Template de e-mail", prompt: "Crie um template de e-mail profissional para cobrança amigável em português." },
];

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content: `Olá! Sou o **Assistente CrossCollect**, especializado em estratégias de cobrança internacional para o mercado brasileiro.

Posso ajudá-lo com:
- 📊 **Análise da carteira** — identificar riscos e oportunidades
- 💬 **Templates de comunicação** — e-mails, WhatsApp e cartas
- 🎯 **Estratégias de negociação** — baseadas no perfil do devedor
- 📋 **Relatórios e insights** — sobre sua taxa de recuperação

Como posso ajudá-lo hoje?`,
    timestamp: new Date(),
  },
];

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  function renderContent(content: string) {
    return content.split("\n").map((line, i) => {
      const formatted = line
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/`(.*?)`/g, '<code class="bg-slate-100 text-slate-800 px-1 py-0.5 rounded text-xs font-mono">$1</code>');
      return (
        <p
          key={i}
          className={cn("text-sm leading-relaxed", i > 0 && line !== "" && "mt-1.5")}
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    });
  }

  return (
    <div className={cn("flex gap-3 chat-message", isUser ? "flex-row-reverse" : "flex-row")}>
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          isUser
            ? "bg-gradient-to-br from-blue-500 to-violet-600"
            : "bg-gradient-to-br from-indigo-500 to-violet-600"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <BotMessageSquare className="w-4 h-4 text-white" />
        )}
      </div>

      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-blue-600 text-white rounded-tr-sm"
            : "bg-white border border-slate-100 shadow-sm rounded-tl-sm"
        )}
      >
        {renderContent(message.content)}
        <p
          className={cn(
            "text-xs mt-2",
            isUser ? "text-blue-200" : "text-slate-400"
          )}
        >
          {message.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}

export default function AssistentePage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(content: string) {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/assistente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error("Erro na API");

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      // Fallback response for demo
      const demoResponses: Record<string, string> = {
        default: `Entendi sua solicitação. Com base na análise da sua carteira atual:

**Situação geral:**
- 43 casos ativos com R$ 4,2M em aberto
- 12 dívidas vencidas precisam de atenção imediata
- Taxa de recuperação atual: 68,4%

**Recomendação:**
Para maximizar a recuperação, sugiro priorizar as dívidas com maior valor e menor tempo de atraso, combinando comunicação por WhatsApp (canal com 45% mais resposta) com proposta de desconto progressivo.

Posso elaborar uma estratégia específica para algum devedor em particular?`,
      };

      const fallbackContent = demoResponses.default;

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: fallbackContent,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function clearChat() {
    setMessages(initialMessages);
  }

  return (
    <div className="h-screen flex flex-col p-6 gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <BotMessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              Assistente CrossCollect
              <span className="flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3" />
                IA
              </span>
            </h1>
            <p className="text-slate-400 text-sm">Powered by Claude · Especialista em cobrança no Brasil</p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-500 hover:bg-slate-50 text-sm font-medium rounded-xl transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Nova conversa
        </button>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Chat */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                  <BotMessageSquare className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex-shrink-0 mt-4">
            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="flex-shrink-0 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium rounded-full transition-all whitespace-nowrap"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-3 bg-white border border-slate-200 rounded-2xl p-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pergunte sobre estratégias de cobrança, análise de devedores, templates..."
                rows={1}
                className="flex-1 resize-none text-sm text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent max-h-32 leading-relaxed"
                style={{ fieldSizing: "content" } as React.CSSProperties}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-xl flex items-center justify-center transition-all flex-shrink-0 self-end"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400 text-center mt-2">
              Enter para enviar · Shift+Enter para nova linha
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 space-y-5">
          {/* Quick actions */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Ações rápidas</h4>
            <div className="space-y-1.5">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => sendMessage(action.prompt)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all group text-left"
                >
                  <action.icon className="w-4 h-4 flex-shrink-0 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  <span className="text-sm font-medium flex-1">{action.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Context */}
          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-4 border border-indigo-100">
            <h4 className="text-sm font-semibold text-indigo-900 mb-2">Contexto atual</h4>
            <div className="space-y-2 text-xs text-indigo-700">
              <div className="flex justify-between">
                <span>Carteira ativa</span>
                <span className="font-semibold">43 casos</span>
              </div>
              <div className="flex justify-between">
                <span>Em aberto</span>
                <span className="font-semibold">$ 847.500</span>
              </div>
              <div className="flex justify-between">
                <span>Vencidas</span>
                <span className="font-semibold text-red-600">12 dívidas</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa sucesso</span>
                <span className="font-semibold text-emerald-700">68,4%</span>
              </div>
            </div>
            <p className="text-xs text-indigo-500 mt-3">
              O assistente usa esses dados para personalizar as respostas.
            </p>
          </div>

          {/* Usage */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-slate-700">Uso do plano</h4>
              <span className="text-xs text-slate-400">Growth</span>
            </div>
            <div className="mb-1.5">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Mensagens</span>
                <span>312 / 1.000</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: "31.2%" }} />
              </div>
            </div>
            <p className="text-xs text-slate-400">Renova em 23 dias</p>
          </div>
        </div>
      </div>
    </div>
  );
}
