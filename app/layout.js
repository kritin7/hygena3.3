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
  title: {
    default: "India’s First Helmet Deodorant with Bacteriostatic Care",
    template: "%s | Hygena",
  },

  description:
    "Hygena is India’s first helmet deodorant with a bacteriostatic formula that prevents odor, protects the scalp, and keeps helmets fresh for up to 30 days.",

  metadataBase: new URL("https://www.hygena.in"),

  openGraph: {
    title: "Hygena – India’s First Helmet Deodorant",
    description:
      "Bacteriostatic helmet deodorant that prevents odor and protects scalp hygiene for everyday riders.",
    url: "https://www.hygena.in",
    siteName: "Hygena",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Hygena Helmet Deodorant",
      },
    ],
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

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
