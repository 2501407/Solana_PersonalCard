import { NextRequest, NextResponse } from "next/server";
import { isValidSolanaAddress } from "@/lib/solana";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json(
      { error: "Missing address parameter" },
      { status: 400 }
    );
  }

  if (!isValidSolanaAddress(address)) {
    return NextResponse.json(
      { error: "Invalid Solana address" },
      { status: 400 }
    );
  }

  // In production, this would query the Solana blockchain for the passport PDA
  // For demo purposes, we simulate a lookup
  // A real implementation would use:
  // const connection = getConnection();
  // const [passportPDA] = PublicKey.findProgramAddressSync(
  //   [Buffer.from("passport"), new PublicKey(address).toBuffer()],
  //   PROGRAM_ID
  // );
  // const accountInfo = await connection.getAccountInfo(passportPDA);

  // Simulate: ~30% chance of finding a passport for demo
  const seed = address.charCodeAt(0) + address.charCodeAt(1);
  const hasPassport = seed % 3 !== 0;

  if (!hasPassport) {
    return NextResponse.json({ found: false });
  }

  // Simulate passport data based on address
  const scoreBase = (seed % 100) + 20;
  const verifiedStamps = Math.floor(scoreBase / 15);
  let humanityScore: "low" | "medium" | "high" | "verified" = "low";
  const percentage = Math.round((scoreBase / 185) * 100);

  if (percentage >= 80) humanityScore = "verified";
  else if (percentage >= 50) humanityScore = "high";
  else if (percentage >= 25) humanityScore = "medium";

  return NextResponse.json({
    found: true,
    walletAddress: address,
    score: scoreBase,
    humanityScore,
    verifiedStamps,
    onChainVerified: verifiedStamps > 2,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { walletAddress?: string; provider?: string; proof?: string };
    const { walletAddress, provider, proof } = body;

    if (!walletAddress || !provider) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!isValidSolanaAddress(walletAddress)) {
      return NextResponse.json(
        { error: "Invalid Solana address" },
        { status: 400 }
      );
    }

    // In production, this would:
    // 1. Verify the proof from the provider (Gitcoin, Reclaim, Synap, etc.)
    // 2. Call the Solana program to mint the stamp NFT/credential
    // 3. Return the transaction signature

    // Simulate verification delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Generate simulated transaction signature
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789";
    const signature = Array.from(
      { length: 88 },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");

    return NextResponse.json({
      success: true,
      provider,
      walletAddress,
      txSignature: signature,
      message: `Successfully verified ${provider} credential for ${walletAddress}`,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
