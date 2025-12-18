import { CheckCircle, Quote, Network } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SampleOutputPreview = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A glimpse into the research synthesis pipeline
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Knowledge Map Preview */}
          <Card className="glass-card-hover overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Network className="w-5 h-5" />
                <span className="font-medium">Knowledge Map</span>
              </div>
              <div className="relative h-40 rounded-lg bg-secondary/30 overflow-hidden">
                {/* Animated nodes visualization */}
                <svg className="w-full h-full" viewBox="0 0 200 120">
                  <circle cx="50" cy="40" r="8" fill="hsl(175, 85%, 45%)" opacity="0.8" className="animate-pulse-slow" />
                  <circle cx="100" cy="30" r="6" fill="hsl(200, 70%, 45%)" opacity="0.7" className="animate-pulse-slow" style={{ animationDelay: "0.5s" }} />
                  <circle cx="150" cy="50" r="7" fill="hsl(280, 60%, 50%)" opacity="0.6" className="animate-pulse-slow" style={{ animationDelay: "1s" }} />
                  <circle cx="80" cy="80" r="5" fill="hsl(175, 85%, 45%)" opacity="0.5" className="animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
                  <circle cx="130" cy="90" r="6" fill="hsl(200, 70%, 45%)" opacity="0.6" className="animate-pulse-slow" style={{ animationDelay: "2s" }} />
                  
                  <line x1="50" y1="40" x2="100" y2="30" stroke="hsl(175, 50%, 30%)" strokeWidth="1" opacity="0.4" />
                  <line x1="100" y1="30" x2="150" y2="50" stroke="hsl(175, 50%, 30%)" strokeWidth="1" opacity="0.4" />
                  <line x1="50" y1="40" x2="80" y2="80" stroke="hsl(175, 50%, 30%)" strokeWidth="1" opacity="0.4" />
                  <line x1="150" y1="50" x2="130" y2="90" stroke="hsl(175, 50%, 30%)" strokeWidth="1" opacity="0.4" />
                  <line x1="80" y1="80" x2="130" y2="90" stroke="hsl(175, 50%, 30%)" strokeWidth="1" opacity="0.4" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">
                Connected research topics and source relationships
              </p>
            </CardContent>
          </Card>

          {/* Findings Card Preview */}
          <Card className="glass-card-hover overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Verified Finding</span>
              </div>
              <div className="space-y-3 p-4 rounded-lg bg-secondary/30">
                <div className="flex items-center justify-between">
                  <Badge className="trust-high text-xs">Trust: 94%</Badge>
                  <Badge variant="outline" className="text-xs border-success/30 text-success">
                    ✓ Verified
                  </Badge>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  "Machine learning models achieve 89% accuracy in early detection..."
                </p>
                <p className="text-xs text-muted-foreground">
                  Nature Medicine, 2024
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Each finding includes trust scores and verification status
              </p>
            </CardContent>
          </Card>

          {/* Cited Excerpt Preview */}
          <Card className="glass-card-hover overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Quote className="w-5 h-5" />
                <span className="font-medium">Cited Excerpt</span>
              </div>
              <div className="space-y-3 p-4 rounded-lg bg-secondary/30 border-l-2 border-primary">
                <p className="text-sm text-foreground italic leading-relaxed">
                  "The integration of retrieval-augmented generation significantly reduces 
                  hallucination rates in knowledge-intensive tasks."
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-primary font-mono">[1]</span>
                  <span className="text-xs text-muted-foreground">
                    Lewis et al., 2020 · APA
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                One-click citations in APA, IEEE, or MLA format
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SampleOutputPreview;
