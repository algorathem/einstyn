import { Link } from "react-router-dom";
import { AuthButtons } from "@/components/AuthButtons";
import { Button } from "@/components/ui/button";
import { Home, Microscope, LayoutDashboard } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <AuthButtons />
        </div>
        
        <div className="bg-card rounded-lg border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Navigation</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/home">
              <Button variant="outline" className="gap-2">
                <Home className="w-4 h-4" />
                Home
              </Button>
            </Link>
            <Link to="/research">
              <Button variant="outline" className="gap-2">
                <Microscope className="w-4 h-4" />
                Research
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" className="gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Protected Content</h2>
          <p className="text-muted-foreground">
            This is a protected page. Only authenticated users can see this content.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

