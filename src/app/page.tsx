import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import FeaturedCars from '../components/FeaturedCars';
import TestimonialsSection from '../components/TestimonialsSection';
import UserTypeDisplay from '../components/UserTypeDisplay';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Inspection from '../components/Inspection';

function App() {

  return (
    <div className="min-h-screen bg-white">
        <HeroSection />
        <Features/>
        <HowItWorks/>
        <ServicesSection />
        <FeaturedCars />
        <TestimonialsSection />
        <Inspection/>
        <UserTypeDisplay />
    </div>
  );
}

export default App;