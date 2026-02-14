"use client";

import { useCallback } from "react";
import { ArrowRightLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { CurrencySelector } from "@/components/CurrencySelector";
import { STABLECOINS, CHAINS, FIAT_CURRENCIES } from "@/lib/constants";
import type { FiatCurrency, Stablecoin, Chain, RampMode } from "@/lib/types";

interface CalculatorProps {
  amount: number;
  fiatCurrency: FiatCurrency;
  stablecoin: Stablecoin;
  chain: Chain;
  mode: RampMode;
  onAmountChange: (amount: number) => void;
  onFiatCurrencyChange: (currency: FiatCurrency) => void;
  onStablecoinChange: (stablecoin: Stablecoin) => void;
  onChainChange: (chain: Chain) => void;
  onModeChange: (mode: RampMode) => void;
}

export function Calculator({
  amount,
  fiatCurrency,
  stablecoin,
  chain,
  mode,
  onAmountChange,
  onFiatCurrencyChange,
  onStablecoinChange,
  onChainChange,
  onModeChange,
}: CalculatorProps) {
  const currencySymbol =
    FIAT_CURRENCIES.find((f) => f.code === fiatCurrency)?.symbol ?? "$";

  const toggleMode = useCallback(() => {
    onModeChange(mode === "on-ramp" ? "off-ramp" : "on-ramp");
  }, [mode, onModeChange]);

  return (
    <Card>
      {/* Mode Toggle */}
      <div className="mb-6 flex items-center gap-3">
        <Button
          variant={mode === "on-ramp" ? "primary" : "secondary"}
          size="md"
          onClick={() => onModeChange("on-ramp")}
        >
          Buy (Fiat → Stablecoin)
        </Button>
        <button
          onClick={toggleMode}
          className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          aria-label="Toggle mode"
        >
          <ArrowRightLeft className="h-4 w-4" />
        </button>
        <Button
          variant={mode === "off-ramp" ? "primary" : "secondary"}
          size="md"
          onClick={() => onModeChange("off-ramp")}
        >
          Sell (Stablecoin → Fiat)
        </Button>
      </div>

      {/* Currency Selection */}
      <div className="mb-5">
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Fiat Currency
        </label>
        <CurrencySelector
          value={fiatCurrency}
          onChange={onFiatCurrencyChange}
        />
      </div>

      {/* Amount Input */}
      <div className="mb-5">
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {mode === "on-ramp" ? "You Pay" : "You Send"}
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
            {mode === "on-ramp" ? currencySymbol : ""}
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 bg-white py-3 text-lg font-semibold text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            style={{ paddingLeft: mode === "on-ramp" ? "1.75rem" : "0.75rem" }}
            min={0}
          />
          {mode === "off-ramp" && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
              {stablecoin}
            </span>
          )}
        </div>
      </div>

      {/* Stablecoin & Chain Selectors */}
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Stablecoin"
          value={stablecoin}
          onChange={(e) => onStablecoinChange(e.target.value as Stablecoin)}
          options={STABLECOINS.map((s) => ({
            value: s.id,
            label: `${s.id} (${s.name})`,
          }))}
        />
        <Select
          label="Withdrawal Chain"
          value={chain}
          onChange={(e) => onChainChange(e.target.value as Chain)}
          options={CHAINS.map((c) => ({
            value: c.id,
            label: c.name,
          }))}
        />
      </div>
    </Card>
  );
}
