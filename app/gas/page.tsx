"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Fuel,
  RefreshCw,
  Zap,
  Clock,
  ArrowUpDown,
  CircleDollarSign,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface GasFeeData {
  chain: string;
  chainId: string;
  nativeToken: string;
  gasPrice: string;
  transferCostUsd: number;
  transferCostNative: number;
  speed: string;
  avgConfirmTime: string;
}

type SortKey = "cost" | "speed";

function getSpeedRank(speed: string): number {
  switch (speed) {
    case "Very Fast":
      return 1;
    case "Fast":
      return 2;
    case "Medium":
      return 3;
    case "Slow":
      return 4;
    default:
      return 5;
  }
}

function getSpeedColor(speed: string): string {
  switch (speed) {
    case "Very Fast":
      return "text-green-500 dark:text-green-400";
    case "Fast":
      return "text-blue-500 dark:text-blue-400";
    case "Medium":
      return "text-yellow-500 dark:text-yellow-400";
    case "Slow":
      return "text-red-500 dark:text-red-400";
    default:
      return "text-gray-500";
  }
}

function getCostBar(cost: number, maxCost: number): number {
  if (maxCost === 0) return 0;
  return Math.min((cost / maxCost) * 100, 100);
}

export default function GasPage() {
  const [gasData, setGasData] = useState<GasFeeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>("cost");

  const fetchGas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gas");
      const json = await res.json();
      setGasData(json.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch gas data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGas();
    const interval = setInterval(fetchGas, 15000);
    return () => clearInterval(interval);
  }, [fetchGas]);

  const sorted = [...gasData].sort((a, b) => {
    if (sortBy === "cost") return a.transferCostUsd - b.transferCostUsd;
    return getSpeedRank(a.speed) - getSpeedRank(b.speed);
  });

  const maxCost =
    gasData.length > 0
      ? Math.max(...gasData.map((d) => d.transferCostUsd))
      : 1;

  const cheapest = sorted.length > 0 ? sorted[0] : null;

  return (
    <div>
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Chain Gas Fee Comparison
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
          Compare stablecoin transfer costs across different blockchain
          networks.
        </p>
      </div>

      {/* Sort & Refresh Controls */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy("cost")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              sortBy === "cost"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            )}
          >
            <CircleDollarSign className="h-4 w-4" />
            Sort by Cost
          </button>
          <button
            onClick={() => setSortBy("speed")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              sortBy === "speed"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            )}
          >
            <ArrowUpDown className="h-4 w-4" />
            Sort by Speed
          </button>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
          <span>
            {lastUpdated
              ? `Updated: ${lastUpdated.toLocaleTimeString()}`
              : "Loading..."}
          </span>
          <button
            onClick={fetchGas}
            className="flex items-center gap-1 rounded px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800"
            disabled={loading}
          >
            <RefreshCw
              className={`h-3 w-3 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && gasData.length === 0 && (
        <Card>
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            <span className="ml-3 text-gray-500 dark:text-gray-400">
              Loading gas fees...
            </span>
          </div>
        </Card>
      )}

      {/* Gas Fee Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((item) => (
          <Card
            key={item.chainId}
            className={cn(
              "relative overflow-hidden",
              cheapest?.chainId === item.chainId &&
                "border-green-300 dark:border-green-800"
            )}
          >
            {cheapest?.chainId === item.chainId && (
              <div className="absolute right-0 top-0 rounded-bl-lg bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
                Cheapest
              </div>
            )}

            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                {item.chain}
              </h3>
              <span
                className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  getSpeedColor(item.speed)
                )}
              >
                <Zap className="h-3.5 w-3.5" />
                {item.speed}
              </span>
            </div>

            {/* Transfer Cost */}
            <div className="mb-4">
              <div className="mb-1 flex items-end justify-between">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${item.transferCostUsd < 0.01 ? "<0.01" : item.transferCostUsd.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  per transfer
                </span>
              </div>
              {/* Cost bar */}
              <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className={cn(
                    "h-2 rounded-full transition-all",
                    cheapest?.chainId === item.chainId
                      ? "bg-green-500"
                      : "bg-blue-500"
                  )}
                  style={{
                    width: `${Math.max(getCostBar(item.transferCostUsd, maxCost), 2)}%`,
                  }}
                />
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                  <Fuel className="h-3.5 w-3.5" />
                  Gas Price
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {item.gasPrice}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                  <CircleDollarSign className="h-3.5 w-3.5" />
                  Native Cost
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {item.transferCostNative} {item.nativeToken}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                  <Clock className="h-3.5 w-3.5" />
                  Confirm Time
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {item.avgConfirmTime}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Info */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
          About Gas Fees
        </h2>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>
            Gas fees are the transaction costs paid to blockchain validators for
            processing your transfer. They vary by network congestion and chain
            architecture.
          </p>
          <p>
            The costs shown are estimates for a standard ERC-20 / SPL token
            transfer (~65,000 gas units on EVM chains). Actual costs may vary
            based on network conditions.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">
              Note:
            </strong>{" "}
            Exchange withdrawal fees are separate from on-chain gas fees and are
            typically higher to cover the exchange&apos;s operational costs.
          </p>
        </div>
      </div>
    </div>
  );
}
