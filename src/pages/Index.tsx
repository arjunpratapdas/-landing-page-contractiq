
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Tools from "@/components/Tools";
import Pricing from "@/components/Pricing";
import Feedback from "@/components/Feedback";
import Footer from "@/components/Footer";
import AuthSimulator from "@/components/AuthSimulator";

const Index = () => {
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background text-foreground overflow-x-hidden"
    >
      <Navbar />
      <Hero />
      
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/0 via-contractBlue-900/5 to-background z-0 pointer-events-none"></div>
        <div className="relative z-10">
          <section id="features">
            <Features />
          </section>
          <section id="tools">
            <Tools />
          </section>
          <section id="pricing">
            <Pricing />
          </section>
          <section id="feedback">
            <Feedback />
          </section>
        </div>
      </div>
      
      <Footer />
      <AuthSimulator />
    </motion.div>
  );
};

export default Index;
