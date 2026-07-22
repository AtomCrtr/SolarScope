'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface WebbImage {
  nasa_id: string
  title: string
  description: string
  date_created: string
  href: string
  thumb: string
}

/* ── Curated JWST highlights ── */
const HIGHLIGHTS = [
  {
    title: 'Carina Nebula — "Falaises Cosmiques"',
    desc: 'Des milliers d\'étoiles cachées dans cette région en formation révélées pour la première fois par Webb. Les colonnes de gaz atteignent 7 années-lumière de haut.',
    img: 'https://esawebb.org/media/archives/images/large/weic2205a.jpg',
    category: 'Nébuleuse', color: '#f97316', year: '2022',
  },
  {
    title: 'SMACS 0723 — Premier champ profond',
    desc: 'La première image publique de Webb. Des milliers de galaxies sur une portion de ciel aussi petite qu\'un grain de sable tenu à bout de bras — certaines vieilles de 13 milliards d\'années.',
    img: '/smacs0723.png',
    category: 'Cosmologie', color: '#6366f1', year: '2022',
  },
  {
    title: 'Piliers de la Création (M16)',
    desc: 'Une vue infrarouge des Piliers de la Création. Les étoiles nouvellement formées (points rouges) sont maintenant visibles à travers les colonnes de poussière cosmique.',
    img: 'https://stsci-opo.org/STScI-01GFNN3PWJMY4RQXKZ585BC4QH.png',
    category: 'Nébuleuse', color: '#10b981', year: '2022',
  },
  {
    title: 'Nébuleuse de l\'Anneau Sud',
    desc: 'Une étoile mourante expulse ses couches externes en une nébuleuse planétaire spectaculaire. Webb révèle deux étoiles au cœur, dont l\'une est responsable des formes complexes.',
    img: 'https://stsci-opo.org/STScI-01G8GZQ3ZFJRD8YF8YZWMAXCE3.png',
    category: 'Nébuleuse', color: '#a855f7', year: '2022',
  },
  {
    title: 'Quintette de Stephan',
    desc: 'Cinq galaxies en interaction à 290 millions d\'années-lumière. Webb révèle comment les collisions galactiques déclenchent des ondes de choc et alimentent les trous noirs supermassifs.',
    img: 'https://esawebb.org/media/archives/images/large/weic2208a.jpg',
    category: 'Galaxies', color: '#0ea5e9', year: '2022',
  },
  {
    title: 'Nébuleuse de la Tarentule',
    desc: 'La région de formation stellaire la plus massive de notre Groupe Local. Webb y détecte des propriétés cachées et une multitude de jeunes étoiles massives dans le brouillard de poussière.',
    img: 'https://esawebb.org/media/archives/images/large/weic2209a.jpg',
    category: 'Nébuleuse', color: '#ef4444', year: '2022',
  },
]

const SCIENCE_STATS = [
  { icon: '🔭', val: '6,5 m', label: 'Diamètre miroir' },
  { icon: '🌡️', val: '-233°C', label: 'Temp. fonctionnement' },
  { icon: '📡', val: '1 500 000 km', label: 'Distance de la Terre' },
  { icon: '🌟', val: '100×', label: 'Plus puissant qu\'Hubble' },
  { icon: '💰', val: '10 Md$', label: 'Coût total' },
  { icon: '📅', val: '25 ans', label: 'De conception à lancement' },
  { icon: '🌌', val: '400+', label: 'Articles publiés' },
  { icon: '🔬', val: '13,8 Ga', label: 'Passé observable' },
]

const CATEGORIES = [
  { icon: '🌌', title: 'Premières galaxies', desc: 'Détecte des galaxies nées 300 millions d\'ans après le Big Bang — plus jeune que jamais observé.', color: '#6366f1' },
  { icon: '⭐', title: 'Formation d\'étoiles', desc: 'Révèle les nurseries stellaires cachées dans les nébuleuses, impossible à voir en lumière visible.', color: '#f97316' },
  { icon: '🪐', title: 'Atmosphères exoplanètes', desc: 'Analyse la composition chimique des atmosphères de planètes à des dizaines d\'années-lumière.', color: '#10b981' },
  { icon: '🕳️', title: 'Trous noirs', desc: 'Observe les disques d\'accrétion et les jets de matière des trous noirs supermassifs en IR.', color: '#a855f7' },
]

export default function JWSTPage() {
  const [nasaImages, setNasaImages] = useState<WebbImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedHighlight, setSelectedHighlight] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'gallery' | 'nasa'>('gallery')

  useEffect(() => {
    fetch('https://images-api.nasa.gov/search?q=james+webb+space+telescope+nebula&media_type=image&year_start=2022&page_size=20')
      .then(r => r.json())
      .then(d => {
        const items = d.collection?.items || []
        const imgs: WebbImage[] = items.slice(0, 12).map((item: { data: { nasa_id: string; title: string; description: string; date_created: string }[]; links?: { href: string }[]; href: string }) => ({
          nasa_id: item.data[0].nasa_id,
          title: item.data[0].title,
          description: item.data[0].description?.slice(0, 180) + '…',
          date_created: item.data[0].date_created?.slice(0, 10),
          href: item.links?.[0]?.href || '',
          thumb: item.links?.[0]?.href || '',
        }))
        setNasaImages(imgs)
      })
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (selectedHighlight === null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedHighlight(null)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [selectedHighlight])

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>

      {/* HERO */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="page-header">
        <div className="badge" style={{ background: 'rgba(99,102,241,0.12)', color: '#a5b4fc', borderColor: 'rgba(99,102,241,0.25)' }}>
          🔭 JAMES WEBB SPACE TELESCOPE
        </div>
        <h1 className="page-title" style={{ background: 'linear-gradient(135deg, #e0e7ff, #6366f1, #4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Télescope Webb
        </h1>
        <p className="page-subtitle">
          Le télescope spatial le plus puissant jamais construit. Lancé le 25 décembre 2021, il observe l&apos;Univers en <strong style={{ color: '#a5b4fc' }}>infrarouge</strong> et voit jusqu&apos;aux premières lumières du cosmos.
        </p>
      </motion.div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.625rem', marginBottom: '2.5rem' }} className="max-sm:grid-cols-2">
        {SCIENCE_STATS.map((s, i) => (
          <motion.div key={s.label} className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div style={{ fontSize: '1.4rem' }}>{s.icon}</div>
            <div className="stat-value" style={{ color: '#a5b4fc', fontSize: '1rem' }}>{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <h2 className="sr-only">Galeries d’images du télescope James Webb</h2>
      {/* Tabs */}
      <div role="tablist" aria-label="Choisir une galerie Webb" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['gallery', 'nasa'] as const).map(tab => (
          <button key={tab} role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)} style={{
            padding: '0.5rem 1.25rem', borderRadius: 99, fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
            background: activeTab === tab ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${activeTab === tab ? 'rgba(99,102,241,0.45)' : 'rgba(255,255,255,0.07)'}`,
            color: activeTab === tab ? '#a5b4fc' : '#94a3b8', transition: 'all 0.2s',
          }}>
            {tab === 'gallery' ? '🌌 Images iconiques Webb' : '🛰️ Galerie NASA live'}
          </button>
        ))}
      </div>

      {/* Gallery — Curated highlights */}
      {activeTab === 'gallery' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '2rem' }} className="max-sm:grid-cols-1">
          {HIGHLIGHTS.map((h, i) => (
            <motion.button type="button" aria-label={`Agrandir ${h.title}`} key={h.title} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
              onClick={() => setSelectedHighlight(i)}
              style={{ cursor: 'pointer', borderRadius: '1rem', overflow: 'hidden', border: `1px solid ${h.color}20`, position: 'relative', padding: 0, textAlign: 'left', background: 'transparent' }}
              whileHover={{ scale: 1.02 }}>
              <Image src={h.img} alt={h.title} width={800} height={440}
                style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
                onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/400x220/0a0a1a/6366f1?text=Webb+${encodeURIComponent(h.category)}` }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 55%)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem' }}>
                <div style={{ fontSize: '0.62rem', fontWeight: 700, color: h.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
                  {h.category} · {h.year}
                </div>
                <h3 style={{ color: '#e2e8f0', fontSize: '0.88rem', fontWeight: 700, fontFamily: 'Outfit, sans-serif', lineHeight: 1.3 }}>{h.title}</h3>
              </div>
              <div style={{ position: 'absolute', top: 10, right: 10, background: `${h.color}20`, border: `1px solid ${h.color}40`, borderRadius: 99, padding: '2px 8px', fontSize: '0.65rem', color: h.color, fontWeight: 700 }}>
                JWST
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* NASA live images */}
      {activeTab === 'nasa' && (
        loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.625rem', marginBottom: '2rem' }}>
            {[...Array(8)].map((_, i) => <div key={i} style={{ height: 180, borderRadius: '0.75rem', background: 'rgba(255,255,255,0.04)' }} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.625rem', marginBottom: '2rem' }} className="max-sm:grid-cols-2">
            {nasaImages.map((img, i) => (
              <motion.a key={img.nasa_id} href={img.thumb} target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
                style={{ display: 'block', textDecoration: 'none', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid rgba(99,102,241,0.12)' }}
                whileHover={{ scale: 1.04 }}>
                <Image src={img.thumb} alt={img.title} width={600} height={400} style={{ width: '100%', height: 170, objectFit: 'cover', display: 'block' }}
                  onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x170/0a0a1a/6366f1?text=JWST' }} />
                <div style={{ padding: '0.5rem 0.625rem', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
                  <div style={{ color: '#c7d2fe', fontSize: '0.65rem', fontWeight: 600, lineHeight: 1.3 }}>{img.title?.slice(0, 55)}{img.title?.length > 55 ? '…' : ''}</div>
                  <div style={{ color: '#475569', fontSize: '0.6rem', marginTop: 2 }}>{img.date_created}</div>
                </div>
              </motion.a>
            ))}
          </div>
        )
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedHighlight !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedHighlight(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="jwst-dialog-title"
            style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(0,0,0,0.93)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <motion.div initial={{ scale: 0.88 }} animate={{ scale: 1 }} exit={{ scale: 0.88 }}
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: 900, width: '100%', borderRadius: '1.25rem', overflow: 'hidden', border: '1px solid rgba(99,102,241,0.2)' }}>
              <Image src={HIGHLIGHTS[selectedHighlight].img} alt={HIGHLIGHTS[selectedHighlight].title} width={1400} height={900} style={{ width: '100%', height: 'auto', maxHeight: '60vh', objectFit: 'contain', background: '#000', display: 'block' }} />
              <div style={{ padding: '1.25rem 1.5rem', background: '#080818' }}>
                <div style={{ color: HIGHLIGHTS[selectedHighlight].color, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.375rem' }}>
                  {HIGHLIGHTS[selectedHighlight].category} · JWST {HIGHLIGHTS[selectedHighlight].year}
                </div>
                <h2 id="jwst-dialog-title" style={{ color: '#e2e8f0', fontWeight: 700, fontFamily: 'Outfit', fontSize: '1.1rem', marginBottom: '0.625rem' }}>{HIGHLIGHTS[selectedHighlight].title}</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.7 }}>{HIGHLIGHTS[selectedHighlight].desc}</p>
                <button onClick={() => setSelectedHighlight(null)} style={{ marginTop: '1rem', padding: '0.5rem 1rem', borderRadius: 99, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', cursor: 'pointer', fontSize: '0.8rem' }}>✕ Fermer</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Science categories */}
      <div className="divider" />
      <h2 className="section-title" style={{ color: '#e2e8f0' }}>🔬 Domaines de recherche de Webb</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.875rem', marginBottom: '2rem' }} className="max-sm:grid-cols-1">
        {CATEGORIES.map((c, i) => (
          <motion.div key={c.title} className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            style={{ padding: '1.25rem', border: `1px solid ${c.color}18`, display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '2rem', flexShrink: 0 }}>{c.icon}</span>
            <div>
              <h3 style={{ color: c.color, fontWeight: 700, fontFamily: 'Outfit', marginBottom: '0.375rem' }}>{c.title}</h3>
              <p style={{ color: '#64748b', fontSize: '0.82rem', lineHeight: 1.65 }}>{c.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Webb vs Hubble */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h2 className="section-title" style={{ color: '#e2e8f0' }}>📡 Webb vs Hubble</h2>
        <div
          role="region"
          aria-label="Comparatif des télescopes spatiaux"
          tabIndex={0}
          style={{ overflowX: 'auto' }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr>
                {['Caractéristique', '🔭 Hubble', '🌌 James Webb'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Miroir principal', '2,4 m', '6,5 m'],
                ['Lancement', '1990', '25 déc. 2021'],
                ['Orbite', '547 km (LEO)', '1 500 000 km (L2)'],
                ['Spectre', 'Visible + UV', 'Infrarouge moyen'],
                ['Température', 'Ambiante', '-233°C (refroidi)'],
                ['Galaxies les plus lointaines', 'z ≈ 7 (650 M.a.l.)', 'z ≈ 13 (320 M.a.l.)'],
                ['Sensibilité', 'Base', '100× supérieure'],
              ].map(row => (
                <tr key={row[0]} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                  onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '0.625rem 1rem', color: '#94a3b8', fontWeight: 600 }}>{row[0]}</td>
                  <td style={{ padding: '0.625rem 1rem', color: '#64748b' }}>{row[1]}</td>
                  <td style={{ padding: '0.625rem 1rem', color: '#a5b4fc', fontWeight: 700 }}>{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
