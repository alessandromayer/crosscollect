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
import { useTranslations } from "next-intl";
import type { ChatMessage } from "@/types";

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
          {message.timestamp.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}

export default function AssistentePage() {
  const t = useTranslations("assistant");

  function makeWelcome(): ChatMessage {
    return {
      id: "welcome",
      role: "assistant",
      content: t("welcome"),
      timestamp: new Date(),
    };
  }

  const [messages, setMessages] = useState<ChatMessage[]>(() => [makeWelcome()]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const suggestions = [
    t("suggestions.s1"),
    t("suggestions.s2"),
    t("suggestions.s3"),
    t("suggestions.s4"),
    t("suggestions.s5"),
  ];

  const quickActions = [
    { icon: TrendingUp, label: t("quickActions.analyze"), prompt: t("quickActions.analyzePrompt") },
    { icon: FileText, label: t("quickActions.report"), prompt: t("quickActions.reportPrompt") },
    { icon: AlertCircle, label: t("quickActions.overdue"), prompt: t("quickActions.overduePrompt") },
    { icon: MessageSquare, label: t("quickActions.template"), prompt: t("quickActions.templatePrompt") },
  ];

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

      if (!response.ok) throw new Error("API error");

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const fallback = `**Portfolio status:**
- 43 active cases with R$ 4.2M open
- 12 overdue debts need immediate attention
- Current recovery rate: 68.4%

**Recommendation:**
To maximize recovery, I suggest prioritizing debts with the highest value and shortest delay time, combining WhatsApp messaging (45% higher response rate) with a progressive discount offer.

Can I elaborate a specific strategy for a particular debtor?`;

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: fallback,
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
    setMessages([makeWelcome()]);
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
              {t("title")}
              <span className="flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3" />
                AI
              </span>
            </h1>
            <p className="text-slate-400 text-sm">{t("subtitle")}</p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-500 hover:bg-slate-50 text-sm font-medium rounded-xl transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {t("newConversation")}
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

          {/* Input area */}
          <div className="flex-shrink-0 mt-4">
            {/* Suggestion chips */}
            {messages.length <= 1 && (
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                {suggestions.map((s) => (
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
                placeholder={t("placeholder")}
                rows={1}
                className="flex-1 resize-none text-sm text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent max-h-32 leading-relaxed"
                style={{ fieldSizing: "content" } as React.CSSProperties}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="w-9 h-9 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-xl flex items-center justify-center transition-all flex-shrink-0 self-end"
                title={t("send")}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400 text-center mt-2">
              {t("hint")}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 space-y-5">
          {/* Quick actions */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">{t("quickActionsTitle")}</h4>
            <div className="space-y-1.5">
              {quickActions.map((action) => (
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
            <h4 className="text-sm font-semibold text-indigo-900 mb-2">{t("context.title")}</h4>
            <div className="space-y-2 text-xs text-indigo-700">
              <div className="flex justify-between">
                <span>{t("context.activePortfolio")}</span>
                <span className="font-semibold">43</span>
              </div>
              <div className="flex justify-between">
                <span>{t("context.open")}</span>
                <span className="font-semibold">$ 847.500</span>
              </div>
              <div className="flex justify-between">
                <span>{t("context.overdue")}</span>
                <span className="font-semibold text-red-600">12</span>
              </div>
              <div className="flex justify-between">
                <span>{t("context.successRate")}</span>
                <span className="font-semibold text-emerald-700">68.4%</span>
              </div>
            </div>
            <p className="text-xs text-indigo-500 mt-3">
              {t("context.note")}
            </p>
          </div>

          {/* Usage */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-slate-700">{t("usage.title")}</h4>
              <span className="text-xs text-slate-400">Growth</span>
            </div>
            <div className="mb-1.5">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>{t("usage.messages")}</span>
                <span>312 / 1.000</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: "31.2%" }} />
              </div>
            </div>
            <p className="text-xs text-slate-400">{t("usage.renews", { days: 23 })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
