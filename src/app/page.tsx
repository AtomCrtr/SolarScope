'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const Earth3D = dynamic(() => import('@/components/Earth3D'), { ssr: false })

const CATEGORIES = [
  {
    icon: '🌞', title: 'Système Solaire',
    desc: 'Explore notre voisinage cosmique — du Soleil à Neptune — avec des données scientifiques réelles.',
    color: '#f59e0b', gradient: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.05))', border: 'rgba(245,158,11,0.2)',
    pages: [
      { icon: '☀️', title: 'Soleil', href: '/soleil' }, { icon: '🪐', title: 'Planètes', href: '/planetes' },
      { icon: '🔴', title: 'Mars', href: '/mars' }, { icon: '☄️', title: 'Astéroïdes', href: '/asteroides' },
      { icon: '🪨', title: 'Météorites', href: '/meteorites' },
    ],
  },
  {
    icon: '🚀', title: 'Exploration humaine',
    desc: "Suis la Station Spatiale en direct et retrace 70 ans d'aventure humaine dans l'espace.",
    color: '#3b82f6', gradient: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(99,102,241,0.05))', border: 'rgba(59,130,246,0.2)',
    pages: [{ icon: '🛰️', title: 'ISS Tracker', href: '/iss' }, { icon: '🚀', title: 'Missions', href: '/missions' }],
  },
  {
    icon: '🔭', title: 'Observation & Télescopes',
    desc: "Le télescope Webb révolutionne notre vision de l'Univers. Exoplanètes, nébuleuses, ciel de ce soir…",
    color: '#a855f7', gradient: 'linear-gradient(135deg, rgba(168,85,247,0.08), rgba(99,102,241,0.05))', border: 'rgba(168,85,247,0.2)',
    pages: [
      { icon: '🔭', title: 'Webb (JWST)', href: '/jwst' }, { icon: '🌌', title: 'Ciel ce soir', href: '/ciel' },
      { icon: '🌠', title: 'Photo du Jour', href: '/photo-du-jour' }, { icon: '🌟', title: 'Exoplanètes', href: '/exoplanetes' },
    ],
  },
  {
    icon: '🎓', title: 'Découverte & Apprentissage',
    desc: 'Actualités spatiales fraîches et un quiz pour tester tes connaissances astronomiques !',
    color: '#10b981', gradient: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(6,182,212,0.05))', border: 'rgba(16,185,129,0.2)',
    pages: [{ icon: '📰', title: 'Actualités', href: '/actualites' }, { icon: '🎮', title: 'Quiz spatial', href: '/quiz' }],
  },
]

interface LaunchInfo { name: string; net: string; agency: string; countdown: number }

function daysSince(dateStr: string) {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
}

function useCountdown(targetMs: number | null) {
  const [remaining, setRemaining] = useState<number | null>(null)
  useEffect(() => {
    if (!targetMs) return
    const tick = () => setRemaining(Math.max(0, targetMs - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetMs])
  return remaining
}

function formatCountdown(ms: number) {
  const d = Math.floor(ms / 86400000)
  const h = Math.floor((ms % 86400000) / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  if (d > 0) return `${d}j ${h}h ${m}m`
  return `T-${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function HomePage() {
  const [exoCount, setExoCount] = useState<number | null>(null)
  const [neoCount, setNeoCount] = useState<number | null>(null)
  const [nextLaunch, setNextLaunch] = useState<LaunchInfo | null>(null)
  const [issCrewCount, setIssCrewCount] = useState<number | null>(null)
  const marsDays = daysSince('2012-08-06')         // Curiosity landing
  const persDays = daysSince('2021-02-18')         // Perseverance landing
  const issHumanDays = daysSince('2000-11-02')     // Continuous human presence in space
  const countdown = useCountdown(nextLaunch?.countdown ?? null)

  useEffect(() => {
    fetch('https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+count(*)+from+ps+where+default_flag=1&format=json')
      .then(r => r.json()).then(d => { const c = d?.[0]?.[0]; if (c) setExoCount(Number(c)) })
      .catch(() => setExoCount(5800))
  }, [])

  useEffect(() => {
    fetch('https://api.nasa.gov/neo/rest/v1/stats?api_key=GsPmvsX1qKcrYHCxdgEuKi7DrJYoXtYZ1u2aOVLF')
      .then(r => r.json()).then(d => { if (d?.near_earth_object_count) setNeoCount(d.near_earth_object_count) })
      .catch(() => setNeoCount(35000))
  }, [])

  useEffect(() => {
    fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=1&format=json')
      .then(r => r.json()).then(d => {
        const l = d.results?.[0]
        if (l) setNextLaunch({ name: l.name, net: l.net, agency: l.launch_service_provider?.name || 'NASA', countdown: new Date(l.net).getTime() })
      }).catch(() => { })
  }, [])

  useEffect(() => {
    fetch('http://api.open-notify.org/astros.json')
      .then(r => r.json()).then(d => { if (d?.number) setIssCrewCount(d.number) })
      .catch(() => setIssCrewCount(7)) // Fallback to 7 if API fails
  }, [])

  const liveKpis = [
    { val: exoCount ? exoCount.toLocaleString('fr-FR') : '…', label: 'Exoplanètes confirmées', sublabel: 'NASA Exoplanet Archive', color: '#a855f7', icon: '🌟', live: true },
    { val: neoCount ? neoCount.toLocaleString('fr-FR') : '…', label: 'Astéroïdes NEO', sublabel: 'NASA CNEOS', color: '#f97316', icon: '☄️', live: true },
    { val: `${marsDays.toLocaleString('fr-FR')} sols`, label: 'Curiosity actif', sublabel: 'Depuis août 2012', color: '#ef4444', icon: '🔴', live: false },
    { val: `${persDays.toLocaleString('fr-FR')} sols`, label: 'Perseverance actif', sublabel: 'Depuis fév. 2021', color: '#8b5cf6', icon: '🚀', live: false },
    { val: issCrewCount !== null ? `${issCrewCount} astro.` : '7 astro.', label: 'Équipage ISS', sublabel: "En ce moment dans l'espace", color: '#3b82f6', icon: '🛰️', live: true },
    { val: `${issHumanDays.toLocaleString('fr-FR')} j.`, label: 'Présence humaine', sublabel: 'Ininterrompue depuis 2000', color: '#10b981', icon: '👨‍🚀', live: false },
  ]

  return (
    <>
      {/* ── HERO ── */}
      <section style={{ minHeight: 'calc(100vh - var(--navbar-h))', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '2rem' }} className="container max-sm:grid-cols-1">
        <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: 'easeOut' }}>
          <div className="badge">🛰️ DONNÉES NASA EN DIRECT</div>
          <h1 className="page-title gradient-text" style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
            Explore<br />l&apos;Univers
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.15rem', lineHeight: 1.85, margin: '1.5rem 0 2.5rem', maxWidth: 480 }}>
            Astéroïdes, planètes, Mars, exoplanètes… découvre l&apos;espace avec des données{' '}
            <strong style={{ color: '#a78bfa' }}>réelles de la NASA</strong> présentées de façon interactive.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/planetes" className="btn-primary">🪐 Explorer</Link>
            <Link href="/iss" className="btn-ghost">🛰️ ISS Live</Link>
          </div>
          {/* KPI grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '2.5rem' }} className="max-sm:grid-cols-2">
            {liveKpis.map(s => (
              <motion.div key={s.label}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: '0.875rem 1rem', borderRadius: '0.875rem',
                  background: `${s.color}08`, border: `1px solid ${s.color}20`,
                  display: 'flex', flexDirection: 'column', gap: '0.2rem',
                  position: 'relative', overflow: 'hidden',
                }}>
                {/* glow orb */}
                <div style={{ position: 'absolute', top: -20, right: -20, width: 70, height: 70, borderRadius: '50%', background: `${s.color}12`, filter: 'blur(20px)', pointerEvents: 'none' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
                  <span style={{ fontSize: '1rem' }}>{s.icon}</span>
                  {s.live && <span className="pulse-dot" style={{ width: 5, height: 5 }} />}
                </div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.15rem', color: s.color, lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>{s.label}</div>
                <div style={{ fontSize: '0.6rem', color: '#475569' }}>{s.sublabel}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, ease: 'easeOut' }} style={{ height: 540 }} className="max-sm:hidden">
          <Earth3D height={540} />
        </motion.div>
      </section>

      {/* ── Next Launch Banner ── */}
      {nextLaunch && countdown !== null && (
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ padding: '0 0 3rem' }}>
          <div className="container">
            <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(59,130,246,0.08))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '1rem', padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '2rem' }}>🚀</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Prochain lancement</div>
                <div style={{ color: '#e2e8f0', fontWeight: 700, fontFamily: 'Outfit, sans-serif', fontSize: '1rem' }}>{nextLaunch.name}</div>
                <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{nextLaunch.agency}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '1.6rem', fontWeight: 900, color: '#6366f1', letterSpacing: '0.04em' }}>{formatCountdown(countdown)}</div>
                <div style={{ color: '#475569', fontSize: '0.65rem' }}>jusqu&apos;au lancement</div>
              </div>
              <Link href="/missions" style={{ padding: '0.5rem 1.25rem', borderRadius: 99, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', textDecoration: 'none', fontWeight: 600, fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                Voir tous les lancements →
              </Link>
            </div>
          </div>
        </motion.section>
      )}

      {/* ── 4 CATEGORY BLOCKS ── */}
      <section style={{ paddingBottom: '8rem' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="badge">🌌 SECTIONS DU SITE</div>
            <h2 className="gradient-text" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
              Par où commencer ?
            </h2>
            <p style={{ color: '#475569', marginTop: '0.75rem', fontSize: '0.95rem' }}>
              Survole le menu pour voir toutes les pages — ou clique sur une catégorie ci-dessous.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }} className="max-sm:grid-cols-1">
            {CATEGORIES.map((cat, i) => (
              <motion.div key={cat.title}
                initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}>
                <div style={{ position: 'relative', overflow: 'hidden', padding: '1.75rem', borderRadius: '1.25rem', background: cat.gradient, border: `1px solid ${cat.border}`, transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = `0 16px 40px ${cat.color}18` }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ''; el.style.boxShadow = '' }}>
                  <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: `${cat.color}10`, filter: 'blur(40px)', pointerEvents: 'none' }} />
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>{cat.icon}</div>
                    <div>
                      <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: '#e2e8f0', marginBottom: '0.35rem' }}>{cat.title}</h3>
                      <p style={{ color: '#64748b', fontSize: '0.82rem', lineHeight: 1.6, maxWidth: 380 }}>{cat.desc}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                    {cat.pages.map(page => (
                      <Link key={page.href} href={page.href} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '4px 12px', borderRadius: 99, textDecoration: 'none', background: `${cat.color}10`, border: `1px solid ${cat.color}25`, color: cat.color, fontSize: '0.75rem', fontWeight: 600, transition: 'background 0.15s, border-color 0.15s' }}
                        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${cat.color}22`; el.style.borderColor = `${cat.color}45` }}
                        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${cat.color}10`; el.style.borderColor = `${cat.color}25` }}>
                        {page.icon} {page.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
