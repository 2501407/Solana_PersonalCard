import { PassportDashboard } from "@/components/sections/PassportDashboard";

export const metadata = {
  title: "My Passport | SolPassport",
  description: "View and manage your Solana Proof-of-Personhood passport",
};

export default function PassportPage() {
  return (
    <main className="min-h-screen bg-black">
      <PassportDashboard />
    </main>
  );
}
