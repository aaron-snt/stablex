import { Card } from "@/components/ui/Card";
import {
  Scale,
  Eye,
  ShieldCheck,
  HelpCircle,
  AlertTriangle,
  Link2,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          About Stablex
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
          Helping you find the cheapest and fastest way to buy, sell, and
          transfer stablecoins.
        </p>
      </div>

      {/* Mission */}
      <Card className="mb-6">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
          Our Mission
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Stablecoin on/off-ramps are fragmented across dozens of exchanges,
          each with different fee structures, spreads, and FX markups. Stablex
          compares the{" "}
          <strong className="text-gray-900 dark:text-white">
            true total cost
          </strong>{" "}
          in one view so you always know exactly how much you&apos;ll pay — and
          how much you&apos;ll receive.
        </p>
      </Card>

      {/* Values */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: Scale,
            title: "Fair Comparison",
            desc: "We include every cost component: trading fees, spread, FX markup, and withdrawal fees.",
          },
          {
            icon: Eye,
            title: "Transparency",
            desc: "All data sources, methodology, and revenue sources are disclosed openly.",
          },
          {
            icon: ShieldCheck,
            title: "Independence",
            desc: "Rankings are based on cost alone. We never accept payment to boost an exchange's position.",
          },
        ].map((v) => (
          <Card key={v.title} className="p-4 text-center">
            <v.icon className="mx-auto mb-2 h-6 w-6 text-blue-500" />
            <h3 className="font-medium text-gray-900 dark:text-white">
              {v.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {v.desc}
            </p>
          </Card>
        ))}
      </div>

      {/* Disclaimer */}
      <Card className="mb-6 border-yellow-300 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/20">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600 dark:text-yellow-400" />
          <div>
            <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Disclaimer
            </h2>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <strong className="text-gray-900 dark:text-white">
                  Not financial advice.
                </strong>{" "}
                Stablex provides information for educational and comparison
                purposes only. We do not recommend any specific exchange or
                investment strategy.
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">
                  Estimates only.
                </strong>{" "}
                All rates, fees, and costs shown are estimates based on
                publicly available data. Actual costs may vary depending on
                market conditions, your account tier, and transaction size.
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">
                  Do your own research.
                </strong>{" "}
                Always verify fees and rates directly on the exchange before
                making a transaction.
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">
                  Regulatory compliance.
                </strong>{" "}
                Cryptocurrency regulations vary by jurisdiction. Ensure you
                comply with your local laws when using exchanges or
                transferring stablecoins.
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Referral Disclosure */}
      <Card className="mb-6">
        <div className="flex gap-3">
          <Link2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
          <div>
            <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Referral Disclosure
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Some links on Stablex are referral/affiliate links. When you
              sign up for an exchange through our link, we may earn a
              commission at no extra cost to you. This helps us keep the
              service free.{" "}
              <strong className="text-gray-900 dark:text-white">
                Referral partnerships never influence our rankings
              </strong>
              — exchanges are always sorted by lowest total cost.
            </p>
          </div>
        </div>
      </Card>

      {/* FAQ */}
      <Card>
        <div className="flex gap-3">
          <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
          <div className="w-full">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "How is the total cost calculated?",
                  a: "Total cost = Trading fee + Spread + FX markup + Withdrawal fee. We calculate each component using publicly available exchange data and real-time market prices.",
                },
                {
                  q: "How often are prices updated?",
                  a: "Stablecoin prices update every 30 seconds, FX rates every 5 minutes, and gas fees every 15 seconds.",
                },
                {
                  q: "Which exchanges do you support?",
                  a: "We currently compare Binance, Coinbase, Bybit, Kraken, OKX, Upbit, and Bithumb. More exchanges will be added over time.",
                },
                {
                  q: "Is Stablex free to use?",
                  a: "Yes, Stablex is completely free. We may introduce optional premium features in the future, but core comparison functionality will always remain free.",
                },
                {
                  q: "Why do actual costs differ from estimates?",
                  a: "Exchange fees may vary based on your account tier (VIP level), payment method, and real-time market conditions. Our estimates use standard (non-VIP) tier fees.",
                },
              ].map((faq) => (
                <div
                  key={faq.q}
                  className="border-b border-gray-100 pb-4 last:border-0 last:pb-0 dark:border-gray-800"
                >
                  <h3 className="mb-1 font-medium text-gray-900 dark:text-white">
                    {faq.q}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
