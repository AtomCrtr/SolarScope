export default function Loading() {
    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <div style={{ width: 120, height: 24, borderRadius: 99, background: 'rgba(255,255,255,0.07)', margin: '0 auto 1rem', animation: 'pulse 1.6s ease-in-out infinite' }} />
                <div style={{ width: 260, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.06)', margin: '0 auto 0.75rem' }} />
                <div style={{ width: 300, height: 20, borderRadius: 8, background: 'rgba(255,255,255,0.04)', margin: '0 auto' }} />
            </div>
            {/* Tab bar skeleton */}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
                {[...Array(4)].map((_, i) => (
                    <div key={i} style={{ width: 100, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.6s ease-in-out infinite', animationDelay: `${i * 0.1}s` }} />
                ))}
            </div>
            {/* Level picker skeleton */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {[...Array(3)].map((_, i) => (
                    <div key={i} style={{ height: 160, borderRadius: '1rem', background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.6s ease-in-out infinite', animationDelay: `${i * 0.15}s` }} />
                ))}
            </div>
            <style>{`@keyframes pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }`}</style>
        </div>
    )
}
