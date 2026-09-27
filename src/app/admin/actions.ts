'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

/**
 * Ambil sesi admin yang terverifikasi, atau lempar.
 * Defense in depth: RLS sudah melindungi, tapi server action tetap divalidasi.
 */
async function requireAdmin() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('UNAUTHENTICATED')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_approved')
    .eq('id', user.id)
    .single()

  if (!profile?.is_approved || profile.role !== 'admin') throw new Error('FORBIDDEN')

  return { supabase, adminId: user.id }
}

export async function setApprovalAction(formData: FormData) {
  const userId  = String(formData.get('user_id') ?? '')
  const approve = String(formData.get('approve') ?? 'true') === 'true'

  if (!userId) return

  const { supabase, adminId } = await requireAdmin()

  // Jangan biarkan admin menonaktifkan dirinya sendiri.
  if (userId === adminId) return

  const { error } = await supabase
    .from('profiles')
    .update({
      is_approved: approve,
      approved_at: approve ? new Date().toISOString() : null,
      approved_by: approve ? adminId : null,
    })
    .eq('id', userId)

  if (error) throw new Error(error.message)

  revalidatePath('/admin')
}
