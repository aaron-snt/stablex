import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Stablex, our mission, disclaimer, referral disclosure, and frequently asked questions.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
