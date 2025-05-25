
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import UserLayout from '@/components/UserLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Bell, Shield, Key, FileCheck, Clock, Loader2, Crown, Zap, Lock, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile as UserProfileType } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { profile, updateProfile, isLoading } = useAuth();
  const [userData, setUserData] = useState<Partial<UserProfileType>>({
    name: '',
    email: '',
    role: '',
    company: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Feature availability based on user plan
  const planFeatures = {
    'Free': {
      contractsLimit: 3,
      aiAnalysis: false,
      teamMembers: 1,
      templates: 2,
      support: 'Email',
      storageGB: 1,
    },
    'Basic': {
      contractsLimit: 20,
      aiAnalysis: true,
      teamMembers: 3,
      templates: 10,
      support: 'Priority Email',
      storageGB: 5,
    },
    'Premium': {
      contractsLimit: 100,
      aiAnalysis: true,
      teamMembers: 10,
      templates: 'Unlimited',
      support: 'Phone + Email',
      storageGB: 20,
    },
    'Enterprise': {
      contractsLimit: 'Unlimited',
      aiAnalysis: true,
      teamMembers: 'Unlimited',
      templates: 'Unlimited',
      support: 'Dedicated Manager',
      storageGB: 100,
    },
  };

  useEffect(() => {
    if (profile) {
      setUserData({
        name: profile.name,
        email: profile.email,
        role: profile.role,
        company: profile.company,
      });
    }
  }, [profile]);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        name: userData.name || '',
        role: userData.role || '',
        company: userData.company || '',
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNavigate = (path: string, requiredPlan?: 'Free' | 'Basic' | 'Premium' | 'Enterprise') => {
    if (requiredPlan && profile) {
      const planLevels = {
        'Free': 0,
        'Basic': 1,
        'Premium': 2,
        'Enterprise': 3
      };
      
      if (planLevels[profile.plan] < planLevels[requiredPlan]) {
        toast({
          title: "Upgrade Required",
          description: `This feature requires ${requiredPlan} plan. Please upgrade to access.`,
          variant: "destructive",
        });
        return;
      }
    }
    
    navigate(path);
  };

  if (isLoading) {
    return (
      <UserLayout currentTab="profile">
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 text-contractBlue-400 animate-spin" />
        </div>
      </UserLayout>
    );
  }

  const userPlan = profile?.plan || 'Free';
  const features = planFeatures[userPlan as keyof typeof planFeatures];

  return (
    <UserLayout currentTab="profile">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="bg-muted/30 border border-white/10">
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} alt={profile?.name} />
                <AvatarFallback>{profile?.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{profile?.name || 'User'}</CardTitle>
              <CardDescription>{profile?.role || 'User'} at {profile?.company || 'Company'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Plan</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  userPlan === 'Free' ? 'bg-gray-500/20 text-gray-400' :
                  userPlan === 'Basic' ? 'bg-blue-500/20 text-blue-400' :
                  userPlan === 'Premium' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {userPlan}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Member Since</span>
                <span>{new Date(profile?.join_date || '').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Contracts Created</span>
                <span>{profile?.contracts_created} / {typeof features.contractsLimit === 'string' ? features.contractsLimit : features.contractsLimit}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Contracts Reviewed</span>
                <span>{profile?.contracts_reviewed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Storage</span>
                <span>{features.storageGB} GB</span>
              </div>
            </CardContent>
            <CardFooter>
              {userPlan !== 'Enterprise' && (
                <Button variant="outline" className="w-full">Upgrade Plan</Button>
              )}
            </CardFooter>
          </Card>
        </div>
      
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-muted/30 border border-white/10">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={userData.name || ''} 
                    onChange={e => setUserData({...userData, name: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={userData.email || ''} 
                    disabled 
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input 
                    id="role" 
                    value={userData.role || ''} 
                    onChange={e => setUserData({...userData, role: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input 
                    id="company" 
                    value={userData.company || ''} 
                    onChange={e => setUserData({...userData, company: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="bg-gradient-blue"
                onClick={handleSaveChanges}
                disabled={isSaving}
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-muted/30 border border-white/10">
            <CardHeader>
              <CardTitle>Your Plan Features</CardTitle>
              <CardDescription>Features available with your {userPlan} plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div 
                className={`flex items-center justify-between p-3 rounded-lg ${features.aiAnalysis ? 'bg-green-500/10 border border-green-500/20' : 'bg-gray-500/10 border border-gray-500/20'}`}
                onClick={() => handleNavigate('/smart-automation', 'Basic')}
              >
                <div className="flex items-center space-x-4">
                  <Zap className={`h-5 w-5 ${features.aiAnalysis ? 'text-green-400' : 'text-gray-400'}`} />
                  <div>
                    <p className="font-medium">AI Contract Analysis</p>
                    <p className="text-sm text-muted-foreground">Automatically analyze contracts for risks</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {!features.aiAnalysis && <Lock className="h-4 w-4 mr-2 text-gray-400" />}
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              
              <div 
                className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20 cursor-pointer"
                onClick={() => handleNavigate('/contract-history')}
              >
                <div className="flex items-center space-x-4">
                  <FileCheck className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="font-medium">Contract History</p>
                    <p className="text-sm text-muted-foreground">Access up to {typeof features.contractsLimit === 'string' ? features.contractsLimit : features.contractsLimit} contracts</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
              
              <div 
                className={`flex items-center justify-between p-3 rounded-lg ${userPlan !== 'Free' ? 'bg-green-500/10 border border-green-500/20' : 'bg-gray-500/10 border border-gray-500/20'}`}
                onClick={() => handleNavigate('/compliance-audit', 'Basic')}
              >
                <div className="flex items-center space-x-4">
                  <Shield className={`h-5 w-5 ${userPlan !== 'Free' ? 'text-green-400' : 'text-gray-400'}`} />
                  <div>
                    <p className="font-medium">Compliance & Audit</p>
                    <p className="text-sm text-muted-foreground">Advanced compliance checking tools</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {userPlan === 'Free' && <Lock className="h-4 w-4 mr-2 text-gray-400" />}
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              
              <div 
                className={`flex items-center justify-between p-3 rounded-lg ${userPlan !== 'Free' ? 'bg-green-500/10 border border-green-500/20' : 'bg-gray-500/10 border border-gray-500/20'}`}
                onClick={() => handleNavigate('/workflow-automation', 'Basic')}
              >
                <div className="flex items-center space-x-4">
                  <Crown className={`h-5 w-5 ${userPlan !== 'Free' ? 'text-green-400' : 'text-gray-400'}`} />
                  <div>
                    <p className="font-medium">Workflow Automation</p>
                    <p className="text-sm text-muted-foreground">Automate approval workflows ({userPlan === 'Free' ? 'Upgrade required' : 'Available'})</p>
                  </div>
                </div>
                <div className="flex items-center">
                  {userPlan === 'Free' && <Lock className="h-4 w-4 mr-2 text-gray-400" />}
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserProfile;
