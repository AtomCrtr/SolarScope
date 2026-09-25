'use client'

import dynamic from 'next/dynamic'
import SpaceIcon, { type SpaceIconName } from '@/components/ui/SpaceIcon'
import Image from 'next/image'
import KidsGuide from '@/components/learning/KidsGuide'
import MetricGrid from '@/components/space/MetricGrid'
import KpChart from '@/components/space/KpChart'
import SolarFlareHistory from '@/components/space/SolarFlareHistory'
import { useSiteLocale } from '@/components/layout/LanguageToggle'
import { SunScene as Sun3D } from '@/components/space/LightScenes'

const SpaceWeatherDashboard = dynamic(() => import('@/components/space/SpaceWeatherDashboard'), { ssr: false })

/* ── Data ── */
const SDO_BASE = 'https://sdo.gsfc.nasa.gov/assets/img/latest'

function sdoProxy(file: string) {
    return `/api/sdo?url=${encodeURIComponent(`${SDO_BASE}/${file}`)}`
}

type Text = { fr: string; en: string }

const SDO_IMAGES: Array<{ src: string; label: Text; desc: Text; wavelength: Text }> = [
    { src: sdoProxy('latest_512_0171.jpg'), label: { fr: 'Ultraviolet 171Å', en: 'Ultraviolet 171Å' }, desc: { fr: 'Boucles de plasma chaud — 600 000 °C', en: 'Loops of hot plasma — 600,000 °C' }, wavelength: { fr: '17,1 nm', en: '17.1 nm' } },
    { src: sdoProxy('latest_512_0304.jpg'), label: { fr: 'Hélium 304Å', en: 'Helium 304Å' }, desc: { fr: 'Chromosphère — 50 000 °C', en: 'Chromosphere — 50,000 °C' }, wavelength: { fr: '30,4 nm', en: '30.4 nm' } },
    { src: sdoProxy('latest_512_HMIB.jpg'), label: { fr: 'Magnétogramme HMI', en: 'HMI magnetogram' }, desc: { fr: 'Champ magnétique en surface', en: 'Magnetic field at the surface' }, wavelength: { fr: '617,3 nm', en: '617.3 nm' } },
    { src: sdoProxy('latest_512_0094.jpg'), label: { fr: 'Éruptions 094Å', en: 'Flares 094Å' }, desc: { fr: 'Détecte les éruptions X — 6 millions °C', en: 'Detects X-ray flares — 6 million °C' }, wavelength: { fr: '9,4 nm', en: '9.4 nm' } },
]

const FACTS: Array<{ icon: SpaceIconName; val: Text; label: Text }> = [
    { icon: 'thermometer', val: { fr: '15 000 000 °C', en: '15,000,000 °C' }, label: { fr: 'Température au cœur', en: 'Core temperature' } },
    { icon: 'bolt', val: { fr: '386 000 TW', en: '386,000 TW' }, label: { fr: 'Énergie par seconde', en: 'Energy per second' } },
    { icon: 'globe', val: { fr: '1 300 000 ×', en: '1,300,000 ×' }, label: { fr: 'Volume comparé à la Terre', en: 'Volume compared with Earth' } },
    { icon: 'rocket', val: { fr: '220 km/s', en: '220 km/s' }, label: { fr: 'Vitesse dans la galaxie', en: 'Speed through the galaxy' } },
    { icon: 'clock', val: { fr: '4,6 milliards d’années', en: '4.6 billion years' }, label: { fr: 'Âge estimé', en: 'Estimated age' } },
    { icon: 'planet', val: { fr: '8 planètes', en: '8 planets' }, label: { fr: 'En orbite autour', en: 'In orbit around it' } },
    { icon: 'refresh', val: { fr: '27 jours', en: '27 days' }, label: { fr: 'Rotation à l’équateur', en: 'Rotation at the equator' } },
    { icon: 'wind', val: { fr: '3 000 km/s', en: '3,000 km/s' }, label: { fr: 'CME les plus rapides', en: 'Fastest CMEs' } },
]

const LAYERS: Array<{ name: Text; temp: Text; radius: Text; desc: Text; color: string }> = [
    { name: { fr: 'Noyau', en: 'Core' }, temp: { fr: '15 000 000 °C', en: '15,000,000 °C' }, radius: { fr: '0–25 % R☉', en: '0–25% R☉' }, desc: { fr: 'Fusion nucléaire : 4 H → He + énergie', en: 'Nuclear fusion: 4 H → He + energy' }, color: '#f87171' },
    { name: { fr: 'Zone radiative', en: 'Radiative zone' }, temp: { fr: '7 000 000 °C', en: '7,000,000 °C' }, radius: { fr: '25–70 % R☉', en: '25–70% R☉' }, desc: { fr: 'L’énergie met des dizaines de milliers d’années à traverser cette zone !', en: 'Energy takes tens of thousands of years to cross this zone!' }, color: '#f97316' },
    { name: { fr: 'Zone convective', en: 'Convective zone' }, temp: { fr: '2 000 000 °C', en: '2,000,000 °C' }, radius: { fr: '70–100 % R☉', en: '70–100% R☉' }, desc: { fr: 'Le plasma monte et descend comme de l’eau qui bout', en: 'Plasma rises and sinks like boiling water' }, color: '#f59e0b' },
    { name: { fr: 'Photosphère', en: 'Photosphere' }, temp: { fr: '5 500 °C', en: '5,500 °C' }, radius: { fr: '~696 000 km', en: '~696,000 km' }, desc: { fr: 'Surface visible du Soleil, avec ses taches solaires', en: 'The visible surface of the Sun, with its sunspots' }, color: '#fbbf24' },
    { name: { fr: 'Chromosphère', en: 'Chromosphere' }, temp: { fr: '20 000 °C', en: '20,000 °C' }, radius: { fr: '+2 000 km', en: '+2,000 km' }, desc: { fr: 'Visible pendant les éclipses totales', en: 'Visible during total eclipses' }, color: '#fde68a' },
    { name: { fr: 'Couronne', en: 'Corona' }, temp: { fr: '1 000 000 °C', en: '1,000,000 °C' }, radius: { fr: '+ millions de km', en: '+ millions of km' }, desc: { fr: 'Étonnamment chaude : c’est la source du vent solaire', en: 'Surprisingly hot: it is where the solar wind comes from' }, color: '#e2e8f0' },
]

const CME_STATS: Array<{ icon: SpaceIconName; label: Text; val: Text; color: string }> = [
    { icon: 'clock', label: { fr: 'Arrivée sur Terre', en: 'Arrival at Earth' }, val: { fr: '1 à 3 jours', en: '1 to 3 days' }, color: '#f59e0b' },
    { icon: 'thermometer', label: { fr: 'Température du plasma', en: 'Plasma temperature' }, val: { fr: '10 000–100 000 °C', en: '10,000–100,000 °C' }, color: '#f87171' },
    { icon: 'signal', label: { fr: 'Vitesse maximale', en: 'Top speed' }, val: { fr: '3 000 km/s', en: '3,000 km/s' }, color: '#f97316' },
    { icon: 'bolt', label: { fr: 'Énergie libérée', en: 'Energy released' }, val: { fr: '10²⁴ joules', en: '10²⁴ joules' }, color: '#a78bfa' },
]

const COPY = {
    fr: {
        badge: 'DONNÉES SDO & NOAA — EN DIRECT',
        title: 'Le Soleil',
        subtitle: 'Notre étoile, à 150 millions de km : la source de toute vie sur Terre',
        sdoTitle: 'Images SDO en direct',
        sdoSource: 'Source : NASA Solar Dynamics Observatory, mise à jour toutes les 15 min',
        layersTitle: 'Structure interne du Soleil',
        factsTitle: 'Le Soleil en chiffres',
        factsLabel: 'Chiffres clés du Soleil',
        cmeTitle: 'Éjections de masse coronale (CME)',
        history: 'Historique de la météo spatiale',
    },
    en: {
        badge: 'SDO & NOAA DATA — LIVE',
        title: 'The Sun',
        subtitle: 'Our star, 150 million km away: the source of all life on Earth',
        sdoTitle: 'Live SDO images',
        sdoSource: 'Source: NASA Solar Dynamics Observatory, updated every 15 min',
        layersTitle: 'Inside the Sun',
        factsTitle: 'The Sun in numbers',
        factsLabel: 'Key figures about the Sun',
        cmeTitle: 'Coronal mass ejections (CMEs)',
        history: 'Space weather history',
    },
}

export default function SoleilPage() {
    const locale = useSiteLocale()
    const copy = COPY[locale]
    const en = locale === 'en'

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>

            {/* ── HEADER ── */}
            <div className="page-header motion-enter">
                <div className="badge" style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24', borderColor: 'rgba(245,158,11,0.25)' }}>
                    <SpaceIcon name="satellite" size={18} className="inline-icon" /> {copy.badge}
                </div>
                <h1 className="page-title">{copy.title}</h1>
                <p className="page-subtitle">{copy.subtitle}</p>
            </div>

            <KidsGuide topic="soleil" />

            {/* ── 3D SUN + SDO ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center', marginBottom: '3rem' }}
                className="max-md:grid-cols-1">

                <div className="motion-enter" style={{ height: 420, borderRadius: '1rem', overflow: 'hidden', background: 'radial-gradient(ellipse at center, rgba(20,5,0,0.9) 0%, rgba(0,0,0,0.97) 100%)' }}>
                    <Sun3D height={420} />
                </div>

                <div>
                    <h2 className="section-title" style={{ color: '#fbbf24' }}>{copy.sdoTitle}</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        {SDO_IMAGES.map((img, i) => (
                            <div key={img.src} className="card motion-enter" style={{ animationDelay: `${Math.min(0.1 + i * 0.1, 0.6)}s`, overflow: 'hidden', padding: 0 }}>
                                <div style={{ position: 'relative' }}>
                                    <Image src={img.src} alt={img.label[locale]} width={512} height={512} unoptimized style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />
                                    <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.7)', borderRadius: 4, padding: '1px 6px', fontSize: '0.65rem', color: '#fbbf24', fontWeight: 600 }}>{img.wavelength[locale]}</div>
                                </div>
                                <div style={{ padding: '0.6rem' }}>
                                    <p style={{ color: '#fcd34d', fontWeight: 700, fontSize: '0.75rem' }}>{img.label[locale]}</p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: 2 }}>{img.desc[locale]}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '0.5rem', textAlign: 'right' }}>
                        <SpaceIcon name="refresh" size={14} className="inline-icon" /> {copy.sdoSource}
                    </p>
                </div>
            </div>

            {/* ── SUN LAYERS ── */}
            <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ color: '#fbbf24' }}>{copy.layersTitle}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }} className="max-sm:grid-cols-2">
                    {LAYERS.map((l) => (
                        <div key={l.name.fr} style={{ padding: '1rem', borderRadius: '0.875rem', background: `${l.color}10`, border: `1px solid ${l.color}25` }}>
                            <div style={{ color: l.color, fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{l.name[locale]}</div>
                            <div style={{ color: l.color, fontWeight: 800, fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.35rem' }}>{l.temp[locale]}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '0.35rem' }}>{l.radius[locale]}</div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: 1.5 }}>{l.desc[locale]}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── STATS GRID ── */}
            <h2 className="section-title" style={{ color: 'var(--text)' }}>{copy.factsTitle}</h2>
            <MetricGrid
                ariaLabel={copy.factsLabel}
                items={FACTS.map(f => ({ icon: f.icon, value: f.val[locale], label: f.label[locale], color: '#fbbf24' }))}
            />

            {/* ── CME EXPLAINER ── */}
            <div className="card" style={{ padding: '1.75rem', marginTop: '2rem' }}>
                <h2 className="section-title" style={{ color: '#f97316' }}>{copy.cmeTitle}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }} className="max-sm:grid-cols-1">
                    <div>
                        {en ? (
                            <>
                                <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.875rem', marginBottom: '1rem' }}>
                                    A <strong style={{ color: '#f97316' }}>CME</strong> is a giant bubble of plasma and magnetic field thrown out by the Sun at
                                    speeds of <strong style={{ color: '#fbbf24' }}>250 to 3,000 km/s</strong>. When it reaches Earth (after 1 to 3 days), it can
                                    cause geomagnetic storms.
                                </p>
                                <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.875rem' }}>
                                    The strongest event ever recorded is the <strong style={{ color: '#f87171' }}>Carrington storm (1859)</strong>. If it happened
                                    again today, it could damage many satellites and cause long power cuts.
                                </p>
                            </>
                        ) : (
                            <>
                                <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.875rem', marginBottom: '1rem' }}>
                                    Une <strong style={{ color: '#f97316' }}>CME</strong> est une gigantesque bulle de plasma et de champ magnétique éjectée
                                    par le Soleil à des vitesses allant de <strong style={{ color: '#fbbf24' }}>250 à 3 000 km/s</strong>. Lorsqu’elle
                                    atteint la Terre (en 1 à 3 jours), elle peut provoquer des tempêtes géomagnétiques.
                                </p>
                                <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.875rem' }}>
                                    L’événement le plus puissant jamais enregistré est la <strong style={{ color: '#f87171' }}>tempête de Carrington
                                        (1859)</strong>. Si elle se reproduisait aujourd’hui, elle pourrait endommager de nombreux satellites et provoquer
                                    de longues pannes d’électricité.
                                </p>
                            </>
                        )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {CME_STATS.map((s) => (
                            <div key={s.label.fr} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.875rem', borderRadius: '0.625rem', background: `${s.color}0d`, border: `1px solid ${s.color}20` }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}><SpaceIcon name={s.icon} size={16} className="inline-icon" /> {s.label[locale]}</span>
                                <span style={{ color: s.color, fontWeight: 700, fontSize: '0.85rem', fontFamily: 'var(--font-display)' }}>{s.val[locale]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── Space weather dashboard — live NOAA data ─── */}
            <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <SpaceWeatherDashboard />
            </div>

            <section aria-label={copy.history} style={{ marginTop: '2rem' }}>
                <KpChart />
                <SolarFlareHistory />
            </section>
        </div>
    )
}
