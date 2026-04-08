import { NextResponse } from "next/server";

export const revalidate = 300; // 5 min server-side cache

export async function GET() {
  try {
    const res = await fetch(
      "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,GBP-BRL,CHF-BRL",
      { next: { revalidate: 300 } }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch rates" }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[cotacoes] Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
