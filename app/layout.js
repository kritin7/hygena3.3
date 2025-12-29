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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <head>
        {/* Meta Pixel Code - Product Page Tracking */}
        <Script
          id="meta-pixel-product"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '861365679718290');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=861365679718290&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className="font-inter antialiased">
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
  )
}
