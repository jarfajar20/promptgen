'use client'

import { useFormStatus } from 'react-dom'

export function Field({
  label, name, type = 'text', required, placeholder, autoComplete, minLength, defaultValue,
}: {
  label: string; name: string; type?: string; required?: boolean
  placeholder?: string; autoComplete?: string; minLength?: number; defaultValue?: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-zinc-300">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        minLength={minLength}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900/70 px-3.5 py-2.5
                   text-zinc-100 placeholder:text-zinc-600 outline-none transition
                   focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30"
      />
    </label>
  )
}

export function Banner({ tone, children }: { tone: 'error' | 'success' | 'info'; children: React.ReactNode }) {
  const styles = {
    error:   'border-red-500/40 bg-red-500/10 text-red-300',
    success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    info:    'border-cyan-500/40 bg-cyan-500/10 text-cyan-200',
  }[tone]
  return (
    <div role="alert" className={'rounded-lg border px-3.5 py-2.5 text-sm ' + styles}>
      {children}
    </div>
  )
}

export function SubmitButton({ children, pendingText = 'Memproses...' }: { children: React.ReactNode; pendingText?: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-gradient-to-r from-fuchsia-600 to-cyan-500 px-4 py-2.5
                 font-semibold text-white shadow-lg shadow-fuchsia-900/30 transition
                 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? pendingText : children}
    </button>
  )
}
