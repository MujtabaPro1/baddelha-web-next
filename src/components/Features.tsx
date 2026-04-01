'use client';
import { memo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Section from './ui/section';
import ValuationWidget from './ValuationWidget';
import lang from '../locale';

const Features = memo(function Features() {
  const { language } = useLanguage();
  const languageContent = language === 'ar' ? 'ar' : 'en';
  const features: any = lang[languageContent].features_widget;

  return (
    <Section id="valuation-card" title={features.title} subtitle={features.subtitle}>
      <ValuationWidget/>
    </Section>
  );
});

export default Features;
