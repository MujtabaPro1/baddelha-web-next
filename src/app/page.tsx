import { cookies } from 'next/headers';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import FeaturedCars from '../components/FeaturedCars';
import TestimonialsSection from '../components/TestimonialsSection';
import UserTypeDisplay from '../components/UserTypeDisplay';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Inspection from '../components/Inspection';
import HomeFAQSection from '../components/HomeFAQSection';
import AppPromoSection from '../components/AppPromoSection';

async function App() {
  const cookieStore = await cookies();
  const isAr = cookieStore.get('language')?.value === 'ar';

  return (
    <div className="min-h-screen bg-white">
        <HeroSection />
        <AppPromoSection />
        <Features/>
        <HowItWorks/>
        <ServicesSection />
        <FeaturedCars />
        <TestimonialsSection />
        <Inspection/>
        <UserTypeDisplay />
        <HomeFAQSection isAr={isAr} />
    </div>
  );
}

export default App;