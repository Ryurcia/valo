import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Public client — for client-side usage (real-time subscriptions only)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
