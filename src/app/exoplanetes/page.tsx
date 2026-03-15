'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const FAMOUS_EXOPLANETS = [
    { name: 'Proxima Centauri b', distance: '4.2 années-lumière', type: 'Rocheuse', habitable: true, color: '#10b981', description: "L'exoplanète la plus proche de nous ! Elle orbite notre voisine Proxima du Centaure, dans la zone habitable.", fun: 'Même à la vitesse de la lumière, il faudrait 4 ans pour y aller. Avec nos fusées actuelles : 73 000 ans !' },
    { name: 'TRAPPIST-1e', distance: '39 années-lumière', type: 'Rocheuse', habitable: true, color: '#3b82f6', description: "L'une des 7 planètes du système TRAPPIST-1, découverte par un télescope belge. Taille et température proches de la Terre.", fun: "Les 7 planètes TRAPPIST sont si proches que depuis l'une, on verrait les autres comme des Lunes géantes !" },
    { name: 'Kepler-452b', distance: '1 400 années-lumière', type: 'Super-Terre', habitable: true, color: '#6366f1', description: "Surnommée la « cousine de la Terre ». Son année dure 385 jours et son étoile ressemble au Soleil.", fun: "Si la vie a émergé sur Kepler-452b, elle aurait eu 1.5 milliard d'années de plus que nous pour évoluer !" },
    { name: '51 Pegasi b', distance: '50 années-lumière', type: 'Jupiter chaud', habitable: false, color: '#f59e0b', description: "La toute première exoplanète découverte autour d'une étoile (1995) ! Prix Nobel de Physique 2019 pour Mayor et Queloz.", fun: "Elle fait le tour de son étoile en seulement 4 jours ! Sa température dépasse 1 000°C." },
    { name: 'HD 189733b', distance: '63 années-lumière', type: 'Jupiter chaud', habitable: false, color: '#67e8f9', description: "Cette planète bleue ressemble à la Terre de loin, mais il y pleut... du verre fondu ! Vents à 8 700 km/h.", fun: "Sa couleur bleue ne vient pas de l'eau, mais de particules de silicate (verre) dans son atmosphère !" },
    { name: 'WASP-12b', distance: '1 400 années-lumière', type: 'Jupiter chaud', habitable: false, color: '#ef4444', description: "Cette planète est en train d'être dévorée par son étoile ! Elle a la forme d'un oeuf à cause des marées gravitationnelles.", fun: "WASP-12b est l'une des planètes les plus noires connues : elle absorbe 94% de la lumière !" },
]

const DETECTION_METHODS = [
    { name: 'Transit', emoji: '🌑', percent: '77%', color: '#6366f1', description: "Quand la planète passe devant son étoile, la luminosité baisse légèrement. Comme si une mouche passait devant un phare !" },
    { name: 'Vitesse radiale', emoji: '🔄', percent: '19%', color: '#f59e0b', description: "La planète fait « trembler » son étoile en tournant autour. On mesure ce tremblement avec un spectromètre ultra-précis." },
    { name: 'Imagerie directe', emoji: '📸', percent: '2%', color: '#10b981', description: "On photographie directement la planète ! Très difficile car l'étoile est des milliards de fois plus brillante." },
    { name: 'Microlentille', emoji: '🔍', percent: '2%', color: '#ef4444', description: "La gravité de l'étoile et sa planète courbent la lumière d'une étoile lointaine, comme une loupe cosmique." },
]

const VIDEOS = [
    { title: 'Paxi — Le Système Solaire (ESA en français)', url: 'https://www.youtube.com/watch?v=shQJd3oGYn8', description: 'L\'animation de l\'Agence Spatiale Européenne pour comprendre notre voisinage galactique.', age: '5-10 ans' },
    { title: 'Les étoiles — National Geographic France', url: 'https://www.youtube.com/watch?v=CDy6kEEClK0', description: 'Comment naissent et meurent les étoiles, les soleils qui abritent peut-être d\'autres mondes.', age: '8-14 ans' },
    { title: 'James Webb — Premières images de l\'Univers (NASA)', url: 'https://www.youtube.com/watch?v=nmMRMIE_asw', description: 'Les historiques premières images du James Webb : galaxies, nébuleuses et atmosphères d\'exoplanètes.', age: '10-14 ans' },
    { title: 'DART : La NASA dévie un astéroïde (NASA)', url: 'https://www.youtube.com/watch?v=4RA8Tfa6Sck', description: 'Défense planétaire : comment protéger notre planète des impacts d\'astéroïdes.', age: '8-14 ans' },
]

export default function ExoplanetesPage() {
    const [habitableOnly, setHabitableOnly] = useState(false)
    const filtered = habitableOnly ? FAMOUS_EXOPLANETS.filter(p => p.habitable) : FAMOUS_EXOPLANETS

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="page-header">
                <div className="badge">🌟 EXPLORATION GALACTIQUE</div>
                <h1 className="page-title" style={{ background: 'linear-gradient(135deg, #fde68a, #f59e0b, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Exoplanètes
                </h1>
                <p className="page-subtitle">Catalogue des planètes découvertes au-delà de notre système solaire</p>
            </motion.div>

            {/* Explainer */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ color: '#fbbf24' }}>🌍 C&apos;est quoi une exoplanète ?</h2>
                <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '0.875rem', marginBottom: '0.875rem' }}>
                    Une exoplanète, c&apos;est une planète qui tourne autour d&apos;une <strong style={{ color: '#e2e8f0' }}>autre étoile</strong> que le Soleil !
                    On en a découvert des milliers depuis 1995, grâce à des télescopes comme <strong style={{ color: '#e2e8f0' }}>Kepler</strong> et <strong style={{ color: '#e2e8f0' }}>James Webb</strong>.
                </p>
                <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '0.875rem', marginBottom: '0.875rem' }}>
                    Les scientifiques cherchent surtout des exoplanètes dans la <strong style={{ color: '#10b981' }}>&quot;zone habitable&quot;</strong> —
                    la distance parfaite de leur étoile pour que l&apos;eau puisse exister à l&apos;état liquide, ingrédient essentiel pour la vie.
                </p>
                <div style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <p style={{ color: '#f59e0b', fontSize: '0.82rem' }}>
                        🏆 La première exoplanète a été découverte en 1995 par deux scientifiques suisses, <strong>Michel Mayor et Didier Queloz</strong>. Ils ont reçu le Prix Nobel en 2019 !
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                {[
                    { label: 'Exoplanètes connues', val: '5 800+', color: '#6366f1' },
                    { label: 'Type Terre', val: '~400', color: '#10b981' },
                    { label: 'Zone habitable', val: '~60', color: '#3b82f6' },
                    { label: 'Systèmes multi-planètes', val: '900+', color: '#f59e0b' },
                ].map(s => (
                    <div key={s.label} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.6rem', fontFamily: 'Outfit, sans-serif', fontWeight: 900, background: s.color, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.val}</div>
                        <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: 4 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Classification guide */}
            <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ color: '#a78bfa' }}>📊 Classification des exoplanètes</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                    {[
                        { label: 'Taille Terre', range: '0.8 - 1.5 R⊕', color: '#10b981', desc: 'Taille similaire à la Terre, possiblement rocheuse' },
                        { label: 'Super-Terre', range: '1.5 - 2.5 R⊕', color: '#f59e0b', desc: 'Plus grande que la Terre, plus petite que Neptune' },
                        { label: 'Mini-Neptune', range: '2.5 - 10 R⊕', color: '#3b82f6', desc: 'Planète gazeuse de taille moyenne' },
                        { label: 'Géante gazeuse', range: '> 10 R⊕', color: '#ef4444', desc: 'Très grosse, comme Jupiter ou Saturne' },
                    ].map(c => (
                        <div key={c.label} style={{ padding: '0.875rem', borderRadius: '0.75rem', background: `${c.color}08`, border: `1px solid ${c.color}25` }}>
                            <div style={{ color: c.color, fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{c.label} <span style={{ color: '#64748b', fontWeight: 400 }}>({c.range})</span></div>
                            <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{c.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detection methods */}
            <h2 className="section-title" style={{ color: '#e2e8f0', marginBottom: '1rem' }}>🔭 Comment trouve-t-on des exoplanètes ?</h2>
            <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '1rem' }}>Les télescopes ne voient presque jamais les exoplanètes directement. Voici les astuces des scientifiques :</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                {DETECTION_METHODS.map(m => (
                    <div key={m.name} className="card" style={{ padding: '1.25rem', textAlign: 'center', borderLeft: `4px solid ${m.color}` }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{m.emoji}</div>
                        <h3 style={{ color: m.color, fontFamily: 'Outfit, sans-serif', fontWeight: 800, marginBottom: '0.25rem' }}>{m.name}</h3>
                        <div style={{ fontSize: '1.8rem', fontWeight: 900, color: m.color, fontFamily: 'Outfit', marginBottom: '0.5rem' }}>{m.percent}</div>
                        <p style={{ color: '#94a3b8', fontSize: '0.78rem', lineHeight: 1.6 }}>{m.description}</p>
                    </div>
                ))}
            </div>

            {/* Habitable filter toggle */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <button onClick={() => setHabitableOnly(!habitableOnly)} style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.6rem 1.25rem', borderRadius: 99, cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem',
                    background: habitableOnly ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
                    border: `2px solid ${habitableOnly ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                    color: habitableOnly ? '#10b981' : '#94a3b8',
                    transition: 'all 0.2s',
                }}>
                    <span>{habitableOnly ? '🌿' : '🌍'}</span>
                    {habitableOnly ? 'Zone habitable uniquement' : 'Toutes les exoplanètes'}
                    <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: 99, background: habitableOnly ? '#10b98120' : 'rgba(255,255,255,0.06)', color: habitableOnly ? '#10b981' : '#475569' }}>
                        {habitableOnly ? FAMOUS_EXOPLANETS.filter(p => p.habitable).length : FAMOUS_EXOPLANETS.length}
                    </span>
                </button>
            </div>

            {/* Famous exoplanets */}
            <h2 className="section-title" style={{ color: '#e2e8f0', marginBottom: '1rem' }}>⭐ Exoplanètes célèbres</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {filtered.map(exo => (
                    <div key={exo.name} className="card" style={{ padding: '1.25rem', borderLeft: `4px solid ${exo.color}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <h3 style={{ color: exo.color, fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '0.95rem' }}>{exo.name}</h3>
                            <span style={{ fontSize: '0.7rem', color: '#64748b', whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>{exo.distance}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.625rem' }}>
                            <span style={{ fontSize: '0.72rem', color: '#8b5cf6', background: 'rgba(139,92,246,0.1)', padding: '2px 8px', borderRadius: 999 }}>{exo.type}</span>
                            {exo.habitable && <span style={{ fontSize: '0.72rem', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: 999 }}>🌿 Zone habitable</span>}
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.7, marginBottom: '0.625rem' }}>{exo.description}</p>
                        <p style={{ color: '#f59e0b', fontSize: '0.78rem', lineHeight: 1.6 }}>💡 {exo.fun}</p>
                    </div>
                ))}
            </div>

            {/* Videos */}
            <h2 className="section-title" style={{ color: '#e2e8f0', marginBottom: '1rem' }}>🎬 Vidéos éducatives</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {VIDEOS.map(v => (
                    <div key={v.title} className="card" style={{ padding: '1.25rem' }}>
                        <h3 style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.5rem' }}>{v.title}</h3>
                        <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '0.75rem', lineHeight: 1.6 }}>{v.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.72rem', color: '#8b5cf6', background: 'rgba(139,92,246,0.1)', padding: '2px 8px', borderRadius: 999 }}>{v.age}</span>
                            <a href={v.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textDecoration: 'none', padding: '0.4rem 0.875rem', fontSize: '0.78rem' }}>▶ YouTube</a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Links */}
            <div className="card" style={{ padding: '1.5rem' }}>
                <h2 className="section-title" style={{ color: '#e2e8f0' }}>🔗 En savoir plus</h2>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                    {[
                        { label: 'NASA Exoplanet Exploration', url: 'https://exoplanets.nasa.gov/', desc: 'Le portail officiel avec visualisations interactives' },
                        { label: 'Eyes on Exoplanets 3D', url: 'https://eyes.nasa.gov/apps/exo/', desc: 'Voyage virtuel vers les exoplanètes' },
                        { label: 'NASA Exoplanet Archive', url: 'https://exoplanetarchive.ipac.caltech.edu/', desc: 'Base de données complète de toutes les exoplanètes' },
                        { label: 'ESO Exoplanètes', url: 'https://www.eso.org/public/france/themes/exoplanets/', desc: "Le site de l'Observatoire Européen" },
                    ].map(l => (
                        <li key={l.label}>
                            <a href={l.url} target="_blank" rel="noopener noreferrer" style={{ color: '#a78bfa' }}>{l.label}</a>
                            <span style={{ color: '#475569' }}> — {l.desc}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
