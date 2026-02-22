"use client";

import { useState } from "react";
import {
  Shield,
  CheckCircle,
  Search,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { isValidSolanaAddress } from "@/lib/solana";

interface VerifyResult {
  found: boolean;
  walletAddress?: string;
  score?: number;
  humanityScore?: string;
  verifiedStamps?: number;
  onChainVerified?: boolean;
}

export function VerifyPage() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    setError("");
    setResult(null);

    if (!address.trim()) {
      setError("Please enter a wallet address");
      return;
    }

    if (!isValidSolanaAddress(address.trim())) {
      setError("Invalid Solana wallet address");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/verify?address=${address.trim()}`);
      const data = await res.json() as VerifyResult;
      setResult(data);
    } catch {
      setError("Failed to verify address. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const SCORE_COLORS = {
    low: "#ef4444",
    medium: "#f59e0b",
    high: "#10b981",
    verified: "#8b5cf6",
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-3">
            Verify a Passport
          </h1>
          <p className="text-white/50 leading-relaxed">
            Check if a Solana wallet address has a valid SolPassport and view
            their humanity score.
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              placeholder="Enter Solana wallet address..."
              className="flex-1 px-4 py-3 rounded-xl border border-white/20 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/60 focus:bg-white/8 transition-all font-mono text-sm"
            />
            <button
              onClick={handleVerify}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Verify
            </button>
          </div>
          {error && (
            <div className="flex items-center gap-2 mt-3 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Result */}
        {result && (
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            {result.found ? (
              <>
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Passport Found</h3>
                      <p className="text-xs text-white/50 font-mono">
                        {result.walletAddress}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-xl bg-white/5">
                      <div
                        className="text-2xl font-black mb-1"
                        style={{
                          color:
                            SCORE_COLORS[
                              (result.humanityScore as keyof typeof SCORE_COLORS) ||
                                "low"
                            ],
                        }}
                      >
                        {result.score}
                      </div>
                      <div className="text-xs text-white/50">Trust Score</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-white/5">
                      <div className="text-2xl font-black text-white mb-1">
                        {result.verifiedStamps}
                      </div>
                      <div className="text-xs text-white/50">Stamps</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-white/5">
                      <div
                        className="text-sm font-bold mb-1 capitalize"
                        style={{
                          color:
                            SCORE_COLORS[
                              (result.humanityScore as keyof typeof SCORE_COLORS) ||
                                "low"
                            ],
                        }}
                      >
                        {result.humanityScore}
                      </div>
                      <div className="text-xs text-white/50">Humanity</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {result.onChainVerified ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        ✓ On-Chain Verified
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/50">
                        Not On-Chain
                      </span>
                    )}
                  </div>
                  <a
                    href={`https://explorer.solana.com/address/${result.walletAddress}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-purple-300 hover:text-purple-200 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Solana Explorer
                  </a>
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
                <AlertCircle className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">
                  No Passport Found
                </h3>
                <p className="text-sm text-white/50">
                  This wallet address doesn&apos;t have a SolPassport yet.
                </p>
              </div>
            )}
          </div>
        )}

        {/* How it works */}
        <div className="mt-10 p-6 rounded-2xl border border-white/10 bg-white/5">
          <h3 className="font-bold text-white mb-4">How Verification Works</h3>
          <div className="space-y-3">
            {[
              {
                step: "1",
                text: "Enter any Solana wallet address to check their passport",
              },
              {
                step: "2",
                text: "We query the on-chain passport PDA for their credentials",
              },
              {
                step: "3",
                text: "View their trust score and verified stamp count",
              },
              {
                step: "4",
                text: "Use this data to gate access to your dApp",
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {item.step}
                </div>
                <p className="text-sm text-white/60">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
