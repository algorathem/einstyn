import { KnowledgeGraph } from "@/components/background/KnowledgeGraph";
import HeroSection from "@/components/landing/HeroSection";
import SampleOutputPreview from "@/components/landing/SampleOutputPreview";
import HowItThinks from "@/components/landing/HowItThinks";
import TrustVerification from "@/components/landing/TrustVerification";
import DesignedFor from "@/components/landing/DesignedFor";
import FAQSection from "@/components/landing/FAQSection";
import LandingFooter from "@/components/landing/LandingFooter";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient Knowledge Graph Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.06]">
        <KnowledgeGraph />
      </div>

      {/* Main Content */}
      <main className="relative z-10">
        <HeroSection />
        <SampleOutputPreview />
        <HowItThinks />
        <TrustVerification />
        <DesignedFor />
        <FAQSection />
        <LandingFooter />
      </main>
    </div>
  );
};

export default Landing;
