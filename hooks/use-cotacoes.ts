"use client";

import { useState, useEffect, useCallback } from "react";

export interface CotacaoItem {
  code: string;
  codein: string;
  bid: string;
  ask: string;
  high: string;
  low: string;
  varBid: string;
  pctChange: string;
  timestamp: string;
  create_date: string;
}

export interface Cotacoes {
  USDBRL: CotacaoItem;
  EURBRL: CotacaoItem;
  GBPBRL: CotacaoItem;
  CHFBRL: CotacaoItem;
}

/** Returns the BRL rate for a given currency code (e.g. "USD" → bid of USDBRL). */
export function getBid(cotacoes: Cotacoes | null, code: string): number {
  const key = `${code}BRL` as keyof Cotacoes;
  const item = cotacoes?.[key];
  return item ? parseFloat(item.bid) : 0;
}

const REFRESH_MS = 5 * 60 * 1000; // 5 min

export function useCotacoes() {
  const [cotacoes, setCotacoes] = useState<Cotacoes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(REFRESH_MS / 1000);

  const fetch_ = useCallback(async () => {
    setError(false);
    try {
      const res = await fetch("/api/cotacoes");
      if (!res.ok) throw new Error("bad status");
      const data: Cotacoes = await res.json();
      if (!data.USDBRL) throw new Error("unexpected shape");
      setCotacoes(data);
      setLastUpdate(new Date());
      setCountdown(REFRESH_MS / 1000);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch + interval
  useEffect(() => {
    fetch_();
    const iv = setInterval(fetch_, REFRESH_MS);
    return () => clearInterval(iv);
  }, [fetch_]);

  // Countdown ticker
  useEffect(() => {
    const iv = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  return { cotacoes, loading, error, lastUpdate, countdown, refresh: fetch_ };
}
