import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import TrustSection from "@/components/home/TrustSection";
import ProductOverview from "@/components/home/ProductOverview";
import FeaturesSection from "@/components/home/FeaturesSection";
import WorkflowSection from "@/components/home/WorkflowSection";
import AISection from "@/components/home/AISection";
import AnalyticsSection from "@/components/home/AnalyticsSection";
import QRSection from "@/components/home/QRSection";
import Testimonials from "@/components/home/Testimonials";
import PricingPreview from "@/components/home/PricingPreview";
import FAQ from "@/components/home/FAQ";
import CTASection from "@/components/home/CTASection";
import Footer from "@/components/home/Footer";

function Home() {
  return (
    <div className="min-h-screen bg-[#FFFDF8]">
      <Navbar />

      <main>
        <Hero />
        <TrustSection />
        <ProductOverview />
        <FeaturesSection />
        <WorkflowSection />
        <AISection />
        <AnalyticsSection />
        <QRSection />
        <Testimonials />
        <PricingPreview />
        <FAQ />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}

export default Home;