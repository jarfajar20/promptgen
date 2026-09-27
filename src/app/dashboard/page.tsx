import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PromptBuilder } from '@/components/dashboard/prompt-builder'

export const metadata: Metadata = { title: 'Dashboard - PromptGen' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user!.id)
    .single()

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
          Halo, {(profile?.full_name ?? 'Sobat').split(' ')[0]} &#128075;
        </h1>
        <p className="mt-1.5 text-zinc-400">
          Rakit prompt foto pasangan bertema 80-an, lalu tempel ke Midjourney, SDXL, atau FLUX.
        </p>
      </div>
      <PromptBuilder />
    </>
  )
}
