export default function Loading() {
    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ width: 200, height: 24, borderRadius: 99, background: 'rgba(249,115,22,0.12)', margin: '0 auto 1rem', animation: 'pulse 1.6s ease-in-out infinite' }} />
                <div style={{ width: 300, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.06)', margin: '0 auto 0.75rem' }} />
                <div style={{ width: 380, height: 20, borderRadius: 8, background: 'rgba(255,255,255,0.04)', margin: '0 auto' }} />
            </div>
            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.625rem', marginBottom: '2rem' }}>
                {[...Array(4)].map((_, i) => (
                    <div key={i} style={{ height: 90, borderRadius: '0.875rem', background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.1)', animation: 'pulse 1.6s ease-in-out infinite', animationDelay: `${i * 0.1}s` }} />
                ))}
            </div>
            {/* Class chips skeleton */}
            <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1rem' }}>
                {[...Array(8)].map((_, i) => (
                    <div key={i} style={{ width: 50, height: 28, borderRadius: 99, background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.6s ease-in-out infinite', animationDelay: `${i * 0.05}s` }} />
                ))}
            </div>
            {/* Map skeleton */}
            <div style={{ height: 450, borderRadius: '0.875rem', background: 'rgba(249,115,22,0.04)', border: '1px solid rgba(249,115,22,0.1)', marginBottom: '1.5rem', animation: 'pulse 1.6s ease-in-out infinite', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: '#475569' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌍</div>
                    <p style={{ fontSize: '0.82rem' }}>Chargement de la carte…</p>
                </div>
            </div>
            <style>{`@keyframes pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }`}</style>
        </div>
    )
}
