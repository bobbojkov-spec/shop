import { inter, poppins, playfair } from '@/lib/fonts'
import '@/styles/globals.css'

export const metadata = {
  title: 'Bridge | Handmade Ceramics',
  description: 'Handmade ceramics inspired by the sea, created with love, touched by nature',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${playfair.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
