export default function Loading() {
    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
            {/* Header skeleton */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <div style={{ width: 120, height: 24, borderRadius: 99, background: 'rgba(255,255,255,0.07)', margin: '0 auto 1rem', animation: 'pulse 1.6s ease-in-out infinite' }} />
                <div style={{ width: 280, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.06)', margin: '0 auto 0.75rem' }} />
                <div style={{ width: 220, height: 20, borderRadius: 8, background: 'rgba(255,255,255,0.04)', margin: '0 auto' }} />
            </div>
            {/* Planet selector grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.625rem', marginBottom: '2rem' }}>
                {[...Array(8)].map((_, i) => (
                    <div key={i} style={{ height: 80, borderRadius: '0.875rem', background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.6s ease-in-out infinite', animationDelay: `${i * 0.05}s` }} />
                ))}
            </div>
            {/* Main card */}
            <div className="card" style={{ padding: '1.5rem', height: 340 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', height: '100%' }}>
                    <div style={{ borderRadius: '0.875rem', background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.6s ease-in-out infinite' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', justifyContent: 'center' }}>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} style={{ height: 16, borderRadius: 8, background: 'rgba(255,255,255,0.05)', width: i % 2 ? '60%' : '100%' }} />
                        ))}
                    </div>
                </div>
            </div>
            <style>{`@keyframes pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }`}</style>
        </div>
    )
}
