import { NextResponse } from "next/server";

const COINGECKO_API = "https://api.coingecko.com/api/v3";

// Stablecoin CoinGecko IDs
const COIN_IDS = ["tether", "usd-coin", "dai"];

export async function GET() {
  try {
    const ids = COIN_IDS.join(",");
    const url = `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=usd`;

    const res = await fetch(url, {
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      // Fallback to hardcoded prices if API fails (stablecoins are ~$1)
      return NextResponse.json({
        tether: { usd: 1.0 },
        "usd-coin": { usd: 1.0 },
        dai: { usd: 1.0 },
      });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    // Fallback prices
    return NextResponse.json({
      tether: { usd: 1.0 },
      "usd-coin": { usd: 1.0 },
      dai: { usd: 1.0 },
    });
  }
}
