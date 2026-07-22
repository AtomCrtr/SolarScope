'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import KidsGuide from '@/components/KidsGuide'

const Sun3D = dynamic(() => import('@/components/Sun3D'), { ssr: false })
const SpaceWeatherDashboard = dynamic(() => import('@/components/SpaceWeatherDashboard'), { ssr: false })


/* ── Data ── */
const SDO_BASE = 'https://sdo.gsfc.nasa.gov/assets/img/latest'

function sdoProxy(file: string) {
    return `/api/sdo?url=${encodeURIComponent(`${SDO_BASE}/${file}`)}`
}

const SDO_IMAGES = [
    { src: sdoProxy('latest_512_0171.jpg'), label: '🔵 Ultraviolet 171Å', desc: 'Boucles de plasma chaud — 600 000°C', wavelength: '17,1 nm' },
    { src: sdoProxy('latest_512_0304.jpg'), label: '🔴 Hélium 304Å', desc: 'Chromosphère — 50 000°C', wavelength: '30,4 nm' },
    { src: sdoProxy('latest_512_HMIB.jpg'), label: '⚫ Magnétogramme HMI', desc: 'Champ magnétique en surface', wavelength: '617,3 nm' },
    { src: sdoProxy('latest_512_0094.jpg'), label: '💚 Flare 094Å', desc: 'Détecte les éruptions X — 6 millions°C', wavelength: '9,4 nm' },
]

const FACTS = [
    { emoji: '🌡️', val: '15 000 000°C', label: 'Température au cœur' },
    { emoji: '⚡', val: '386 000 TW', label: 'Énergie / seconde' },
    { emoji: '🔢', val: '1 330 000×', label: 'Volume vs la Terre' },
    { emoji: '🏃', val: '220 km/s', label: 'Vitesse galactique' },
    { emoji: '🕐', val: '4,6 Ga', label: 'Âge estimé' },
    { emoji: '🪐', val: '8 planètes', label: 'En orbite autour' },
    { emoji: '💡', val: '27 jours', label: 'Rotation équatoriale' },
    { emoji: '🌊', val: '1 400 km/s', label: 'CME la plus rapide' },
]



const LAYERS = [
    { name: 'Noyau', temp: '15 000 000°C', radius: '0–25% R☉', desc: 'Fusion nucléaire — 4H → He + énergie', color: '#ef4444' },
    { name: 'Zone radiative', temp: '7 000 000°C', radius: '25–70% R☉', desc: 'Les photons mettent 100 000 ans à traverser cette zone !', color: '#f97316' },
    { name: 'Zone convective', temp: '2 000 000°C', radius: '70–100% R☉', desc: 'Convection de plasma — transport de chaleur', color: '#f59e0b' },
    { name: 'Photosphère', temp: '5 500°C', radius: '~696 000 km', desc: 'Surface visible du Soleil — taches solaires', color: '#fbbf24' },
    { name: 'Chromosphère', temp: '20 000°C', radius: '+2 000 km', desc: 'Visible lors des éclipses totales', color: '#fde68a' },
    { name: 'Couronne', temp: '1 000 000°C', radius: '+Millions km', desc: 'Mystérieusement chaude — source du vent solaire', color: '#e2e8f0' },
]

export default function SoleilPage() {
    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>

            {/* ── HEADER ── */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="page-header">
                <div className="badge" style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24', borderColor: 'rgba(245,158,11,0.25)' }}>
                    🛸 DONNÉES SDO & NOAA — EN DIRECT
                </div>
                <h1 className="page-title gradient-text-gold">Le Soleil</h1>
                <p className="page-subtitle">Notre étoile — à 150 millions de km, source de toute vie sur Terre</p>
            </motion.div>

            <KidsGuide topic="soleil" />

            {/* ── 3D SUN + SDO ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center', marginBottom: '3rem' }}
                className="max-md:grid-cols-1">

                <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }}
                    style={{ height: 420, borderRadius: '1rem', overflow: 'hidden', background: 'radial-gradient(ellipse at center, rgba(20,5,0,0.9) 0%, rgba(0,0,0,0.97) 100%)' }}>
                    <Sun3D height={420} />
                </motion.div>

                <div>
                    <h2 className="section-title" style={{ color: '#fbbf24' }}>📡 Images SDO en direct</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        {SDO_IMAGES.map((img, i) => (
                            <motion.div key={img.src} className="card" style={{ overflow: 'hidden', padding: 0 }}
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}>
                                <div style={{ position: 'relative' }}>
                                    <Image src={img.src} alt={img.label} width={512} height={512} unoptimized style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />
                                    <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.7)', borderRadius: 4, padding: '1px 6px', fontSize: '0.65rem', color: '#fbbf24', fontWeight: 600 }}>{img.wavelength}</div>
                                </div>
                                <div style={{ padding: '0.6rem' }}>
                                    <p style={{ color: '#fcd34d', fontWeight: 700, fontSize: '0.75rem' }}>{img.label}</p>
                                    <p style={{ color: '#94a3b8', fontSize: '0.7rem', marginTop: 2 }}>{img.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '0.7rem', marginTop: '0.5rem', textAlign: 'right' }}>
                        ⟳ Source : NASA Solar Dynamics Observatory — mise à jour toutes les 15 min
                    </p>
                </div>
            </div>


            {/* ── SUN LAYERS ── */}
            <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ color: '#fbbf24' }}>🔬 Structure interne du Soleil</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }} className="max-sm:grid-cols-2">
                    {LAYERS.map((l) => (
                        <div key={l.name} style={{ padding: '1rem', borderRadius: '0.875rem', background: `${l.color}10`, border: `1px solid ${l.color}25` }}>
                            <div style={{ color: l.color, fontWeight: 700, fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{l.name}</div>
                            <div style={{ color: l.color, fontWeight: 800, fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.35rem' }}>{l.temp}</div>
                            <div style={{ color: '#64748b', fontSize: '0.7rem', marginBottom: '0.35rem' }}>{l.radius}</div>
                            <p style={{ color: '#94a3b8', fontSize: '0.75rem', lineHeight: 1.5 }}>{l.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── STATS GRID ── */}
            <h2 className="section-title" style={{ color: '#e2e8f0' }}>📊 Le Soleil en chiffres</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {FACTS.map((f, i) => (
                    <motion.div key={f.val} className="stat-card"
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                        <div style={{ fontSize: '1.8rem' }}>{f.emoji}</div>
                        <div className="stat-value gradient-text-gold">{f.val}</div>
                        <div className="stat-label">{f.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* ── CME EXPLAINER ── */}
            <div className="card" style={{ padding: '1.75rem', marginTop: '2rem' }}>
                <h2 className="section-title" style={{ color: '#f97316' }}>☄️ Éjections de Masse Coronale (CME)</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }} className="max-sm:grid-cols-1">
                    <div>
                        <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '0.875rem', marginBottom: '1rem' }}>
                            Une <strong style={{ color: '#f97316' }}>CME</strong> est une gigantesque bulle de plasma et de champ magnétique éjectée
                            par le Soleil à des vitesses allant de <strong style={{ color: '#fbbf24' }}>250 à 3 000 km/s</strong>. Lorsqu’elle
                            atteint la Terre (en 1 à 3 jours), elle peut provoquer des tempêtes géomagnétiques.
                        </p>
                        <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '0.875rem' }}>
                            L’événement le plus puissant jamais enregistré est la <strong style={{ color: '#ef4444' }}>Tempête de Carrington
                                (1859)</strong> — si elle se reproduisait aujourd’hui, elle détruirait la majorité des satellites et provoquerait
                            des pannes électriques mondiales pendant des mois.
                        </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {[
                            { emoji: '⚡', label: 'Délai Terre', val: '1–3 jours', color: '#f59e0b' },
                            { emoji: '🌡️', label: 'Temp. plasma', val: '10 000–100 000°C', color: '#ef4444' },
                            { emoji: '📡', label: 'Vitesse max', val: '3 000 km/s', color: '#f97316' },
                            { emoji: '🌐', label: 'Énergie libérée', val: '10²⁴ joules', color: '#8b5cf6' },
                        ].map((s) => (
                            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.875rem', borderRadius: '0.625rem', background: `${s.color}0d`, border: `1px solid ${s.color}20` }}>
                                <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{s.emoji} {s.label}</span>
                                <span style={{ color: s.color, fontWeight: 700, fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif' }}>{s.val}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            {/* ─── Météo Spatiale Dashboard — données NOAA en direct ─── */}
            <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <SpaceWeatherDashboard />
            </div>
        </div>
    )
}
