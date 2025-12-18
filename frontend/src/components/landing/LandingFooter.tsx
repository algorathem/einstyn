import { FooterGraph } from "@/components/background/FooterGraph";

const LandingFooter = () => {
  return (
    <footer className="relative py-12 px-6 border-t border-glass-border/30">
      {/* Background Graph Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FooterGraph />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">
              <span className="text-foreground">Re</span>
              <span className="text-primary">Search</span>
              <span className="text-foreground">ly</span>
            </span>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} ReSearchly. Research that thinks with you.
          </p>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
