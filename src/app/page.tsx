import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'

export const dynamic = 'force-dynamic'

export default async function RootPage() {
  // Jika Supabase belum dikonfigurasi, arahkan ke /login agar tidak crash.
  if (!isSupabaseConfigured()) redirect('/login')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_approved')
    .eq('id', user.id)
    .single()

  redirect(profile?.is_approved ? '/dashboard' : '/pending')
}
