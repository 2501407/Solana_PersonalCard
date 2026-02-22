"use client";

import { useState } from "react";
import {
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
  Loader2,
  Github,
  Twitter,
  Globe,
  Shield,
  Fingerprint,
  Zap,
  Star,
  Link,
  Eye,
} from "lucide-react";
import type { Stamp, StampProvider } from "@/lib/types";

interface StampCardProps {
  stamp: Stamp;
  onVerify: (provider: StampProvider) => Promise<void>;
  isVerifying: boolean;
}

const PROVIDER_ICONS: Record<string, React.ReactNode> = {
  github: <Github className="w-6 h-6" />,
  twitter: <Twitter className="w-6 h-6" />,
  discord: <Zap className="w-6 h-6" />,
  google: <Globe className="w-6 h-6" />,
  worldcoin: <Eye className="w-6 h-6" />,
  reclaim: <Shield className="w-6 h-6" />,
  synap: <Fingerprint className="w-6 h-6" />,
  ens: <Link className="w-6 h-6" />,
  poh: <Star className="w-6 h-6" />,
  brightid: <CheckCircle className="w-6 h-6" />,
};

const PROVIDER_COLORS: Record<string, string> = {
  github: "#6e40c9",
  twitter: "#1d9bf0",
  discord: "#5865f2",
  google: "#4285f4",
  worldcoin: "#00c2a8",
  reclaim: "#ff6b35",
  synap: "#8b5cf6",
  ens: "#5298ff",
  poh: "#e91e63",
  brightid: "#f59e0b",
};

export function StampCard({ stamp, onVerify, isVerifying }: StampCardProps) {
  const [localLoading, setLocalLoading] = useState(false);
  const color = PROVIDER_COLORS[stamp.provider] || "#8b5cf6";
  const icon = PROVIDER_ICONS[stamp.provider] || <Shield className="w-6 h-6" />;

  const isVerified = stamp.status === "verified";
  const isPending = stamp.status === "pending";
  const isLoading = localLoading || (isVerifying && isPending);

  const handleVerify = async () => {
    setLocalLoading(true);
    try {
      await onVerify(stamp.provider);
    } finally {
      setLocalLoading(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      className={`relative rounded-xl border p-5 transition-all duration-200 ${
        isVerified
          ? "border-opacity-40 bg-opacity-10"
          : "border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20"
      }`}
      style={
        isVerified
          ? {
              borderColor: `${color}60`,
              backgroundColor: `${color}10`,
            }
          : {}
      }
    >
      {/* Verified glow effect */}
      {isVerified && (
        <div
          className="absolute inset-0 rounded-xl opacity-5 pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 0%, ${color}, transparent 70%)` }}
        />
      )}

      <div className="flex items-start justify-between gap-3">
        {/* Icon + Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className="flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-white text-sm">{stamp.name}</h3>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ color, backgroundColor: `${color}20` }}
              >
                +{stamp.points} pts
              </span>
            </div>
            <p className="text-xs text-white/50 mt-0.5 leading-relaxed">
              {stamp.description}
            </p>
            {isVerified && stamp.verifiedAt && (
              <p className="text-xs mt-1.5" style={{ color: `${color}cc` }}>
                ✓ Verified {formatDate(stamp.verifiedAt)}
                {stamp.expiresAt && ` · Expires ${formatDate(stamp.expiresAt)}`}
              </p>
            )}
            {isVerified && stamp.credential && (
              <a
                href={`https://explorer.solana.com/tx/${stamp.credential}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs mt-1 opacity-60 hover:opacity-100 transition-opacity"
                style={{ color }}
              >
                <ExternalLink className="w-3 h-3" />
                View on Solana Explorer
              </a>
            )}
          </div>
        </div>

        {/* Status / Action */}
        <div className="flex-shrink-0">
          {isVerified ? (
            <div
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
              style={{ color, backgroundColor: `${color}20` }}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Verified
            </div>
          ) : isPending ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-amber-400 bg-amber-400/10">
              <Clock className="w-3.5 h-3.5" />
              Pending
            </div>
          ) : (
            <button
              onClick={handleVerify}
              disabled={isLoading}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{
                color: "white",
                backgroundColor: isLoading ? `${color}40` : color,
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5" />
                  Verify
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
