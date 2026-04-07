"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en.json";
import ptMessages from "@/messages/pt.json";

type Locale = "en" | "pt";

const allMessages: Record<Locale, typeof enMessages> = {
  en: enMessages,
  pt: ptMessages as typeof enMessages,
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("cc_locale") as Locale | null;
    if (saved === "en" || saved === "pt") {
      setLocaleState(saved);
    }
  }, []);

  function setLocale(newLocale: Locale) {
    setLocaleState(newLocale);
    localStorage.setItem("cc_locale", newLocale);
  }

  // Prevent hydration mismatch — render with default (en) on server
  const activeLocale = mounted ? locale : "en";

  return (
    <I18nContext.Provider value={{ locale: activeLocale, setLocale }}>
      <NextIntlClientProvider
        locale={activeLocale}
        messages={allMessages[activeLocale]}
        timeZone="America/Sao_Paulo"
      >
        {children}
      </NextIntlClientProvider>
    </I18nContext.Provider>
  );
}

export function useLocale() {
  return useContext(I18nContext);
}
