"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Globe2,
  LayoutDashboard,
  FileText,
  BotMessageSquare,
  CreditCard,
  Settings,
  LogOut,
  Bell,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { LanguageToggle } from "@/components/language-toggle";

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  const navItems = [
    { label: t("dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { label: t("debts"), href: "/dividas", icon: FileText, badge: "43" },
    { label: t("assistant"), href: "/assistente", icon: BotMessageSquare, highlight: true },
    { label: t("plans"), href: "/planos", icon: CreditCard },
    { label: t("settings"), href: "/configuracoes", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Globe2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-base leading-none block">CrossCollect</span>
            <span className="text-slate-400 text-xs">International Collections</span>
          </div>
        </Link>
      </div>

      {/* Plan Badge */}
      <div className="px-4 py-3 border-b border-slate-800">
        <div className="bg-slate-800 rounded-lg px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-300 text-xs font-medium">{t("currentPlan")}</span>
          </div>
          <Link
            href="/planos"
            className="text-blue-400 text-xs hover:text-blue-300 flex items-center gap-0.5"
          >
            {t("upgrade")}
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
                isActive
                  ? "bg-blue-600 text-white"
                  : item.highlight
                  ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "flex-shrink-0",
                  isActive ? "text-white" : item.highlight ? "text-blue-400" : "text-slate-400 group-hover:text-slate-200"
                )}
                style={{ width: "18px", height: "18px" }}
              />
              <span className="text-sm font-medium flex-1">{item.label}</span>
              {item.badge && !isActive && (
                <span className="text-xs bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              {item.highlight && !isActive && (
                <span className="text-xs bg-blue-900/60 text-blue-400 px-1.5 py-0.5 rounded-full">
                  AI
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-4 space-y-1 border-t border-slate-800 pt-3">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all w-full group">
          <Bell style={{ width: "18px", height: "18px" }} className="flex-shrink-0 group-hover:text-slate-200" />
          <span className="text-sm font-medium flex-1 text-left">{t("notifications")}</span>
          <span className="w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Language toggle */}
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-xs text-slate-500 font-medium">Language</span>
          <LanguageToggle variant="dark" />
        </div>

        {/* User */}
        <div className="flex items-center gap-3 px-3 py-2.5 mt-1">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">JS</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-200 text-sm font-medium truncate">João Silva</p>
            <p className="text-slate-500 text-xs truncate">joao@empresa.com</p>
          </div>
          <button className="text-slate-500 hover:text-slate-300 transition-colors" title={t("logout")}>
            <LogOut style={{ width: "15px", height: "15px" }} />
          </button>
        </div>
      </div>
    </aside>
  );
}
