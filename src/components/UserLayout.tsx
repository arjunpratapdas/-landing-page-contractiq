
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserRound, FileText, ShieldAlert, Workflow } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';

interface UserLayoutProps {
  children: React.ReactNode;
  currentTab: string;
}

const UserLayout = ({ children, currentTab }: UserLayoutProps) => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  
  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background text-foreground overflow-x-hidden"
    >
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-4">My Contract IQ Dashboard</h1>
          <p className="text-muted-foreground">Manage your contracts and access all Contract IQ features</p>
        </div>
        
        <Tabs defaultValue={currentTab} className="w-full" onValueChange={(value) => navigate(`/${value}`)}>
          <TabsList className="mb-8 bg-muted/30 border border-white/10 p-1 overflow-x-auto flex w-full md:w-auto max-w-full">
            <TabsTrigger value="profile" className="flex items-center gap-2 px-4 py-2">
              <UserRound className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="contract-history" className="flex items-center gap-2 px-4 py-2">
              <FileText className="h-4 w-4" />
              <span>Contract History</span>
            </TabsTrigger>
            <TabsTrigger value="smart-automation" className="flex items-center gap-2 px-4 py-2">
              <FileText className="h-4 w-4" />
              <span>Smart Automation</span>
            </TabsTrigger>
            <TabsTrigger value="compliance-audit" className="flex items-center gap-2 px-4 py-2">
              <ShieldAlert className="h-4 w-4" />
              <span>Compliance & Audit</span>
            </TabsTrigger>
            <TabsTrigger value="workflow-automation" className="flex items-center gap-2 px-4 py-2">
              <Workflow className="h-4 w-4" />
              <span>Workflow Automation</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="bg-card rounded-xl border border-white/5 p-6 md:p-8">
            {children}
          </div>
        </Tabs>
      </div>
      
      <Footer />
    </motion.div>
  );
};

export default UserLayout;
