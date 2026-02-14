"use client";

import { useMemo } from "react";
import { ExternalLink, Trophy, Clock, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatPercent, cn } from "@/lib/utils";
import { EXCHANGES } from "@/lib/constants";
import type { ExchangeQuote, FiatCurrency, Stablecoin, RampMode } from "@/lib/types";

interface ComparisonTableProps {
  quotes: ExchangeQuote[];
  fiatCurrency: FiatCurrency;
  stablecoin: Stablecoin;
  mode: RampMode;
  loading?: boolean;
}

export function ComparisonTable({
  quotes,
  fiatCurrency,
  stablecoin,
  mode,
  loading,
}: ComparisonTableProps) {
  const exchangeMap = useMemo(() => {
    const map = new Map<string, (typeof EXCHANGES)[number]>();
    for (const ex of EXCHANGES) {
      map.set(ex.id, ex);
    }
    return map;
  }, []);

  if (loading) {
    return (
      <Card className="mt-6">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <span className="ml-3 text-gray-500 dark:text-gray-400">
            Comparing rates...
          </span>
        </div>
      </Card>
    );
  }

  if (quotes.length === 0) {
    return (
      <Card className="mt-6">
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
          No exchanges available for this currency pair.
        </div>
      </Card>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
                    Exchange
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-400">
                    Price
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-400">
                    Trading Fee
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-400">
                    Spread
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-400">
                    FX Markup
                  </th>
                  {mode === "on-ramp" && (
                    <th className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-400">
                      Withdrawal Fee
                    </th>
                  )}
                  <th className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-400">
                    Total Cost
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-400">
                    {mode === "on-ramp" ? "You Receive" : "You Receive"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((quote) => {
                  const exchange = exchangeMap.get(quote.exchangeId);
                  return (
                    <tr
                      key={quote.exchangeId}
                      className={cn(
                        "border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50",
                        quote.isBestRate &&
                          "bg-green-50/50 dark:bg-green-950/20"
                      )}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {quote.exchangeName}
                          </span>
                          {quote.isBestRate && (
                            <Badge variant="success">
                              <Trophy className="mr-1 h-3 w-3" />
                              Best
                            </Badge>
                          )}
                        </div>
                        <div className="mt-0.5 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          {exchange && (
                            <>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {exchange.processingTime}
                              </span>
                              <span className="flex items-center gap-1">
                                <CreditCard className="h-3 w-3" />
                                {exchange.depositMethods[0]}
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right text-gray-700 dark:text-gray-300">
                        {formatCurrency(quote.stablecoinPrice, fiatCurrency)}
                      </td>
                      <td className="px-4 py-4 text-right text-gray-700 dark:text-gray-300">
                        <div>{formatCurrency(quote.tradingFee, fiatCurrency)}</div>
                        <div className="text-xs text-gray-400">
                          {formatPercent(quote.tradingFeePercent)}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right text-gray-700 dark:text-gray-300">
                        <div>{formatCurrency(quote.spread, fiatCurrency)}</div>
                        <div className="text-xs text-gray-400">
                          {formatPercent(quote.spreadPercent)}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right text-gray-700 dark:text-gray-300">
                        <div>{formatCurrency(quote.fxMarkup, fiatCurrency)}</div>
                        <div className="text-xs text-gray-400">
                          {formatPercent(quote.fxMarkupPercent)}
                        </div>
                      </td>
                      {mode === "on-ramp" && (
                        <td className="px-4 py-4 text-right text-gray-700 dark:text-gray-300">
                          <div>
                            {quote.withdrawalFee > 0
                              ? `${quote.withdrawalFee} ${stablecoin}`
                              : "Free"}
                          </div>
                          {quote.withdrawalFee > 0 && (
                            <div className="text-xs text-gray-400">
                              ~{formatCurrency(quote.withdrawalFeeInFiat, fiatCurrency)}
                            </div>
                          )}
                        </td>
                      )}
                      <td className="px-4 py-4 text-right">
                        <div className="font-medium text-red-600 dark:text-red-400">
                          -{formatCurrency(quote.totalCost, fiatCurrency)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatPercent(quote.totalCostPercent)}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div
                          className={cn(
                            "text-lg font-bold",
                            quote.isBestRate
                              ? "text-green-600 dark:text-green-400"
                              : "text-gray-900 dark:text-white"
                          )}
                        >
                          {mode === "on-ramp"
                            ? formatCurrency(quote.amountReceived, stablecoin)
                            : formatCurrency(quote.amountReceived, fiatCurrency)}
                        </div>
                        {exchange?.referralUrl && (
                          <a
                            href={exchange.referralUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-blue-400"
                          >
                            Trade <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="space-y-3 md:hidden">
        {quotes.map((quote) => {
          const exchange = exchangeMap.get(quote.exchangeId);
          return (
            <Card
              key={quote.exchangeId}
              className={cn(
                quote.isBestRate &&
                  "border-green-300 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold text-gray-900 dark:text-white">
                    {quote.exchangeName}
                  </span>
                  {quote.isBestRate && (
                    <Badge variant="success">
                      <Trophy className="mr-1 h-3 w-3" />
                      Best
                    </Badge>
                  )}
                </div>
                <div
                  className={cn(
                    "text-right text-lg font-bold",
                    quote.isBestRate
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-900 dark:text-white"
                  )}
                >
                  {mode === "on-ramp"
                    ? formatCurrency(quote.amountReceived, stablecoin)
                    : formatCurrency(quote.amountReceived, fiatCurrency)}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Trading Fee
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {formatPercent(quote.tradingFeePercent)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Spread
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {formatPercent(quote.spreadPercent)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    FX Markup
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {formatPercent(quote.fxMarkupPercent)}
                  </span>
                </div>
                {mode === "on-ramp" && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Withdrawal
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {quote.withdrawalFee > 0
                        ? `${quote.withdrawalFee} ${stablecoin}`
                        : "Free"}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Total Cost:{" "}
                  </span>
                  <span className="font-medium text-red-600 dark:text-red-400">
                    -{formatCurrency(quote.totalCost, fiatCurrency)} (
                    {formatPercent(quote.totalCostPercent)})
                  </span>
                </div>
                {exchange && (
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    {exchange.processingTime}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
