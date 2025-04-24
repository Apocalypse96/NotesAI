import { createClient } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// For server components and API routes
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For client components with built-in auth helpers
export const createSupabaseClient = () => {
  return createClientComponentClient();
};
