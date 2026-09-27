/** Cek apakah kredensial Supabase sudah diisi (env Vercel). */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return Boolean(url && anon && url.startsWith('http') && anon.length > 20)
}
