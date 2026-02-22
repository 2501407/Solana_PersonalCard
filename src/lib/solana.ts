import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

export const SOLANA_NETWORK = "devnet";
export const SOLANA_RPC_URL = clusterApiUrl(SOLANA_NETWORK);

export function getConnection(): Connection {
  return new Connection(SOLANA_RPC_URL, "confirmed");
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export async function getAccountBalance(address: string): Promise<number> {
  try {
    const connection = getConnection();
    const pubkey = new PublicKey(address);
    const balance = await connection.getBalance(pubkey);
    return balance / 1e9; // Convert lamports to SOL
  } catch {
    return 0;
  }
}

// Simulated on-chain passport PDA derivation
export function derivePassportPDA(walletAddress: string): string {
  // In production, this would use findProgramAddressSync
  // For demo purposes, we simulate a PDA
  const hash = walletAddress
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `passport_${hash.toString(16).padStart(8, "0")}`;
}

// Simulated transaction for minting a stamp on-chain
export async function simulateMintStamp(
  walletAddress: string,
  stampProvider: string
): Promise<{ success: boolean; signature: string }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Generate a fake transaction signature for demo
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789";
  const signature = Array.from(
    { length: 88 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");

  console.log(
    `[Solana] Minting stamp for ${walletAddress} - Provider: ${stampProvider}`
  );
  console.log(`[Solana] TX Signature: ${signature}`);

  return { success: true, signature };
}
