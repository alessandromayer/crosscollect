"use client";

import { useLocale } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  variant?: "light" | "dark";
}

export function LanguageToggle({ variant = "light" }: LanguageToggleProps) {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded-lg p-0.5 text-xs font-semibold",
        variant === "dark"
          ? "bg-slate-800"
          : "bg-slate-100"
      )}
    >
      <button
        onClick={() => setLocale("en")}
        className={cn(
          "px-2.5 py-1 rounded-md transition-all",
          locale === "en"
            ? variant === "dark"
              ? "bg-blue-600 text-white shadow"
              : "bg-white text-slate-900 shadow"
            : variant === "dark"
            ? "text-slate-400 hover:text-slate-200"
            : "text-slate-400 hover:text-slate-600"
        )}
      >
        EN
      </button>
      <button
        onClick={() => setLocale("pt")}
        className={cn(
          "px-2.5 py-1 rounded-md transition-all",
          locale === "pt"
            ? variant === "dark"
              ? "bg-blue-600 text-white shadow"
              : "bg-white text-slate-900 shadow"
            : variant === "dark"
            ? "text-slate-400 hover:text-slate-200"
            : "text-slate-400 hover:text-slate-600"
        )}
      >
        PT
      </button>
    </div>
  );
}
