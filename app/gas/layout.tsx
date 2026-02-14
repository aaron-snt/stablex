import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chain Gas Fee Comparison",
  description:
    "Compare real-time gas fees for stablecoin transfers across Ethereum, Tron, Solana, Arbitrum, Base, and Polygon.",
};

export default function GasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
