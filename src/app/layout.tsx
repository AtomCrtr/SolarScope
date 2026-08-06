import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import StarField from '@/components/layout/StarField'
import SolarBotWidget from '@/components/assistant/SolarBotWidget'
import Footer from '@/components/layout/Footer'
import Breadcrumb from '@/components/layout/Breadcrumb'
import ThemeToggle from '@/components/layout/ThemeToggle'
import ProgressTracker from '@/components/learning/ProgressTracker'
import LanguageAvailabilityNotice from '@/components/layout/LanguageAvailabilityNotice'
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/config/site'

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
        <main className="relative z-10" style={{ paddingTop: 'calc(var(--navbar-h) + 0.25rem)', minHeight: '100vh' }}>
          {/* Breadcrumb — auto-hides on homepage and clears the fixed navbar. */}
          <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '0.5rem var(--section-px) 0' }}>
            <Breadcrumb />
          </div>
          <LanguageAvailabilityNotice />
          {children}
        </main>
        <Footer />
        <SolarBotWidget />
      </body>
    </html>
  )
}
