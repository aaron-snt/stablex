# Stablex

**Find the Cheapest Stablecoin Rates** — Compare the true total cost of buying, selling, and transferring stablecoins across exchanges in one view.

## What is Stablex?

Stablecoin on/off-ramps are fragmented across dozens of exchanges, each with different fee structures, spreads, and FX markups. Stablex compares every cost component so you always know exactly how much you'll pay — and how much you'll receive.

## Features

### On/Off-Ramp Comparison
- Input amount and fiat currency, get a ranked comparison across 7 exchanges
- Total cost breakdown: trading fee + spread + FX markup + withdrawal fee
- Best rate highlighted, sorted by amount received
- Desktop table view + mobile card view

### Chain Gas Fee Comparison
- Real-time gas fee comparison across 6 chains (Ethereum, Tron, Solana, Arbitrum, Base, Polygon)
- Transfer cost in USD and native token
- Sort by cost or speed

### Remittance Calculator
- Bank wire (Wire, Western Union, Wise) vs stablecoin transfer cost comparison
- Visual savings display
- Step-by-step stablecoin remittance guide

### General
- Dark / Light mode toggle
- Mobile responsive with hamburger nav
- SEO optimized (Open Graph, sitemap, robots.txt)

## Supported Exchanges

| Exchange | Region | Supported Fiat |
|----------|--------|----------------|
| Binance | Global | USD, KRW, EUR, GBP |
| Coinbase | US | USD, KRW, EUR, GBP |
| Bybit | Global | USD, KRW, EUR, GBP |
| Kraken | US | USD, KRW, EUR, GBP |
| OKX | Global | USD, KRW, EUR, GBP |
| Upbit | Korea | KRW |
| Bithumb | Korea | KRW |

## Supported Stablecoins & Chains

- **Stablecoins**: USDT, USDC, DAI
- **Chains**: ERC-20, TRC-20, Solana, Arbitrum, Base, Polygon

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Charts**: Recharts
- **APIs**: CoinGecko (prices), Open Exchange Rates (FX), Etherscan (gas)
- **Deployment**: Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Optional — fallback data is used if not set
COINGECKO_API_KEY=
ETHERSCAN_API_KEY=
EXCHANGE_RATE_API_KEY=
```

All APIs work without keys using free tiers or built-in fallback data.

## Project Structure

```
app/
  page.tsx                 # Main comparison page
  gas/page.tsx             # Chain gas fee comparison
  remittance/page.tsx      # Remittance calculator
  about/page.tsx           # About, disclaimer, FAQ
  api/
    prices/route.ts        # CoinGecko price API
    exchange-rate/route.ts # FX rate API
    gas/route.ts           # Gas fee API
components/
  Calculator.tsx           # Amount input + selectors
  ComparisonTable.tsx      # Exchange comparison table
  CurrencySelector.tsx     # Fiat currency picker
  Nav.tsx                  # Navigation + dark mode toggle
  ui/                      # Shared UI (Card, Button, Select, Input, Badge)
lib/
  types.ts                 # TypeScript type definitions
  constants.ts             # Exchange fees, chains, currencies
  utils.ts                 # Cost calculation, formatting
```

## Disclaimer

Not financial advice. All rates and fees shown are estimates based on publicly available data. Actual costs may vary. Always verify directly on the exchange before transacting.

## License

MIT
