'use client';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import FeaturedCars from '../components/FeaturedCars';
import CtaSection from '../components/CtaSection';

function App() {

  return (
    <div className="min-h-screen bg-white">
        <HeroSection />
        <ServicesSection />
        <FeaturedCars />
        <CtaSection />
    </div>
  );
}

export default App;