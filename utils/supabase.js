import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
)

// For ADMIN tasks
const supabaseLogin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)