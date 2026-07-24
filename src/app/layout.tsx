import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import Navbar from '@/components/Navbar'
import StarField from '@/components/StarField'
import SolarBotWidget from '@/components/SolarBotWidget'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import ThemeToggle from '@/components/ThemeToggle'
import ProgressTracker from '@/components/ProgressTracker'
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: {
    default: 'SolarScope 🔭 — L’espace expliqué aux enfants',
    template: '%s · SolarScope',
  },
  description: DEFAULT_DESCRIPTION,
  keywords: 'espace enfants, astronomie enfants, planètes, NASA, système solaire, Mars, univers, JWST, ISS, quiz espace',
  authors: [{ name: 'SolarScope' }],
  creator: 'SolarScope',
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'SolarScope 🔭 — L’espace expliqué aux enfants',
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SolarScope 🔭 — L’espace expliqué aux enfants',
    description: DEFAULT_DESCRIPTION,
  },
  icons: {
    icon: '/favicon.ico',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <Script src="/theme-init.js" strategy="beforeInteractive" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: SITE_NAME,
              url: SITE_URL,
              inLanguage: 'fr-FR',
              description: DEFAULT_DESCRIPTION,
            }).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body>
        <ProgressTracker />
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
