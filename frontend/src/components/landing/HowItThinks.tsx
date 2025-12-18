import { useState, useEffect } from "react";
import { Search, Database, ShieldCheck, Layers } from "lucide-react";

const steps = [
  {
    id: "query",
    icon: Search,
    title: "Query",
    description: "Understand your research question and intent",
  },
  {
    id: "retrieval",
    icon: Database,
    title: "Retrieval",
    description: "Search verified academic and professional sources",
  },
  {
    id: "verification",
    icon: ShieldCheck,
    title: "Verification",
    description: "Cross-reference and fact-check each finding",
  },
  {
    id: "synthesis",
    icon: Layers,
    title: "Synthesis",
    description: "Compile insights with transparent reasoning",
  },
];

const HowItThinks = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 px-6 bg-secondary/20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How ReSearchly Thinks
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A transparent pipeline from question to verified answer
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === index;
            const isPast = index < activeStep;

            return (
              <div key={step.id} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div 
                    className={`hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 transition-colors duration-500 ${
                      isPast || isActive ? "bg-primary/50" : "bg-border"
                    }`}
                  />
                )}

                <div
                  className={`glass-card p-6 text-center transition-all duration-500 cursor-pointer ${
                    isActive 
                      ? "border-primary/50 glow-primary scale-105" 
                      : "hover:border-primary/30"
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div 
                    className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors duration-500 ${
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className={`font-semibold mb-2 transition-colors duration-500 ${
                    isActive ? "text-primary" : "text-foreground"
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItThinks;
