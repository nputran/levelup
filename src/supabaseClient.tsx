import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gpzcaxbkxkdxrevczhzh.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwemNheGJreGtkeHJldmN6aHpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MTA4NjksImV4cCI6MjA3MzI4Njg2OX0.Jln4CCBM53pi9W19I2zBnzc6EMwIqv-dcjOmGF7vJdw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
