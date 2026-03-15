export default function Loading() {
    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ width: 120, height: 24, borderRadius: 99, background: 'rgba(255,255,255,0.07)', margin: '0 auto 1rem', animation: 'pulse 1.6s ease-in-out infinite' }} />
                <div style={{ width: 200, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.06)', margin: '0 auto 0.75rem' }} />
            </div>
            {/* Search skeleton */}
            <div style={{ width: 500, maxWidth: '100%', height: 48, borderRadius: '1rem', background: 'rgba(255,255,255,0.05)', margin: '0 auto 2rem', animation: 'pulse 1.6s ease-in-out infinite' }} />
            {/* Category chips skeleton */}
            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.5rem' }}>
                {[...Array(9)].map((_, i) => (
                    <div key={i} style={{ width: 70 + i * 10, height: 28, borderRadius: 99, background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.6s ease-in-out infinite', animationDelay: `${i * 0.05}s` }} />
                ))}
            </div>
            {/* Article cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <div style={{ width: 80, height: 20, borderRadius: 99, background: 'rgba(255,255,255,0.07)', animation: 'pulse 1.6s ease-in-out infinite' }} />
                            <div style={{ width: 60, height: 20, borderRadius: 8, background: 'rgba(255,255,255,0.05)' }} />
                        </div>
                        <div style={{ height: 22, borderRadius: 8, background: 'rgba(255,255,255,0.07)', marginBottom: '0.75rem', animation: 'pulse 1.6s ease-in-out infinite', animationDelay: `${i * 0.08}s` }} />
                        <div style={{ height: 16, borderRadius: 8, background: 'rgba(255,255,255,0.05)', marginBottom: '0.4rem' }} />
                        <div style={{ height: 16, borderRadius: 8, background: 'rgba(255,255,255,0.05)', width: '70%' }} />
                    </div>
                ))}
            </div>
            <style>{`@keyframes pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }`}</style>
        </div>
    )
}
