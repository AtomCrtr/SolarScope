'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'

const Planet3D = dynamic(() => import('@/components/Planet3D'), { ssr: false })
const RoverViewer3D = dynamic(() => import('@/components/RoverViewer3D'), { ssr: false })



/* ─────────────────────────────────────────── DATA ── */
const FACTS = [
    { emoji: '🌡️', val: '-63°C', label: 'Temp. moyenne' },
    { emoji: '📏', val: '6 792 km', label: 'Diamètre' },
    { emoji: '🌙', val: '2 lunes', label: 'Phobos & Deimos' },
    { emoji: '📅', val: '687 jours', label: 'Durée orbite' },
    { emoji: '⚖️', val: '3.72 m/s²', label: 'Gravité' },
    { emoji: '🏔️', val: '21 km', label: 'Olympus Mons' },
    { emoji: '🕐', val: '24h 37', label: 'Journée martienne' },
    { emoji: '☀️', val: '227.9 Mkm', label: 'Distance au Soleil' },
]

const ROVERS_DETAIL = [
    {
        name: 'Sojourner', agency: 'NASA / JPL', active: false, key: null,
        launch: '4 déc. 1996', land: '4 juil. 1997', area: 'Plaine de Chryse', color: '#94a3b8',
        mass: '10.6 kg', distance: '100 m', duration: '83 sols',
        emoji: '🛸',
        desc: 'Premier rover martien. Malgré sa taille miniature (similaire à un four à micro-ondes), il a prouvé la faisabilité des rovers mobiles sur une autre planète.',
        achievements: ['Premier rover mobile sur un autre monde', 'Analyse de 16 rochers avec APXS', 'Mission prévue 7 jours → réelle 83 sols'],
    },
    {
        name: 'Spirit', agency: 'NASA / JPL', active: false, key: null,
        launch: '10 juin 2003', land: '4 janv. 2004', area: 'Cratère Gusev', color: '#f59e0b',
        mass: '174 kg', distance: '7.73 km', duration: '2 208 sols',
        emoji: '✨',
        desc: 'Exploration du Cratère Gusev et des Collines Columbia. A trouvé des preuves de passé hydrothermal et découvert de la silice pure, signe d\'eau chaude ancienne.',
        achievements: ['Preuves d\'activité hydrothermale ancienne', 'Dépôts de silice pur (eau chaude)', 'Parcours de 7,73 km en terrain accidenté', 'Contact perdu mars 2010'],
    },
    {
        name: 'Opportunity', agency: 'NASA / JPL', active: false, key: null,
        launch: '8 juil. 2003', land: '25 janv. 2004', area: 'Meridiani Planum', color: '#f97316',
        mass: '174 kg', distance: '45.16 km', duration: '5 111 sols',
        emoji: '🏆',
        desc: 'Le rover le plus durable de l\'histoire ! Mission prévue 90 sols, il a survécu 15 ans. A parcouru 45 km, confirmé l\'existence d\'eau liquide ancienne et exploré des cratères géants.',
        achievements: ['Record de distance extraterrestre : 45,16 km', '15 ans de mission (record absolu)', 'Confirmation d\'eau liquide ancienne', 'Exploration d\'Endeavour Crater (+22 km)'],
    },
    {
        name: 'Curiosity', agency: 'NASA / JPL', active: true, key: 'curiosity',
        launch: '26 nov. 2011', land: '6 août 2012', area: 'Cratère Gale / Mont Sharp', color: '#ef4444',
        mass: '899 kg', distance: '+29 km', duration: '4 200+ sols',
        emoji: '🤖',
        desc: 'Laboratoire mobile de la taille d\'une voiture. Explore le Cratère Gale depuis 2012 et grimpe le Mont Sharp. A confirmé que Mars était habitable par le passé.',
        achievements: ['Confirmation de conditions habitables passées', 'Détection de molécules organiques', 'Analyse de matière organique complexe', 'Mesure continue du rayonnement martien', 'Découverte de méthane saisonnier'],
    },
    {
        name: 'Perseverance', agency: 'NASA / JPL', active: true, key: 'perseverance',
        launch: '30 juil. 2020', land: '18 fév. 2021', area: 'Cratère Jezero', color: '#8b5cf6',
        mass: '1 025 kg', distance: '+25 km', duration: '1 400+ sols',
        emoji: '🚀',
        desc: 'Plus sophistiqué que jamais. Cherche des signes de vie ancienne dans un ancien delta de rivière. A déployé Ingenuity, le premier hélicoptère extraterrestre.',
        achievements: ['Déploiement d\'Ingenuity (1er hélicoptère extraterrestre)', 'Production d\'oxygène avec MOXIE', 'Collecte de 23+ carottes de roches', 'Enregistrement des sons martiens', 'Analyse de dépôts lacustres du Cratère Jezero'],
    },
]

const ACTIVE_ROVERS = ROVERS_DETAIL.filter(r => r.active && r.key) as Array<typeof ROVERS_DETAIL[0] & { key: string }>

const MARS_TIMELINE = [
    { year: '1965', flag: '🇺🇸', event: 'Mariner 4 — Premier survol', detail: 'Premières photos rapprochées : une surface criblée de cratères, sans canal ni vie visible.' },
    { year: '1971', flag: '🇺🇸', event: 'Mariner 9 — Premier orbiteur', detail: 'Cartographie complète de Mars. Découverte d\'Olympus Mons et Valles Marineris.' },
    { year: '1976', flag: '🇺🇸', event: 'Viking 1 & 2 — Atterrissages', detail: 'Premières photos couleur depuis la surface. Tests de biologie : résultats ambigus.' },
    { year: '1997', flag: '🇺🇸', event: 'Pathfinder + Sojourner', detail: 'Premier rover. Preuves d\'eau liquide ancienne. Révolution dans l\'exploration mobile.' },
    { year: '2004', flag: '🇺🇸', event: 'Spirit & Opportunity', detail: 'Spirit = silice hydrothermale. Opportunity = sphères « myrtilles » hématite, preuves d\'eau.' },
    { year: '2008', flag: '🇺🇸', event: 'Phoenix — Pôle Nord', detail: 'Première détection de glace d\'eau pure à la surface (0-5 cm de profondeur).' },
    { year: '2012', flag: '🇺🇸', event: 'Curiosity — Cratère Gale', detail: 'MSL : laboratoire chimique complet. Conditions habitables confirmées. Méthane détecté.' },
    { year: '2021', flag: '🇺🇸', event: 'Perseverance + Ingenuity', detail: 'Premier hélicoptère extraterrestre. Production d\'O₂. Collecte d\'échantillons pour retour.' },
    { year: '2022', flag: '🇦🇪', event: 'Hope Probe — Orbiteur', detail: 'Premier orbiteur des Émirats Arabes Unis. Cartographie de la météo martienne en 3D.' },
    { year: '2021', flag: '🇨🇳', event: 'Tianwen-1 + Zhurong', detail: 'Premières missions chinoises complètes : orbiteur + atterrisseur + rover.' },
    { year: '2029', flag: '🌍', event: '🔮 Mars Sample Return (prévu)', detail: 'Retour des 23+ carottes de Perseverance sur Terre — révolution scientifique possible.' },
]



/* ─────────────────────────────────────────── Curated NASA Gallery ── */
const MARS_GALLERY = [
    {
        src: 'https://images-assets.nasa.gov/image/PIA24430/PIA24430~orig.jpg',
        title: 'Premier vol Ingenuity',
        desc: 'Le premier hélicoptère extraterrestre en vol · Sol 58',
        rover: 'Perseverance', camera: 'NavCam', sol: 58, color: '#8b5cf6'
    },
    {
        src: 'https://images-assets.nasa.gov/image/PIA24546/PIA24546~orig.jpg',
        title: 'Perseverance au Cratère Jezero',
        desc: 'Vue panoramique depuis le site d\'atterrissage · Sol 13',
        rover: 'Perseverance', camera: 'MastCam-Z', sol: 13, color: '#8b5cf6'
    },
    {
        src: 'https://images-assets.nasa.gov/image/PIA24542/PIA24542~orig.jpg',
        title: 'Selfie de Perseverance',
        desc: 'Auto-portrait avec Ingenuity en arrière-plan · Sol 46',
        rover: 'Perseverance', camera: 'WATSON', sol: 46, color: '#8b5cf6'
    },
    {
        src: '/rovers/curiosity.png',
        title: 'Curiosity au Mont Sharp',
        desc: 'Selfie au pied du Mont Sharp · Sol 2291',
        rover: 'Curiosity', camera: 'MAHLI', sol: 2291, color: '#ef4444'
    },
    {
        src: '/textures/mars.jpg',
        title: 'Roches de Vera Rubin Ridge',
        desc: 'Litage sédimentaire martien · Sol 1769',
        rover: 'Curiosity', camera: 'MastCam', sol: 1769, color: '#ef4444'
    },
    {
        src: 'https://images-assets.nasa.gov/image/PIA19839/PIA19839~orig.jpg',
        title: 'Coucher de soleil martien',
        desc: 'Crépuscule bleu sur Mars — Cratère Gale · Sol 956',
        rover: 'Curiosity', camera: 'MastCam', sol: 956, color: '#ef4444'
    },
    {
        src: '/rovers/opportunity.png',
        title: 'Marathon Valley — Opportunity',
        desc: 'Au bord du Cratère Endeavour · Sol 3966',
        rover: 'Opportunity', camera: 'PanCam', sol: 3966, color: '#f97316'
    },
    {
        src: 'https://images-assets.nasa.gov/image/PIA24836/PIA24836~orig.jpg',
        title: 'Dunes de sable noir',
        desc: 'Champs de dunes basaltiques depuis Perseverance · Sol 170',
        rover: 'Perseverance', camera: 'Hazcam', sol: 170, color: '#8b5cf6'
    },
]

export default function MarsPage() {
    const [activeRover, setActiveRover] = useState<'curiosity' | 'perseverance'>('curiosity')
    const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
    const activeRoverDetail = ROVERS_DETAIL.find(r => r.key === activeRover)!

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>

            {/* ── HERO ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center', marginBottom: '2.5rem' }} className="max-sm:grid-cols-1">
                <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                    <div className="badge" style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', borderColor: 'rgba(239,68,68,0.25)' }}>
                        🤖 ROVERS NASA — EN DIRECT
                    </div>
                    <h1 className="page-title" style={{ background: 'linear-gradient(135deg, #fca5a5, #ef4444, #b91c1c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                        Mars
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: 440, marginBottom: '1.5rem' }}>
                        La Planète Rouge — à <strong style={{ color: '#f87171' }}>227,9 millions de km</strong> de la Terre. Quatre rovers actifs et une dizaine d&apos;orbiteurs y collectent des données en ce moment même.
                    </p>
                    {/* Active rover selector */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {ACTIVE_ROVERS.map(r => (
                            <button key={r.key} onClick={() => setActiveRover(r.key as 'curiosity' | 'perseverance')} style={{
                                padding: '0.5rem 1.1rem', borderRadius: 99, fontSize: '0.82rem', fontWeight: 700,
                                cursor: 'pointer', border: `2px solid ${activeRover === r.key ? r.color : 'rgba(255,255,255,0.1)'}`,
                                background: activeRover === r.key ? `${r.color}18` : 'transparent',
                                color: activeRover === r.key ? r.color : '#64748b',
                                transition: 'all 0.2s ease',
                            }}>{r.emoji} {r.name}</button>
                        ))}
                    </div>
                </motion.div>

                {/* 3D Mars globe */}
                <motion.div initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: 'easeOut' }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            height: 340, borderRadius: '1.5rem', overflow: 'hidden',
                            background: 'radial-gradient(ellipse at center, rgba(40,5,0,0.92) 0%, rgba(0,0,0,0.98) 100%)',
                            border: '1px solid rgba(239,68,68,0.15)',
                            boxShadow: '0 0 60px rgba(239,68,68,0.08)',
                        }}>
                            <Planet3D textureUrl="/textures/mars.jpg" size={2.1} rotationSpeed={0.002} atmosphereColor="#ef4444" />
                        </div>
                        <div style={{
                            position: 'absolute', bottom: 12, left: 0, right: 0, textAlign: 'center',
                            color: '#475569', fontSize: '0.65rem', letterSpacing: '0.05em',
                        }}>🖱 Maintenir & glisser pour explorer</div>
                        {/* Live badge */}
                        <div style={{
                            position: 'absolute', top: 14, right: 14,
                            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(239,68,68,0.3)', borderRadius: 99,
                            padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 5,
                        }}>
                            <span className="pulse-dot" style={{ width: 6, height: 6 }} />
                            <span style={{ color: '#f87171', fontSize: '0.68rem', fontWeight: 700 }}>NASA · En direct</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ── STATS ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.65rem', marginBottom: '2.5rem' }} className="max-sm:grid-cols-2">
                {FACTS.map((s, i) => (
                    <motion.div key={s.label} className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <div style={{ fontSize: '1.4rem' }}>{s.emoji}</div>
                        <div className="stat-value" style={{ color: '#f87171', fontSize: '1.05rem' }}>{s.val}</div>
                        <div className="stat-label">{s.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* ── ACTIVE ROVER DETAIL ── */}
            <div className="divider" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <h2 className="section-title" style={{ color: activeRoverDetail.color, marginBottom: 0 }}>
                    {activeRoverDetail.emoji} Rover {activeRoverDetail.name}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="pulse-dot" />
                    <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>Actif · {activeRoverDetail.area}</span>
                </div>
            </div>

            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', border: `1px solid ${activeRoverDetail.color}25` }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem', alignItems: 'start' }} className="max-sm:grid-cols-1">
                    <div>
                        <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem' }}>{activeRoverDetail.desc}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {activeRoverDetail.achievements.map(a => (
                                <span key={a} style={{
                                    padding: '4px 10px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600,
                                    background: `${activeRoverDetail.color}12`, border: `1px solid ${activeRoverDetail.color}28`,
                                    color: activeRoverDetail.color,
                                }}>✓ {a}</span>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: 'grid', gap: '0.625rem', minWidth: 160 }}>
                        {[
                            { label: 'Lancement', val: activeRoverDetail.launch, icon: '🚀' },
                            { label: 'Atterrissage', val: activeRoverDetail.land, icon: '🛬' },
                            { label: 'Masse', val: activeRoverDetail.mass, icon: '⚖️' },
                            { label: 'Distance parcourue', val: activeRoverDetail.distance, icon: '📍' },
                            { label: 'Durée active', val: activeRoverDetail.duration, icon: '⏱' },
                        ].map(d => (
                            <div key={d.label} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.03)' }}>
                                <span style={{ fontSize: '1rem' }}>{d.icon}</span>
                                <div>
                                    <div style={{ color: '#64748b', fontSize: '0.65rem' }}>{d.label}</div>
                                    <div style={{ color: '#e2e8f0', fontSize: '0.8rem', fontWeight: 700 }}>{d.val}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── 3D ROVER VIEWER ── */}
            <div style={{ marginBottom: '2.5rem' }}>
                <h2 className="section-title" style={{ color: '#e2e8f0', marginBottom: '0.5rem' }}>
                    🛸 Maquette 3D — {activeRoverDetail.name}
                </h2>
                <p style={{ color: '#475569', fontSize: '0.72rem', marginBottom: '1rem' }}>
                    Modèle 3D officiel NASA · Faites pivoter avec la souris
                </p>
                <RoverViewer3D rover={activeRover} height={360} />
            </div>

            {/* ── CURATED NASA GALLERY ── */}
            <div className="divider" />
            <div style={{ marginBottom: '2.5rem' }}>
                <h2 className="section-title" style={{ color: '#e2e8f0', marginBottom: '0.25rem' }}>📸 Galerie — Icônes de l&apos;exploration martienne</h2>
                <p style={{ color: '#475569', fontSize: '0.72rem', marginBottom: '1.25rem' }}>Sélection des photos les plus marquantes — Curiosity, Opportunity &amp; Perseverance</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.625rem' }} className="max-sm:grid-cols-2">
                    {MARS_GALLERY.map((photo, i) => (
                        <motion.div key={i}
                            initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                            onClick={() => setLightboxIdx(i)}
                            style={{ cursor: 'pointer', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', position: 'relative' }}
                            whileHover={{ scale: 1.04, borderColor: `${photo.color}50` }}>
                            <img src={photo.src} alt={photo.title}
                                style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block', background: 'rgba(0,0,0,0.5)' }}
                                onError={e => {
                                    const image = e.currentTarget
                                    image.onerror = null
                                    image.src = '/textures/mars.jpg'
                                }}
                            />
                            <div style={{ padding: '0.4rem 0.6rem', background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(6px)' }}>
                                <div style={{ color: photo.color, fontSize: '0.65rem', fontWeight: 700, fontFamily: 'Outfit' }}>{photo.rover} · {photo.camera}</div>
                                <div style={{ color: '#94a3b8', fontSize: '0.6rem', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{photo.title}</div>
                            </div>
                            {/* hover overlay */}
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0)', transition: 'background 0.2s', pointerEvents: 'none' }}>
                                <span style={{ fontSize: '1.5rem', opacity: 0, transition: 'opacity 0.2s' }}>🔍</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ── LIGHTBOX ── */}
            <AnimatePresence>
                {lightboxIdx !== null && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setLightboxIdx(null)}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 9000,
                            background: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(16px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
                        }}>
                        <motion.div initial={{ scale: 0.88 }} animate={{ scale: 1 }} exit={{ scale: 0.88 }}
                            onClick={e => e.stopPropagation()}
                            style={{ maxWidth: 880, width: '100%', borderRadius: '1.25rem', overflow: 'hidden', border: `1px solid ${MARS_GALLERY[lightboxIdx].color}30` }}>
                            <img src={MARS_GALLERY[lightboxIdx].src} alt={MARS_GALLERY[lightboxIdx].title}
                                style={{ width: '100%', display: 'block', maxHeight: '65vh', objectFit: 'contain', background: '#000' }} />
                            <div style={{ padding: '1rem 1.5rem', background: '#080816', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <div>
                                    <div style={{ color: MARS_GALLERY[lightboxIdx].color, fontWeight: 700, fontFamily: 'Outfit' }}>{MARS_GALLERY[lightboxIdx].title}</div>
                                    <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: 2 }}>{MARS_GALLERY[lightboxIdx].desc}</div>
                                    <div style={{ color: '#334155', fontSize: '0.7rem', marginTop: 3 }}>Rover {MARS_GALLERY[lightboxIdx].rover} · {MARS_GALLERY[lightboxIdx].camera} · Sol {MARS_GALLERY[lightboxIdx].sol}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <a href={MARS_GALLERY[lightboxIdx].src} target="_blank" rel="noopener noreferrer"
                                        style={{ padding: '0.5rem 1rem', borderRadius: 99, background: `${MARS_GALLERY[lightboxIdx].color}15`, border: `1px solid ${MARS_GALLERY[lightboxIdx].color}35`, color: MARS_GALLERY[lightboxIdx].color, fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600 }}>
                                        ↗ Pleine résolution
                                    </a>
                                    <button onClick={() => setLightboxIdx(null)}
                                        style={{ padding: '0.5rem 1rem', borderRadius: 99, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '0.8rem', cursor: 'pointer' }}>
                                        ✕ Fermer
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── ROVER HISTORY ── */}
            <div className="divider" />
            <h2 className="section-title" style={{ color: '#e2e8f0' }}>🤖 Tous les rovers martiens</h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem', marginTop: '-0.5rem' }}>
                Cinq rovers se sont posés sur Mars depuis 1997. Deux sont encore actifs aujourd&apos;hui.
            </p>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
                {ROVERS_DETAIL.map((r, i) => (
                    <motion.div key={r.name} className="card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        style={{ padding: '1.25rem', border: `1px solid ${r.color}20`, position: 'relative', overflow: 'hidden' }}>
                        {/* accent stripe */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${r.color}, transparent)`, borderRadius: '4px 4px 0 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                <span style={{ fontSize: '1.6rem' }}>{r.emoji}</span>
                                <div>
                                    <h3 style={{ color: r.color, fontWeight: 800, fontFamily: 'Outfit, sans-serif', fontSize: '1.05rem' }}>{r.name}</h3>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{r.agency}</div>
                                </div>
                            </div>
                            <span style={{
                                padding: '3px 8px', borderRadius: 99, fontSize: '0.65rem', fontWeight: 700,
                                background: r.active ? 'rgba(16,185,129,0.12)' : 'rgba(100,116,139,0.12)',
                                border: `1px solid ${r.active ? 'rgba(16,185,129,0.3)' : 'rgba(100,116,139,0.2)'}`,
                                color: r.active ? '#10b981' : '#64748b',
                            }}>{r.active ? '● Actif' : '○ Mission terminée'}</span>
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.65, marginBottom: '0.875rem' }}>{r.desc}</p>
                        {/* Key stats mini-grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.375rem', marginBottom: '0.875rem' }}>
                            {[
                                { icon: '📅', label: 'Atterrissage', val: r.land },
                                { icon: '📍', label: 'Distance', val: r.distance },
                                { icon: '⏱', label: 'Durée', val: r.duration },
                            ].map(d => (
                                <div key={d.label} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', padding: '0.4rem 0.25rem' }}>
                                    <div style={{ fontSize: '0.75rem' }}>{d.icon}</div>
                                    <div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '0.68rem' }}>{d.val}</div>
                                    <div style={{ color: '#475569', fontSize: '0.6rem' }}>{d.label}</div>
                                </div>
                            ))}
                        </div>
                        {/* Achievements */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                            {r.achievements.slice(0, 3).map(a => (
                                <div key={a} style={{ display: 'flex', gap: '0.375rem', alignItems: 'flex-start' }}>
                                    <span style={{ color: r.color, fontSize: '0.65rem', marginTop: 2, flexShrink: 0 }}>✓</span>
                                    <span style={{ color: '#64748b', fontSize: '0.72rem', lineHeight: 1.5 }}>{a}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ── TIMELINE ── */}
            <div className="divider" />
            <h2 className="section-title" style={{ color: '#e2e8f0' }}>🚀 Histoire de l&apos;exploration martienne</h2>
            <div className="card" style={{ padding: '1.5rem' }}>
                {MARS_TIMELINE.map((ev, i) => (
                    <div key={`${ev.year}-${i}`} className="timeline-item">
                        <div className="timeline-dot" style={{
                            background: i === MARS_TIMELINE.length - 1
                                ? 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))'
                                : 'linear-gradient(135deg, #ef4444, #f97316)',
                            fontSize: '0.68rem', fontWeight: 700, minWidth: 32, height: 32,
                        }}>
                            {i === MARS_TIMELINE.length - 1 ? '🔮' : ev.flag}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'baseline', flexWrap: 'wrap' }}>
                                <span style={{ color: '#f87171', fontWeight: 800, fontSize: '0.78rem', fontFamily: 'Outfit, sans-serif', flexShrink: 0 }}>{ev.year}</span>
                                <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.88rem' }}>{ev.event}</span>
                            </div>
                            <p style={{ color: '#64748b', fontSize: '0.775rem', marginTop: '0.2rem', lineHeight: 1.6 }}>{ev.detail}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── FUN FACTS ── */}
            <div className="card" style={{ padding: '1.25rem', marginTop: '1.5rem' }}>
                <h3 className="section-title" style={{ color: '#f87171', fontSize: '1rem' }}>💡 Le savais-tu ?</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                    {[
                        { icon: '🌋', fact: 'Olympus Mons est 3× plus haut que l\'Everest et si large qu\'on ne verrait pas l\'autre côté depuis le sommet.' },
                        { icon: '🏞️', fact: 'Valles Marineris s\'étend sur 1/5 de la circonférence de Mars — 4× la longueur des États-Unis.' },
                        { icon: '🌫️', fact: 'L\'atmosphère de Mars est si fine que la pression au sol équivaut à 35 km d\'altitude sur Terre.' },
                        { icon: '🌡️', fact: 'Les températures varient de -125°C aux pôles en hiver à +20°C à l\'équateur en été.' },
                        { icon: '🌊', fact: 'Des preuves d\'un ancien océan couvrant 19% de la surface de Mars ont été découvertes par orbiteurs.' },
                        { icon: '🔴', fact: 'La couleur rouge vient d\'oxyde de fer (rouille) dans la poussière — Mars est littéralement rouillée.' },
                    ].map(f => (
                        <div key={f.icon} style={{ display: 'flex', gap: '0.625rem', padding: '0.875rem', borderRadius: '0.625rem', background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.08)' }}>
                            <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{f.icon}</span>
                            <p style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.65 }}>{f.fact}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
