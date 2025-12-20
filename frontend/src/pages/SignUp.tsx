import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const SignUp = () => {
  const { loginWithRedirect, isLoading } = useAuth0();

  useEffect(() => {
    if (!isLoading) {
      loginWithRedirect({
        appState: { returnTo: "/dashboard" },
        authorizationParams: {
          screen_hint: "signup",
        },
      });
    }
  }, [isLoading, loginWithRedirect]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to sign up…</p>
      </div>
    </div>
  );
};

export default SignUp;
