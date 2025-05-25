
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import UserProfile from "./pages/UserProfile";
import ContractHistory from "./pages/ContractHistory";
import SmartAutomation from "./pages/SmartAutomation";
import ComplianceAudit from "./pages/ComplianceAudit";
import WorkflowAutomation from "./pages/WorkflowAutomation";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider>
          <BrowserRouter>
            <Toaster />
            <Sonner />
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                
                {/* Protected routes with plan requirements */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                } />
                <Route path="/contract-history" element={
                  <ProtectedRoute>
                    <ContractHistory />
                  </ProtectedRoute>
                } />
                <Route path="/smart-automation" element={
                  <ProtectedRoute requiredPlan="Basic">
                    <SmartAutomation />
                  </ProtectedRoute>
                } />
                <Route path="/compliance-audit" element={
                  <ProtectedRoute requiredPlan="Basic">
                    <ComplianceAudit />
                  </ProtectedRoute>
                } />
                <Route path="/workflow-automation" element={
                  <ProtectedRoute requiredPlan="Premium">
                    <WorkflowAutomation />
                  </ProtectedRoute>
                } />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
