import type { Metadata, Viewport } from 'next'
import { Atkinson_Hyperlegible, Caveat, Fredoka } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import StarField from '@/components/layout/StarField'
import SolarBotWidgetBoundary from '@/components/assistant/SolarBotWidgetBoundary'
import Footer from '@/components/layout/Footer'
import MobileTabBar from '@/components/layout/MobileTabBar'
import Breadcrumb from '@/components/layout/Breadcrumb'
import ProgressTracker from '@/components/learning/ProgressTracker'
import ServiceWorkerRegistration from '@/components/layout/ServiceWorkerRegistration'
import PrivacyAnalytics from '@/components/layout/PrivacyAnalytics'
import LanguageScope from '@/components/layout/LanguageScope'
import { DEFAULT_DESCRIPTION, pageMetadata, SITE_NAME, SITE_URL } from '@/lib/config/site'

// Self-hosted at build time by next/font: no request to Google from the visitor's browser.
const bodyFont = Atkinson_Hyperlegible({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-body', display: 'swap' })
const displayFont = Fredoka({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-display', display: 'swap' })
const noteFont = Caveat({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-note', display: 'swap' })

const home = pageMetadata('/')

export const metadata: Metadata = {
  ...home,
  title: {
    default: 'SolarScope — L’espace expliqué aux enfants',
    template: '%s · SolarScope',
  },
  keywords: 'espace enfants, astronomie enfants, planètes, NASA, système solaire, Mars, univers, JWST, ISS, quiz espace, space for kids',
  authors: [{ name: 'SolarScope' }],
  creator: 'SolarScope',
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/solarscope-icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/solarscope-icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: { capable: true, title: 'SolarScope', statusBarStyle: 'black-translucent' },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0B1026',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-theme="dark" className={`${bodyFont.variable} ${displayFont.variable} ${noteFont.variable}`} suppressHydrationWarning>
      <head>
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
        <LanguageScope>
        <ProgressTracker />
        <StarField />
        <Navbar />
        <main id="main-content" className="relative z-10" style={{ paddingTop: 'calc(var(--navbar-h) + 0.25rem)', minHeight: '100vh' }}>
          {/* Breadcrumb — auto-hides on homepage and clears the fixed navbar. */}
          <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '0.5rem var(--section-px) 0' }}>
            <Breadcrumb />
          </div>
          {children}
        </main>
        <Footer />
        <MobileTabBar />
        <SolarBotWidgetBoundary />
        <ServiceWorkerRegistration />
        <PrivacyAnalytics />
        </LanguageScope>
      </body>
    </html>
  )
}
