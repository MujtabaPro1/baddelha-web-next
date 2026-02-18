import { memo } from 'react';

const Section = memo(function Section({ id, title, subtitle, className = '', children }: any) {
  return (
    <section id={id} className={`py-12 sm:py-16 ${className}`.trim()}>
      <div className="max-w-6xl mx-auto px-4">
        {(title || subtitle) && (
          <header className="mb-8 text-center">
            {title && <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{title}</h2>}
            {subtitle && <p className="mt-2 text-sm text-slate-600 sm:text-base">{subtitle}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
});

export default Section;