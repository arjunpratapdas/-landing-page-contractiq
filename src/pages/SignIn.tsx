
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { Eye, EyeOff, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from '@/components/ui/use-toast';
import { Spinner } from '@/components/ui/spinner';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect if already logged in
  if (user) {
    return <Navigate to="/profile" replace />;
  }
  
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      // Successful login will automatically redirect via the user check above on next render
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background text-foreground"
    >
      <Navbar />
      
      <div className="pt-28 pb-16 px-4">
        <div className="max-w-md mx-auto bg-card rounded-xl border border-white/5 p-8">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 rounded-full bg-contractBlue-500/20 flex items-center justify-center">
                <File className="h-6 w-6 text-contractBlue-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
            <p className="text-white/60 text-sm">
              Sign in to access your Contract IQ dashboard
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            
            <Button
              type="submit"
              className="w-full bg-gradient-blue hover:shadow-lg hover:shadow-blue-500/20 transition-all py-5"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Spinner size="sm" className="mr-2" />
                  Signing in...
                </span>
              ) : (
                <>Sign In</>
              )}
            </Button>
            
            <div className="text-center text-white/60 text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-contractBlue-400 hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </motion.div>
  );
};

export default SignIn;
