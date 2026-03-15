export default function Loading() {
    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <div style={{ width: 160, height: 24, borderRadius: 99, background: 'rgba(255,255,255,0.07)', margin: '0 auto 1rem', animation: 'pulse 1.6s ease-in-out infinite' }} />
                <div style={{ width: 220, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.06)', margin: '0 auto 0.75rem' }} />
                <div style={{ width: 300, height: 20, borderRadius: 8, background: 'rgba(255,255,255,0.04)', margin: '0 auto' }} />
            </div>
            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
                {[...Array(4)].map((_, i) => (
                    <div key={i} style={{ height: 80, borderRadius: '0.875rem', background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.6s ease-in-out infinite', animationDelay: `${i * 0.08}s` }} />
                ))}
            </div>
            {/* Planet cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {[...Array(6)].map((_, i) => (
                    <div key={i} style={{ height: 200, borderRadius: '0.875rem', background: 'rgba(255,255,255,0.04)', borderLeft: '4px solid rgba(255,255,255,0.06)', animation: 'pulse 1.6s ease-in-out infinite', animationDelay: `${i * 0.06}s` }} />
                ))}
            </div>
            <style>{`@keyframes pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }`}</style>
        </div>
    )
}
