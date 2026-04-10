"use client";

import { motion } from "framer-motion";
import type { AuctionCar, AuctionStatus } from "../../lib/mock-auction-data";

const statusConfig: Record<AuctionStatus, { bg: string; text: string; dot: string }> = {
  Live: { bg: "bg-emerald-500/15", text: "text-emerald-400", dot: "bg-emerald-400" },
  "Ending Soon": { bg: "bg-amber-500/15", text: "text-amber-400", dot: "bg-amber-400" },
  "Hot Bid": { bg: "bg-[#ee3c48]/15", text: "text-[#ee3c48]", dot: "bg-[#ee3c48]" },
  Approved: { bg: "bg-[#f78f37]/15", text: "text-[#f78f37]", dot: "bg-[#f78f37]" },
  Upcoming: { bg: "bg-slate-500/15", text: "text-slate-400", dot: "bg-slate-400" },
};

function StatusBadge({ status }: { status: AuctionStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.bg} ${config.text}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${config.dot} ${
          status === "Live" || status === "Hot Bid" ? "animate-pulse" : ""
        }`}
      />
      {status}
    </span>
  );
}

export function AuctionCard({ car }: { car: AuctionCar }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative mx-2 w-[320px] shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-white/[0.08] bg-[#2d2d31]/80 backdrop-blur-xl"
    >
      <div className="relative h-[180px] w-full overflow-hidden">
        <img
          src={car.image}
          alt={`${car.year} ${car.name}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#232326]/90 via-transparent to-transparent" />
        <div className="absolute left-3 top-3">
          <StatusBadge status={car.status} />
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          {car.location}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-bold text-white">
          {car.year} {car.name}
        </h3>

        <div className="mt-2 flex items-center gap-3 text-[11px] text-white/50">
          <span className="flex items-center gap-1">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {car.mileage}
          </span>
          <span className="h-3 w-px bg-white/10" />
          <span>{car.fuelType}</span>
          <span className="h-3 w-px bg-white/10" />
          <span>{car.transmission}</span>
        </div>

        <div className="mt-3 flex items-end justify-between border-t border-white/[0.06] pt-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-white/40">
              Current Bid
            </p>
            <p className="mt-0.5 text-base font-bold text-[#ee3c48]">
              {car.currentBid}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-medium uppercase tracking-wider text-white/40">
              Time Left
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-sm font-semibold tabular-nums text-white/90">
              <svg className="h-3 w-3 text-[#f78f37]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {car.timeLeft}
            </p>
          </div>
        </div>

        <button className="mt-3 w-full rounded-xl bg-[#ee3c48]/10 py-2 text-xs font-semibold text-[#ee3c48] transition-colors hover:bg-[#ee3c48]/20">
          View Details
        </button>
      </div>
    </motion.div>
  );
}
