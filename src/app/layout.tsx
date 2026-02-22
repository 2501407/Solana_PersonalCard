import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SolanaWalletProvider } from "@/components/providers/WalletProvider";
import { PassportProvider } from "@/components/providers/PassportProvider";
import { Navbar } from "@/components/layout/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SolPassport — Proof of Personhood on Solana",
  description:
    "Build your on-chain identity with verifiable credentials. Collect stamps from GitHub, Twitter, World ID, Reclaim Protocol, and more to prove your humanity on Solana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <SolanaWalletProvider>
          <PassportProvider>
            <Navbar />
            {children}
          </PassportProvider>
        </SolanaWalletProvider>
      </body>
    </html>
  );
}
