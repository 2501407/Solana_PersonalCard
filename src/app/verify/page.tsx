import { VerifyPage } from "@/components/sections/VerifyPage";

export const metadata = {
  title: "Verify Passport | SolPassport",
  description: "Verify a Solana wallet's Proof-of-Personhood passport",
};

export default function VerifyRoute() {
  return (
    <main className="min-h-screen bg-black">
      <VerifyPage />
    </main>
  );
}
