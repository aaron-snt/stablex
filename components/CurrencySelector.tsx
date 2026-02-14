"use client";

import { FIAT_CURRENCIES } from "@/lib/constants";
import type { FiatCurrency } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CurrencySelectorProps {
  value: FiatCurrency;
  onChange: (currency: FiatCurrency) => void;
}

export function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  return (
    <div className="flex gap-2">
      {FIAT_CURRENCIES.map((currency) => (
        <button
          key={currency.code}
          onClick={() => onChange(currency.code)}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
            value === currency.code
              ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-300"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-600"
          )}
        >
          <span>{currency.flag}</span>
          <span>{currency.code}</span>
        </button>
      ))}
    </div>
  );
}
