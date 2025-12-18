import { GraduationCap, Microscope, BarChart3, Pen, Lock } from "lucide-react";

const personas = [
  { icon: Microscope, label: "Researchers" },
  { icon: GraduationCap, label: "Students" },
  { icon: BarChart3, label: "Analysts" },
  { icon: Pen, label: "Writers" },
];

const DesignedFor = () => {
  return (
    <section className="py-20 px-6 bg-secondary/20">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          Designed For
        </h2>

        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {personas.map((persona) => {
            const Icon = persona.icon;
            return (
              <div 
                key={persona.label} 
                className="flex flex-col items-center gap-3 group"
              >
                <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center group-hover:border-primary/50 transition-colors">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {persona.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Privacy Note */}
        <div className="inline-flex items-center gap-3 px-6 py-4 glass-card text-sm text-muted-foreground">
          <Lock className="w-5 h-5 text-primary" />
          <span>
            Your research sessions are private, attributable, and user-owned.
          </span>
        </div>
      </div>
    </section>
  );
};

export default DesignedFor;
