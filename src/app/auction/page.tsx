import type { Metadata } from "next";
import { AuctionHero } from "../../components/auction/auction-hero";
import { HowToAuction } from "../../components/auction/how-to-auction";

export const metadata: Metadata = {
  title: "Auctions | BADDELHA - Premium Auto Auctions",
  description:
    "Join Baddelha Auto Auctions. Verified dealers access curated vehicle inventory, bid in real time, and close deals faster.",
};

export default function AuctionPage() {
  return (
    <main>
      <AuctionHero />
      <HowToAuction />
    </main>
  );
}
