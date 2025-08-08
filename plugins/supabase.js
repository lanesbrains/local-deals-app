import { createClient } from "@supabase/supabase-js";

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig();
  const supabaseUrl = runtimeConfig.public.supabaseUrl;
  const supabaseAnonKey = runtimeConfig.public.supabaseAnonKey;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "Supabase configuration error: Missing SUPABASE_URL or SUPABASE_ANON_KEY"
    );
    throw new Error(
      "Supabase configuration error: Missing SUPABASE_URL or SUPABASE_ANON_KEY"
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  nuxtApp.provide("supabase", supabase);
});
