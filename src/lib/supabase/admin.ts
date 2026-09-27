import 'server-only'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * HANYA untuk operasi server yang butuh bypass RLS.
 * JANGAN pernah import file ini dari komponen 'use client'.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
