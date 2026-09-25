'use client'

import { useEffect, useState } from 'react'
import SpaceIcon from '@/components/ui/SpaceIcon'

import KidsGuide from '@/components/learning/KidsGuide'
import MetricGrid from '@/components/space/MetricGrid'
import { useSiteLocale } from '@/components/layout/LanguageToggle'

type Text = { fr: string; en: string }

const FAMOUS_ASTEROIDS: Array<{ name: Text; size: Text; danger: boolean; color: string; description: Text; fun: Text }> = [
    { name: { fr: 'Bennu', en: 'Bennu' }, size: { fr: '490 m', en: '490 m' }, danger: true, color: '#f87171',
      description: { fr: 'L’astéroïde le plus étudié. La sonde OSIRIS-REx en a rapporté des échantillons sur Terre en 2023 ! Il a environ 1 chance sur 2 700 de heurter la Terre en 2182.', en: 'The most studied asteroid. The OSIRIS-REx probe brought samples of it back to Earth in 2023! It has about a 1 in 2,700 chance of hitting Earth in 2182.' },
      fun: { fr: 'Bennu fait un tour sur lui-même en 4 h 17 min et projette parfois des cailloux dans l’espace !', en: 'Bennu spins once every 4 h 17 min and sometimes throws small pebbles into space!' } },
    { name: { fr: 'Apophis', en: 'Apophis' }, size: { fr: '370 m', en: '370 m' }, danger: true, color: '#f59e0b',
      description: { fr: 'En 2004, les premiers calculs donnaient 2,7 % de risque de collision en 2029. Ce risque est écarté : il passera à environ 32 000 km de la Terre le 13 avril 2029.', en: 'In 2004, the first calculations gave a 2.7% chance of a collision in 2029. That risk has been ruled out: it will pass about 32,000 km from Earth on 13 April 2029.' },
      fun: { fr: 'Il passera plus près que certains satellites. On pourra peut-être le voir à l’œil nu !', en: 'It will pass closer than some satellites. We may even see it with the naked eye!' } },
    { name: { fr: 'Ryugu', en: 'Ryugu' }, size: { fr: '900 m', en: '900 m' }, danger: false, color: '#a5b4fc',
      description: { fr: 'La sonde japonaise Hayabusa2 s’y est posée et a rapporté des échantillons en 2020. On y a trouvé des acides aminés, des briques de base de la vie !', en: 'The Japanese probe Hayabusa2 touched down on it and brought samples back in 2020. Amino acids, building blocks of life, were found in them!' },
      fun: { fr: 'Ryugu a la forme d’une toupie et il est si poreux qu’il est fait à moitié de vide.', en: 'Ryugu is shaped like a spinning top and is so porous that it is about half empty space.' } },
    { name: { fr: 'Dimorphos', en: 'Dimorphos' }, size: { fr: '160 m', en: '160 m' }, danger: false, color: '#10b981',
      description: { fr: 'Le premier astéroïde dont l’humanité a modifié l’orbite ! La mission DART de la NASA l’a percuté en 2022 pour tester la défense planétaire.', en: 'The first asteroid whose orbit humans have changed! NASA’s DART mission hit it in 2022 to test planetary defence.' },
      fun: { fr: 'L’impact a créé une traînée de débris de plus de 10 000 km et raccourci son orbite d’environ 33 minutes.', en: 'The impact made a trail of debris more than 10,000 km long and shortened its orbit by about 33 minutes.' } },
    { name: { fr: 'Cérès', en: 'Ceres' }, size: { fr: '940 km', en: '940 km' }, danger: false, color: '#60a5fa',
      description: { fr: 'Le plus gros objet de la ceinture d’astéroïdes, classé comme « planète naine ». La sonde Dawn l’a étudié de 2015 à 2018.', en: 'The biggest object in the asteroid belt, classed as a “dwarf planet”. The Dawn probe studied it from 2015 to 2018.' },
      fun: { fr: 'Cérès pourrait contenir plus d’eau douce que toute la Terre, cachée sous forme de glace sous sa croûte.', en: 'Ceres may hold more fresh water than the whole Earth, hidden as ice under its crust.' } },
    { name: { fr: 'Vesta', en: 'Vesta' }, size: { fr: '525 km', en: '525 km' }, danger: false, color: '#a78bfa',
      description: { fr: 'Le deuxième plus gros astéroïde. Vesta porte un énorme cratère d’impact (Rheasilvia) presque aussi large qu’elle !', en: 'The second biggest asteroid. Vesta has a huge impact crater (Rheasilvia) almost as wide as the asteroid itself!' },
      fun: { fr: 'Des morceaux de Vesta sont tombés sur Terre sous forme de météorites. On en a retrouvé en Antarctique !', en: 'Pieces of Vesta have fallen to Earth as meteorites. Some were found in Antarctica!' } },
]

const VIDEOS: Array<{ title: Text; url: string; description: Text; age: Text }> = [
    { title: { fr: 'DART : la NASA dévie un astéroïde', en: 'DART: NASA moves an asteroid' }, url: 'https://www.youtube.com/watch?v=4RA8Tfa6Sck', description: { fr: 'La mission DART qui a percuté l’astéroïde Dimorphos en 2022.', en: 'The DART mission that hit the asteroid Dimorphos in 2022.' }, age: { fr: '8-14 ans', en: 'Ages 8-14' } },
    { title: { fr: 'Journée des astéroïdes — ESA', en: 'Asteroid Day — ESA' }, url: 'https://www.youtube.com/watch?v=SJLzZC2dVpg', description: { fr: 'Une vidéo de l’Agence spatiale européenne pour comprendre les astéroïdes et la façon dont les scientifiques les surveillent.', en: 'A European Space Agency video about asteroids and how scientists keep watch on them.' }, age: { fr: '8-14 ans', en: 'Ages 8-14' } },
    { title: { fr: 'L’astéroïde qui a fait disparaître les dinosaures', en: 'The asteroid that wiped out the dinosaurs' }, url: 'https://www.youtube.com/watch?v=dFCbJmgeHmA', description: { fr: 'Il y a 66 millions d’années, un astéroïde d’environ 10 km a changé l’histoire de la Terre.', en: '66 million years ago, an asteroid about 10 km wide changed Earth’s history.' }, age: { fr: '8-14 ans', en: 'Ages 8-14' } },
    { title: { fr: 'OSIRIS-REx : le retour de Bennu — NASA Goddard', en: 'OSIRIS-REx: the return from Bennu — NASA Goddard' }, url: 'https://www.youtube.com/watch?v=O8R2hsoIgTc', description: { fr: 'La fin du voyage de la sonde qui a rapporté des échantillons de l’astéroïde Bennu sur Terre.', en: 'The end of the journey of the probe that brought samples of the asteroid Bennu back to Earth.' }, age: { fr: '10-14 ans', en: 'Ages 10-14' } },
]

const SIZE_COMPARISONS: Array<{ label: Text; size: number; color: string }> = [
    { label: { fr: 'Personne (1,7 m)', en: 'Person (1.7 m)' }, size: 1.7, color: '#10b981' },
    { label: { fr: 'Bus (12 m)', en: 'Bus (12 m)' }, size: 12, color: '#60a5fa' },
    { label: { fr: 'Terrain de foot (100 m)', en: 'Football pitch (100 m)' }, size: 100, color: '#a5b4fc' },
    { label: { fr: 'Dimorphos (160 m)', en: 'Dimorphos (160 m)' }, size: 160, color: '#a78bfa' },
    { label: { fr: 'Tour Eiffel (330 m)', en: 'Eiffel Tower (330 m)' }, size: 330, color: '#f59e0b' },
    { label: { fr: 'Apophis (370 m)', en: 'Apophis (370 m)' }, size: 370, color: '#f59e0b' },
    { label: { fr: 'Bennu (490 m)', en: 'Bennu (490 m)' }, size: 490, color: '#f87171' },
    { label: { fr: 'Astéroïde des dinosaures (10 km)', en: 'Dinosaur asteroid (10 km)' }, size: 10000, color: '#dc2626' },
]

const LINKS: Array<{ label: string; url: string; desc: Text }> = [
    { label: 'CNEOS Close Approach Data', url: 'https://cneos.jpl.nasa.gov/ca/', desc: { fr: 'Prochains passages d’astéroïdes près de la Terre (NASA JPL)', en: 'Upcoming asteroid flybys near Earth (NASA JPL)' } },
    { label: 'Asteroid Watch 3D', url: 'https://eyes.nasa.gov/apps/asteroids/', desc: { fr: 'Visualisation 3D des astéroïdes en temps réel', en: 'Real-time 3D view of asteroids' } },
    { label: 'Small-Body Database', url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html', desc: { fr: 'Base de données de tous les astéroïdes connus', en: 'Database of every known asteroid' } },
    { label: 'Mission DART', url: 'https://dart.jhuapl.edu/', desc: { fr: 'Le programme de défense planétaire', en: 'The planetary defence programme' } },
]

const COPY = {
    fr: {
        badge: 'DÉFENSE PLANÉTAIRE', title: 'Astéroïdes', subtitle: 'Découvre les roches spatiales que la NASA surveille près de notre planète.',
        whatTitle: 'C’est quoi un astéroïde ?',
        what1: ['Un astéroïde, c’est un ', 'gros rocher qui voyage dans l’espace', ' ! La plupart se trouvent entre Mars et Jupiter, dans la « ceinture d’astéroïdes », mais certains passent parfois près de la Terre. La NASA les surveille ', 'jour et nuit', ' avec des télescopes spéciaux.'],
        what2: ['Les scientifiques classent certains astéroïdes comme ', '« potentiellement dangereux »', ' quand ils peuvent passer à moins de 7,5 millions de km de la Terre ET mesurent plus de 140 mètres. Pour comparer : la tour Eiffel mesure 330 mètres, et un terrain de foot 100 mètres.'],
        defence: ['Défense planétaire :', ' depuis la mission ', 'DART', ' en 2022, l’humanité sait dévier un astéroïde en le percutant avec une sonde. C’était la première fois qu’on modifiait l’orbite d’un objet céleste !'],
        kpis: 'Chiffres clés des passages d’astéroïdes', near: 'Proches cette semaine', dangerous: 'Potentiellement dangereux', window: 'Fenêtre analysée', days: '7 jours', source: 'Source scientifique', unavailable: 'Indisponible',
        tableTitle: 'Passages proches cette semaine (NASA NeoWs)', checkedAt: (time: string) => `Vérifié à ${time}`, loading: 'Chargement des données NASA…', down: 'Le service NASA NeoWs est temporairement indisponible.',
        tableLabel: 'Tableau défilable des passages proches d’astéroïdes', head: ['Nom', 'Date du passage', 'Distance (km)', 'Diamètre min. (m)', 'Dangereux'], yes: 'Oui', no: 'Non',
        scaleTitle: 'Comparaison des tailles (échelle logarithmique)', scaleText: 'Chaque barre grandit moins vite que la vraie taille, pour que les petits objets restent visibles.',
        famous: 'Astéroïdes célèbres', dangerTag: 'Potentiellement dangereux', videos: 'Vidéos éducatives', more: 'En savoir plus', numbers: 'fr-FR',
    },
    en: {
        badge: 'PLANETARY DEFENCE', title: 'Asteroids', subtitle: 'Discover the space rocks NASA keeps an eye on near our planet.',
        whatTitle: 'What is an asteroid?',
        what1: ['An asteroid is a ', 'big rock travelling through space', '! Most are found between Mars and Jupiter, in the “asteroid belt”, but some sometimes pass near Earth. NASA watches them ', 'day and night', ' with special telescopes.'],
        what2: ['Scientists call some asteroids ', '“potentially hazardous”', ' when they can pass within 7.5 million km of Earth AND are more than 140 metres across. To compare: the Eiffel Tower is 330 metres tall, and a football pitch is 100 metres long.'],
        defence: ['Planetary defence:', ' since the ', 'DART', ' mission in 2022, humans know how to push an asteroid off course by hitting it with a spacecraft. It was the first time anyone changed the orbit of an object in space!'],
        kpis: 'Key figures on asteroid flybys', near: 'Close this week', dangerous: 'Potentially hazardous', window: 'Time window', days: '7 days', source: 'Science source', unavailable: 'Unavailable',
        tableTitle: 'Close flybys this week (NASA NeoWs)', checkedAt: (time: string) => `Checked at ${time}`, loading: 'Loading NASA data…', down: 'The NASA NeoWs service is temporarily unavailable.',
        tableLabel: 'Scrollable table of close asteroid flybys', head: ['Name', 'Flyby date', 'Distance (km)', 'Min. diameter (m)', 'Hazardous'], yes: 'Yes', no: 'No',
        scaleTitle: 'Size comparison (logarithmic scale)', scaleText: 'Each bar grows more slowly than the real size, so that small objects stay visible.',
        famous: 'Famous asteroids', dangerTag: 'Potentially hazardous', videos: 'Educational videos', more: 'Learn more', numbers: 'en-GB',
    },
}

interface Asteroid { id: string; name: string; date: string; distKm: string; diamMin: number; dangerous: boolean }

export default function AsteroidsPage() {
    const locale = useSiteLocale()
    const t = COPY[locale]
    const [asteroids, setAsteroids] = useState<Asteroid[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [updatedAt, setUpdatedAt] = useState<string | null>(null)
    const maxSize = Math.max(...SIZE_COMPARISONS.map(s => s.size))

    useEffect(() => {
        const controller = new AbortController()
        fetch('/api/asteroids', { signal: controller.signal })
            .then(r => {
                if (!r.ok) throw new Error('NASA NeoWs unavailable')
                return r.json()
            })
            .then(data => {
                const list = Array.isArray(data.asteroids) ? data.asteroids : []
                setAsteroids(list)
                setUpdatedAt(data.updatedAt || null)
                setLoading(false)
            }).catch(fetchError => {
                if (fetchError instanceof DOMException && fetchError.name === 'AbortError') return
                setError(true)
                setLoading(false)
            })
        return () => controller.abort()
    }, [])

    const total = asteroids.length
    const dangerous = asteroids.filter(a => a.dangerous).length

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
            <div className="page-header motion-enter">
                <div className="badge"><SpaceIcon name="asteroid" size={18} className="inline-icon" /> {t.badge}</div>
                <h1 className="page-title">{t.title}</h1>
                <p className="page-subtitle">{t.subtitle}</p>
            </div>

            <KidsGuide topic="asteroides" />

            {/* Explainer */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ color: '#fbbf24' }}>{t.whatTitle}</h2>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.875rem', marginBottom: '0.875rem' }}>
                    {t.what1[0]}<strong style={{ color: 'var(--text)' }}>{t.what1[1]}</strong>{t.what1[2]}<strong style={{ color: 'var(--text)' }}>{t.what1[3]}</strong>{t.what1[4]}
                </p>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.875rem', marginBottom: '0.875rem' }}>
                    {t.what2[0]}<strong style={{ color: '#f87171' }}>{t.what2[1]}</strong>{t.what2[2]}
                </p>
                <div style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <p style={{ color: '#f59e0b', fontSize: '0.82rem' }}>
                        <SpaceIcon name="shield" size={18} className="inline-icon" /> <strong>{t.defence[0]}</strong>{t.defence[1]}<strong>{t.defence[2]}</strong>{t.defence[3]}
                    </p>
                </div>
            </div>

            {/* Live KPIs */}
            <MetricGrid
                ariaLabel={t.kpis}
                className="metric-grid-block"
                items={[
                    { label: t.near, value: loading ? '…' : error ? t.unavailable : total, color: '#818cf8' },
                    { label: t.dangerous, value: loading ? '…' : error ? t.unavailable : dangerous, color: '#f87171' },
                    { label: t.window, value: t.days, color: '#fbbf24' },
                    { label: t.source, value: 'NeoWs', color: '#34d399' },
                ]}
            />

            {/* Live close approaches table */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <h2 className="section-title" style={{ color: 'var(--text)' }}>{t.tableTitle}</h2>
                    {updatedAt && <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>{t.checkedAt(new Date(updatedAt).toLocaleTimeString(t.numbers, { hour: '2-digit', minute: '2-digit' }))}</span>}
                </div>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}><SpaceIcon name="clock" size={18} className="inline-icon" /> {t.loading}</div>
                ) : error ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#f59e0b' }}><SpaceIcon name="signal" size={18} className="inline-icon" /> {t.down}</div>
                ) : (
                    <div
                        style={{ overflow: 'auto' }}
                        tabIndex={0}
                        role="region"
                        aria-label={t.tableLabel}
                    >
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', minWidth: 600 }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                    {t.head.map(h => (
                                        <th key={h} style={{ padding: '0.625rem 0.875rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {asteroids.map(a => (
                                    <tr key={a.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.15s' }}>
                                        <td style={{ padding: '0.625rem 0.875rem', color: 'var(--text)', fontWeight: 600, whiteSpace: 'nowrap' }}>{a.name.replace(/[()]/g, '')}</td>
                                        <td style={{ padding: '0.625rem 0.875rem', color: 'var(--text-muted)' }}>{a.date}</td>
                                        <td style={{ padding: '0.625rem 0.875rem', color: 'var(--text)' }}>{parseInt(a.distKm).toLocaleString(t.numbers)}</td>
                                        <td style={{ padding: '0.625rem 0.875rem', color: 'var(--text)' }}>{a.diamMin}</td>
                                        <td style={{ padding: '0.625rem 0.875rem' }}>
                                            {a.dangerous ? <span style={{ color: '#f87171', fontWeight: 700 }}><SpaceIcon name="alert" size={18} className="inline-icon" /> {t.yes}</span> : <span style={{ color: '#10b981' }}><SpaceIcon name="check" size={18} className="inline-icon" /> {t.no}</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Size comparisons */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ color: 'var(--text)' }}>{t.scaleTitle}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>{t.scaleText}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {SIZE_COMPARISONS.map(s => (
                        <div key={s.label.fr} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: 200, color: 'var(--text-muted)', fontSize: '0.78rem', flexShrink: 0 }}>{s.label[locale]}</div>
                            <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 6, overflow: 'hidden', height: 14 }}>
                                <div className="bar-grow" style={{ width: `${Math.log10(s.size + 1) / Math.log10(maxSize + 1) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${s.color}80, ${s.color})`, borderRadius: 6 }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Famous asteroids */}
            <h2 className="section-title" style={{ color: 'var(--text)', marginBottom: '1rem' }}>{t.famous}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {FAMOUS_ASTEROIDS.map(a => (
                    <div key={a.name.fr} className="card" style={{ padding: '1.25rem', borderLeft: `4px solid ${a.color}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <h3 style={{ color: a.color, fontFamily: 'var(--font-display)', fontWeight: 800 }}>{a.name[locale]}</h3>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{a.size[locale]}</span>
                        </div>
                        {a.danger && <div style={{ color: '#f87171', fontSize: '0.75rem', marginBottom: '0.5rem' }}><SpaceIcon name="alert" size={18} className="inline-icon" /> {t.dangerTag}</div>}
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>{a.description[locale]}</p>
                        <p style={{ color: '#f59e0b', fontSize: '0.8rem', lineHeight: 1.6 }}><SpaceIcon name="bulb" size={18} className="inline-icon" /> {a.fun[locale]}</p>
                    </div>
                ))}
            </div>

            {/* Videos */}
            <h2 className="section-title" style={{ color: 'var(--text)', marginBottom: '1rem' }}>{t.videos}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {VIDEOS.map(v => (
                    <div key={v.url} className="card" style={{ padding: '1.25rem' }}>
                        <h3 style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>{v.title[locale]}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>{v.description[locale]}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--nebula)', background: 'rgba(196,181,253,0.12)', padding: '2px 8px', borderRadius: 999 }}>{v.age[locale]}</span>
                            <a href={v.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textDecoration: 'none', padding: '0.4rem 0.875rem', fontSize: '0.78rem' }}>
                                ▶ YouTube
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Links */}
            <div className="card" style={{ padding: '1.5rem' }}>
                <h2 className="section-title" style={{ color: 'var(--text)' }}>{t.more}</h2>
                <ul className="resource-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {LINKS.map(l => (
                        <li key={l.label}>
                            <a href={l.url} target="_blank" rel="noopener noreferrer" className="touch-link touch-link-compact" style={{ color: 'var(--nebula)', textDecoration: 'underline', textUnderlineOffset: 3 }}>{l.label}</a>
                            <span style={{ color: 'var(--text-muted)' }}> — {l.desc[locale]}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
