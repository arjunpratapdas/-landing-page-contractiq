
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AuthDialog from './AuthDialog';
import { useState } from 'react';

const Pricing = () => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  
  return (
    <div className="py-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            Start Using Contract IQ Today
          </h2>
          
          <p className="text-lg text-white/70">
            Try all features free for 3 days, then choose your plan
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Free Trial Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card rounded-xl border border-white/5 p-8 relative overflow-hidden"
          >
            <div className="relative z-10">
              <h3 className="text-xl font-semibold mb-5">Included in Trial</h3>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-contractBlue-400 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Unlimited Document Analysis</p>
                    <p className="text-white/60 text-sm">Analyze any number of documents during your trial period</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-contractBlue-400 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Contract Generation</p>
                    <p className="text-white/60 text-sm">Create custom contracts from our template library</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-contractBlue-400 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Compliance Tracking</p>
                    <p className="text-white/60 text-sm">Monitor compliance across all your agreements</p>
                  </div>
                </li>
              </ul>
              
              <p className="text-white/70 text-sm mb-5">Get full access to all features for 3 days</p>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full bg-gradient-blue hover:shadow-lg hover:shadow-blue-500/20 py-6 font-medium"
                    onClick={() => setAuthMode('signup')}
                  >
                    Start Free Trial
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-card border-white/5">
                  <AuthDialog mode={authMode} setMode={setAuthMode} />
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Background decoration */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-contractBlue-500/10 rounded-full blur-3xl opacity-50"></div>
          </motion.div>
          
          {/* Professional Plan Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-muted/50 to-muted/10 rounded-xl border border-white/10 p-8 relative overflow-hidden"
          >
            <div className="absolute top-3 right-3 bg-white/10 px-3 py-1 rounded-full text-xs font-medium">
              After Trial
            </div>
            
            <div className="relative z-10">
              <h3 className="text-xl font-semibold mb-5">Professional Features</h3>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-contractBlue-400 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Priority Support</p>
                    <p className="text-white/60 text-sm">Get faster responses from our support team</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-contractBlue-400 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Advanced AI Features</p>
                    <p className="text-white/60 text-sm">Access to our most sophisticated contract analysis tools</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-contractBlue-400 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Unlimited Storage</p>
                    <p className="text-white/60 text-sm">Store an unlimited number of contracts and documents</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-contractBlue-400 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Team Collaboration</p>
                    <p className="text-white/60 text-sm">Work together with your team on contracts</p>
                  </div>
                </li>
              </ul>
              
              <div className="mb-5">
                <div className="flex items-center justify-center">
                  <span className="text-white/60 text-sm">Starting from</span>
                  <span className="text-2xl font-bold ml-2">$49</span>
                  <span className="text-white/60 text-sm ml-1">/month</span>
                </div>
              </div>
              
              <Button variant="outline" className="w-full border-white/10 py-6 font-medium hover:bg-white/5">
                Learn More
              </Button>
            </div>
            
            {/* Background decoration */}
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-contractBlue-500/10 rounded-full blur-3xl opacity-50"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
