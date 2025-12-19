import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";

export const AuthButtons = () => {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <Button variant="outline" disabled>
        Loading...
      </Button>
    );
  }

  if (!isAuthenticated) {
    return (
      <Button onClick={() => loginWithRedirect()}>
        <LogIn className="w-4 h-4 mr-2" />
        Log in
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm">
        <User className="w-4 h-4 text-muted-foreground" />
        <span className="text-muted-foreground">
          {user?.name || user?.email || "User"}
        </span>
      </div>
      <Button
        variant="outline"
        onClick={() =>
          logout({
            logoutParams: {
              returnTo: window.location.origin,
            },
          })
        }
      >
        <LogOut className="w-4 h-4 mr-2" />
        Log out
      </Button>
    </div>
  );
};

