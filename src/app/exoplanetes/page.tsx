'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import KidsGuide from '@/components/KidsGuide'

const FAMOUS_EXOPLANETS = [
    { name: 'Proxima Centauri b', distance: '4,2 années-lumière', type: 'Probablement rocheuse', inHabitableZone: true, color: '#10b981', description: "L’exoplanète connue la plus proche tourne autour de Proxima du Centaure. Elle se trouve dans sa zone habitable, sans que l’on sache si elle possède de l’eau.", fun: 'Sa lumière met plus de quatre ans à nous parvenir. Un vaisseau actuel mettrait des milliers d’années à faire le voyage.' },
    { name: 'TRAPPIST-1e', distance: '40 années-lumière', type: 'Rocheuse', inHabitableZone: true, color: '#3b82f6', description: "C’est l’une des sept planètes rocheuses du système TRAPPIST-1. Sa taille est proche de celle de la Terre.", fun: "Ces sept planètes tournent très près de leur petite étoile, mais certaines reçoivent une quantité d’énergie comparable à la Terre." },
    { name: 'Kepler-452b', distance: '1 400 années-lumière', type: 'Super-Terre', inHabitableZone: true, color: '#6366f1', description: "Son année dure 385 jours et son étoile ressemble au Soleil. Elle est toutefois plus grande que la Terre et sa surface reste inconnue.", fun: "Être dans la zone habitable ne suffit pas : il faut aussi connaître l’atmosphère et la présence éventuelle d’eau." },
    { name: '51 Pegasi b', distance: '50 années-lumière', type: 'Jupiter chaud', inHabitableZone: false, color: '#f59e0b', description: "Découverte en 1995, c’est la première exoplanète confirmée autour d’une étoile semblable au Soleil.", fun: "Elle fait le tour de son étoile en seulement quatre jours et se trouve beaucoup trop près d’elle pour abriter la vie telle que nous la connaissons." },
    { name: 'HD 189733b', distance: '64 années-lumière', type: 'Jupiter chaud', inHabitableZone: false, color: '#67e8f9', description: "Cette planète paraît bleue, mais elle est très chaude et ses vents sont extrêmement rapides.", fun: "Des modèles indiquent que des particules de silicate pourraient former une pluie de verre poussée par les vents." },
    { name: 'WASP-12b', distance: '1 400 années-lumière', type: 'Jupiter chaud', inHabitableZone: false, color: '#ef4444', description: "Cette planète passe si près de son étoile qu’elle est déformée et perd peu à peu de la matière.", fun: "Elle renvoie très peu de lumière visible : les observations montrent qu’elle en absorbe presque toute." },
]

const DETECTION_METHODS = [
    { name: 'Transit', emoji: '🌑', usage: 'La plus utilisée', color: '#6366f1', description: "Quand la planète passe devant son étoile, la luminosité baisse légèrement. Comme si une mouche passait devant un phare !" },
    { name: 'Vitesse radiale', emoji: '🔄', usage: 'Très utilisée', color: '#f59e0b', description: "La planète fait légèrement bouger son étoile en tournant autour. On mesure ce mouvement grâce à la lumière de l’étoile." },
    { name: 'Imagerie directe', emoji: '📸', usage: 'Rare', color: '#10b981', description: "On photographie la planète elle-même. C’est difficile, car l’étoile voisine est beaucoup plus brillante." },
    { name: 'Microlentille', emoji: '🔍', usage: 'Rare', color: '#ef4444', description: "La gravité de l’étoile et de sa planète déforme la lumière d’une étoile lointaine, comme une loupe." },
]

const VIDEOS = [
    { title: 'Paxi — Le Système Solaire (ESA en français)', url: 'https://www.youtube.com/watch?v=shQJd3oGYn8', description: 'L\'animation de l\'Agence Spatiale Européenne pour comprendre notre voisinage galactique.', age: '5-10 ans' },
    { title: 'Les étoiles — National Geographic France', url: 'https://www.youtube.com/watch?v=CDy6kEEClK0', description: 'Comment naissent et meurent les étoiles, les soleils qui abritent peut-être d\'autres mondes.', age: '8-14 ans' },
    { title: 'James Webb — Premières images de l\'Univers (NASA)', url: 'https://www.youtube.com/watch?v=nmMRMIE_asw', description: 'Les historiques premières images du James Webb : galaxies, nébuleuses et atmosphères d\'exoplanètes.', age: '10-14 ans' },
    { title: 'DART : La NASA dévie un astéroïde (NASA)', url: 'https://www.youtube.com/watch?v=4RA8Tfa6Sck', description: 'Défense planétaire : comment protéger notre planète des impacts d\'astéroïdes.', age: '8-14 ans' },
]

export default function ExoplanetesPage() {
    const [habitableZoneOnly, setHabitableZoneOnly] = useState(false)
    const filtered = habitableZoneOnly ? FAMOUS_EXOPLANETS.filter(p => p.inHabitableZone) : FAMOUS_EXOPLANETS

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="page-header">
                <div className="badge">🌟 EXPLORATION GALACTIQUE</div>
                <h1 className="page-title" style={{ background: 'linear-gradient(135deg, #fde68a, #f59e0b, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Exoplanètes
                </h1>
                <p className="page-subtitle">Pars à la recherche des planètes qui tournent autour d&apos;autres étoiles.</p>
            </motion.div>

            <KidsGuide topic="exoplanetes" />

            {/* Explainer */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ color: '#fbbf24' }}>🌍 C&apos;est quoi une exoplanète ?</h2>
                <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '0.875rem', marginBottom: '0.875rem' }}>
                    Une exoplanète, c&apos;est une planète qui tourne autour d&apos;une <strong style={{ color: '#e2e8f0' }}>autre étoile</strong> que le Soleil !
                    On en a découvert des milliers depuis 1995, grâce à des télescopes comme <strong style={{ color: '#e2e8f0' }}>Kepler</strong> et <strong style={{ color: '#e2e8f0' }}>James Webb</strong>.
                </p>
                <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '0.875rem', marginBottom: '0.875rem' }}>
                    La <strong style={{ color: '#10b981' }}>&quot;zone habitable&quot;</strong> est la région autour d’une étoile où la température pourrait permettre de l’eau liquide.
                    Cela ne prouve pas qu’une planète est habitable : son atmosphère et sa surface comptent aussi.
                </p>
                <div style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <p style={{ color: '#f59e0b', fontSize: '0.82rem' }}>
                        🏆 En 1995, <strong>Michel Mayor et Didier Queloz</strong> ont découvert la première exoplanète autour d’une étoile semblable au Soleil. Les premières exoplanètes connues avaient été trouvées autour d’un pulsar en 1992.
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                {[
                    { label: 'Exoplanètes confirmées', val: '6 000+', color: '#6366f1' },
                    { label: 'Candidats à vérifier', val: 'Des milliers', color: '#10b981' },
                    { label: 'Dans la zone habitable', val: 'Des dizaines', color: '#3b82f6' },
                    { label: 'Vie découverte', val: 'Aucune preuve', color: '#f59e0b' },
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
                        { label: 'Planète terrestre', marker: 'petite et rocheuse', color: '#10b981', desc: 'Un monde à surface solide, comme la Terre ou Mars' },
                        { label: 'Super-Terre', marker: 'plus grande que la Terre', color: '#f59e0b', desc: 'Son nom parle de sa taille, pas de sa ressemblance avec notre planète' },
                        { label: 'Neptune', marker: 'atmosphère épaisse', color: '#3b82f6', desc: 'Un monde souvent composé de gaz et de glaces' },
                        { label: 'Géante gazeuse', marker: 'très grande', color: '#ef4444', desc: 'Un monde surtout composé de gaz, comme Jupiter ou Saturne' },
                    ].map(c => (
                        <div key={c.label} style={{ padding: '0.875rem', borderRadius: '0.75rem', background: `${c.color}08`, border: `1px solid ${c.color}25` }}>
                            <div style={{ color: c.color, fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{c.label} <span style={{ color: '#64748b', fontWeight: 400 }}>— {c.marker}</span></div>
                            <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{c.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detection methods */}
            <h2 className="section-title" style={{ color: '#e2e8f0', marginBottom: '1rem' }}>🔭 Comment trouve-t-on des exoplanètes ?</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: '1rem' }}>Les télescopes ne voient presque jamais les exoplanètes directement. Voici les astuces des scientifiques :</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                {DETECTION_METHODS.map(m => (
                    <div key={m.name} className="card" style={{ padding: '1.25rem', textAlign: 'center', borderLeft: `4px solid ${m.color}` }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{m.emoji}</div>
                        <h3 style={{ color: m.color, fontFamily: 'Outfit, sans-serif', fontWeight: 800, marginBottom: '0.25rem' }}>{m.name}</h3>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: m.color, fontFamily: 'Outfit', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.usage}</div>
                        <p style={{ color: '#94a3b8', fontSize: '0.78rem', lineHeight: 1.6 }}>{m.description}</p>
                    </div>
                ))}
            </div>

            {/* Habitable filter toggle */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <button onClick={() => setHabitableZoneOnly(!habitableZoneOnly)} style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.6rem 1.25rem', borderRadius: 99, cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem',
                    background: habitableZoneOnly ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
                    border: `2px solid ${habitableZoneOnly ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                    color: habitableZoneOnly ? '#10b981' : '#94a3b8',
                    transition: 'all 0.2s',
                }}>
                    <span>{habitableZoneOnly ? '🌿' : '🌍'}</span>
                    {habitableZoneOnly ? 'Zone habitable uniquement' : 'Toutes les exoplanètes'}
                    <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: 99, background: habitableZoneOnly ? '#10b98120' : 'rgba(255,255,255,0.06)', color: habitableZoneOnly ? '#10b981' : '#475569' }}>
                        {habitableZoneOnly ? FAMOUS_EXOPLANETS.filter(p => p.inHabitableZone).length : FAMOUS_EXOPLANETS.length}
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
                            {exo.inHabitableZone && <span style={{ fontSize: '0.72rem', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: 999 }}>🌿 Dans la zone habitable</span>}
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
                            <a href={l.url} target="_blank" rel="noopener noreferrer" style={{ color: '#c4b5fd', textDecoration: 'underline', textUnderlineOffset: 3 }}>{l.label}</a>
                            <span style={{ color: '#475569' }}> — {l.desc}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
