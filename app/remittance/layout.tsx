import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Remittance Calculator",
  description:
    "Compare traditional bank wire transfer costs vs stablecoin remittance. See how much you can save sending money internationally.",
};

export default function RemittanceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
