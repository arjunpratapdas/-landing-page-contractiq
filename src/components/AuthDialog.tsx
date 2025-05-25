
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface AuthDialogProps {
  mode: 'signin' | 'signup';
  setMode: (mode: 'signin' | 'signup') => void;
}

const AuthDialog = ({ mode, setMode }: AuthDialogProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: mode === 'signin' ? "Welcome back!" : "Account created successfully!",
        description: mode === 'signin' 
          ? "You've successfully signed in to your account." 
          : "Your account has been created. You can now use all features.",
      });
    }, 1500);
  };
  
  const variants = {
    hidden: { opacity: 0, x: mode === 'signin' ? -20 : 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: mode === 'signin' ? 20 : -20 }
  };

  return (
    <div className="w-full max-w-md mx-auto p-2">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-2">
          <div className="w-12 h-12 rounded-full bg-contractBlue-500/20 flex items-center justify-center">
            <File className="h-6 w-6 text-contractBlue-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">
          {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-white/60 text-sm">
          {mode === 'signin' 
            ? 'Sign in to access your Contract IQ dashboard' 
            : 'Join Contract IQ to streamline your contract workflow'}
        </p>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.form 
          key={mode}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.25 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {mode === 'signup' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                className="form-input"
                required
              />
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="form-input"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="form-input pr-10"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          {mode === 'signup' && (
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  aria-describedby="terms"
                  type="checkbox"
                  className="w-4 h-4 bg-muted/50 border-white/10 rounded focus:ring-contractBlue-500"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-white/60">
                  I agree to the <a href="#" className="text-contractBlue-400 hover:underline">Terms of Service</a> and <a href="#" className="text-contractBlue-400 hover:underline">Privacy Policy</a>
                </label>
              </div>
            </div>
          )}
          
          <Button
            type="submit"
            className="w-full bg-gradient-blue hover:shadow-lg hover:shadow-blue-500/20 transition-all py-5"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>{mode === 'signin' ? 'Sign In' : 'Create Account'}</>
            )}
          </Button>
          
          <div className="text-center text-white/60 text-sm">
            {mode === 'signin' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-contractBlue-400 hover:underline font-medium"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-contractBlue-400 hover:underline font-medium"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </motion.form>
      </AnimatePresence>
    </div>
  );
};

export default AuthDialog;
