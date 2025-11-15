
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dkfissjbxaevmxcqvpai.supabase.co';
// This is a public "anon" key and is safe to be exposed in client-side code.
// Security is handled by Supabase Row Level Security (RLS) policies.
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrZmlzc2pieGFldm14Y3F2cGFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIyNTU2MjQsImV4cCI6MjAyNzgzMTYyNH0.o26T4cCR0385T22f2-vHqJ2_if_2m_S1l3yZ5VlDeHw';
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;