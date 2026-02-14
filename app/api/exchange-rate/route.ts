import { NextResponse } from "next/server";

const EXCHANGE_RATE_API = "https://open.er-api.com/v6/latest/USD";

// Fallback rates (approximate)
const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  KRW: 1350,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 155,
};

export async function GET() {
  try {
    const res = await fetch(EXCHANGE_RATE_API, {
      next: { revalidate: 300 }, // 5 min cache
    });

    if (!res.ok) {
      return NextResponse.json({
        base: "USD",
        rates: FALLBACK_RATES,
      });
    }

    const data = await res.json();

    // Extract only the currencies we support
    const rates: Record<string, number> = {
      USD: 1,
      KRW: data.rates?.KRW ?? FALLBACK_RATES.KRW,
      EUR: data.rates?.EUR ?? FALLBACK_RATES.EUR,
      GBP: data.rates?.GBP ?? FALLBACK_RATES.GBP,
      JPY: data.rates?.JPY ?? FALLBACK_RATES.JPY,
    };

    return NextResponse.json({
      base: "USD",
      rates,
    });
  } catch {
    return NextResponse.json({
      base: "USD",
      rates: FALLBACK_RATES,
    });
  }
}
