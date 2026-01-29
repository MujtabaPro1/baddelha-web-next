'use client';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import FeaturedCars from '../components/FeaturedCars';
import CtaSection from '../components/CtaSection';
import TestimonialsSection from '../components/TestimonialsSection';

function App() {

  return (
    <div className="min-h-screen bg-white">
        <HeroSection />
        <ServicesSection />
        <FeaturedCars />
        <TestimonialsSection />
        <CtaSection />
    </div>
  );
}

export default App;