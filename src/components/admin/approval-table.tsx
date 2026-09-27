'use client'

import { setApprovalAction } from '@/app/admin/actions'

export type PendingRow = {
  id: string
  full_name: string
  email: string
  created_at: string
}

function Row({ row }: { row: PendingRow }) {
  const joined = new Date(row.created_at).toLocaleString('id-ID', {
    dateStyle: 'medium', timeStyle: 'short',
  })

  return (
    <tr className="border-t border-zinc-800/80">
      <td className="px-4 py-3">
        <div className="font-medium text-zinc-100">{row.full_name || '-'}</div>
        <div className="text-xs text-zinc-500">{row.email}</div>
      </td>
      <td className="hidden px-4 py-3 text-sm text-zinc-500 sm:table-cell">{joined}</td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-2">
          <form action={setApprovalAction}>
            <input type="hidden" name="user_id" value={row.id} />
            <input type="hidden" name="approve" value="true" />
            <button type="submit"
                    className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-sm font-semibold
                               text-white transition hover:bg-emerald-500">
              Approve
            </button>
          </form>
          <form action={setApprovalAction}>
            <input type="hidden" name="user_id" value={row.id} />
            <input type="hidden" name="approve" value="false" />
            <button type="submit"
                    className="rounded-lg border border-red-500/40 px-3.5 py-1.5 text-sm
                               font-medium text-red-400 transition hover:bg-red-500/10">
              Tolak
            </button>
          </form>
        </div>
      </td>
    </tr>
  )
}

export function ApprovalTable({ rows }: { rows: PendingRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-10 text-center">
        <p className="text-3xl">&#9989;</p>
        <p className="mt-2 font-medium text-zinc-300">Tidak ada user menunggu</p>
        <p className="mt-1 text-sm text-zinc-500">Semua pendaftar sudah ditinjau.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
      <table className="w-full text-left">
        <thead className="bg-zinc-900/80 text-xs uppercase tracking-wider text-zinc-500">
          <tr>
            <th className="px-4 py-3 font-medium">User</th>
            <th className="hidden px-4 py-3 font-medium sm:table-cell">Terdaftar</th>
            <th className="px-4 py-3 text-right font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => <Row key={r.id} row={r} />)}
        </tbody>
      </table>
    </div>
  )
}
