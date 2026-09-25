'use client'

import { useState, Suspense } from 'react'
import SpaceIcon from '@/components/ui/SpaceIcon'
import dynamic from 'next/dynamic'
import KidsGuide from '@/components/learning/KidsGuide'
import DataSourceNote from '@/components/learning/DataSourceNote'
import PlanetExplorer from '@/components/space/PlanetExplorer'
import { SCIENTIFIC_SOURCES } from '@/lib/data/source-registry'
import { useSiteLocale } from '@/components/layout/LanguageToggle'

import { PlanetScene as Planet3D } from '@/components/space/LightScenes'
const SolarSystem2D = dynamic(() => import('@/components/space/SolarSystem2D'), { ssr: false })

const PLANETS = [
    { name: 'Mercure', nameEn: 'Mercury', typeEn: 'Rocky', descriptionEn: 'The smallest planet and the closest to the Sun. No atmosphere, extreme temperatures.', funEn: 'A day on Mercury lasts 176 Earth days!', emoji: '☿', texture: '/textures/mercury.jpg', color: '#94a3b8', type: 'Rocheuse', gravity: 3.7, meanRadius: 2439.7, avgTemp: 440, density: 5.43, distSun: 57.9, moons: 0, orbit: 88, atmosphere: false, description: 'La plus petite et la plus proche du Soleil. Pas d\'atmosphère, températures extrêmes.', fun: 'Un jour sur Mercure dure 176 jours terrestres !' },
    { name: 'Vénus', nameEn: 'Venus', typeEn: 'Rocky', descriptionEn: 'The hottest! Its carbon dioxide atmosphere traps heat. The Sun rises in the west there.', funEn: 'Venus spins the opposite way to most other planets!', emoji: '♀', texture: '/textures/venus.jpg', color: '#f59e0b', type: 'Rocheuse', gravity: 8.87, meanRadius: 6051.8, avgTemp: 737, density: 5.24, distSun: 108.2, moons: 0, orbit: 225, atmosphere: '#f59e0b', description: 'La plus chaude ! Son atmosphère de CO2 piège la chaleur. Le Soleil s\'y lève à l\'Ouest.', fun: 'Vénus tourne à l\'envers par rapport aux autres planètes !' },
    { name: 'Terre', nameEn: 'Earth', typeEn: 'Rocky', descriptionEn: 'Our home! The only planet where we know life exists. 71% of its surface is water.', funEn: 'Earth is the only planet not named after a Roman or Greek god.', emoji: '🌍', texture: '/textures/earth.jpg', color: '#60a5fa', type: 'Rocheuse', gravity: 9.81, meanRadius: 6371.0, avgTemp: 288, density: 5.51, distSun: 149.6, moons: 1, orbit: 365, atmosphere: '#60a5fa', description: 'Notre maison ! Seule planète connue à abriter la vie. 71% de sa surface est de l\'eau.', fun: 'La Terre est la seule planète qui ne porte pas le nom d\'un dieu romain ou grec.' },
    { name: 'Mars', nameEn: 'Mars', typeEn: 'Rocky', descriptionEn: 'The red planet. Rovers explore it. Olympus Mons is the biggest volcano in the Solar System (21 km high).', funEn: 'Mars has the biggest canyon in the Solar System: Valles Marineris, 4,000 km long!', emoji: '♂', texture: '/textures/mars.jpg', color: '#f87171', type: 'Rocheuse', gravity: 3.72, meanRadius: 3389.5, avgTemp: 210, density: 3.93, distSun: 227.9, moons: 2, orbit: 687, atmosphere: '#ef444430', description: 'La planète rouge. Des rovers l\'explorent. Olympus Mons est le plus grand volcan du système solaire (21 km).', fun: 'Mars a le plus grand canyon du système solaire : Valles Marineris, 4 000 km de long !' },
    { name: 'Jupiter', nameEn: 'Jupiter', typeEn: 'Gas giant', descriptionEn: 'The biggest planet! Its Great Red Spot is a huge storm that has been watched for a very long time.', funEn: 'Jupiter’s gravity can push some small objects away, but can also change their path towards the inner Solar System.', emoji: '♃', texture: '/textures/jupiter.jpg', color: '#f97316', type: 'Géante gazeuse', gravity: 24.79, meanRadius: 69911, avgTemp: 165, density: 1.33, distSun: 778.5, moons: 101, orbit: 4333, atmosphere: '#f97316', description: 'La plus grande planète ! Sa Grande Tache Rouge est une immense tempête observée depuis très longtemps.', fun: 'La gravité de Jupiter peut éloigner certains petits objets, mais aussi modifier leur route vers l’intérieur du Système solaire.' },
    { name: 'Saturne', nameEn: 'Saturn', typeEn: 'Gas giant', descriptionEn: 'Famous for its rings made of billions of pieces of ice and rock. It is the planet with the most known moons.', funEn: 'The rings stretch over about 282,000 km, but are often only about ten metres thick!', emoji: '♄', texture: '/textures/saturn.jpg', color: '#eab308', type: 'Géante gazeuse', gravity: 10.44, meanRadius: 58232, avgTemp: 134, density: 0.69, distSun: 1434, moons: 274, orbit: 10759, atmosphere: '#eab308', hasRings: true, description: 'Célèbre pour ses anneaux faits de milliards de morceaux de glace et de roche. C’est la planète qui possède le plus de lunes connues.', fun: 'Les anneaux s’étendent sur environ 282 000 km, mais ne mesurent souvent qu’une dizaine de mètres d’épaisseur !' },
    { name: 'Uranus', nameEn: 'Uranus', typeEn: 'Ice giant', descriptionEn: 'The planet that “rolls” on its side. Discovered in 1781. It may rain diamonds there.', funEn: 'Uranus is tilted by 98°: it spins on its side like a rolling ball!', emoji: '♅', texture: '/textures/uranus.jpg', color: '#67e8f9', type: 'Géante de glace', gravity: 8.69, meanRadius: 25362, avgTemp: 76, density: 1.27, distSun: 2871, moons: 28, orbit: 30687, atmosphere: '#67e8f9', description: 'La planète qui \'roule\' sur le côté. Découverte en 1781. Il y pleut peut-être des diamants.', fun: 'Uranus a une inclinaison de 98° — elle tourne sur le côté comme une toupie !' },
    { name: 'Neptune', nameEn: 'Neptune', typeEn: 'Ice giant', descriptionEn: 'The farthest and windiest planet. Winds reach 2,100 km/h! Discovered in 1846 thanks to maths.', funEn: 'Neptune was found with maths before anyone saw it!', emoji: '♆', texture: '/textures/neptune.jpg', color: '#818cf8', type: 'Géante de glace', gravity: 11.15, meanRadius: 24622, avgTemp: 72, density: 1.64, distSun: 4495, moons: 16, orbit: 60190, atmosphere: '#a5b4fc', description: 'La plus lointaine et la plus venteuse. Vents à 2 100 km/h ! Découverte en 1846 grâce aux maths.', fun: 'Neptune a été découverte mathématiquement avant même d\'être observée !' },
]

const maxRadius = Math.max(...PLANETS.map(p => p.meanRadius))

type Planet = (typeof PLANETS)[number]

const COPY = {
    fr: {
        badge: 'SYSTÈME SOLAIRE', title: 'Planètes & Lunes', subtitle: 'Observe, fais tourner et compare les huit mondes qui voyagent autour du Soleil.',
        moreKicker: 'POUR ALLER PLUS LOIN', moreTitle: 'Les chiffres détaillés des planètes', moreText: 'Tu veux comparer davantage ? Choisis une planète ci-dessous pour voir ses données et son modèle en détail.',
        moons: (n: number) => `${n} lune${n > 1 ? 's' : ''}`, noTexture: 'Texture non disponible', drag: 'Faire glisser pour tourner', didYouKnow: 'Le savais-tu ?',
        gravity: 'Gravité', radius: 'Rayon', temp: 'Temp.', density: 'Densité', distance: 'Distance', orbit: 'Orbite', days: 'j', temperature: 'Température', moonsLabel: 'Lunes',
        systemTitle: 'Le système solaire',
        systemText: ['Notre système solaire compte ', '8 planètes', '. Les 4 premières sont des ', 'planètes rocheuses', ' (Mercure, Vénus, Terre, Mars). Les 4 suivantes sont des ', 'géantes gazeuses ou de glace', ' (Jupiter, Saturne, Uranus, Neptune). Les modèles 3D utilisent des ', 'cartes réalisées d’après les images de la NASA', '.'],
        sizesTitle: 'Comparaison des tailles', relativeTitle: 'Taille des planètes comparée à la Terre', relativeText: 'Chaque cercle est proportionnel au vrai rayon : Jupiter pourrait contenir 1 300 Terres !',
        earthTimes: (x: string) => `×${x} Terre`, relativeHint: 'Clique sur une planète pour l’explorer · ×1,0 = Terre (rayon 6 371 km)',
        comparator: 'Comparateur', planetN: (n: number) => `Planète ${n}`, bigger: 'plus grande', weigh: (planet: string) => ['Si tu pèses 30 kg → ', ` sur ${planet}`],
        tableTitle: 'Tableau des planètes', tableHead: ['Planète', 'Type', 'Rayon (km)', 'Gravité', 'Temp (K)', 'Densité', 'Dist.', 'Lunes', 'Orbite'], loading: 'Chargement des positions…',
    },
    en: {
        badge: 'SOLAR SYSTEM', title: 'Planets & Moons', subtitle: 'Look at, spin and compare the eight worlds that travel around the Sun.',
        moreKicker: 'GOING FURTHER', moreTitle: 'Detailed planet figures', moreText: 'Want to compare more? Choose a planet below to see its data and its model in detail.',
        moons: (n: number) => `${n} moon${n === 1 ? '' : 's'}`, noTexture: 'Texture not available', drag: 'Drag to spin', didYouKnow: 'Did you know?',
        gravity: 'Gravity', radius: 'Radius', temp: 'Temp.', density: 'Density', distance: 'Distance', orbit: 'Orbit', days: 'd', temperature: 'Temperature', moonsLabel: 'Moons',
        systemTitle: 'The Solar System',
        systemText: ['Our Solar System has ', '8 planets', '. The first 4 are ', 'rocky planets', ' (Mercury, Venus, Earth, Mars). The next 4 are ', 'gas or ice giants', ' (Jupiter, Saturn, Uranus, Neptune). The 3D models use ', 'maps made from NASA images', '.'],
        sizesTitle: 'Size comparison', relativeTitle: 'Planet sizes compared with Earth', relativeText: 'Each circle matches the real radius: Jupiter could hold 1,300 Earths!',
        earthTimes: (x: string) => `×${x} Earth`, relativeHint: 'Click a planet to explore it · ×1.0 = Earth (radius 6,371 km)',
        comparator: 'Comparator', planetN: (n: number) => `Planet ${n}`, bigger: 'bigger', weigh: (planet: string) => ['If you weigh 30 kg → ', ` on ${planet}`],
        tableTitle: 'Planet table', tableHead: ['Planet', 'Type', 'Radius (km)', 'Gravity', 'Temp (K)', 'Density', 'Dist.', 'Moons', 'Orbit'], loading: 'Loading positions…',
    },
}

export default function PlanetesPage() {
    const [selected, setSelected] = useState(2)
    const [comp1, setComp1] = useState(2)
    const [comp2, setComp2] = useState(4)
    const p = PLANETS[selected]
    const pa = PLANETS[comp1]
    const pb = PLANETS[comp2]
    const locale = useSiteLocale()
    const t = COPY[locale]
    const numbers = locale === 'en' ? 'en-GB' : 'fr-FR'
    const name = (pl: Planet) => (locale === 'en' ? pl.nameEn : pl.name)
    const type = (pl: Planet) => (locale === 'en' ? pl.typeEn : pl.type)

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
            <div className="page-header motion-enter">
                <div className="badge"><SpaceIcon name="planet" size={18} className="inline-icon" /> {t.badge}</div>
                <h1 className="page-title">{t.title}</h1>
                <p className="page-subtitle">{t.subtitle}</p>
            </div>

            <KidsGuide topic="planetes" />
            <DataSourceNote
                source={SCIENTIFIC_SOURCES.planetaryFacts.label}
                href={SCIENTIFIC_SOURCES.planetaryFacts.href}
                refreshed={locale === 'en' ? SCIENTIFIC_SOURCES.planetaryFacts.childNoteEn : SCIENTIFIC_SOURCES.planetaryFacts.childNote}
                checkedOn={SCIENTIFIC_SOURCES.planetaryFacts.checkedOn}
                cadence={SCIENTIFIC_SOURCES.planetaryFacts.cadence}
            />

            <PlanetExplorer />

            <section className="planet-details-heading" aria-labelledby="planet-details-title">
                <span>{t.moreKicker}</span>
                <h2 id="planet-details-title">{t.moreTitle}</h2>
                <p>{t.moreText}</p>
            </section>

            {/* Detailed planet data */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.625rem', marginBottom: '2rem' }} className="max-sm:grid-cols-2">
                {PLANETS.map((pl, i) => (
                    <button key={pl.name} onClick={() => setSelected(i)} style={{
                        padding: '0.75rem', borderRadius: '0.875rem', cursor: 'pointer', textAlign: 'center',
                        background: selected === i ? `${pl.color}15` : 'rgba(255,255,255,0.03)',
                        border: `2px solid ${selected === i ? pl.color : 'rgba(255,255,255,0.06)'}`,
                        color: selected === i ? pl.color : 'var(--text-muted)', fontWeight: 700,
                        fontFamily: 'var(--font-display)', transition: 'all 0.2s',
                        boxShadow: selected === i ? `0 0 20px ${pl.color}30` : 'none',
                    }}>
                        <div style={{ fontSize: '1.4rem', marginBottom: '0.2rem' }}>{pl.emoji}</div>
                        <div style={{ fontSize: '0.8rem' }}>{name(pl)}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 1 }}>{t.moons(pl.moons)}</div>
                    </button>
                ))}
            </div>

            {/* 3D viewer + info panel */}
            <div key={selected} className="card motion-enter" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }} className="max-sm:grid-cols-1">
                    {/* 3D Globe */}
                    <div style={{ height: 280, borderRadius: '1rem', overflow: 'hidden', background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.95) 100%)', position: 'relative' }}>
                        {p.texture ? (
                            <Suspense fallback={
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>{p.emoji}</div>
                            }>
                                <Planet3D
                                    textureUrl={p.texture}
                                    size={p.hasRings ? 1.6 : 2}
                                    rotationSpeed={0.003}
                                    hasRings={p.hasRings}
                                    atmosphereColor={typeof p.atmosphere === 'string' ? p.atmosphere : undefined}
                                />
                            </Suspense>
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ fontSize: '6rem', filter: `drop-shadow(0 0 30px ${p.color})` }}>{p.emoji}</div>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{t.noTexture}</span>
                            </div>
                        )}
                        <div style={{ position: 'absolute', bottom: '0.625rem', left: '50%', transform: 'translateX(-50%)', color: 'var(--text-muted)', fontSize: '0.65rem', whiteSpace: 'nowrap' }}>{t.drag}</div>
                    </div>

                    {/* Info */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
                            <h2 style={{ color: p.color, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.6rem', lineHeight: 1 }}>{name(p)}</h2>
                            <span style={{ fontSize: '0.72rem', padding: '2px 10px', borderRadius: 999, background: `${p.color}15`, color: p.color, border: `1px solid ${p.color}30` }}>{type(p)}</span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: '0.875rem', fontSize: '0.85rem' }}>{locale === 'en' ? p.descriptionEn : p.description}</p>
                        <div style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.18)', marginBottom: '1rem' }}>
                            <p style={{ color: '#f59e0b', fontSize: '0.78rem', lineHeight: 1.6 }}><SpaceIcon name="bulb" size={18} className="inline-icon" /> <strong>{t.didYouKnow}</strong> {locale === 'en' ? p.funEn : p.fun}</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                            {[
                                { label: t.gravity, val: `${p.gravity.toLocaleString(numbers)} m/s²` },
                                { label: t.radius, val: `${p.meanRadius.toLocaleString(numbers)} km` },
                                { label: t.temp, val: `${p.avgTemp} K` },
                                { label: t.density, val: `${p.density.toLocaleString(numbers)} g/cm³` },
                                { label: t.distance, val: `${p.distSun.toLocaleString(numbers)} M km` },
                                { label: t.orbit, val: `${p.orbit.toLocaleString(numbers)} ${t.days}` },
                            ].map(s => (
                                <div key={s.label} style={{ padding: '0.5rem 0.75rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.67rem', marginBottom: '0.1rem' }}>{s.label}</div>
                                    <div style={{ color: 'var(--text)', fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '0.8rem' }}>{s.val}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Intro text */}
            <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ color: 'var(--nebula)' }}>{t.systemTitle}</h2>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.875rem' }}>
                    {t.systemText[0]}<strong style={{ color: 'var(--text)' }}>{t.systemText[1]}</strong>{t.systemText[2]}
                    <strong style={{ color: '#f97316' }}>{t.systemText[3]}</strong>{t.systemText[4]}
                    <strong style={{ color: 'var(--nebula)' }}>{t.systemText[5]}</strong>{t.systemText[6]}
                    <strong style={{ color: 'var(--text)' }}>{t.systemText[7]}</strong>{t.systemText[8]}
                </p>
            </div>

            {/* Size comparison bars */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ color: 'var(--text)' }}>{t.sizesTitle}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {PLANETS.map(pl => (
                        <div key={pl.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setSelected(PLANETS.indexOf(pl))}>
                            <div style={{ width: 72, color: selected === PLANETS.indexOf(pl) ? pl.color : 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'right', flexShrink: 0, fontWeight: 600 }}>{pl.emoji} {name(pl)}</div>
                            <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 6, overflow: 'hidden', height: 18 }}>
                                <div className="bar-grow" style={{ width: `${(pl.meanRadius / maxRadius) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${pl.color}70, ${pl.color})`, borderRadius: 6 }} />
                            </div>
                            <div style={{ width: 84, color: 'var(--text-muted)', fontSize: '0.68rem', flexShrink: 0 }}>{pl.meanRadius.toLocaleString(numbers)} km</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── TAILLE RELATIVE ── */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ color: 'var(--text)', marginBottom: '0.25rem' }}>{t.relativeTitle}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '1.25rem' }}>{t.relativeText}</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', padding: '1rem 0' }}>
                    {PLANETS.map((pl, i) => {
                        const maxPx = 76
                        const minPx = 6
                        const px = minPx + (pl.meanRadius / 69911) * (maxPx - minPx)
                        const xTimes = (pl.meanRadius / PLANETS[2].meanRadius).toLocaleString(numbers, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
                        const isEarth = pl.name === 'Terre'
                        return (
                            <div key={pl.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem', cursor: 'pointer' }}
                                onClick={() => setSelected(i)}>
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{
                                        width: px * 2, height: px * 2, borderRadius: '50%',
                                        background: `radial-gradient(circle at 35% 35%, ${pl.color}cc, ${pl.color}33)`,
                                        border: `2px solid ${selected === i ? pl.color : pl.color + '44'}`,
                                        boxShadow: selected === i ? `0 0 22px ${pl.color}55` : isEarth ? `0 0 10px ${pl.color}35` : 'none',
                                        transition: 'all 0.2s',
                                    }} />
                                    {isEarth && <div style={{ position: 'absolute', top: -5, right: -5, background: '#1d4ed8', borderRadius: 99, padding: '1px 4px', fontSize: '0.48rem', color: '#fff', fontWeight: 700 }}><SpaceIcon name="globe" size={18} className="inline-icon" /> REF</div>}
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.65rem', color: pl.color, fontWeight: 700 }}>{name(pl)}</div>
                                    <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>{t.earthTimes(xTimes)}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.62rem', marginTop: '0.25rem' }}>{t.relativeHint}</p>
            </div>

            {/* Comparator */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ color: 'var(--text)' }}>{t.comparator}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }} className="max-sm:grid-cols-1">
                    {[{ v: comp1, set: setComp1 }, { v: comp2, set: setComp2 }].map((c, ci) => (
                        <div key={ci}>
                            <label htmlFor={`planet-compare-${ci}`} style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.3rem', display: 'block' }}>{t.planetN(ci + 1)}</label>
                            <select id={`planet-compare-${ci}`} value={c.v} onChange={e => c.set(parseInt(e.target.value))} style={{
                                width: '100%', padding: '0.5rem 0.75rem', borderRadius: 9, fontSize: '0.85rem',
                                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                color: 'var(--text)', outline: 'none',
                            }}>
                                {PLANETS.map((pl, i) => <option key={i} value={i} style={{ background: 'var(--card)' }}>{pl.emoji} {name(pl)}</option>)}
                            </select>
                        </div>
                    ))}
                </div>
                {/* Visual size duel */}
                {comp1 !== comp2 && (() => {
                    const bigger = pa.meanRadius > pb.meanRadius ? pa : pb
                    const smaller = pa.meanRadius > pb.meanRadius ? pb : pa
                    const ratioValue = bigger.meanRadius / smaller.meanRadius
                    const ratio = ratioValue.toLocaleString(numbers, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
                    return (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', padding: '0.875rem', marginBottom: '1rem', borderRadius: '0.75rem', background: 'rgba(0,0,0,0.2)' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ width: 70, height: 70, borderRadius: '50%', background: `radial-gradient(circle at 35% 35%, ${bigger.color}cc, ${bigger.color}22)`, border: `2px solid ${bigger.color}55`, margin: '0 auto 0.25rem' }} />
                                <div style={{ color: bigger.color, fontSize: '0.7rem', fontWeight: 700 }}>{name(bigger)}</div>
                            </div>
                            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                <div style={{ fontSize: '1.3rem', color: 'var(--text-muted)', fontWeight: 900 }}>×{ratio}</div>
                                <div style={{ fontSize: '0.58rem' }}>{t.bigger}</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ width: Math.max(10, 70 / ratioValue), height: Math.max(10, 70 / ratioValue), borderRadius: '50%', background: `radial-gradient(circle at 35% 35%, ${smaller.color}cc, ${smaller.color}22)`, border: `2px solid ${smaller.color}55`, margin: '0 auto 0.25rem' }} />
                                <div style={{ color: smaller.color, fontSize: '0.7rem', fontWeight: 700 }}>{name(smaller)}</div>
                            </div>
                        </div>
                    )
                })()}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="max-sm:grid-cols-1">
                    {[pa, pb].map((pl, ci) => (
                        <div key={ci} style={{ padding: '1.25rem', borderRadius: '0.875rem', background: `${pl.color}08`, border: `2px solid ${pl.color}25`, textAlign: 'center' }}>
                            {pl.texture ? (
                                <div style={{ height: 120, borderRadius: '0.5rem', overflow: 'hidden', marginBottom: '0.75rem', background: 'rgba(0,0,0,0.5)' }}>
                                    <Suspense fallback={<div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>{pl.emoji}</div>}>
                                        <Planet3D textureUrl={pl.texture} size={1.4} hasRings={pl.hasRings} atmosphereColor={typeof pl.atmosphere === 'string' ? pl.atmosphere : undefined} />
                                    </Suspense>
                                </div>
                            ) : (
                                <div style={{ fontSize: '3rem', marginBottom: '0.75rem', filter: `drop-shadow(0 0 15px ${pl.color})` }}>{pl.emoji}</div>
                            )}
                            <h3 style={{ color: pl.color, fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: '0.625rem' }}>{name(pl)}</h3>
                            {[
                                { l: t.radius, v: `${pl.meanRadius.toLocaleString(numbers)} km` },
                                { l: t.gravity, v: `${pl.gravity.toLocaleString(numbers)} m/s²` },
                                { l: t.temperature, v: `${pl.avgTemp} K (${(pl.avgTemp - 273).toFixed(0)} °C)` },
                                { l: t.density, v: `${pl.density.toLocaleString(numbers)} g/cm³` },
                                { l: t.moonsLabel, v: `${pl.moons}` },
                            ].map(s => (
                                <div key={s.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.8rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>{s.l}</span>
                                    <span style={{ color: 'var(--text)', fontWeight: 600 }}>{s.v}</span>
                                </div>
                            ))}
                            {comp1 !== comp2 && (
                                <div style={{ marginTop: '0.75rem', padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {t.weigh(name(pl))[0]}<strong style={{ color: pl.color }}>{(30 * pl.gravity / 9.81).toLocaleString(numbers, { maximumFractionDigits: 1 })} kg</strong>{t.weigh(name(pl))[1]}
                                </div>
                            )}
                            <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', background: `${pl.color}08`, border: `1px solid ${pl.color}15`, fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: 1.5, textAlign: 'left' }}>
                                <SpaceIcon name="bulb" size={18} className="inline-icon" /> {locale === 'en' ? pl.funEn : pl.fun}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Full table */}
            <h2 className="section-title" style={{ color: 'var(--text)' }}>{t.tableTitle}</h2>
            <div style={{ overflow: 'auto', borderRadius: '0.875rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', minWidth: 700 }}>
                    <thead>
                        <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                            {t.tableHead.map(h => (
                                <th key={h} style={{ padding: '0.675rem 0.875rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {PLANETS.map((pl, i) => (
                            <tr key={pl.name} tabIndex={0} onClick={() => setSelected(i)} onKeyDown={event => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault()
                                    setSelected(i)
                                }
                            }} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', background: selected === i ? `${pl.color}08` : 'transparent', transition: 'background 0.2s' }}>
                                <td style={{ padding: '0.625rem 0.875rem', whiteSpace: 'nowrap' }}><span style={{ color: pl.color, fontWeight: 700 }}>{pl.emoji} {name(pl)}</span></td>
                                <td style={{ padding: '0.625rem 0.875rem', color: 'var(--text-muted)' }}>{type(pl)}</td>
                                <td style={{ padding: '0.625rem 0.875rem', color: 'var(--text)' }}>{pl.meanRadius.toLocaleString(numbers)}</td>
                                <td style={{ padding: '0.625rem 0.875rem', color: 'var(--text)' }}>{pl.gravity}</td>
                                <td style={{ padding: '0.625rem 0.875rem', color: 'var(--text)' }}>{pl.avgTemp}</td>
                                <td style={{ padding: '0.625rem 0.875rem', color: 'var(--text)' }}>{pl.density}</td>
                                <td style={{ padding: '0.625rem 0.875rem', color: 'var(--text)' }}>{pl.distSun} M km</td>
                                <td style={{ padding: '0.625rem 0.875rem', color: 'var(--text)' }}>{pl.moons}</td>
                                <td style={{ padding: '0.625rem 0.875rem', color: 'var(--text)' }}>{pl.orbit.toLocaleString(numbers)} {t.days}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── SOLAR SYSTEM TODAY ── */}
            <div className="divider" />
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <Suspense fallback={<div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>{t.loading}</div>}>
                    <SolarSystem2D />
                </Suspense>
            </div>
        </div>
    )
}
