import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logoutAction, recheckApprovalAction } from '@/app/(auth)/actions'
import { Banner } from '@/components/ui'

export const metadata: Metadata = { title: 'Menunggu Persetujuan - PromptGen' }
export const dynamic = 'force-dynamic'

export default async function PendingPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; checked?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, is_approved, created_at')
    .eq('id', user.id)
    .single()

  if (profile?.is_approved) redirect('/dashboard')

  return (
    <main className="flex min-h-dvh items-center justify-center bg-zinc-950 px-4
                     [background-image:radial-gradient(50rem_35rem_at_50%_0%,rgba(34,211,238,.10),transparent)]">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8
                      text-center shadow-2xl shadow-black/50 backdrop-blur">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full
                        border border-amber-500/40 bg-amber-500/10">
          <span className="animate-pulse text-3xl">&#9203;</span>
        </div>

        <h1 className="text-2xl font-bold text-zinc-100">Menunggu Persetujuan Admin</h1>
        <p className="mt-2.5 text-sm leading-relaxed text-zinc-400">
          Hai <span className="font-medium text-zinc-200">{profile?.full_name || user.email}</span>,
          pendaftaranmu berhasil. Akun kamu sedang ditinjau oleh admin.
          Kamu akan bisa mengakses dashboard setelah disetujui.
        </p>

        <div className="mt-6 space-y-3">
          {params.registered === '1' && (
            <Banner tone="success">Pendaftaran berhasil! Silakan tunggu persetujuan admin.</Banner>
          )}
          {params.checked === '1' && (
            <Banner tone="info">Status masih menunggu. Coba cek lagi nanti.</Banner>
          )}

          <form action={recheckApprovalAction}>
            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-fuchsia-600 to-cyan-500 px-4 py-2.5
                         font-semibold text-white transition hover:brightness-110"
            >
              Cek Status Sekarang
            </button>
          </form>

          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full rounded-lg border border-zinc-700 px-4 py-2.5 text-sm
                         font-medium text-zinc-400 transition hover:bg-zinc-800/60 hover:text-zinc-200"
            >
              Keluar
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
