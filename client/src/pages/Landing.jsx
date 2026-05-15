import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/hero/HeroSection";
import FeaturesSection from "../components/features/FeaturesSection";
import AnalyticsSection from "../components/analytics/AnalyticsSection";
import PricingSection from "../components/pricing/PricingSection";
import TestimonialsSection from "../components/testimonials/TestimonialsSection";
import Footer from "../components/layout/Footer";

export default function LandingPage() {
  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] overflow-x-hidden">
      <Navbar />

      <main className="pt-24">
        <HeroSection />
        <FeaturesSection />
        <AnalyticsSection />
        <PricingSection />
        <TestimonialsSection />
      </main>

      <Footer />
    </div>
  );
}
