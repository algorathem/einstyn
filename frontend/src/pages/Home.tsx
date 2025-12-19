import { Link } from "react-router-dom";
import { AuthButtons } from "@/components/AuthButtons";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6 text-center">
        <h1 className="text-4xl font-bold">Welcome to ReSearchly</h1>
        <p className="text-muted-foreground">
          Your AI-powered research assistant
        </p>
        
        <div className="flex flex-col gap-4 items-center pt-6">
          <AuthButtons />
          
          <div className="pt-4">
            <Link to="/dashboard">
              <Button variant="link" className="gap-2">
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

