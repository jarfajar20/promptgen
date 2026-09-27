import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LogoutButton } from '@/components/dashboard/logout-button'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, is_approved, role')
    .eq('id', user.id)
    .single()

  // Gerbang utama: hanya user approved yang boleh render dashboard.
  if (!profile?.is_approved) redirect('/pending')

  return (
    <div className="min-h-dvh bg-zinc-950 [background-image:radial-gradient(60rem_40rem_at_50%_-15%,rgba(217,70,239,.10),transparent)]">
      <header className="sticky top-0 z-10 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5">
          <Link href="/dashboard" className="bg-gradient-to-r from-fuchsia-400 to-cyan-400
                                             bg-clip-text text-sm font-black tracking-tight text-transparent">
            80s COUPLE PROMPT GEN
          </Link>
          <div className="flex items-center gap-3">
            {profile.role === 'admin' && (
              <Link href="/admin"
                    className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5
                               text-sm font-medium text-amber-300 transition hover:bg-amber-500/20">
                Admin Panel
              </Link>
            )}
            <span className="hidden text-sm text-zinc-400 sm:block">
              {profile.full_name || user.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}
