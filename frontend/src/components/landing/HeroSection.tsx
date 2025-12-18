import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>AI-Powered Research Intelligence</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
          <span className="text-foreground">Re</span>
          <span className="text-primary glow-text">Search</span>
          <span className="text-foreground">ly</span>
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Research that thinks with you. Verified sources, transparent reasoning, 
          and citations you can trust.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button 
            size="lg" 
            className="group px-8 py-6 text-lg font-medium"
            onClick={() => navigate("/sign-up")}
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="px-8 py-6 text-lg font-medium border-glass-border hover:bg-secondary/50"
            onClick={() => navigate("/sign-in")}
          >
            Sign In
          </Button>
        </div>

        {/* Trust Indicator */}
        <p className="text-sm text-muted-foreground pt-8">
          Trusted by researchers, students, and analysts worldwide
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
