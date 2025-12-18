import { Shield, CheckCircle, Eye, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Trust Score",
    description: "AI-assigned reliability scores based on source credibility, recency, and cross-validation.",
  },
  {
    icon: CheckCircle,
    title: "Fact-Check Status",
    description: "Every finding is verified against multiple sources before presentation.",
  },
  {
    icon: Eye,
    title: "Source Transparency",
    description: "Full visibility into where each piece of information originates.",
  },
  {
    icon: FileText,
    title: "Citation Control",
    description: "Export citations in APA, IEEE, or MLA format with one click.",
  },
];

const TrustVerification = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trust & Verification
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Research you can rely on, with complete transparency
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.title} 
                className="glass-card-hover group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustVerification;
