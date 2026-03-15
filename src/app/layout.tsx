import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import StarField from '@/components/StarField'
import SolarBotWidget from '@/components/SolarBotWidget'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import ThemeToggle from '@/components/ThemeToggle'

const BASE_URL = 'https://solarscope.vercel.app'
const OG_IMAGE = `${BASE_URL}/og-image.png`

export const metadata: Metadata = {
  title: {
    default: 'SolarScope 🔭 — Explorer l\'Univers',
    template: '%s · SolarScope',
  },
  description:
    'Découvre l\'espace avec SolarScope ! Planètes en 3D, Mars, astéroïdes, télescope Webb, ISS en direct et bien plus — données NASA en temps réel.',
  keywords: 'espace, planètes, NASA, astéroïdes, Mars, univers, astronomie, JWST, Webb, ISS, aurores, météorites',
  authors: [{ name: 'SolarScope' }],
  creator: 'SolarScope',
  metadataBase: new URL(BASE_URL),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: BASE_URL,
    siteName: 'SolarScope',
    title: 'SolarScope 🔭 — Explorer l\'Univers avec la NASA',
    description: 'Planètes en 3D, positions réelles J2000, télescope Webb, ISS live, aurores boréales, météorites… données NASA en temps réel pour tous.',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'SolarScope — Explore l\'Univers' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SolarScope 🔭 — Explorer l\'Univers',
    description: 'Planètes, Mars, JWST, ISS et données NASA en direct.',
    images: [OG_IMAGE],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {/* Theme script — runs before render to avoid FOUC */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(){var t=localStorage.getItem('solarscope-theme')||'dark';document.documentElement.setAttribute('data-theme',t);})();`
        }} />
      </head>
      <body>
        <StarField />
        <Navbar themeToggle={<ThemeToggle />} />
        {/* Breadcrumb — auto-hides on homepage */}
        <div style={{ position: 'relative', zIndex: 10, maxWidth: 'var(--max-w)', margin: '0 auto', padding: '0.5rem 2rem 0' }}>
          <Breadcrumb />
        </div>
        <main className="relative z-10" style={{ paddingTop: 'calc(var(--navbar-h) + 0.25rem)', minHeight: '100vh' }}>
          {children}
        </main>
        <Footer />
        <SolarBotWidget />
      </body>
    </html>
  )
}
