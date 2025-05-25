
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/spinner';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPlan?: 'Free' | 'Basic' | 'Premium' | 'Enterprise';
}

const ProtectedRoute = ({ 
  children, 
  requiredPlan 
}: ProtectedRouteProps) => {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is authenticated but doesn't have required plan
    if (user && profile && requiredPlan && profile.plan !== requiredPlan && ['Premium', 'Enterprise'].includes(requiredPlan)) {
      toast({
        title: "Upgrade Required",
        description: `This feature requires ${requiredPlan} plan. Please upgrade to access it.`,
        variant: "destructive",
      });
    }
  }, [user, profile, requiredPlan, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    // Redirect to sign in, but remember where they were going
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  // User is authenticated, but needs to check for plan access
  if (requiredPlan && profile && requiredPlan !== 'Free') {
    const planLevels = {
      'Free': 0,
      'Basic': 1,
      'Premium': 2,
      'Enterprise': 3
    };
    
    // Check if user's plan is sufficient
    if (planLevels[profile.plan] < planLevels[requiredPlan]) {
      // Could redirect to upgrade page or just show the limited view
      return <Navigate to="/profile" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
