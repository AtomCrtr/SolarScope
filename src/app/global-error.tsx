'use client'

// Replaces the whole layout, so the language is read from the address directly.
const COPY = {
  fr: { title: 'SolarScope est temporairement indisponible', text: 'Le problème a été isolé. Réessayez dans un instant.', retry: 'Réessayer' },
  en: { title: 'SolarScope is temporarily unavailable', text: 'The problem has been isolated. Please try again in a moment.', retry: 'Try again' },
}

export default function GlobalError({ reset }: { reset: () => void }) {
  const locale = typeof window !== 'undefined' && /^\/en(\/|$)/.test(window.location.pathname) ? 'en' : 'fr'
  const copy = COPY[locale]
  return (
    <html lang={locale}>
      <body style={{ margin: 0, background: '#0b1026', color: '#eef1fa', fontFamily: 'system-ui, sans-serif' }}>
        <main style={{ maxWidth: 640, margin: '10vh auto', padding: '2rem', textAlign: 'center' }}>
          <h1>{copy.title}</h1>
          <p>{copy.text}</p>
          <button type="button" onClick={reset} style={{ padding: '0.75rem 1rem', borderRadius: 10, cursor: 'pointer' }}>
            {copy.retry}
          </button>
        </main>
      </body>
    </html>
  )
}
