import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export const createServerClient = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!
  return createClient<Database>(supabaseUrl, supabaseServiceKey)
}