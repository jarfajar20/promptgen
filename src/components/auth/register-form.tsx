'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { registerAction, type ActionState } from '@/app/(auth)/actions'
import { Banner, Field, SubmitButton } from '@/components/ui'

export function RegisterForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(registerAction, null)

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && <Banner tone="error">{state.error}</Banner>}

      <Field label="Nama Lengkap" name="full_name" required autoComplete="name"
             placeholder="Budi dan Ayu" minLength={3} />
      <Field label="Email" name="email" type="email" required autoComplete="email"
             placeholder="kamu@email.com" />
      <Field label="Password" name="password" type="password" required
             autoComplete="new-password" placeholder="Minimal 8 karakter" minLength={8} />
      <Field label="Konfirmasi Password" name="confirm_password" type="password" required
             autoComplete="new-password" placeholder="Ulangi password" minLength={8} />

      <SubmitButton pendingText="Mendaftarkan...">Daftar Sekarang</SubmitButton>

      <p className="text-center text-sm text-zinc-400">
        Sudah punya akun?{' '}
        <Link href="/login" className="font-medium text-fuchsia-400 hover:text-fuchsia-300">
          Masuk di sini
        </Link>
      </p>

      <p className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3.5 py-2.5 text-xs leading-relaxed text-zinc-500">
        Akun baru berstatus <span className="text-zinc-300">menunggu persetujuan admin</span>.
        Anda baru bisa masuk setelah admin mengaktifkan akun.
      </p>
    </form>
  )
}
