"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import type { SolanaPassport, Stamp, StampProvider } from "@/lib/types";
import { getDefaultStamps, calculateScore } from "@/lib/stamps";
import { simulateMintStamp, derivePassportPDA } from "@/lib/solana";

interface PassportContextValue {
  passport: SolanaPassport | null;
  isLoading: boolean;
  verifyStamp: (provider: StampProvider) => Promise<void>;
  refreshPassport: () => void;
}

const PassportContext = createContext<PassportContextValue | null>(null);

export function PassportProvider({ children }: { children: ReactNode }) {
  const { publicKey, connected } = useWallet();
  const [passport, setPassport] = useState<SolanaPassport | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const initPassport = useCallback(() => {
    if (!publicKey) {
      setPassport(null);
      return;
    }

    const walletAddress = publicKey.toBase58();
    const storageKey = `passport_${walletAddress}`;
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as SolanaPassport;
        setPassport(parsed);
        return;
      } catch {
        // Fall through to create new
      }
    }

    const stamps = getDefaultStamps();
    const score = calculateScore(stamps);
    const newPassport: SolanaPassport = {
      walletAddress,
      passportId: derivePassportPDA(walletAddress),
      stamps,
      score,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      onChainVerified: false,
    };

    localStorage.setItem(storageKey, JSON.stringify(newPassport));
    setPassport(newPassport);
  }, [publicKey]);

  useEffect(() => {
    if (connected && publicKey) {
      initPassport();
    } else {
      setPassport(null);
    }
  }, [connected, publicKey, initPassport]);

  const verifyStamp = useCallback(
    async (provider: StampProvider) => {
      if (!passport || !publicKey) return;

      setIsLoading(true);
      try {
        const result = await simulateMintStamp(
          publicKey.toBase58(),
          provider
        );

        if (result.success) {
          const updatedStamps: Stamp[] = passport.stamps.map((s) =>
            s.provider === provider
              ? {
                  ...s,
                  status: "verified" as const,
                  verifiedAt: new Date().toISOString(),
                  expiresAt: new Date(
                    Date.now() + 90 * 24 * 60 * 60 * 1000
                  ).toISOString(),
                  credential: result.signature,
                }
              : s
          );

          const updatedPassport: SolanaPassport = {
            ...passport,
            stamps: updatedStamps,
            score: calculateScore(updatedStamps),
            updatedAt: new Date().toISOString(),
            onChainVerified: true,
          };

          const storageKey = `passport_${publicKey.toBase58()}`;
          localStorage.setItem(storageKey, JSON.stringify(updatedPassport));
          setPassport(updatedPassport);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [passport, publicKey]
  );

  const refreshPassport = useCallback(() => {
    initPassport();
  }, [initPassport]);

  return (
    <PassportContext.Provider
      value={{ passport, isLoading, verifyStamp, refreshPassport }}
    >
      {children}
    </PassportContext.Provider>
  );
}

export function usePassport() {
  const ctx = useContext(PassportContext);
  if (!ctx) throw new Error("usePassport must be used within PassportProvider");
  return ctx;
}
