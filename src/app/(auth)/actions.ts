'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

import type { ActionState } from '@/lib/auth-types'
import { PENDING_MESSAGE, EMAIL_RE, safeNext } from '@/lib/auth-types'

export type { ActionState }
export { PENDING_MESSAGE }

/* ------------------------------------------------------------------ */
/* REGISTER                                                            */
/* ------------------------------------------------------------------ */
export async function registerAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const fullName = String(formData.get('full_name') ?? '').trim()
  const email    = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')
  const confirm  = String(formData.get('confirm_password') ?? '')

  if (fullName.length < 3)   return { error: 'Nama lengkap minimal 3 karakter.' }
  if (fullName.length > 80)  return { error: 'Nama lengkap maksimal 80 karakter.' }
  if (!EMAIL_RE.test(email)) return { error: 'Format email tidak valid.' }
  if (password.length < 8)   return { error: 'Password minimal 8 karakter.' }
  if (password !== confirm)  return { error: 'Konfirmasi password tidak cocok.' }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })

  if (error) {
    const msg = error.message.toLowerCase()
    if (msg.includes('already registered') || msg.includes('already been registered'))
      return { error: 'Email ini sudah terdaftar. Silakan login.' }
    if (msg.includes('rate limit'))
      return { error: 'Terlalu banyak percobaan. Coba lagi beberapa menit.' }
    return { error: 'Pendaftaran gagal: ' + error.message }
  }

  // Jika "Confirm email" dimatikan, Supabase mengembalikan sesi aktif.
  // Kita WAJIB membatalkannya: user belum approved, jadi tidak boleh punya sesi.
  if (data.session) {
    await supabase.auth.signOut()
  }

  redirect('/pending?registered=1')
}

/* ------------------------------------------------------------------ */
/* LOGIN + VERIFIKASI APPROVAL                                         */
/* ------------------------------------------------------------------ */
export async function loginAction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email    = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')
  const next     = safeNext(String(formData.get('next') ?? '') || null)

  if (!email || !password) return { error: 'Email dan password wajib diisi.' }

  const supabase = await createClient()

  // 1) Autentikasi kredensial
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.user) {
    const msg = (error?.message ?? '').toLowerCase()
    if (msg.includes('email not confirmed'))
      return { error: 'Email belum diverifikasi. Silakan cek inbox Anda.' }
    if (msg.includes('rate limit') || msg.includes('too many'))
      return { error: 'Terlalu banyak percobaan login. Coba lagi nanti.' }
    return { error: 'Email atau password salah.' }
  }

  // 2) Cek status approval
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_approved')
    .eq('id', data.user.id)
    .single()

  if (profileError || !profile?.is_approved) {
    // KRITIS: sesi harus dibatalkan.
    await supabase.auth.signOut()
    return { error: PENDING_MESSAGE }
  }

  redirect(next)
}

/* ------------------------------------------------------------------ */
/* LOGOUT                                                              */
/* ------------------------------------------------------------------ */
export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

/* ------------------------------------------------------------------ */
/* RE-CHECK STATUS (tombol "Cek Status" di halaman /pending)           */
/* ------------------------------------------------------------------ */
export async function recheckApprovalAction() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_approved')
    .eq('id', user.id)
    .single()

  redirect(profile?.is_approved ? '/dashboard' : '/pending?checked=1')
}
