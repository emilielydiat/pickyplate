import { createClient } from "@supabase/supabase-js";

// Get Supabase URL and key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Create Supabase instance
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
