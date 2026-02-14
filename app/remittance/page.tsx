"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Building2,
  Coins,
  ArrowRight,
  TrendingDown,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { CurrencySelector } from "@/components/CurrencySelector";
import { cn } from "@/lib/utils";
import { FIAT_CURRENCIES, DEFAULT_AMOUNT } from "@/lib/constants";
import type { FiatCurrency, ExchangeRateData } from "@/lib/types";

interface BankFee {
  provider: string;
  sendFee: number;
  fxMarkupPercent: number;
  receiveFee: number;
  speed: string;
}

const BANK_FEES: Record<string, BankFee[]> = {
  USD: [
    { provider: "Wire Transfer (Bank)", sendFee: 30, fxMarkupPercent: 0.03, receiveFee: 15, speed: "1-3 business days" },
    { provider: "Western Union", sendFee: 8, fxMarkupPercent: 0.04, receiveFee: 0, speed: "Minutes - 1 day" },
    { provider: "Wise (TransferWise)", sendFee: 5, fxMarkupPercent: 0.005, receiveFee: 0, speed: "1-2 business days" },
  ],
  KRW: [
    { provider: "Bank Wire (Korea)", sendFee: 20000, fxMarkupPercent: 0.025, receiveFee: 10000, speed: "1-3 business days" },
    { provider: "Western Union", sendFee: 10000, fxMarkupPercent: 0.04, receiveFee: 0, speed: "Minutes - 1 day" },
    { provider: "Wise (TransferWise)", sendFee: 3000, fxMarkupPercent: 0.005, receiveFee: 0, speed: "1-2 business days" },
  ],
  EUR: [
    { provider: "SEPA Transfer (Bank)", sendFee: 5, fxMarkupPercent: 0.025, receiveFee: 5, speed: "1-2 business days" },
    { provider: "Western Union", sendFee: 6, fxMarkupPercent: 0.04, receiveFee: 0, speed: "Minutes - 1 day" },
    { provider: "Wise (TransferWise)", sendFee: 3, fxMarkupPercent: 0.005, receiveFee: 0, speed: "1-2 business days" },
  ],
  GBP: [
    { provider: "Wire Transfer (Bank)", sendFee: 25, fxMarkupPercent: 0.03, receiveFee: 10, speed: "1-3 business days" },
    { provider: "Western Union", sendFee: 5, fxMarkupPercent: 0.04, receiveFee: 0, speed: "Minutes - 1 day" },
    { provider: "Wise (TransferWise)", sendFee: 3, fxMarkupPercent: 0.005, receiveFee: 0, speed: "1-2 business days" },
  ],
};

const CRYPTO_ROUTE = {
  buyFeePercent: 0.001,
  gasFeeUsd: 0.5,
  sellFeePercent: 0.001,
  speed: "10-30 minutes",
};

export default function RemittancePage() {
  const [amount, setAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState<FiatCurrency>("USD");
  const [toCurrency, setToCurrency] = useState<FiatCurrency>("KRW");
  const [fxRates, setFxRates] = useState<ExchangeRateData | null>(null);

  const fetchRates = useCallback(async () => {
    try {
      const res = await fetch("/api/exchange-rate");
      const data = await res.json();
      setFxRates(data);
    } catch {
      setFxRates({ base: "USD", rates: { USD: 1, KRW: 1350, EUR: 0.92, GBP: 0.79 } });
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const handleFromChange = (c: FiatCurrency) => {
    setFromCurrency(c);
    setAmount(DEFAULT_AMOUNT[c] ?? 1000);
    if (c === toCurrency) {
      const other = FIAT_CURRENCIES.find((f) => f.code !== c);
      if (other) setToCurrency(other.code);
    }
  };

  const currencySymbol =
    FIAT_CURRENCIES.find((f) => f.code === fromCurrency)?.symbol ?? "$";

  const toSymbol =
    FIAT_CURRENCIES.find((f) => f.code === toCurrency)?.symbol ?? "$";

  const midMarketRate = useMemo(() => {
    if (!fxRates) return 1;
    const fromUsd = fxRates.rates[fromCurrency] ?? 1;
    const toUsd = fxRates.rates[toCurrency] ?? 1;
    return toUsd / fromUsd;
  }, [fxRates, fromCurrency, toCurrency]);

  const bankResults = useMemo(() => {
    const fees = BANK_FEES[fromCurrency] ?? BANK_FEES.USD;
    return fees.map((bank) => {
      const fxMarkupCost = amount * bank.fxMarkupPercent;
      const totalFee = bank.sendFee + fxMarkupCost + bank.receiveFee;
      const effectiveAmount = amount - totalFee;
      const received = effectiveAmount * midMarketRate;
      return { ...bank, totalFee, received };
    });
  }, [amount, fromCurrency, midMarketRate]);

  const cryptoResult = useMemo(() => {
    const fromRate = fxRates?.rates[fromCurrency] ?? 1;
    const gasFeeLocal = CRYPTO_ROUTE.gasFeeUsd * fromRate;
    const buyFee = amount * CRYPTO_ROUTE.buyFeePercent;
    const sellFee = amount * CRYPTO_ROUTE.sellFeePercent;
    const totalFee = buyFee + gasFeeLocal + sellFee;
    const effectiveAmount = amount - totalFee;
    const received = effectiveAmount * midMarketRate;
    return { totalFee, received, gasFeeLocal, buyFee, sellFee };
  }, [amount, fromCurrency, midMarketRate, fxRates]);

  const bestBank = bankResults.reduce(
    (best, b) => (b.received > best.received ? b : best),
    bankResults[0]
  );

  const savings = cryptoResult.received - (bestBank?.received ?? 0);

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Remittance Calculator
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
          Compare traditional bank transfers vs stablecoin remittance — see how
          much you can save.
        </p>
      </div>

      {/* Input Section */}
      <Card className="mb-6">
        <div className="mb-5">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Sending From
          </label>
          <CurrencySelector value={fromCurrency} onChange={handleFromChange} />
        </div>

        <div className="mb-5">
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              {currencySymbol}
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-7 text-lg font-semibold text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              min={0}
            />
          </div>
        </div>

        <Select
          label="Sending To"
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value as FiatCurrency)}
          options={FIAT_CURRENCIES.filter((f) => f.code !== fromCurrency).map(
            (f) => ({ value: f.code, label: `${f.flag} ${f.code} — ${f.name}` })
          )}
        />

        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Mid-market rate: 1 {fromCurrency} = {midMarketRate.toFixed(fromCurrency === "KRW" || toCurrency === "KRW" ? 2 : 4)} {toCurrency}
        </div>
      </Card>

      {/* Results */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Traditional */}
        <div>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Building2 className="h-5 w-5 text-gray-400" />
            Traditional Transfer
          </h2>
          <div className="space-y-3">
            {bankResults.map((b) => (
              <Card key={b.provider} className="p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {b.provider}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    {b.speed}
                  </span>
                </div>
                <div className="mt-2 flex items-end justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Fee: {currencySymbol}
                    {b.totalFee.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {toSymbol}
                    {b.received.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Crypto */}
        <div>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Coins className="h-5 w-5 text-blue-500" />
            Stablecoin Transfer
          </h2>
          <Card className="border-blue-300 bg-blue-50/30 p-4 dark:border-blue-800 dark:bg-blue-950/20">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900 dark:text-white">
                Buy USDT → Send → Sell
              </span>
              <span className="flex items-center gap-1 text-xs text-blue-500">
                <Clock className="h-3 w-3" />
                {CRYPTO_ROUTE.speed}
              </span>
            </div>

            <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Buy fee (0.1%)</span>
                <span>
                  {currencySymbol}
                  {cryptoResult.buyFee.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Gas fee (TRC-20)</span>
                <span>
                  {currencySymbol}
                  {cryptoResult.gasFeeLocal.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Sell fee (0.1%)</span>
                <span>
                  {currencySymbol}
                  {cryptoResult.sellFee.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-1 font-medium text-gray-900 dark:border-gray-700 dark:text-white">
                <span>Total fee</span>
                <span>
                  {currencySymbol}
                  {cryptoResult.totalFee.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Recipient receives
              </span>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {toSymbol}
                {cryptoResult.received.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
          </Card>

          {/* Savings */}
          {savings > 0 && (
            <Card className="mt-4 border-green-300 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/30">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="font-semibold text-green-700 dark:text-green-300">
                  You save {toSymbol}
                  {savings.toLocaleString(undefined, { maximumFractionDigits: 0 })} vs{" "}
                  {bestBank?.provider}
                </span>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* How it works */}
      <Card className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          How Stablecoin Remittance Works
        </h2>
        <div className="grid gap-4 text-sm md:grid-cols-4">
          {[
            { step: "1", title: "Buy Stablecoin", desc: "Buy USDT/USDC on a local exchange using your fiat currency." },
            { step: "2", title: "Send On-chain", desc: "Transfer stablecoins to the recipient's exchange wallet via a low-cost chain (e.g. TRC-20)." },
            { step: "3", title: "Sell Stablecoin", desc: "Recipient sells stablecoins for their local fiat currency." },
            { step: "4", title: "Withdraw Fiat", desc: "Recipient withdraws fiat to their bank account." },
          ].map((s, i) => (
            <div key={s.step} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                {s.step}
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {s.title}
                </div>
                <p className="mt-0.5 text-gray-500 dark:text-gray-400">
                  {s.desc}
                </p>
              </div>
              {i < 3 && (
                <ArrowRight className="mt-1.5 hidden h-4 w-4 shrink-0 text-gray-300 dark:text-gray-600 md:block" />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Benefits */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { icon: TrendingDown, title: "Lower Fees", desc: "Typically 50-90% cheaper than traditional bank wire transfers." },
          { icon: Clock, title: "Faster", desc: "Settle in minutes, not days. No business hours restrictions." },
          { icon: CheckCircle2, title: "Transparent", desc: "Know the exact cost upfront. No hidden charges or surprise FX markups." },
        ].map((b) => (
          <Card key={b.title} className="p-4 text-center">
            <b.icon className="mx-auto mb-2 h-6 w-6 text-blue-500" />
            <h3 className="font-medium text-gray-900 dark:text-white">
              {b.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {b.desc}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
