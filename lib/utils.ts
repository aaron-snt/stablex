import type {
  ExchangeInfo,
  ExchangeQuote,
  ComparisonRequest,
  ComparisonResult,
  FiatCurrency,
  Stablecoin,
  Chain,
} from "./types";
import { EXCHANGES, FIAT_CURRENCIES } from "./constants";

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(
  amount: number,
  currency: FiatCurrency | Stablecoin
): string {
  const fiatInfo = FIAT_CURRENCIES.find((f) => f.code === currency);

  if (fiatInfo) {
    if (currency === "KRW") {
      return `${fiatInfo.symbol}${Math.round(amount).toLocaleString()}`;
    }
    return `${fiatInfo.symbol}${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  // Stablecoin
  return `${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

function getWithdrawalFee(
  exchange: ExchangeInfo,
  chain: Chain,
  stablecoin: Stablecoin
): number {
  return exchange.withdrawalFees[chain]?.[stablecoin] ?? 0;
}

export function calculateExchangeQuote(
  exchange: ExchangeInfo,
  request: ComparisonRequest,
  stablecoinPriceUsd: number,
  fxRate: number // how many units of fiatCurrency per 1 USD
): ExchangeQuote | null {
  // Check if exchange supports the fiat currency and stablecoin
  if (!exchange.supportedFiat.includes(request.fiatCurrency)) return null;
  if (!exchange.supportedStablecoins.includes(request.stablecoin)) return null;

  const { amount } = request;

  // Price of 1 stablecoin in the user's fiat currency
  const basePrice = stablecoinPriceUsd * fxRate;

  // Apply FX markup
  const fxMarkupAmount = basePrice * exchange.fxMarkup;
  const fxMarkupPercent = exchange.fxMarkup;

  // Apply spread
  const spreadAmount = basePrice * exchange.spreadEstimate;
  const spreadPercent = exchange.spreadEstimate;

  // Trading fee
  const tradingFeePercent = exchange.tradingFee.taker;
  const tradingFeeAmount = amount * tradingFeePercent;

  // Withdrawal fee (in stablecoin units)
  const withdrawalFee = getWithdrawalFee(
    exchange,
    request.chain,
    request.stablecoin
  );

  if (request.mode === "on-ramp") {
    // Fiat → Stablecoin
    // Effective price per stablecoin including spread and FX markup
    const effectivePrice = basePrice + fxMarkupAmount + spreadAmount;

    // Amount after trading fee
    const amountAfterFee = amount - tradingFeeAmount;

    // Stablecoins bought
    const stablecoinsBought = amountAfterFee / effectivePrice;

    // Stablecoins received after withdrawal fee
    const amountReceived = stablecoinsBought - withdrawalFee;

    // Withdrawal fee in fiat
    const withdrawalFeeInFiat = withdrawalFee * effectivePrice;

    // Total cost in fiat
    const totalCost =
      tradingFeeAmount +
      (fxMarkupAmount + spreadAmount) * stablecoinsBought +
      withdrawalFeeInFiat;
    const totalCostPercent = totalCost / amount;

    return {
      exchangeId: exchange.id,
      exchangeName: exchange.name,
      stablecoinPrice: effectivePrice,
      tradingFee: tradingFeeAmount,
      tradingFeePercent,
      spread: spreadAmount * stablecoinsBought,
      spreadPercent,
      fxMarkup: fxMarkupAmount * stablecoinsBought,
      fxMarkupPercent,
      withdrawalFee,
      withdrawalFeeInFiat,
      totalCost,
      totalCostPercent,
      amountReceived: Math.max(0, amountReceived),
      isBestRate: false,
    };
  } else {
    // Stablecoin → Fiat (off-ramp)
    // The input amount is in stablecoins
    const stablecoinAmount = amount;

    // Effective price with spread and FX markup deducted
    const effectivePrice = basePrice - fxMarkupAmount - spreadAmount;

    // Gross fiat amount
    const grossFiat = stablecoinAmount * effectivePrice;

    // Trading fee
    const tradingFee = grossFiat * tradingFeePercent;

    // Net fiat received
    const amountReceived = grossFiat - tradingFee;

    // Total cost
    const totalCost =
      tradingFee +
      (fxMarkupAmount + spreadAmount) * stablecoinAmount;
    const totalCostPercent = totalCost / (stablecoinAmount * basePrice);

    return {
      exchangeId: exchange.id,
      exchangeName: exchange.name,
      stablecoinPrice: effectivePrice,
      tradingFee,
      tradingFeePercent,
      spread: spreadAmount * stablecoinAmount,
      spreadPercent,
      fxMarkup: fxMarkupAmount * stablecoinAmount,
      fxMarkupPercent,
      withdrawalFee: 0,
      withdrawalFeeInFiat: 0,
      totalCost,
      totalCostPercent,
      amountReceived: Math.max(0, amountReceived),
      isBestRate: false,
    };
  }
}

export function calculateComparison(
  request: ComparisonRequest,
  stablecoinPriceUsd: number,
  fxRate: number
): ComparisonResult {
  const quotes: ExchangeQuote[] = [];

  for (const exchange of EXCHANGES) {
    const quote = calculateExchangeQuote(
      exchange,
      request,
      stablecoinPriceUsd,
      fxRate
    );
    if (quote) {
      quotes.push(quote);
    }
  }

  // Sort by amount received (descending for on-ramp, ascending for off-ramp inverted)
  if (request.mode === "on-ramp") {
    quotes.sort((a, b) => b.amountReceived - a.amountReceived);
  } else {
    quotes.sort((a, b) => b.amountReceived - a.amountReceived);
  }

  // Mark best rate
  if (quotes.length > 0) {
    quotes[0].isBestRate = true;
  }

  return {
    request,
    quotes,
    bestQuoteId: quotes[0]?.exchangeId ?? "binance",
    timestamp: Date.now(),
  };
}
