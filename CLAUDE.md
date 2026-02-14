# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A web service that helps users find the cheapest and fastest routes to buy and sell stablecoins (USDT, USDC, DAI, etc.).
Compares the **true total cost** (fees + spread + FX markup + gas fees) across exchanges in one view.

- **Project Name Candidates**: CoinRamp / CoinRadar / CoinRoute
- **Service Type**: Web (mobile-responsive) → Future iOS app expansion
- **Target**: Global users (supporting KRW, USD, EUR, GBP, JPY, etc.)
- **UI Language**: English (all text, labels, and content in English)

---

## Tech Stack

### Frontend
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts or Chart.js
- **State Management**: React built-in (useState, useContext) — Zustand if complexity grows

### Backend / API
- **Serverless**: Next.js API Routes or Vercel Edge Functions
- **Database**: Supabase (PostgreSQL) or Firebase Firestore
- **Caching**: Redis (Upstash free tier) — minimize API calls

### External APIs (Free Tiers)
- **Exchange Prices**: CoinGecko API (free)
- **FX Rates**: ExchangeRate API or Open Exchange Rates
- **Gas Fees**: Etherscan API, Tronscan API, Solscan API (free)
- **Exchange Fees**: Official exchange APIs or manually maintained data

### Deployment
- **Hosting**: Vercel (free tier)
- **Domain**: TBD
- **Analytics**: Google Analytics or Vercel Analytics

---

## Core Features

### 1. On-Ramp Comparison (Fiat → Stablecoin)
- User inputs amount and fiat currency (e.g., $1,000 USD or ₩1,000,000 KRW)
- Compare actual stablecoin amount received across exchanges
- Total cost = trading fee + spread + FX markup + withdrawal fee
- Sort by: best rate (most stablecoins received)

### 2. Off-Ramp Comparison (Stablecoin → Fiat)
- User inputs stablecoin amount (e.g., 1,000 USDT)
- Compare actual fiat amount received across exchanges
- Total cost included

### 3. Chain Gas Fee Comparison
- Compare transfer costs across chains: ERC-20, TRC-20, SOL, Arbitrum, Base, Polygon, etc.
- Real-time gas fee tracking

### 4. Remittance Calculator
- Traditional bank wire vs stablecoin transfer cost comparison
- Visual savings display

### 5. (Future) Price Alerts
- Email/Telegram notifications when fees drop below threshold

---

## Supported Exchanges (Initial MVP)

### Korean Exchanges
- Upbit
- Bithumb

### Global Exchanges
- Binance
- Coinbase
- Bybit
- Kraken
- OKX

### Comparison Criteria
| Criteria | Description |
|----------|-------------|
| Trading Fee | Maker/taker fees |
| Spread | Bid/ask price difference |
| FX Markup | Applied rate vs market rate |
| Withdrawal Fee | Per-chain withdrawal cost |
| Deposit Methods | Bank transfer, card, etc. |
| Processing Time | Estimated deposit-to-withdrawal time |

---

## Supported Fiat Currencies (MVP)

| Currency | Code | Priority |
|----------|------|----------|
| US Dollar | USD | High |
| Korean Won | KRW | High |
| Euro | EUR | Medium |
| British Pound | GBP | Medium |
| Japanese Yen | JPY | Low |

User selects their local currency → comparison results shown in that currency.

---

## Revenue Model

1. **Exchange Referrals (Primary)**: Earn referral commission when users click through to exchanges
2. **Premium Subscription ($2.99–4.99/mo)**: Real-time alerts, detailed analytics, ad-free
3. **Display Ads**: Crypto-related banner ads (supplementary revenue)

---

## Project Structure

```
/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main page (on/off-ramp comparison)
│   ├── gas/
│   │   └── page.tsx            # Chain gas fee comparison
│   ├── remittance/
│   │   └── page.tsx            # Remittance calculator
│   ├── about/
│   │   └── page.tsx            # About & disclaimer
│   └── api/
│       ├── prices/
│       │   └── route.ts        # Exchange price API
│       ├── gas/
│       │   └── route.ts        # Gas fee API
│       └── exchange-rate/
│           └── route.ts        # FX rate API
├── components/
│   ├── ui/                     # Shared UI components
│   ├── ComparisonTable.tsx     # Exchange comparison table
│   ├── Calculator.tsx          # Amount input calculator
│   ├── CurrencySelector.tsx    # Fiat currency selector
│   ├── ChainGasCard.tsx        # Per-chain gas fee card
│   └── SavingsChart.tsx        # Savings visualization chart
├── lib/
│   ├── api/
│   │   ├── coingecko.ts        # CoinGecko API client
│   │   ├── exchangeRate.ts     # FX rate API client
│   │   └── gasTracker.ts       # Gas fee API client
│   ├── constants.ts            # Exchange fees, chain data, etc.
│   ├── types.ts                # TypeScript type definitions
│   └── utils.ts                # Utility functions (cost calculations)
├── public/
│   └── images/                 # Exchange logos, icons
├── CLAUDE.md                   # This file
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Coding Rules

### General
- TypeScript strict mode enabled
- Functional components + React Hooks only
- File naming: PascalCase (components), camelCase (utils/API)
- **All UI text, labels, buttons, and content must be in English**
- Use constants file for all static text (future i18n ready)

### Styling
- Tailwind CSS utility-first approach
- Dark mode support (dark: prefix)
- Mobile-first responsive design
- Consistent color palette: define in tailwind.config.ts

### API
- All external API calls must be server-side (API Routes) — never expose keys to client
- Caching strategy: prices 30s, gas fees 15s, FX rates 5min
- Error handling: try-catch + user-friendly error messages
- Rate limiting: respect free tier limits, implement fallback

### Performance
- Prevent unnecessary re-renders (memo, useMemo, useCallback)
- Minimize API calls (caching + debouncing)
- Image optimization (next/image)
- Lazy load below-the-fold content

---

## Environment Variables

```env
# API Keys
COINGECKO_API_KEY=              # CoinGecko (free tier may not need key)
ETHERSCAN_API_KEY=              # Etherscan gas tracker
EXCHANGE_RATE_API_KEY=          # FX rate provider

# Database
SUPABASE_URL=
SUPABASE_ANON_KEY=

# Analytics
NEXT_PUBLIC_GA_ID=

# Referral Links
UPBIT_REFERRAL=
BINANCE_REFERRAL=
COINBASE_REFERRAL=
BYBIT_REFERRAL=
BITHUMB_REFERRAL=
KRAKEN_REFERRAL=
OKX_REFERRAL=
```

---

## Development Roadmap

### Phase 1: MVP (2 weeks)
- [ ] Project setup (Next.js + Tailwind + TypeScript)
- [ ] Main UI: amount input → exchange comparison table
- [ ] CoinGecko API integration (price data)
- [ ] FX rate API integration (multi-currency)
- [ ] Exchange fee data (initially hardcoded)
- [ ] Fiat currency selector (USD, KRW, EUR, GBP)
- [ ] Mobile responsive
- [ ] Deploy to Vercel

### Phase 2: Feature Expansion (2 weeks)
- [ ] Chain gas fee comparison page
- [ ] Remittance calculator page
- [ ] Referral link integration
- [ ] SEO optimization (meta tags, sitemap, OG images)
- [ ] Google Analytics setup
- [ ] About page with disclaimer

### Phase 3: Monetization (2 weeks)
- [ ] Premium subscription (Stripe integration)
- [ ] Email/Telegram alerts
- [ ] User favorites / saved comparisons
- [ ] Blog / content section (SEO traffic)

### Phase 4: Scale
- [ ] iOS app (React Native or Swift)
- [ ] More exchanges and fiat currencies
- [ ] DeFi protocol comparison (Aave, Compound, etc.)
- [ ] API for B2B partners
- [ ] KRW stablecoin support (when Korean regulation allows)

---

## Regulatory Notes

- **CLARITY Act (US)**: Stablecoin interest payment prohibition under debate. On/off-ramp comparison is unrelated to yield, so regulatory risk is low.
- **Korea Digital Asset Basic Act**: KRW stablecoin legislation in progress. Future expansion opportunity when KRW stablecoin launches.
- **MiCA (EU)**: Stablecoin regulation framework in effect. Ensure compliance for EU users.
- **Disclaimer**: Must include "Not financial advice" disclaimer on all pages.
- **Referral Disclosure**: Transparently disclose referral revenue to users.

---

## Design Principles

- **Clarity**: Users should understand the total cost within 3 seconds
- **Trust**: Show data sources, last updated time, and calculation methodology
- **Speed**: Page load under 2 seconds, comparison results under 1 second
- **Simplicity**: Minimal clicks to get comparison results
- **Transparency**: Always show how total cost is calculated (breakdown view)

---

## Reference Resources

- [CoinGecko API Docs](https://docs.coingecko.com/)
- [Etherscan API Docs](https://docs.etherscan.io/)
- [ExchangeRate API](https://www.exchangerate-api.com/)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Stripe Subscriptions](https://stripe.com/docs/billing/subscriptions)
