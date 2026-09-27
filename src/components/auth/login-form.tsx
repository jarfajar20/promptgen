'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { loginAction, PENDING_MESSAGE, type ActionState } from '@/app/(auth)/actions'
import { Banner, Field, SubmitButton } from '@/components/ui'

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState<ActionState, FormData>(loginAction, null)
  const isPending = state?.error === PENDING_MESSAGE

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next ?? ''} />

      {state?.error && (
        <Banner tone="error">
          {state.error}
          {isPending && (
            <span className="mt-1.5 block text-xs text-red-300/80">
              Hubungi admin untuk mengaktifkan akun Anda, lalu coba login kembali.
            </span>
          )}
        </Banner>
      )}

      <Field label="Email" name="email" type="email" required autoComplete="email"
             placeholder="kamu@email.com" />
      <Field label="Password" name="password" type="password" required
             autoComplete="current-password" placeholder="********" />

      <SubmitButton pendingText="Memverifikasi...">Masuk</SubmitButton>

      <p className="text-center text-sm text-zinc-400">
        Belum punya akun?{' '}
        <Link href="/register" className="font-medium text-fuchsia-400 hover:text-fuchsia-300">
          Daftar di sini
        </Link>
      </p>
    </form>
  )
}
