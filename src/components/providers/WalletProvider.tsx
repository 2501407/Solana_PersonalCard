"use client";

import { useMemo, useState, useEffect } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { SOLANA_RPC_URL } from "@/lib/solana";
import type { Adapter } from "@solana/wallet-adapter-base";

// Import wallet adapter CSS
import "@solana/wallet-adapter-react-ui/styles.css";

export function SolanaWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [wallets, setWallets] = useState<Adapter[]>([]);

  useEffect(() => {
    // Dynamically import wallet adapters only on client side
    import("@solana/wallet-adapter-wallets").then((module) => {
      const adapters = [
        new module.PhantomWalletAdapter(),
        new module.SolflareWalletAdapter(),
        new module.TorusWalletAdapter(),
      ];
      setWallets(adapters);
    });
  }, []);

  return (
    <ConnectionProvider endpoint={SOLANA_RPC_URL}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
