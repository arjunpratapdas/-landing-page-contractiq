
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const AuthSimulator = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');

  const login = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
    toast({
      title: "Logged in successfully",
      description: "You are now logged in and can access all features.",
    });
    navigate('/profile');
  };

  const logout = () => {
    localStorage.setItem('isAuthenticated', 'false');
    setIsAuthenticated(false);
    toast({
      title: "Logged out successfully",
      description: "You have been logged out.",
    });
    navigate('/');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 p-2 bg-card border border-white/10 rounded-lg shadow-lg">
      {isAuthenticated ? (
        <Button variant="destructive" onClick={logout} size="sm">
          Simulate Logout
        </Button>
      ) : (
        <Button onClick={login} size="sm" className="bg-gradient-blue">
          Simulate Login
        </Button>
      )}
    </div>
  );
};

export default AuthSimulator;
