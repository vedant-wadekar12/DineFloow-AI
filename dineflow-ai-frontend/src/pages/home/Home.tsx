import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import ProductOverview from "@/components/home/ProductOverview";
import FeatureSection from "@/components/home/FeaturesSection";
import AnalyticsSection from "@/components/home/AnalyticsSection";
import AISection from "@/components/home/AISection";
import QRSection from "@/components/home/QRSection";
import PricingPreview from "@/components/home/PricingPreview";
import CTASection from "@/components/home/CTASection";
import FAQ from "@/components/home/FAQ";
import Footer from "@/components/home/Footer";

function Home() {
  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      <Navbar />

      <main>
        <Hero />
        <ProductOverview />
        <FeatureSection />
        <AnalyticsSection />
        <AISection />
        <QRSection />
        <PricingPreview />
        <CTASection />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}

export default Home;