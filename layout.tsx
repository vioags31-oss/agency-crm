import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Agency CRM',
  description: 'GG Swap Manager',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <body style={{ margin: 0, padding: '20px', fontFamily: 'system-ui', background: '#0f0f0f', color: '#fff' }}>
        {children}
      </body>
    </html>
  )
}
