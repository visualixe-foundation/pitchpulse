import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PitchPulse",
  description:
    "Live football matchday hub for UEFA Champions League and Nations League. Fixtures, live scores, results, tables & team pages.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
