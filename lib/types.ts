export type FiatCurrency = "USD" | "KRW" | "EUR" | "GBP";

export type Stablecoin = "USDT" | "USDC" | "DAI";

export type Chain =
  | "ERC-20"
  | "TRC-20"
  | "SOL"
  | "Arbitrum"
  | "Base"
  | "Polygon";

export type ExchangeId =
  | "upbit"
  | "bithumb"
  | "binance"
  | "coinbase"
  | "bybit"
  | "kraken"
  | "okx";

export type RampMode = "on-ramp" | "off-ramp";

export interface ExchangeInfo {
  id: ExchangeId;
  name: string;
  country: string;
  supportedFiat: FiatCurrency[];
  supportedStablecoins: Stablecoin[];
  tradingFee: {
    maker: number;
    taker: number;
  };
  spreadEstimate: number; // percentage
  fxMarkup: number; // percentage over mid-market rate
  withdrawalFees: Partial<Record<Chain, Partial<Record<Stablecoin, number>>>>;
  depositMethods: string[];
  processingTime: string;
  referralUrl?: string;
}

export interface ExchangeQuote {
  exchangeId: ExchangeId;
  exchangeName: string;
  stablecoinPrice: number; // price of 1 stablecoin in fiat
  tradingFee: number; // absolute amount in fiat
  tradingFeePercent: number;
  spread: number; // absolute amount in fiat
  spreadPercent: number;
  fxMarkup: number; // absolute amount in fiat
  fxMarkupPercent: number;
  withdrawalFee: number; // in stablecoin units
  withdrawalFeeInFiat: number;
  totalCost: number; // absolute total cost in fiat
  totalCostPercent: number;
  amountReceived: number; // stablecoins received (on-ramp) or fiat received (off-ramp)
  isBestRate: boolean;
}

export interface ComparisonRequest {
  amount: number;
  fiatCurrency: FiatCurrency;
  stablecoin: Stablecoin;
  chain: Chain;
  mode: RampMode;
}

export interface ComparisonResult {
  request: ComparisonRequest;
  quotes: ExchangeQuote[];
  bestQuoteId: ExchangeId;
  timestamp: number;
}

export interface FiatCurrencyInfo {
  code: FiatCurrency;
  name: string;
  symbol: string;
  flag: string;
}

export interface PriceData {
  [coinId: string]: {
    [currency: string]: number;
  };
}

export interface ExchangeRateData {
  base: string;
  rates: Record<string, number>;
}
