import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nuzurgvnceehrufxxgdm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51enVyZ3ZuY2VlaHJ1Znh4Z2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNzkxNjQsImV4cCI6MjA2MjY1NTE2NH0.ubxaYGEDlP7OUD2yID8cy4YmAgy1HMhrvHSdeSPSkZg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 