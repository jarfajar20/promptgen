export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-zinc-950 px-4 py-12
                     [background-image:radial-gradient(60rem_40rem_at_50%_-10%,rgba(217,70,239,.12),transparent)]">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-3xl
                         font-black tracking-tight text-transparent">
            80s COUPLE PROMPT GEN
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            Studio prompt AI bertema retro untuk pasangan.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6
                        shadow-2xl shadow-black/50 backdrop-blur">
          {children}
        </div>
      </div>
    </main>
  )
}
