'use client'

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, background: '#0b1026', color: 'var(--text)', fontFamily: 'system-ui, sans-serif' }}>
        <main style={{ maxWidth: 640, margin: '10vh auto', padding: '2rem', textAlign: 'center' }}>
          <h1>SolarScope est temporairement indisponible</h1>
          <p>Le problème a été isolé. Réessayez dans un instant.</p>
          <button type="button" onClick={reset} style={{ padding: '0.75rem 1rem', borderRadius: 10, cursor: 'pointer' }}>
            Réessayer
          </button>
        </main>
      </body>
    </html>
  )
}
