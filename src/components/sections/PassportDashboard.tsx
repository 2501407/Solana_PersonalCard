"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import {
  Shield,
  RefreshCw,
  CheckCircle,
  Clock,
  Wallet,
  ExternalLink,
  Filter,
} from "lucide-react";
import { usePassport } from "@/components/providers/PassportProvider";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { StampCard } from "@/components/ui/StampCard";
import { shortenAddress } from "@/lib/solana";
import type { StampProvider } from "@/lib/types";

type FilterType = "all" | "verified" | "unverified";

export function PassportDashboard() {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const { passport, isLoading, verifyStamp, refreshPassport } = usePassport();
  const [filter, setFilter] = useState<FilterType>("all");

  if (!connected || !publicKey) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-10 h-10 text-white/40" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Connect Your Wallet
          </h2>
          <p className="text-white/50 mb-8 leading-relaxed">
            Connect your Solana wallet to access your SolPassport and start
            collecting verification stamps.
          </p>
          <button
            onClick={() => setVisible(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold transition-all shadow-lg shadow-purple-500/20 cursor-pointer"
          >
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  if (!passport) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="flex items-center gap-3 text-white/60">
          <RefreshCw className="w-5 h-5 animate-spin" />
          Loading passport...
        </div>
      </div>
    );
  }

  const verifiedCount = passport.stamps.filter(
    (s) => s.status === "verified"
  ).length;
  const filteredStamps = passport.stamps.filter((s) => {
    if (filter === "verified") return s.status === "verified";
    if (filter === "unverified") return s.status !== "verified";
    return true;
  });

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-white/50">
                {shortenAddress(publicKey.toBase58(), 6)}
              </span>
              {passport.onChainVerified && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  On-Chain ✓
                </span>
              )}
            </div>
            <h1 className="text-3xl font-black text-white">My Passport</h1>
            <p className="text-white/50 mt-1">
              Passport ID:{" "}
              <span className="font-mono text-white/70">
                {passport.passportId}
              </span>
            </p>
          </div>
          <button
            onClick={refreshPassport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-sm transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Score Ring */}
          <div className="lg:col-span-1 rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col items-center justify-center">
            <ScoreRing score={passport.score} size={180} />
            <div className="mt-4 text-center">
              <p className="text-sm text-white/50">
                {passport.score.percentage}% of max score achieved
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {[
              {
                label: "Stamps Verified",
                value: `${verifiedCount} / ${passport.stamps.length}`,
                icon: <CheckCircle className="w-5 h-5" />,
                color: "#10b981",
              },
              {
                label: "Trust Score",
                value: passport.score.total,
                icon: <Shield className="w-5 h-5" />,
                color: "#8b5cf6",
              },
              {
                label: "Humanity Level",
                value:
                  passport.score.humanityScore.charAt(0).toUpperCase() +
                  passport.score.humanityScore.slice(1),
                icon: <CheckCircle className="w-5 h-5" />,
                color: "#06b6d4",
              },
              {
                label: "Last Updated",
                value: new Date(passport.updatedAt).toLocaleDateString(),
                icon: <Clock className="w-5 h-5" />,
                color: "#f59e0b",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-white/5 p-5"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{
                    backgroundColor: `${stat.color}20`,
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Solana Explorer Link */}
        {passport.onChainVerified && (
          <div className="mb-6 p-4 rounded-xl border border-purple-500/30 bg-purple-500/10 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Passport Anchored On-Chain
                </p>
                <p className="text-xs text-white/50">
                  Your identity credentials are stored on Solana devnet
                </p>
              </div>
            </div>
            <a
              href={`https://explorer.solana.com/address/${publicKey.toBase58()}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-purple-300 hover:text-purple-200 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View on Explorer
            </a>
          </div>
        )}

        {/* Stamps Section */}
        <div>
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <h2 className="text-xl font-bold text-white">
              Verification Stamps
            </h2>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-white/40" />
              {(["all", "verified", "unverified"] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    filter === f
                      ? "bg-purple-500/30 text-purple-300 border border-purple-500/40"
                      : "text-white/50 hover:text-white border border-transparent hover:border-white/20"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStamps.map((stamp) => (
              <StampCard
                key={stamp.id}
                stamp={stamp}
                onVerify={verifyStamp}
                isVerifying={isLoading}
              />
            ))}
          </div>

          {filteredStamps.length === 0 && (
            <div className="text-center py-12 text-white/40">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No stamps in this category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
