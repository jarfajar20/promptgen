import type { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/register-form'

export const metadata: Metadata = { title: 'Daftar - PromptGen' }

export default function RegisterPage() {
  return (
    <>
      <h2 className="mb-6 text-xl font-semibold text-zinc-100">Buat Akun Baru</h2>
      <RegisterForm />
    </>
  )
}
