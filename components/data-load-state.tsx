"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function DataLoadState({ loading, status, onRetry }: {
  loading: boolean;
  status: number;
  onRetry: () => void;
}) {
  const t = useTranslations("dataState");
  const title = loading ? t("loading")
    : status === 401 ? t("sessionExpired")
    : status === 403 ? t("activationPending") : t("errorTitle");
  const description = loading ? null
    : status === 401 ? t("signInAgain")
    : status === 403 ? t("activationDescription") : t("errorDescription");

  return (
    <section className="m-8 rounded-2xl border border-slate-200 bg-white p-8"
      role={loading || status === 403 ? "status" : "alert"} aria-live="polite">
      <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
      {description && <p className="mt-2 text-slate-600">{description}</p>}
      {!loading && status === 401 && (
        <Link href="/login" className="mt-4 inline-block font-medium text-blue-600">{t("login")}</Link>
      )}
      {!loading && status !== 401 && status !== 403 && (
        <button type="button" onClick={onRetry}
          className="mt-4 rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
          {t("retry")}
        </button>
      )}
    </section>
  );
}
