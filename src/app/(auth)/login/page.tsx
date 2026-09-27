import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = { title: 'Masuk - PromptGen' }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  return (
    <>
      <h2 className="mb-6 text-xl font-semibold text-zinc-100">Masuk ke Dashboard</h2>
      <LoginForm next={next} />
    </>
  )
}
