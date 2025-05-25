
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { File, Menu, X, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AuthDialog from './AuthDialog';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const userInitials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).join('')
    : 'U';

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-12 glassmorphism"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <File className="h-8 w-8 text-contractBlue-400" />
          <span className="text-xl font-semibold text-white tracking-tight">Contract IQ</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex items-center space-x-1">
            <a href="#features" className="nav-link">Features</a>
            <a href="#tools" className="nav-link">Tools</a>
            <a href="#pricing" className="nav-link">Pricing</a>
            <a href="#feedback" className="nav-link">Feedback</a>
          </nav>
          
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full bg-muted/30 hover:bg-muted/50 px-3 py-1.5 border border-white/5 transition-colors">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={profile?.name || "User"} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline text-sm font-medium">{profile?.name?.split(' ')[0] || 'User'}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/contract-history')}>
                    <File className="mr-2 h-4 w-4" />
                    <span>My Contracts</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500">
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/signin">
                  <Button 
                    variant="ghost" 
                    className="text-white/90 hover:text-white"
                  >
                    Sign In
                  </Button>
                </Link>
                
                <Link to="/signup">
                  <Button 
                    className="bg-gradient-shine hover:shadow-lg hover:shadow-blue-500/20 font-medium"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
        
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={profile?.name || "User"} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/contract-history')}>
                  My Contracts
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-500 focus:text-red-500">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button className="text-white" onClick={toggleMenu}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && !user && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="md:hidden absolute top-16 left-0 right-0 p-5 glassmorphism border-t border-white/5"
        >
          <nav className="flex flex-col space-y-4">
            <a href="#features" className="text-white/90 hover:text-white py-2">Features</a>
            <a href="#tools" className="text-white/90 hover:text-white py-2">Tools</a>
            <a href="#pricing" className="text-white/90 hover:text-white py-2">Pricing</a>
            <a href="#feedback" className="text-white/90 hover:text-white py-2">Feedback</a>
          </nav>
          <div className="flex flex-col space-y-3 mt-5 pt-5 border-t border-white/5">
            <Link to="/signin">
              <Button variant="outline" className="w-full border-white/10">
                Sign In
              </Button>
            </Link>
            
            <Link to="/signup">
              <Button className="w-full bg-gradient-shine">
                Get Started
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Navbar;
