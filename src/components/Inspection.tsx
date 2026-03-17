'use client';
import { memo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import {Button} from './ui/button';
import Card from './ui/card-v1';
import Section from './ui/section';
import lang from '../locale';
import RevealOnScroll from './ui/reveal-on-scroll';

const Inspection = memo(function Inspection() {
  const { language } = useLanguage();
  const languageContent = language === 'ar' ? 'ar' : 'en';
  const inspection: any = lang[languageContent].inspection_items;
  const highlightWord = inspection.highlightWord;
  const titleIndex = inspection.title.indexOf(highlightWord);
  const inspectionTitle =
    titleIndex === -1 ? (
      inspection.title
    ) : (
      <>
        {inspection.title.slice(0, titleIndex)}
        <span className="text-[#f78f37]">{highlightWord}</span>
        {inspection.title.slice(titleIndex + highlightWord.length)}
      </>
    );

  return (
    <Section title={null} subtitle={null}>
      <header className="mb-8 text-center">
        <RevealOnScroll>
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            {inspectionTitle}
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay={80}>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">{inspection.subtitle}</p>
        </RevealOnScroll>
      </header>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="relative overflow-hidden bg-white/90">
          <span className="pointer-events-none absolute -top-16 -start-16 h-44 w-44 rounded-full bg-brand-100/80 blur-3xl" />
          <div className="relative">
            <ul className="grid gap-3">
            {inspection.checks.map((item: any) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-white"
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-xs font-extrabold text-white">
                    ✓
                  </span>
                  {item}
              </li>
            ))}
            </ul>
            <img
              src={'/icons/settings.gif'}
              alt={inspection.settingsIconAlt}
              className="mx-auto mt-6 h-20 w-auto object-contain"
              loading="lazy"
            />
          </div>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 text-white">
          <span className="pointer-events-none absolute -bottom-20 -end-20 h-52 w-52 rounded-full bg-brand-500/30 blur-3xl" />
          <div className="relative flex h-full flex-col gap-4">
            <h3 className="text-xl font-extrabold">{inspection.cardTitle}</h3>
            <p className="mt-2 text-sm text-slate-200">{inspection.cardText}</p>
            <img
              src={'/images/banner/3.webp'}
              alt={inspection.cardImageAlt}
              className="mt-2 h-32 w-full rounded-2xl object-cover ring-1 ring-white/20"
              loading="lazy"
            />
            <div className="mt-auto">
              <Button onClick={() => {
                document.getElementById('valuation-card')?.scrollIntoView({ behavior: 'smooth' });
              }} variant="default" className="w-full shadow-lg">
                {inspection.cta}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Section>
  );
});

export default Inspection;
