import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_approved')
    .eq('id', user.id)
    .single()

  if (!profile?.is_approved) redirect('/pending')
  if (profile.role !== 'admin') redirect('/dashboard')

  return (
    <div className="min-h-dvh bg-zinc-950">
      <header className="border-b border-zinc-800/80 bg-zinc-900/40">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5">
          <h1 className="font-semibold text-amber-300">Admin - Manajemen Persetujuan</h1>
          <Link href="/dashboard" className="text-sm text-zinc-400 transition hover:text-zinc-200">
            Kembali ke Dashboard
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  )
}
