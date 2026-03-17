'use client';
import { memo } from 'react';
import  Card  from './ui/card-v1';
import Section from './ui/section';
import { useLanguage } from '../contexts/LanguageContext';
import lang from '../locale';
import BlurText from './ui/blur-text';
import TiltCard from './ui/tilt-card';

const stepIcons = ['/icons/appointment.gif', '/icons/car-inspection.png', '/icons/payment.gif'];

const CarTypeIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand-500" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 13.5V16a1.5 1.5 0 0 0 1.5 1.5h.5a2 2 0 1 0 4 0h6a2 2 0 1 0 4 0h.5A1.5 1.5 0 0 0 21 16v-2.2a2 2 0 0 0-.8-1.6l-2.8-2.1a3 3 0 0 0-1.8-.6H9.8a3 3 0 0 0-2.2 1L6 12H4.5A1.5 1.5 0 0 0 3 13.5Z" />
    <circle cx="7" cy="17.5" r="1.5" />
    <circle cx="17" cy="17.5" r="1.5" />
  </svg>
);

const HowItWorks = memo(function HowItWorks() {
  const { language } = useLanguage();
  const languageContent = language === 'ar' ? 'ar' : 'en';
  const howItWorks = lang[languageContent].howItWorksSteps;
  const dreamItems = [...howItWorks.dreamTypes, ...howItWorks.dreamTypes];

  return (
    <Section title={null} subtitle={null}>
      <header className="mb-8 text-center">
        <BlurText
          text={howItWorks.title}
          className="text-3xl font-extrabold text-slate-900 sm:text-4xl"
          animateBy="words"
          direction="top"
          delay={60}
        />
        <BlurText
          text={howItWorks.subtitle}
          className="mt-2 text-sm text-slate-600 sm:text-base"
          animateBy="words"
          direction="bottom"
          delay={30}
        />
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {howItWorks.steps.map((step, index) => (
          <TiltCard key={step.title}>
            <Card className="relative pt-10 min-h-[195px]">
              <span className="absolute right-5 top-4 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-extrabold text-[#ee3c48] ring-1 ring-slate-200">
                {index + 1}
              </span>
              <img
                src={stepIcons[index]}
                alt={step.title}
                className="h-12 w-12 rounded-lg object-contain"
                loading="lazy"
              />
              <h3 className="text-base font-extrabold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{step.description}</p>
            </Card>
          </TiltCard>
        ))}
      </div>

      <div className="mt-10 rounded-2xl bg-[#f3f3f3] px-4 py-8 sm:px-8">
        <div className="flex items-center gap-4">
          <span className="h-px flex-1 bg-brand-100" />
          <h3 className="text-center text-3xl font-extrabold text-slate-700 sm:text-5xl">{howItWorks.dreamTitle}</h3>
          <span className="h-px flex-1 bg-brand-100" />
        </div>

        <div className="dream-marquee mt-8">
          <div className="dream-marquee-track">
            {dreamItems.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="me-4 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 ring-1 ring-slate-200"
              >
                <CarTypeIcon />
                <span className="text-xl font-extrabold text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
});

export default HowItWorks;
