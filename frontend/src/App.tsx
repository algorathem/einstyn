import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { RequireAuth } from "@/components/RequireAuth";
import { RedirectIfAuthed } from "@/components/RedirectIfAuthed";
import Callback from "./pages/Callback";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
          <Route path="/" element={<Navigate to="/landing" replace />} />
          
          {/* Public routes - redirect to dashboard if authenticated */}
          <Route path="/callback" element={<Callback />} />
          <Route
            path="/landing"
            element={
              <RedirectIfAuthed>
                <Landing />
              </RedirectIfAuthed>
            }
          />
          <Route
            path="/sign-in"
            element={
              <RedirectIfAuthed>
                <SignIn />
              </RedirectIfAuthed>
            }
          />
          <Route
            path="/sign-up"
            element={
              <RedirectIfAuthed>
                <SignUp />
              </RedirectIfAuthed>
            }
          />
          
          {/* Protected routes - require authentication */}
          <Route
            path="/home"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/research"
            element={
              <RequireAuth>
                <Index />
              </RequireAuth>
            }
          />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
