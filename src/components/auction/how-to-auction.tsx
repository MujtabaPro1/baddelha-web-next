"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import lang from "../../locale";

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const stepIcons = [
  (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  ),
];

function StepCard({ step, index }: { step: Step; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col items-center text-center"
    >
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[#ee3c48]/12 bg-gradient-to-br from-[#ee3c48]/10 to-[#f78f37]/[0.03] text-[#ee3c48] shadow-lg shadow-[#ee3c48]/5 transition-all duration-300 group-hover:border-[#ee3c48]/20 group-hover:shadow-[#ee3c48]/10">
          {step.icon}
        </div>
        <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#ee3c48] to-[#f78f37] text-[11px] font-bold text-white shadow-md shadow-[#ee3c48]/30">
          {step.number}
        </span>
      </div>

      <h3 className="text-lg font-bold text-[#3d3d40] sm:text-xl">{step.title}</h3>
      <p className="mt-2.5 max-w-xs text-sm leading-relaxed text-[#3d3d40]/60">{step.description}</p>
    </motion.div>
  );
}

function Connector() {
  return (
    <div className="hidden items-center justify-center lg:flex">
      <div className="h-px w-full bg-gradient-to-r from-[#ee3c48]/20 via-[#f78f37]/15 to-[#ee3c48]/20" />
      <div className="mx-1 h-2 w-2 shrink-0 rotate-45 border-r border-t border-[#ee3c48]/25 bg-transparent" />
    </div>
  );
}

export function HowToAuction() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { language } = useLanguage();
  const languageContent = language === 'ar' ? 'ar' : 'en';
  const t = lang[languageContent].auction.howTo;

  const steps: Step[] = t.steps.map((step: any, index: number) => ({
    number: step.number,
    title: step.title,
    description: step.description,
    icon: stepIcons[index],
  }));

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#f4f4f4] py-24 sm:py-32"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ee3c48]/12 to-transparent" />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-[#ee3c48]/[0.02] blur-[80px]" />
        <div className="absolute -right-32 top-1/3 h-[350px] w-[350px] rounded-full bg-[#f78f37]/[0.02] blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-[#ee3c48]/12 bg-[#ee3c48]/[0.05] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#ee3c48]"
          >
            {t.badge}
          </motion.span>

          <div className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            <span className="text-[#3d3d40]">{t.title1}</span>{" "}
            <h2 className="inline text-[#3d3d40]">{t.title2}</h2>
          </div>

          <p className="mt-4 text-base leading-relaxed text-[#3d3d40]/60 sm:text-lg">
            {t.subtitle}
          </p>
        </div>

        {/* Steps grid */}
        <div className="mt-16 grid grid-cols-1 gap-12 sm:mt-20 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:gap-6">
          <StepCard step={steps[0]} index={0} />
          <Connector />
          <StepCard step={steps[1]} index={1} />
          <Connector />
          <StepCard step={steps[2]} index={2} />
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 flex justify-center sm:mt-20"
        >
          <button 
          onClick={()=>{
            window.location.href = "https://dealer.baddelha.com.sa"
          }}
          className="group relative overflow-hidden rounded-xl bg-[#ee3c48] px-10 py-4 text-sm font-bold text-white shadow-lg shadow-[#ee3c48]/25 transition-all hover:shadow-xl hover:shadow-[#ee3c48]/30">
            <span className="relative z-10">{t.ctaButton}</span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
