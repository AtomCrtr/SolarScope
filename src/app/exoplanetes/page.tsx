'use client'

import { useState } from 'react'
import SpaceIcon, { type SpaceIconName } from '@/components/ui/SpaceIcon'
import KidsGuide from '@/components/learning/KidsGuide'
import ExoplanetCatalog from '@/components/space/ExoplanetCatalog'
import { useSiteLocale } from '@/components/layout/LanguageToggle'
import type { SiteLocale } from '@/lib/i18n/paths'

type Text = Record<SiteLocale, string>

const FAMOUS_EXOPLANETS: Array<{ name: string; distance: Text; type: Text; inHabitableZone: boolean; color: string; description: Text; fun: Text }> = [
    { name: 'Proxima Centauri b', distance: { fr: '4,2 années-lumière', en: '4.2 light-years' }, type: { fr: 'Probablement rocheuse', en: 'Probably rocky' }, inHabitableZone: true, color: '#10b981',
      description: { fr: 'L’exoplanète connue la plus proche tourne autour de Proxima du Centaure. Elle se trouve dans sa zone habitable, sans que l’on sache si elle possède de l’eau.', en: 'The closest known exoplanet goes around Proxima Centauri. It is in the star’s habitable zone, but we do not know whether it has water.' },
      fun: { fr: 'Sa lumière met plus de quatre ans à nous parvenir. Un vaisseau actuel mettrait des milliers d’années à faire le voyage.', en: 'Its light takes more than four years to reach us. A spacecraft today would need thousands of years to make the trip.' } },
    { name: 'TRAPPIST-1e', distance: { fr: '40 années-lumière', en: '40 light-years' }, type: { fr: 'Rocheuse', en: 'Rocky' }, inHabitableZone: true, color: '#60a5fa',
      description: { fr: 'C’est l’une des sept planètes rocheuses du système TRAPPIST-1. Sa taille est proche de celle de la Terre.', en: 'It is one of the seven rocky planets of the TRAPPIST-1 system. It is close to Earth’s size.' },
      fun: { fr: 'Ces sept planètes tournent très près de leur petite étoile, mais certaines reçoivent une quantité d’énergie comparable à la Terre.', en: 'These seven planets orbit very close to their small star, yet some receive about as much energy as Earth does.' } },
    { name: 'Kepler-452b', distance: { fr: 'environ 1 800 années-lumière', en: 'about 1,800 light-years' }, type: { fr: 'Super-Terre', en: 'Super-Earth' }, inHabitableZone: true, color: '#a5b4fc',
      description: { fr: 'Son année dure 385 jours et son étoile ressemble au Soleil. Elle est toutefois plus grande que la Terre et sa surface reste inconnue.', en: 'Its year lasts 385 days and its star looks like the Sun. But it is bigger than Earth and its surface is still unknown.' },
      fun: { fr: 'Être dans la zone habitable ne suffit pas : il faut aussi connaître l’atmosphère et la présence éventuelle d’eau.', en: 'Being in the habitable zone is not enough: we also need to know about its atmosphere and whether there is water.' } },
    { name: '51 Pegasi b', distance: { fr: '50 années-lumière', en: '50 light-years' }, type: { fr: 'Jupiter chaud', en: 'Hot Jupiter' }, inHabitableZone: false, color: '#f59e0b',
      description: { fr: 'Découverte en 1995, c’est la première exoplanète confirmée autour d’une étoile semblable au Soleil.', en: 'Discovered in 1995, it is the first confirmed exoplanet around a Sun-like star.' },
      fun: { fr: 'Elle fait le tour de son étoile en seulement quatre jours et se trouve beaucoup trop près d’elle pour abriter la vie telle que nous la connaissons.', en: 'It goes around its star in only four days and is far too close to it for life as we know it.' } },
    { name: 'HD 189733b', distance: { fr: '64 années-lumière', en: '64 light-years' }, type: { fr: 'Jupiter chaud', en: 'Hot Jupiter' }, inHabitableZone: false, color: '#67e8f9',
      description: { fr: 'Cette planète paraît bleue, mais elle est très chaude et ses vents sont extrêmement rapides.', en: 'This planet looks blue, but it is very hot and its winds are extremely fast.' },
      fun: { fr: 'Des modèles indiquent que des particules de silicate pourraient former une pluie de verre poussée par les vents.', en: 'Models suggest that silicate particles could form a rain of glass blown sideways by the winds.' } },
    { name: 'WASP-12b', distance: { fr: '1 400 années-lumière', en: '1,400 light-years' }, type: { fr: 'Jupiter chaud', en: 'Hot Jupiter' }, inHabitableZone: false, color: '#f87171',
      description: { fr: 'Cette planète passe si près de son étoile qu’elle est déformée et perd peu à peu de la matière.', en: 'This planet passes so close to its star that it is stretched out of shape and slowly loses material.' },
      fun: { fr: 'Elle renvoie très peu de lumière visible : les observations montrent qu’elle en absorbe presque toute.', en: 'It reflects very little visible light: observations show it absorbs almost all of it.' } },
]

const DETECTION_METHODS: Array<{ name: Text; icon: SpaceIconName; usage: Text; color: string; description: Text }> = [
    { name: { fr: 'Transit', en: 'Transit' }, icon: 'moon-stars', usage: { fr: 'La plus utilisée', en: 'Most used' }, color: '#a5b4fc', description: { fr: 'Quand la planète passe devant son étoile, la luminosité baisse légèrement. Comme une mouche qui passerait devant un phare !', en: 'When the planet passes in front of its star, the brightness drops a little. Like a fly passing in front of a lighthouse!' } },
    { name: { fr: 'Vitesse radiale', en: 'Radial velocity' }, icon: 'refresh', usage: { fr: 'Très utilisée', en: 'Widely used' }, color: '#f59e0b', description: { fr: 'La planète fait légèrement bouger son étoile en tournant autour. On mesure ce mouvement grâce à la lumière de l’étoile.', en: 'The planet makes its star wobble a little as it goes around. We measure this wobble in the star’s light.' } },
    { name: { fr: 'Imagerie directe', en: 'Direct imaging' }, icon: 'camera', usage: { fr: 'Rare', en: 'Rare' }, color: '#10b981', description: { fr: 'On photographie la planète elle-même. C’est difficile, car l’étoile voisine est beaucoup plus brillante.', en: 'We photograph the planet itself. It is hard, because its star is much brighter.' } },
    { name: { fr: 'Microlentille', en: 'Microlensing' }, icon: 'search', usage: { fr: 'Rare', en: 'Rare' }, color: '#f87171', description: { fr: 'La gravité de l’étoile et de sa planète déforme la lumière d’une étoile lointaine, comme une loupe.', en: 'The gravity of a star and its planet bends the light of a more distant star, like a magnifying glass.' } },
]

const CLASSES: Array<{ label: Text; marker: Text; color: string; desc: Text }> = [
    { label: { fr: 'Planète terrestre', en: 'Terrestrial planet' }, marker: { fr: 'petite et rocheuse', en: 'small and rocky' }, color: '#10b981', desc: { fr: 'Un monde à surface solide, comme la Terre ou Mars', en: 'A world with a solid surface, like Earth or Mars' } },
    { label: { fr: 'Super-Terre', en: 'Super-Earth' }, marker: { fr: 'plus grande que la Terre', en: 'bigger than Earth' }, color: '#f59e0b', desc: { fr: 'Son nom parle de sa taille, pas de sa ressemblance avec notre planète', en: 'The name is about its size, not about looking like our planet' } },
    { label: { fr: 'Neptune', en: 'Neptune-like' }, marker: { fr: 'atmosphère épaisse', en: 'thick atmosphere' }, color: '#60a5fa', desc: { fr: 'Un monde souvent composé de gaz et de glaces', en: 'A world often made of gas and ice' } },
    { label: { fr: 'Géante gazeuse', en: 'Gas giant' }, marker: { fr: 'très grande', en: 'very big' }, color: '#f87171', desc: { fr: 'Un monde surtout composé de gaz, comme Jupiter ou Saturne', en: 'A world made mostly of gas, like Jupiter or Saturn' } },
]

const VIDEOS: Array<{ title: Text; url: string; description: Text; age: Text }> = [
    { title: { fr: 'Paxi — Le Système solaire (ESA, en français)', en: 'Paxi — The Solar System (ESA, in French)' }, url: 'https://www.youtube.com/watch?v=shQJd3oGYn8', description: { fr: 'L’animation de l’Agence spatiale européenne pour comprendre notre voisinage dans l’espace.', en: 'The European Space Agency’s cartoon about our neighbourhood in space.' }, age: { fr: '5-10 ans', en: 'Ages 5-10' } },
    { title: { fr: 'Les étoiles — National Geographic France', en: 'Stars — National Geographic France (in French)' }, url: 'https://www.youtube.com/watch?v=CDy6kEEClK0', description: { fr: 'Comment naissent et meurent les étoiles, ces soleils qui abritent peut-être d’autres mondes.', en: 'How stars are born and die: suns that may be home to other worlds.' }, age: { fr: '8-14 ans', en: 'Ages 8-14' } },
    { title: { fr: 'James Webb — premières images de l’Univers (NASA)', en: 'James Webb — first images of the Universe (NASA)' }, url: 'https://www.youtube.com/watch?v=1C_zuHf6lP4', description: { fr: 'Une sélection officielle des premières images de Webb : galaxies, nébuleuses et mondes lointains.', en: 'An official selection of Webb’s first images: galaxies, nebulae and distant worlds.' }, age: { fr: '10-14 ans', en: 'Ages 10-14' } },
    { title: { fr: 'DART : la NASA dévie un astéroïde (NASA)', en: 'DART: NASA moves an asteroid (NASA)' }, url: 'https://www.youtube.com/watch?v=4RA8Tfa6Sck', description: { fr: 'Défense planétaire : comment protéger notre planète des impacts d’astéroïdes.', en: 'Planetary defence: how to protect our planet from asteroid impacts.' }, age: { fr: '8-14 ans', en: 'Ages 8-14' } },
]

const LINKS: Array<{ label: string; url: string; desc: Text }> = [
    { label: 'NASA Exoplanet Exploration', url: 'https://science.nasa.gov/exoplanets/', desc: { fr: 'Le portail officiel avec des visualisations interactives', en: 'The official portal with interactive visualisations' } },
    { label: 'Eyes on Exoplanets 3D', url: 'https://eyes.nasa.gov/apps/exo/', desc: { fr: 'Un voyage virtuel vers les exoplanètes', en: 'A virtual trip to the exoplanets' } },
    { label: 'NASA Exoplanet Archive', url: 'https://exoplanetarchive.ipac.caltech.edu/', desc: { fr: 'La base de données complète des exoplanètes', en: 'The complete exoplanet database' } },
    { label: 'ESO', url: 'https://www.eso.org/public/france/science/exoplanets/', desc: { fr: 'Le site de l’Observatoire européen austral', en: 'The European Southern Observatory’s website' } },
]

const COPY = {
    fr: {
        badge: 'EXPLORATION GALACTIQUE', title: 'Exoplanètes', subtitle: 'Pars à la recherche des planètes qui tournent autour d’autres étoiles.',
        whatTitle: 'C’est quoi une exoplanète ?',
        what1: ['Une exoplanète, c’est une planète qui tourne autour d’une ', 'autre étoile', ' que le Soleil ! On en a découvert des milliers depuis 1995, grâce à des télescopes comme ', 'Kepler', ' et ', 'James Webb', '.'],
        what2: ['La ', '« zone habitable »', ' est la région autour d’une étoile où la température pourrait permettre de l’eau liquide. Cela ne prouve pas qu’une planète est habitable : son atmosphère et sa surface comptent aussi.'],
        history: ['En 1995, ', 'Michel Mayor et Didier Queloz', ' ont découvert la première exoplanète autour d’une étoile semblable au Soleil. Les toutes premières exoplanètes connues avaient été trouvées autour d’un pulsar en 1992.'],
        stats: [
            { label: 'Exoplanètes confirmées', val: '6 000+', color: '#a5b4fc' },
            { label: 'Candidates à vérifier', val: 'Des milliers', color: '#10b981' },
            { label: 'Dans la zone habitable', val: 'Des dizaines', color: '#60a5fa' },
            { label: 'Vie découverte', val: 'Aucune preuve', color: '#f59e0b' },
        ],
        classes: 'Les familles d’exoplanètes', howTitle: 'Comment trouve-t-on des exoplanètes ?', howText: 'Les télescopes ne voient presque jamais les exoplanètes directement. Voici les astuces des scientifiques :',
        habitableOnly: 'Zone habitable uniquement', allPlanets: 'Toutes les exoplanètes', famous: 'Exoplanètes célèbres', inZone: 'Dans la zone habitable', videos: 'Vidéos éducatives', more: 'En savoir plus',
    },
    en: {
        badge: 'GALACTIC EXPLORATION', title: 'Exoplanets', subtitle: 'Go looking for planets that travel around other stars.',
        whatTitle: 'What is an exoplanet?',
        what1: ['An exoplanet is a planet that goes around a ', 'star other than the Sun', '! Thousands have been found since 1995, thanks to telescopes such as ', 'Kepler', ' and ', 'James Webb', '.'],
        what2: ['The ', '“habitable zone”', ' is the area around a star where the temperature could allow liquid water. That does not prove a planet is habitable: its atmosphere and surface matter too.'],
        history: ['In 1995, ', 'Michel Mayor and Didier Queloz', ' discovered the first exoplanet around a Sun-like star. The very first known exoplanets had been found around a pulsar in 1992.'],
        stats: [
            { label: 'Confirmed exoplanets', val: '6,000+', color: '#a5b4fc' },
            { label: 'Candidates to check', val: 'Thousands', color: '#10b981' },
            { label: 'In the habitable zone', val: 'Dozens', color: '#60a5fa' },
            { label: 'Life found', val: 'No evidence', color: '#f59e0b' },
        ],
        classes: 'Families of exoplanets', howTitle: 'How do we find exoplanets?', howText: 'Telescopes almost never see exoplanets directly. Here are the scientists’ tricks:',
        habitableOnly: 'Habitable zone only', allPlanets: 'All exoplanets', famous: 'Famous exoplanets', inZone: 'In the habitable zone', videos: 'Educational videos', more: 'Learn more',
    },
}

export default function ExoplanetesPage() {
    const locale = useSiteLocale()
    const t = COPY[locale]
    const [habitableZoneOnly, setHabitableZoneOnly] = useState(false)
    const filtered = habitableZoneOnly ? FAMOUS_EXOPLANETS.filter(p => p.inHabitableZone) : FAMOUS_EXOPLANETS
    const strong = { color: 'var(--text)' }

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
            <div className="page-header motion-enter">
                <div className="badge"><SpaceIcon name="sparkle" size={18} className="inline-icon" /> {t.badge}</div>
                <h1 className="page-title">{t.title}</h1>
                <p className="page-subtitle">{t.subtitle}</p>
            </div>

            <KidsGuide topic="exoplanetes" />

            {/* Explainer */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ color: '#fbbf24' }}>{t.whatTitle}</h2>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.875rem', marginBottom: '0.875rem' }}>
                    {t.what1[0]}<strong style={strong}>{t.what1[1]}</strong>{t.what1[2]}<strong style={strong}>{t.what1[3]}</strong>{t.what1[4]}<strong style={strong}>{t.what1[5]}</strong>{t.what1[6]}
                </p>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.875rem', marginBottom: '0.875rem' }}>
                    {t.what2[0]}<strong style={{ color: '#10b981' }}>{t.what2[1]}</strong>{t.what2[2]}
                </p>
                <div style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <p style={{ color: '#f59e0b', fontSize: '0.82rem' }}>
                        <SpaceIcon name="trophy" size={18} className="inline-icon" /> {t.history[0]}<strong>{t.history[1]}</strong>{t.history[2]}
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                {t.stats.map(s => (
                    <div key={s.label} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-display)', fontWeight: 900, background: s.color, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.val}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 4 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Classification guide */}
            <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ color: 'var(--nebula)' }}>{t.classes}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                    {CLASSES.map(c => (
                        <div key={c.label.fr} style={{ padding: '0.875rem', borderRadius: '0.75rem', background: `${c.color}08`, border: `1px solid ${c.color}25` }}>
                            <div style={{ color: c.color, fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{c.label[locale]} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>— {c.marker[locale]}</span></div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{c.desc[locale]}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detection methods */}
            <h2 className="section-title" style={{ color: 'var(--text)', marginBottom: '1rem' }}>{t.howTitle}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1rem' }}>{t.howText}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                {DETECTION_METHODS.map(m => (
                    <div key={m.name.fr} className="card" style={{ padding: '1.25rem', textAlign: 'center', borderLeft: `4px solid ${m.color}` }}>
                        <div style={{ color: m.color, marginBottom: '0.5rem' }}><SpaceIcon name={m.icon} size={32} /></div>
                        <h3 style={{ color: m.color, fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: '0.25rem' }}>{m.name[locale]}</h3>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: m.color, fontFamily: 'var(--font-display)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.usage[locale]}</div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: 1.6 }}>{m.description[locale]}</p>
                    </div>
                ))}
            </div>

            {/* Real NASA catalogue */}
            <ExoplanetCatalog />

            {/* Habitable filter toggle */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0' }}>
                <button onClick={() => setHabitableZoneOnly(!habitableZoneOnly)} aria-pressed={habitableZoneOnly} style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.6rem 1.25rem', borderRadius: 99, cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem',
                    background: habitableZoneOnly ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
                    border: `2px solid ${habitableZoneOnly ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                    color: habitableZoneOnly ? '#10b981' : 'var(--text-muted)',
                    transition: 'all 0.2s',
                }}>
                    <SpaceIcon name="globe" size={18} />
                    {habitableZoneOnly ? t.habitableOnly : t.allPlanets}
                    <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: 99, background: habitableZoneOnly ? '#10b98120' : 'rgba(255,255,255,0.06)', color: habitableZoneOnly ? '#10b981' : 'var(--text-muted)' }}>
                        {filtered.length}
                    </span>
                </button>
            </div>

            {/* Famous exoplanets */}
            <h2 className="section-title" style={{ color: 'var(--text)', marginBottom: '1rem' }}>{t.famous}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {filtered.map(exo => (
                    <div key={exo.name} className="card" style={{ padding: '1.25rem', borderLeft: `4px solid ${exo.color}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <h3 style={{ color: exo.color, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.95rem' }}>{exo.name}</h3>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>{exo.distance[locale]}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.625rem' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--nebula)', background: 'rgba(196,181,253,0.12)', padding: '2px 8px', borderRadius: 999 }}>{exo.type[locale]}</span>
                            {exo.inHabitableZone && <span style={{ fontSize: '0.72rem', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: 999 }}><SpaceIcon name="globe" size={18} className="inline-icon" /> {t.inZone}</span>}
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.7, marginBottom: '0.625rem' }}>{exo.description[locale]}</p>
                        <p style={{ color: '#f59e0b', fontSize: '0.78rem', lineHeight: 1.6 }}><SpaceIcon name="bulb" size={18} className="inline-icon" /> {exo.fun[locale]}</p>
                    </div>
                ))}
            </div>

            {/* Videos */}
            <h2 className="section-title" style={{ color: 'var(--text)', marginBottom: '1rem' }}>{t.videos}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {VIDEOS.map(v => (
                    <div key={v.url} className="card" style={{ padding: '1.25rem' }}>
                        <h3 style={{ color: 'var(--text)', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.5rem' }}>{v.title[locale]}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.75rem', lineHeight: 1.6 }}>{v.description[locale]}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--nebula)', background: 'rgba(196,181,253,0.12)', padding: '2px 8px', borderRadius: 999 }}>{v.age[locale]}</span>
                            <a href={v.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textDecoration: 'none', padding: '0.4rem 0.875rem', fontSize: '0.78rem' }}>▶ YouTube</a>
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
