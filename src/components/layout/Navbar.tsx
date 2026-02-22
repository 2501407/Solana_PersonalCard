"use client";

import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Wallet, Shield, ChevronDown, Copy, LogOut } from "lucide-react";
import { useState } from "react";
import { shortenAddress } from "@/lib/solana";

export function Navbar() {
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              SolPassport
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/passport"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              My Passport
            </Link>
            <Link
              href="/verify"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Verify
            </Link>
            <a
              href="https://docs.gitcoin.co/gitcoin-passport/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Docs
            </a>
          </div>

          {/* Wallet Button */}
          <div className="relative">
            {connected && publicKey ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-medium transition-all cursor-pointer"
                >
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  {shortenAddress(publicKey.toBase58())}
                  <ChevronDown className="w-3.5 h-3.5 text-white/60" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/10 bg-gray-900/95 backdrop-blur-xl shadow-2xl overflow-hidden">
                    <div className="p-3 border-b border-white/10">
                      <p className="text-xs text-white/40 mb-1">Connected Wallet</p>
                      <p className="text-sm text-white font-mono">
                        {shortenAddress(publicKey.toBase58(), 8)}
                      </p>
                    </div>
                    <div className="p-1">
                      <Link
                        href="/passport"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        My Passport
                      </Link>
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                        {copied ? "Copied!" : "Copy Address"}
                      </button>
                      <button
                        onClick={() => {
                          disconnect();
                          setShowDropdown(false);
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Disconnect
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setVisible(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-sm font-semibold transition-all shadow-lg shadow-purple-500/20 cursor-pointer"
              >
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
