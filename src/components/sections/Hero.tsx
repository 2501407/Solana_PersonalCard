"use client";

import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import {
  Shield,
  ArrowRight,
  CheckCircle,
  Zap,
  Globe,
  Lock,
} from "lucide-react";

export function Hero() {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.15)_0%,_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(6,182,212,0.1)_0%,_transparent_60%)]" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium mb-8">
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          Built on Solana Devnet
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
          Prove You&apos;re{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Human
          </span>
          <br />
          On-Chain
        </h1>

        <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          SolPassport is a Proof-of-Personhood protocol on Solana. Collect
          verifiable credentials from trusted providers, build your on-chain
          identity, and unlock access to Sybil-resistant applications.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          {connected ? (
            <Link
              href="/passport"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-lg transition-all shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
            >
              View My Passport
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <button
              onClick={() => setVisible(true)}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-lg transition-all shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 cursor-pointer"
            >
              Get Your Passport
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          <a
            href="https://docs.gitcoin.co/gitcoin-passport/overview"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white/80 hover:text-white hover:border-white/40 font-semibold text-lg transition-all"
          >
            Learn More
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mb-16">
          {[
            { value: "10+", label: "Stamp Providers" },
            { value: "185", label: "Max Trust Score" },
            { value: "Solana", label: "Blockchain" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-sm text-white/40">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: <Shield className="w-5 h-5" />,
              title: "Sybil Resistant",
              desc: "Multi-source verification prevents fake identities",
              color: "#8b5cf6",
            },
            {
              icon: <Lock className="w-5 h-5" />,
              title: "Privacy First",
              desc: "ZK proofs keep your data private on-chain",
              color: "#06b6d4",
            },
            {
              icon: <Zap className="w-5 h-5" />,
              title: "Fast & Cheap",
              desc: "Solana's speed means instant, low-cost stamps",
              color: "#f59e0b",
            },
            {
              icon: <Globe className="w-5 h-5" />,
              title: "Composable",
              desc: "Integrate with any Solana dApp via our SDK",
              color: "#10b981",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="p-5 rounded-xl border border-white/10 bg-white/5 text-left hover:bg-white/8 transition-colors"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{
                  backgroundColor: `${feature.color}20`,
                  color: feature.color,
                }}
              >
                {feature.icon}
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-white/50 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
