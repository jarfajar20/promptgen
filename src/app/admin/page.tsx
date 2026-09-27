import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ApprovalTable, type PendingRow } from '@/components/admin/approval-table'

export const metadata: Metadata = { title: 'Admin - PromptGen' }

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: pending } = await supabase
    .from('profiles')
    .select('id, full_name, email, created_at')
    .eq('is_approved', false)
    .order('created_at', { ascending: true })

  const { count: approvedCount } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('is_approved', true)

  return (
    <>
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
          <p className="text-sm text-amber-300/80">Menunggu Persetujuan</p>
          <p className="mt-1 text-3xl font-bold text-amber-300">{pending?.length ?? 0}</p>
        </div>
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
          <p className="text-sm text-emerald-300/80">User Aktif</p>
          <p className="mt-1 text-3xl font-bold text-emerald-300">{approvedCount ?? 0}</p>
        </div>
      </div>

      <h2 className="mb-3 text-lg font-semibold text-zinc-200">Daftar Pending</h2>
      <ApprovalTable rows={(pending ?? []) as PendingRow[]} />
    </>
  )
}
