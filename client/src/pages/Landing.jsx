import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/hero/HeroSection";
import FeaturesSection from "../components/features/FeaturesSection";
import AnalyticsSection from "../components/analytics/AnalyticsSection";
import TestimonialsSection from "../components/testimonials/TestimonialsSection";
import Footer from "../components/layout/Footer";

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden bg-[#f5f7fb] text-[#101828]">
      <Navbar />

      <main className="pt-14">
        <HeroSection />
        <FeaturesSection />
        <AnalyticsSection />
        <TestimonialsSection />
      </main>

      <Footer />
    </div>
  );
}
