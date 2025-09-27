import './globals.css'
import { Inter, Montserrat } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import SessionWrapper from '@/components/SessionWrapper'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat'
})

export const metadata = {
  title: 'Hygena - India\'s First Helmet Deodorant | Bacteriostatic Protection',
  description: 'Revolutionary helmet deodorant with bacteriostatic formula. Prevents odor, protects scalp, lasts 30 days. Dermatologically tested. Shop now with 20% OFF.',
  keywords: 'helmet deodorant, helmet freshener, helmet hygiene, bacteriostatic spray, helmet odor remover, scalp protection, bike helmet cleaner',
  openGraph: {
    title: 'Hygena - India\'s First Helmet Deodorant',
    description: 'Revolutionary bacteriostatic formula that prevents helmet odor for 30 days',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="font-inter antialiased">
        <SessionWrapper>
          {children}
        </SessionWrapper>
      </body>
    </html>
  )
}