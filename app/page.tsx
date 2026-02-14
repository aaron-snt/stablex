"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { RefreshCw, TrendingDown, Shield, Zap } from "lucide-react";
import { Calculator } from "@/components/Calculator";
import { ComparisonTable } from "@/components/ComparisonTable";
import { STABLECOINS, DEFAULT_AMOUNT } from "@/lib/constants";
import { calculateComparison } from "@/lib/utils";
import type {
  FiatCurrency,
  Stablecoin,
  Chain,
  RampMode,
  ComparisonResult,
  PriceData,
  ExchangeRateData,
} from "@/lib/types";

export default function Home() {
  const [amount, setAmount] = useState(1000);
  const [fiatCurrency, setFiatCurrency] = useState<FiatCurrency>("USD");
  const [stablecoin, setStablecoin] = useState<Stablecoin>("USDT");
  const [chain, setChain] = useState<Chain>("TRC-20");
  const [mode, setMode] = useState<RampMode>("on-ramp");

  const [prices, setPrices] = useState<PriceData | null>(null);
  const [fxRates, setFxRates] = useState<ExchangeRateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [pricesRes, fxRes] = await Promise.all([
        fetch("/api/prices"),
        fetch("/api/exchange-rate"),
      ]);
      const pricesData = await pricesRes.json();
      const fxData = await fxRes.json();
      setPrices(pricesData);
      setFxRates(fxData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch data:", err);
      // Use fallback data
      setPrices({
        tether: { usd: 1.0 },
        "usd-coin": { usd: 1.0 },
        dai: { usd: 1.0 },
      });
      setFxRates({
        base: "USD",
        rates: { USD: 1, KRW: 1350, EUR: 0.92, GBP: 0.79 },
      });
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Update default amount when currency changes
  const handleCurrencyChange = useCallback((currency: FiatCurrency) => {
    setFiatCurrency(currency);
    setAmount(DEFAULT_AMOUNT[currency] ?? 1000);
  }, []);

  const comparison: ComparisonResult | null = useMemo(() => {
    if (!prices || !fxRates || amount <= 0) return null;

    const coinInfo = STABLECOINS.find((s) => s.id === stablecoin);
    const coingeckoId = coinInfo?.coingeckoId ?? "tether";
    const stablecoinPriceUsd = prices[coingeckoId]?.usd ?? 1.0;
    const fxRate = fxRates.rates[fiatCurrency] ?? 1;

    return calculateComparison(
      { amount, fiatCurrency, stablecoin, chain, mode },
      stablecoinPriceUsd,
      fxRate
    );
  }, [prices, fxRates, amount, fiatCurrency, stablecoin, chain, mode]);

  return (
    <div>
      {/* Hero */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Find the Cheapest Stablecoin Rates
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
          Compare the true total cost across exchanges — fees, spread, FX
          markup, and gas in one view.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <TrendingDown className="h-4 w-4 text-green-500" />
            Lowest fees
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-yellow-500" />
            Real-time rates
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-blue-500" />
            Transparent costs
          </span>
        </div>
      </div>

      {/* Calculator */}
      <Calculator
        amount={amount}
        fiatCurrency={fiatCurrency}
        stablecoin={stablecoin}
        chain={chain}
        mode={mode}
        onAmountChange={setAmount}
        onFiatCurrencyChange={handleCurrencyChange}
        onStablecoinChange={setStablecoin}
        onChainChange={setChain}
        onModeChange={setMode}
      />

      {/* Last Updated & Refresh */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
        <span>
          {lastUpdated
            ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
            : "Loading..."}
        </span>
        <button
          onClick={fetchData}
          className="flex items-center gap-1 rounded px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800"
          disabled={loading}
        >
          <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Comparison Results */}
      <ComparisonTable
        quotes={comparison?.quotes ?? []}
        fiatCurrency={fiatCurrency}
        stablecoin={stablecoin}
        mode={mode}
        loading={loading}
      />

      {/* How It Works */}
      <div className="mt-12 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          How We Calculate Total Cost
        </h2>
        <div className="grid gap-4 text-sm text-gray-600 dark:text-gray-400 md:grid-cols-4">
          <div>
            <h3 className="mb-1 font-medium text-gray-900 dark:text-white">
              Trading Fee
            </h3>
            <p>
              The maker/taker fee charged by the exchange for executing your
              trade.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-medium text-gray-900 dark:text-white">
              Spread
            </h3>
            <p>
              The difference between the bid and ask price — the hidden cost in
              every trade.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-medium text-gray-900 dark:text-white">
              FX Markup
            </h3>
            <p>
              The difference between the exchange&apos;s rate and the mid-market
              rate.
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-medium text-gray-900 dark:text-white">
              Withdrawal Fee
            </h3>
            <p>
              The fee to withdraw your stablecoins to your wallet, varies by
              chain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
