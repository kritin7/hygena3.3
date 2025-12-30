import './globals.css'
import { Inter, Montserrat } from 'next/font/google'
import SessionWrapper from '@/components/SessionWrapper'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DiscountWidget from '@/components/DiscountWidget'
import Script from 'next/script'

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
  description: 'Revolutionary helmet deodorant with bacteriostatic formula. Prevents odor, protects scalp, lasts 30 days. Dermatologically tested. Shop now with 10% OFF.',
  keywords: 'helmet deodorant, helmet freshener, helmet hygiene, bacteriostatic spray, helmet odor remover, scalp protection, bike helmet cleaner',
  openGraph: {
    title: 'Hygena - India\'s First Helmet Deodorant',
    description: 'Revolutionary bacteriostatic formula that prevents helmet odor for 30 days',
    images: ['/og-image.jpg'],
  },
}

import MetaPixel from "./MetaPixel";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="font-inter antialiased">
        <MetaPixel />
        <SessionWrapper>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <DiscountWidget />
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}
