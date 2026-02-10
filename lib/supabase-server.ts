import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Server client — passes Clerk token so RLS policies work via auth.jwt()->>'sub'
export function createServerSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    async accessToken() {
      return (await auth()).getToken();
    },
  });
}

// Admin client — bypasses RLS, for background jobs (e.g. async AI insights)
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : createClient(supabaseUrl, supabaseAnonKey);
