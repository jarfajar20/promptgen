'use client'

import { useMemo, useState } from 'react'
import {
  CAMERAS, FASHION, LOCATIONS, buildPrompt, randomSelection,
  type Option, type Target,
} from '@/lib/prompt/options'

const TARGETS: { id: Target; label: string }[] = [
  { id: 'midjourney', label: 'Midjourney' },
  { id: 'sdxl', label: 'SD / SDXL' },
  { id: 'flux', label: 'FLUX' },
]

function Select({
  label, value, options, onChange,
}: {
  label: string; value: string; options: Option[]; onChange: (v: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-zinc-300">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-zinc-100
                   outline-none transition focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30"
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>{o.label}</option>
        ))}
      </select>
    </label>
  )
}

function CopyButton({ text, label = 'Copy to Clipboard' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={
        'shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition ' +
        (copied
          ? 'bg-emerald-500 text-white'
          : 'bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white hover:brightness-110')
      }
    >
      {copied ? 'Tersalin!' : label}
    </button>
  )
}

export function PromptBuilder() {
  const [locationId, setLocationId] = useState(LOCATIONS[0].id)
  const [fashionId,  setFashionId]  = useState(FASHION[0].id)
  const [cameraId,   setCameraId]   = useState(CAMERAS[0].id)
  const [detail,     setDetail]     = useState('')
  const [target,     setTarget]     = useState<Target>('midjourney')

  const result = useMemo(
    () => buildPrompt({ locationId, fashionId, cameraId, detail }),
    [locationId, fashionId, cameraId, detail]
  )
  const output = result[target]

  function randomize() {
    const r = randomSelection()
    setLocationId(r.locationId)
    setFashionId(r.fashionId)
    setCameraId(r.cameraId)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ---------------- KOLOM KONTROL ---------------- */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
        <header className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-zinc-100">Prompt Builder</h2>
          <button
            type="button"
            onClick={randomize}
            className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium
                       text-zinc-300 transition hover:bg-zinc-800"
          >
            Acak
          </button>
        </header>

        <div className="space-y-4">
          <Select label="Lokasi / Setting"  value={locationId} options={LOCATIONS} onChange={setLocationId} />
          <Select label="Era Fashion"       value={fashionId}  options={FASHION}   onChange={setFashionId} />
          <Select label="Tipe Film Kamera"  value={cameraId}   options={CAMERAS}   onChange={setCameraId} />

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-zinc-300">
              Detail Khusus <span className="text-zinc-600">(opsional)</span>
            </span>
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              rows={3}
              maxLength={300}
              placeholder="cth: memegang milkshake stroberi, rambut tertiup angin, ada arcade cabinet di belakang"
              className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2.5
                         text-zinc-100 placeholder:text-zinc-600 outline-none transition
                         focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/30"
            />
            <span className="mt-1 block text-right text-xs text-zinc-600">{detail.length}/300</span>
          </label>
        </div>
      </section>

      {/* ---------------- KOLOM OUTPUT ---------------- */}
      <section className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur">
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">Hasil Prompt</h2>

        <div className="mb-4 flex gap-1.5 rounded-lg bg-zinc-950/70 p-1">
          {TARGETS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTarget(t.id)}
              className={
                'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition ' +
                (target === t.id
                  ? 'bg-zinc-800 text-fuchsia-300 shadow'
                  : 'text-zinc-500 hover:text-zinc-300')
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1">
          <pre className="h-full max-h-[22rem] overflow-auto whitespace-pre-wrap break-words rounded-lg
                          border border-zinc-800 bg-zinc-950/80 p-4 font-mono text-[13px]
                          leading-relaxed text-zinc-300">
{output}
          </pre>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <CopyButton text={output} />
          <span className="text-xs text-zinc-600">{output.length} karakter</span>
        </div>

        {target !== 'flux' && (
          <details className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950/50 p-3">
            <summary className="cursor-pointer text-sm font-medium text-zinc-400">
              Negative Prompt
            </summary>
            <pre className="mt-2.5 whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-zinc-500">
{result.negative}
            </pre>
            <div className="mt-3">
              <CopyButton text={result.negative} label="Copy Negative" />
            </div>
          </details>
        )}
      </section>
    </div>
  )
}
