import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Nav } from "@/components/Nav";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Stablex — Find the Cheapest Stablecoin Rates",
    template: "%s | Stablex",
  },
  description:
    "Compare the true total cost of buying and selling stablecoins across exchanges. Find the cheapest and fastest routes for USDT, USDC, DAI.",
  keywords: [
    "stablecoin",
    "USDT",
    "USDC",
    "DAI",
    "exchange comparison",
    "on-ramp",
    "off-ramp",
    "crypto",
    "gas fees",
    "remittance",
  ],
  openGraph: {
    title: "Stablex — Find the Cheapest Stablecoin Rates",
    description:
      "Compare fees, spread, FX markup and gas across exchanges in one view.",
    type: "website",
    locale: "en_US",
    siteName: "Stablex",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stablex — Find the Cheapest Stablecoin Rates",
    description:
      "Compare fees, spread, FX markup and gas across exchanges in one view.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100`}
      >
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                SX
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                Stablex
              </span>
            </div>
            <Nav />
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} Stablex. All rights
                reserved.
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                Not financial advice. Rates are estimates and may vary. Referral
                links may earn us commission.
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
