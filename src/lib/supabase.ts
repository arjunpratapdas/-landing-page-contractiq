
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase credentials - these are public keys
const supabaseUrl = 'https://rzeevbprnlfitqbzuvco.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZWV2YnBybmxmaXRxYnp1dmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3MDYyNTUsImV4cCI6MjA1ODI4MjI1NX0.bjVOcr5_fgt2-3DXLDUXpHqF-20bqmunB9DeLM3aOC8';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// User types for the application
export type UserProfile = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  avatar_url?: string;
  plan: 'Free' | 'Basic' | 'Premium' | 'Enterprise';
  join_date: string;
  contracts_created: number;
  contracts_reviewed: number;
  notifications_enabled: boolean;
};

export type ContractRecord = {
  id: string;
  user_id: string;
  title: string;
  status: 'Draft' | 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
  updated_at: string;
  contract_type: string;
  document_url?: string;
  parties_involved: string[];
};

// Helper functions for auth
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data as UserProfile;
};

export const getUserContracts = async (userId: string): Promise<ContractRecord[]> => {
  const { data, error } = await supabase
    .from('contracts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching user contracts:', error);
    return [];
  }
  
  return data as ContractRecord[];
};
