
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AuthDialog from './AuthDialog';
import { useState } from 'react';

const Hero = () => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  
  return (
    <div className="min-h-screen flex flex-col justify-center px-4 md:px-8">
      <div className="max-w-6xl mx-auto w-full pt-28">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <Brain className="mr-2 h-4 w-4 text-contractBlue-400" />
            <span className="text-sm font-medium">Intelligent Contract Management</span>
          </div>
          
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 gradient-text leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            AI-Powered Contract Intelligence
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Analyze contracts, generate agreements, and track compliance with our intelligent
            contract platform
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto px-8 py-6 font-medium bg-gradient-shine hover:shadow-lg hover:shadow-blue-500/20 interactive-button"
                >
                  Get Started
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-card border-white/5">
                <AuthDialog mode={authMode} setMode={setAuthMode} />
              </DialogContent>
            </Dialog>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto px-8 py-6 font-medium text-white border-white/10 hover:bg-white/5 interactive-button"
            >
              See Demo
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
