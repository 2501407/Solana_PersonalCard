import type { Stamp, StampProvider } from "./types";

export const STAMP_DEFINITIONS: Record<
  StampProvider,
  Omit<Stamp, "id" | "status" | "verifiedAt" | "expiresAt" | "credential">
> = {
  github: {
    provider: "github",
    name: "GitHub",
    description: "Verify your GitHub account with commit history",
    icon: "github",
    points: 15,
  },
  twitter: {
    provider: "twitter",
    name: "Twitter / X",
    description: "Verify your Twitter/X account ownership",
    icon: "twitter",
    points: 10,
  },
  discord: {
    provider: "discord",
    name: "Discord",
    description: "Verify your Discord account membership",
    icon: "discord",
    points: 10,
  },
  google: {
    provider: "google",
    name: "Google",
    description: "Verify your Google account identity",
    icon: "google",
    points: 12,
  },
  worldcoin: {
    provider: "worldcoin",
    name: "World ID",
    description: "Biometric proof of unique humanity via Worldcoin Orb",
    icon: "worldcoin",
    points: 40,
  },
  reclaim: {
    provider: "reclaim",
    name: "Reclaim Protocol",
    description: "Zero-knowledge proof of web2 credentials",
    icon: "reclaim",
    points: 20,
  },
  synap: {
    provider: "synap",
    name: "Synap",
    description: "AI-powered identity verification and KYC",
    icon: "synap",
    points: 25,
  },
  ens: {
    provider: "ens",
    name: "ENS Domain",
    description: "Verify ownership of an Ethereum Name Service domain",
    icon: "ens",
    points: 15,
  },
  poh: {
    provider: "poh",
    name: "Proof of Humanity",
    description: "Decentralized registry of verified humans",
    icon: "poh",
    points: 35,
  },
  brightid: {
    provider: "brightid",
    name: "BrightID",
    description: "Social identity network for unique human verification",
    icon: "brightid",
    points: 30,
  },
};

export const MAX_SCORE = Object.values(STAMP_DEFINITIONS).reduce(
  (sum, s) => sum + s.points,
  0
);

export function calculateScore(stamps: Stamp[]) {
  const verified = stamps.filter((s) => s.status === "verified");
  const total = verified.reduce((sum, s) => sum + s.points, 0);
  const percentage = Math.round((total / MAX_SCORE) * 100);

  let humanityScore: "low" | "medium" | "high" | "verified" = "low";
  if (percentage >= 80) humanityScore = "verified";
  else if (percentage >= 50) humanityScore = "high";
  else if (percentage >= 25) humanityScore = "medium";

  return { total, max: MAX_SCORE, percentage, humanityScore };
}

export function getDefaultStamps(): Stamp[] {
  return Object.entries(STAMP_DEFINITIONS).map(([key, def]) => ({
    ...def,
    id: `stamp-${key}`,
    status: "unverified" as const,
  }));
}
