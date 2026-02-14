import { NextResponse } from "next/server";

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

// Estimated USDT/USDC transfer gas costs per chain (in USD)
// These are approximate and would ideally come from live APIs
const FALLBACK_GAS_DATA: GasFeeData[] = [
  {
    chain: "Ethereum (ERC-20)",
    chainId: "ERC-20",
    nativeToken: "ETH",
    gasPrice: "~15 Gwei",
    transferCostUsd: 3.5,
    transferCostNative: 0.0014,
    speed: "Slow",
    avgConfirmTime: "~15 sec",
  },
  {
    chain: "Tron (TRC-20)",
    chainId: "TRC-20",
    nativeToken: "TRX",
    gasPrice: "~420 SUN",
    transferCostUsd: 0.5,
    transferCostNative: 6.5,
    speed: "Fast",
    avgConfirmTime: "~3 sec",
  },
  {
    chain: "Solana",
    chainId: "SOL",
    nativeToken: "SOL",
    gasPrice: "~0.000005 SOL",
    transferCostUsd: 0.01,
    transferCostNative: 0.000005,
    speed: "Very Fast",
    avgConfirmTime: "~0.4 sec",
  },
  {
    chain: "Arbitrum",
    chainId: "Arbitrum",
    nativeToken: "ETH",
    gasPrice: "~0.1 Gwei",
    transferCostUsd: 0.1,
    transferCostNative: 0.00004,
    speed: "Fast",
    avgConfirmTime: "~2 sec",
  },
  {
    chain: "Base",
    chainId: "Base",
    nativeToken: "ETH",
    gasPrice: "~0.05 Gwei",
    transferCostUsd: 0.05,
    transferCostNative: 0.00002,
    speed: "Fast",
    avgConfirmTime: "~2 sec",
  },
  {
    chain: "Polygon",
    chainId: "Polygon",
    nativeToken: "POL",
    gasPrice: "~30 Gwei",
    transferCostUsd: 0.02,
    transferCostNative: 0.05,
    speed: "Fast",
    avgConfirmTime: "~2 sec",
  },
];

export async function GET() {
  try {
    // Try fetching Ethereum gas price from Etherscan
    const etherscanKey = process.env.ETHERSCAN_API_KEY;
    let ethGasGwei = 15;

    if (etherscanKey) {
      const ethRes = await fetch(
        `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${etherscanKey}`,
        { next: { revalidate: 15 } }
      );
      if (ethRes.ok) {
        const ethData = await ethRes.json();
        if (ethData.status === "1") {
          ethGasGwei = Number(ethData.result.ProposeGasPrice) || 15;
        }
      }
    }

    // Update Ethereum gas data with live price
    const gasData = FALLBACK_GAS_DATA.map((item) => {
      if (item.chainId === "ERC-20") {
        // ERC-20 token transfer ≈ 65,000 gas units
        const gasUnits = 65000;
        const ethPrice = 2500; // approximate, ideally from price API
        const costEth = (gasUnits * ethGasGwei * 1e-9);
        const costUsd = costEth * ethPrice;
        return {
          ...item,
          gasPrice: `~${ethGasGwei} Gwei`,
          transferCostUsd: Math.round(costUsd * 100) / 100,
          transferCostNative: Math.round(costEth * 100000) / 100000,
        };
      }
      return item;
    });

    return NextResponse.json({
      data: gasData,
      timestamp: Date.now(),
    });
  } catch {
    return NextResponse.json({
      data: FALLBACK_GAS_DATA,
      timestamp: Date.now(),
    });
  }
}
