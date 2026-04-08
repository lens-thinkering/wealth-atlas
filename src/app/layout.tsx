import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: "The Wealth Atlas",
  description:
    "Visualize the ideal levels of wealth across the globe and US states. Based on the Wealth Ladder concept from Of Dollars and Data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pixelFont.variable} h-full`}>
      <body className="min-h-full bg-black text-neon-green font-pixel antialiased">
        {children}
      </body>
    </html>
  );
}
