"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { AuctionCard } from "../auction/auction-card";
import { auctionCars } from "../../lib/mock-auction-data";
import { useLanguage } from "../../contexts/LanguageContext";
import lang from "../../locale";

const trustBadgeIcons = [
  (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
    </svg>
  ),
  (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
];

const row1Cars = [auctionCars[0], auctionCars[1], auctionCars[2]];
const row2Cars = [auctionCars[3], auctionCars[4], auctionCars[5]];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export function AuctionHero() {
  const { language } = useLanguage();
  const languageContent = language === 'ar' ? 'ar' : 'en';
  const t = lang[languageContent].auction;

  const trustBadges = [
    { icon: trustBadgeIcons[0], label: t.trustBadges.verifiedDealer },
    { icon: trustBadgeIcons[1], label: t.trustBadges.curatedInventory },
    { icon: trustBadgeIcons[2], label: t.trustBadges.transparentBidding },
    { icon: trustBadgeIcons[3], label: t.trustBadges.fasterAcquisition },
  ];

  return (
    <section className="relative overflow-hidden bg-[#1e1e22]">
      {/* Background ambient elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 h-[600px] w-[600px] rounded-full bg-[#ee3c48]/[0.04] blur-[120px]" />
        <div className="absolute -right-40 top-60 h-[500px] w-[500px] rounded-full bg-[#f78f37]/[0.03] blur-[100px]" />
        <div className="absolute left-1/2 top-0 h-px w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#ee3c48]/20 to-transparent" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-8 pt-24 sm:px-6 sm:pt-32 lg:px-8 lg:pt-36">
        <div className="mx-auto max-w-3xl text-center">
          {/* Logo */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mb-8 flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[#ee3c48]/10 via-[#f78f37]/5 to-transparent blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] px-6 py-3">
                <Image
                  src="/logo-light.png"
                  alt="Baddelha"
                  width={180}
                  height={60}
                  className="h-20 w-auto sm:h-24"
                  priority
                />
              </div>
            </div>
          </motion.div>

          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ee3c48]/20 bg-[#ee3c48]/[0.08] px-4 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ee3c48]" />
            <span className="text-xs font-medium text-[#f78f37]">{t.badge}</span>
          </div>

          {/* Headline */}
          <div className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            <h1 className="text-white">{t.headline1}</h1>
            <span className="bg-gradient-to-r from-[#ee3c48] to-[#f78f37] bg-clip-text text-transparent">
              {t.headline2}
            </span>
          </div>

          {/* Subheading */}
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/50 sm:text-lg">
            {t.subheading}
          </p>

          {/* CTA button */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-8 flex items-center justify-center"
          >
            <button 
            onClick={()=>{
              window.location.href = 'https://dealer.baddelha.com.sa';
            }}
            className="group cursor-pointer relative w-full overflow-hidden rounded-xl bg-[#ee3c48] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#ee3c48]/25 transition-all hover:shadow-xl hover:shadow-[#ee3c48]/30 sm:w-auto">
              <span className="relative z-10">{t.ctaButton}</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            </button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            custom={5}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
          >
            {trustBadges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-white/35"
              >
                <span className="text-[#ee3c48]/50">{badge.icon}</span>
                <span className="text-xs font-medium">{badge.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Auto-scrolling Car Cards Carousel */}
      <div className="relative z-10 mt-8 pb-16 sm:mt-12 lg:mt-16 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#1e1e22] to-transparent z-10"
          aria-hidden
        />
        
        {/* Left fade gradient */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#1e1e22] to-transparent z-10" aria-hidden />
        
        {/* Right fade gradient */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#1e1e22] to-transparent z-10" aria-hidden />

        <div className="space-y-4 [perspective:1200px]">
          {/* Row 1 - scrolls left */}
          <div className="[transform:rotateX(4deg)] opacity-95">
            <div className="flex animate-scroll-left gap-4 hover:[animation-play-state:paused]">
              {[...row1Cars, ...row1Cars, ...row1Cars].map((car, index) => (
                <div key={`row1-${car.id}-${index}`} className="flex-shrink-0 w-[280px] sm:w-[320px]">
                  <AuctionCard car={car} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Row 2 - scrolls right */}
          <div className="[transform:rotateX(2deg)] opacity-90">
            <div className="flex animate-scroll-right gap-4 hover:[animation-play-state:paused]">
              {[...row2Cars, ...row2Cars, ...row2Cars].map((car, index) => (
                <div key={`row2-${car.id}-${index}`} className="flex-shrink-0 w-[280px] sm:w-[320px]">
                  <AuctionCard car={car} />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#1e1e22] to-transparent z-10"
          aria-hidden
        />
      </div>

      {/* Carousel animation styles */}
      <style jsx global>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        @keyframes scroll-right {
          0% {
            transform: translateX(-33.333%);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        .animate-scroll-left {
          animation: scroll-left 25s linear infinite;
        }
        
        .animate-scroll-right {
          animation: scroll-right 25s linear infinite;
        }
      `}</style>
    </section>
  );
}
