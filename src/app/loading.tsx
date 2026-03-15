/* Global loading skeleton — shown by Next.js while page segment is loading */
export default function Loading() {
    return (
        <div style={{
            padding: '3rem 2rem 6rem',
            maxWidth: 'var(--max-w)',
            margin: '0 auto',
            animation: 'pulse 2s ease-in-out infinite',
        }}>
            {/* Page header skeleton */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ width: 120, height: 22, borderRadius: 99, background: 'rgba(255,255,255,0.05)', marginBottom: '0.875rem' }} />
                <div style={{ width: '55%', height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.05)', marginBottom: '0.75rem' }} />
                <div style={{ width: '40%', height: 18, borderRadius: 99, background: 'rgba(255,255,255,0.04)' }} />
            </div>

            {/* Stats cards skeleton */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.625rem', marginBottom: '2rem' }}>
                {[...Array(4)].map((_, i) => (
                    <div key={i} style={{ height: 88, borderRadius: '0.875rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.04)' }} />
                ))}
            </div>

            {/* Main content skeleton */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ height: 380, borderRadius: '1rem', background: 'rgba(255,255,255,0.04)' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ flex: 1, borderRadius: '1rem', background: 'rgba(255,255,255,0.04)' }} />
                    <div style={{ height: 140, borderRadius: '1rem', background: 'rgba(255,255,255,0.04)' }} />
                </div>
            </div>

            {/* Cards row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {[...Array(3)].map((_, i) => (
                    <div key={i} style={{ height: 140, borderRadius: '0.875rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.04)' }} />
                ))}
            </div>

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
      `}</style>
        </div>
    )
}
