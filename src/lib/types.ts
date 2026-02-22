export type StampProvider =
  | "github"
  | "twitter"
  | "discord"
  | "google"
  | "worldcoin"
  | "reclaim"
  | "synap"
  | "ens"
  | "poh"
  | "brightid";

export type StampStatus = "unverified" | "pending" | "verified" | "expired";

export interface Stamp {
  id: string;
  provider: StampProvider;
  name: string;
  description: string;
  icon: string;
  points: number;
  status: StampStatus;
  verifiedAt?: string;
  expiresAt?: string;
  credential?: string;
}

export interface PassportScore {
  total: number;
  max: number;
  percentage: number;
  humanityScore: "low" | "medium" | "high" | "verified";
}

export interface SolanaPassport {
  walletAddress: string;
  passportId: string;
  stamps: Stamp[];
  score: PassportScore;
  createdAt: string;
  updatedAt: string;
  onChainVerified: boolean;
}

export interface VerificationRequest {
  provider: StampProvider;
  walletAddress: string;
  proof?: string;
}

export interface VerificationResult {
  success: boolean;
  stamp?: Stamp;
  error?: string;
  txSignature?: string;
}
