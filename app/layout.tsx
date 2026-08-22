import type { Metadata } from "next";
import { Architects_Daughter, Patrick_Hand, Caveat, Kalam, Alex_Brush, Great_Vibes } from "next/font/google";
import "./globals.css";

const architectsDaughter = Architects_Daughter({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-hand-architect",
  display: "swap",
});

const patrickHand = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-hand-patrick",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-hand-caveat",
  display: "swap",
});

const kalam = Kalam({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-hand-kalam",
  display: "swap",
});

const alexBrush = Alex_Brush({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-brush-alex",
  display: "swap",
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-brush-vibes",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bullet Journal Habit & Metric Tracker",
  description: "A handwritten dot-grid notebook habit and mood tracker inspired by physical bullet journaling.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${architectsDaughter.variable} ${patrickHand.variable} ${caveat.variable} ${kalam.variable} ${alexBrush.variable} ${greatVibes.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
