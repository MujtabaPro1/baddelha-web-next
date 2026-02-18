import { memo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import  Card  from './ui/card-v1';
import Orb from './motions/orb';
import lang from '../locale';

const Locations = memo(function Locations() {
  const { language } = useLanguage();
  const languageContent = language === 'ar' ? 'ar' : 'en';
  const testimonials: any = lang[languageContent].testimonials_items;

  return (
    <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#020013] py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">{testimonials.title}</h2>
          <p className="mt-2 text-sm text-slate-300 sm:text-base">{testimonials.subtitle}</p>
        </header>
        <div className="relative h-[620px] w-full">
          <div className="absolute inset-0">
            <Orb hoverIntensity={2} rotateOnHover hue={76} forceHoverState={false} backgroundColor="#000000" />
          </div>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 py-10 sm:px-8">
            <div className="pointer-events-auto grid w-full max-w-6xl gap-4 md:grid-cols-3">
              {testimonials.items.map((item: any) => (
                <Card key={item.author} className="bg-[#e5e7eb] backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-brand-50 px-2 py-1 text-xs font-bold text-brand-700">
                      {item.platform}
                    </span>
                    <span className="text-sm text-amber-500">{item.rating}</span>
                  </div>
                  <p className="mt-4 text-sm text-slate-600">"{item.comment}"</p>
                  <p className="mt-4 text-xs font-bold text-slate-500">{item.author}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Locations;
