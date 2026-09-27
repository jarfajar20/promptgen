export type ActionState = { error?: string; success?: string } | null

export const PENDING_MESSAGE = 'Akun Anda belum disetujui admin.'

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Cegah open-redirect: hanya izinkan path internal. */
export function safeNext(raw: string | null) {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/dashboard'
  return raw
}
