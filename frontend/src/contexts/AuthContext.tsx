import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("mock_user");
    return stored ? JSON.parse(stored) : null;
  });

  const signIn = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - accepts any credentials
    await new Promise((resolve) => setTimeout(resolve, 800));
    const mockUser = { name: "Researcher", email };
    setUser(mockUser);
    localStorage.setItem("mock_user", JSON.stringify(mockUser));
    return true;
  };

  const signUp = async (name: string, email: string, password: string): Promise<boolean> => {
    // Mock sign up - accepts any credentials
    await new Promise((resolve) => setTimeout(resolve, 800));
    const mockUser = { name, email };
    setUser(mockUser);
    localStorage.setItem("mock_user", JSON.stringify(mockUser));
    return true;
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("mock_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
