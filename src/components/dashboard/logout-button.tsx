'use client'

import { useFormStatus } from 'react-dom'
import { logoutAction } from '@/app/(auth)/actions'

function Btn() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm font-medium
                 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200
                 disabled:opacity-50"
    >
      {pending ? 'Keluar...' : 'Keluar'}
    </button>
  )
}

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Btn />
    </form>
  )
}
