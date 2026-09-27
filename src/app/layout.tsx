import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '80s Couple Prompt Generator',
  description: 'Generator prompt AI image bertema pasangan 80-an.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="dark">
      <body className="bg-zinc-950 text-zinc-100 antialiased">{children}</body>
    </html>
  )
}
