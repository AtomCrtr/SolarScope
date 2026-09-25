'use client'

import { useEffect, useRef, useState } from 'react'
import SpaceIcon, { type SpaceIconName } from '@/components/ui/SpaceIcon'
import Image from 'next/image'
import KidsGuide from '@/components/learning/KidsGuide'
import DataSourceNote from '@/components/learning/DataSourceNote'
import MarsMission from '@/components/learning/MarsMission'
import MetricGrid from '@/components/space/MetricGrid'
import { useSiteLocale } from '@/components/layout/LanguageToggle'
import { SCIENTIFIC_SOURCES } from '@/lib/data/source-registry'
import { MARS_DATA_CHECKED_ON, MARS_DATA_DISCLAIMER, MARS_FACTS, marsRoverMission, type MarsRoverId } from '@/lib/content/mars-data'
import type { SiteLocale } from '@/lib/i18n/paths'
import { PlanetScene as Planet3D, RoverScene as RoverViewer3D } from '@/components/space/LightScenes'

type Text = Record<SiteLocale, string>
type Texts = Record<SiteLocale, string[]>

/* ─────────────────────────────────────────── DATA ── */
const ROVERS_DETAIL: Array<{
    name: string; agency: string; active: boolean; key: MarsRoverId | null; color: string; icon: SpaceIconName
    launch: Text; land: Text; area: Text; mass: Text; distance: Text; duration: Text; desc: Text; achievements: Texts
}> = [
    {
        name: 'Sojourner', agency: 'NASA / JPL', active: false, key: null, color: '#94a3b8', icon: 'robot',
        launch: { fr: '4 déc. 1996', en: '4 Dec 1996' }, land: { fr: '4 juil. 1997', en: '4 Jul 1997' }, area: { fr: 'Ares Vallis', en: 'Ares Vallis' },
        mass: { fr: '10,6 kg', en: '10.6 kg' }, distance: { fr: '100 m', en: '100 m' }, duration: { fr: '83 sols', en: '83 sols' },
        desc: {
            fr: 'Premier rover martien. Malgré sa petite taille (celle d’un four à micro-ondes), il a prouvé qu’un robot à roues pouvait explorer une autre planète.',
            en: 'The first Mars rover. Despite its small size (about that of a microwave oven), it proved that a wheeled robot could explore another planet.',
        },
        achievements: {
            fr: ['Premier rover mobile sur une autre planète', 'Analyse de 16 roches', 'Mission prévue pour 7 jours, qui a duré 83 sols'],
            en: ['First mobile rover on another planet', 'Analysed 16 rocks', 'Planned for 7 days, it lasted 83 sols'],
        },
    },
    {
        name: 'Spirit', agency: 'NASA / JPL', active: false, key: null, color: '#f59e0b', icon: 'robot',
        launch: { fr: '10 juin 2003', en: '10 Jun 2003' }, land: { fr: '4 janv. 2004', en: '4 Jan 2004' }, area: { fr: 'Cratère Gusev', en: 'Gusev Crater' },
        mass: { fr: '174 kg', en: '174 kg' }, distance: { fr: '7,73 km', en: '7.73 km' }, duration: { fr: '2 208 sols', en: '2,208 sols' },
        desc: {
            fr: 'Il a exploré le cratère Gusev et les collines Columbia. Il a trouvé de la silice presque pure, signe d’une eau chaude très ancienne.',
            en: 'It explored Gusev Crater and the Columbia Hills. It found almost pure silica, a sign of very ancient hot water.',
        },
        achievements: {
            fr: ['Indices d’eau chaude ancienne', 'Dépôts de silice presque pure', '7,73 km sur un terrain difficile', 'Dernier contact en mars 2010'],
            en: ['Clues of ancient hot water', 'Almost pure silica deposits', '7.73 km over rough ground', 'Last contact in March 2010'],
        },
    },
    {
        name: 'Opportunity', agency: 'NASA / JPL', active: false, key: null, color: '#f97316', icon: 'trophy',
        launch: { fr: '8 juil. 2003', en: '8 Jul 2003' }, land: { fr: '25 janv. 2004', en: '25 Jan 2004' }, area: { fr: 'Meridiani Planum', en: 'Meridiani Planum' },
        mass: { fr: '174 kg', en: '174 kg' }, distance: { fr: '45,16 km', en: '45.16 km' }, duration: { fr: '5 111 sols', en: '5,111 sols' },
        desc: {
            fr: 'Prévu pour 90 sols, il a fonctionné près de 15 ans ! Il a parcouru plus de 45 km, confirmé la présence ancienne d’eau liquide et exploré de grands cratères.',
            en: 'Planned for 90 sols, it worked for almost 15 years! It drove more than 45 km, confirmed that liquid water once existed and explored large craters.',
        },
        achievements: {
            fr: ['Record de distance sur un autre monde : 45,16 km', 'Près de 15 ans de mission', 'Preuve d’une eau liquide ancienne', 'Exploration du cratère Endeavour (22 km de large)'],
            en: ['Distance record on another world: 45.16 km', 'Almost 15 years of mission', 'Evidence of ancient liquid water', 'Explored Endeavour Crater (22 km wide)'],
        },
    },
    {
        name: 'Curiosity', agency: 'NASA / JPL', active: true, key: 'curiosity', color: '#f87171', icon: 'robot',
        launch: { fr: '26 nov. 2011', en: '26 Nov 2011' }, land: { fr: '6 août 2012', en: '6 Aug 2012' }, area: { fr: 'Cratère Gale / mont Sharp', en: 'Gale Crater / Mount Sharp' },
        mass: { fr: '899 kg', en: '899 kg' }, distance: { fr: 'plus de 37 km', en: 'more than 37 km' }, duration: { fr: 'sol 4 955 (juil. 2026)', en: 'sol 4,955 (Jul 2026)' },
        desc: {
            fr: 'Un laboratoire mobile de la taille d’une voiture. Il explore le cratère Gale depuis 2012 et grimpe le mont Sharp. Il a montré que Mars a pu être habitable autrefois.',
            en: 'A mobile laboratory the size of a car. It has explored Gale Crater since 2012 and is climbing Mount Sharp. It showed that Mars could once have been habitable.',
        },
        achievements: {
            fr: ['Conditions habitables dans le passé', 'Détection de molécules organiques', 'Analyse de matière organique complexe', 'Mesure continue des radiations', 'Variations saisonnières du méthane'],
            en: ['Habitable conditions in the past', 'Organic molecules detected', 'Complex organic matter analysed', 'Continuous radiation measurements', 'Seasonal changes in methane'],
        },
    },
    {
        name: 'Perseverance', agency: 'NASA / JPL', active: true, key: 'perseverance', color: '#a78bfa', icon: 'rocket',
        launch: { fr: '30 juil. 2020', en: '30 Jul 2020' }, land: { fr: '18 févr. 2021', en: '18 Feb 2021' }, area: { fr: 'Cratère Jezero', en: 'Jezero Crater' },
        mass: { fr: '1 025 kg', en: '1,025 kg' }, distance: { fr: '42,2 km', en: '42.2 km' }, duration: { fr: 'sol 1 890 (juin 2026)', en: 'sol 1,890 (Jun 2026)' },
        desc: {
            fr: 'Un laboratoire roulant qui cherche des traces d’une vie ancienne dans l’ancien delta d’une rivière. Il a emporté Ingenuity, le premier hélicoptère à voler sur une autre planète.',
            en: 'A rolling laboratory looking for signs of ancient life in an old river delta. It carried Ingenuity, the first helicopter to fly on another planet.',
        },
        achievements: {
            fr: ['Ingenuity : 72 vols, mission terminée en 2024', 'Production d’oxygène avec MOXIE', 'Prélèvement de carottes de roche', 'Enregistrement des sons de Mars', 'Étude des dépôts d’un ancien lac'],
            en: ['Ingenuity: 72 flights, mission ended in 2024', 'Made oxygen with MOXIE', 'Collected rock cores', 'Recorded the sounds of Mars', 'Studied the deposits of an ancient lake'],
        },
    },
]

const ACTIVE_ROVERS = ROVERS_DETAIL.filter((r): r is (typeof ROVERS_DETAIL)[number] & { key: MarsRoverId } => r.active && r.key !== null)

const MARS_TIMELINE: Array<{ year: string; flag: Text; event: Text; detail: Text }> = [
    { year: '1965', flag: { fr: 'USA', en: 'USA' }, event: { fr: 'Mariner 4 — premier survol', en: 'Mariner 4 — first flyby' }, detail: { fr: 'Premières photos rapprochées : une surface criblée de cratères, sans canal ni vie visible.', en: 'First close-up photos: a surface covered in craters, with no canals and no visible life.' } },
    { year: '1971', flag: { fr: 'USA', en: 'USA' }, event: { fr: 'Mariner 9 — premier orbiteur', en: 'Mariner 9 — first orbiter' }, detail: { fr: 'Carte complète de Mars. Découverte d’Olympus Mons et de Valles Marineris.', en: 'A full map of Mars. Olympus Mons and Valles Marineris discovered.' } },
    { year: '1976', flag: { fr: 'USA', en: 'USA' }, event: { fr: 'Viking 1 et 2 — atterrissages', en: 'Viking 1 and 2 — landings' }, detail: { fr: 'Premières photos en couleur depuis le sol. Tests de biologie : résultats peu clairs.', en: 'First colour photos from the ground. Biology tests: unclear results.' } },
    { year: '1997', flag: { fr: 'USA', en: 'USA' }, event: { fr: 'Pathfinder et Sojourner', en: 'Pathfinder and Sojourner' }, detail: { fr: 'Premier rover. Indices d’eau liquide ancienne.', en: 'First rover. Clues of ancient liquid water.' } },
    { year: '2004', flag: { fr: 'USA', en: 'USA' }, event: { fr: 'Spirit et Opportunity', en: 'Spirit and Opportunity' }, detail: { fr: 'Spirit trouve de la silice ; Opportunity trouve de petites billes d’hématite, des preuves d’eau.', en: 'Spirit finds silica; Opportunity finds small hematite “blueberries”, evidence of water.' } },
    { year: '2008', flag: { fr: 'USA', en: 'USA' }, event: { fr: 'Phoenix — près du pôle Nord', en: 'Phoenix — near the North Pole' }, detail: { fr: 'Première détection directe de glace d’eau juste sous la surface.', en: 'First direct detection of water ice just under the surface.' } },
    { year: '2012', flag: { fr: 'USA', en: 'USA' }, event: { fr: 'Curiosity — cratère Gale', en: 'Curiosity — Gale Crater' }, detail: { fr: 'Un laboratoire complet. Conditions habitables anciennes confirmées. Méthane détecté.', en: 'A complete laboratory. Ancient habitable conditions confirmed. Methane detected.' } },
    { year: '2021', flag: { fr: 'USA', en: 'USA' }, event: { fr: 'Perseverance et Ingenuity', en: 'Perseverance and Ingenuity' }, detail: { fr: 'Premier hélicoptère sur une autre planète. Production d’oxygène. Prélèvement d’échantillons.', en: 'First helicopter on another planet. Oxygen produced. Samples collected.' } },
    { year: '2021', flag: { fr: 'EAU', en: 'UAE' }, event: { fr: 'Sonde Hope — orbiteur', en: 'Hope probe — orbiter' }, detail: { fr: 'Premier orbiteur des Émirats arabes unis. Il étudie la météo martienne.', en: 'The first orbiter from the United Arab Emirates. It studies Martian weather.' } },
    { year: '2021', flag: { fr: 'CHN', en: 'CHN' }, event: { fr: 'Tianwen-1 et Zhurong', en: 'Tianwen-1 and Zhurong' }, detail: { fr: 'Première mission chinoise complète : orbiteur, atterrisseur et rover.', en: 'China’s first complete mission: orbiter, lander and rover.' } },
    { year: '2026', flag: { fr: '', en: '' }, event: { fr: 'Retour d’échantillons', en: 'Mars Sample Return' }, detail: { fr: 'La NASA étudie encore plusieurs options pour rapporter les échantillons. Le calendrier n’est pas confirmé.', en: 'NASA is still studying several options to bring the samples back. The schedule is not confirmed.' } },
]

/* ─────────────────────────────────────────── Curated NASA Gallery ── */
const MARS_GALLERY: Array<{ src: string; title: Text; desc: Text; rover: string; camera: string; sol: number; color: string }> = [
    { src: '/media/mars/ingenuity-first-flight.webp', title: { fr: 'Premier vol d’Ingenuity', en: 'Ingenuity’s first flight' }, desc: { fr: 'Le premier hélicoptère en vol sur une autre planète · sol 58', en: 'The first helicopter flying on another planet · sol 58' }, rover: 'Perseverance', camera: 'NavCam', sol: 58, color: '#a78bfa' },
    { src: '/media/mars/perseverance-jezero.webp', title: { fr: 'Perseverance dans le cratère Jezero', en: 'Perseverance in Jezero Crater' }, desc: { fr: 'Vue panoramique depuis le site d’atterrissage · sol 13', en: 'Panorama from the landing site · sol 13' }, rover: 'Perseverance', camera: 'MastCam-Z', sol: 13, color: '#a78bfa' },
    { src: '/media/mars/perseverance-selfie.webp', title: { fr: 'Selfie de Perseverance', en: 'Perseverance selfie' }, desc: { fr: 'Autoportrait avec Ingenuity en arrière-plan · sol 46', en: 'Self-portrait with Ingenuity in the background · sol 46' }, rover: 'Perseverance', camera: 'WATSON', sol: 46, color: '#a78bfa' },
    { src: '/rovers/curiosity.png', title: { fr: 'Curiosity au mont Sharp', en: 'Curiosity at Mount Sharp' }, desc: { fr: 'Selfie au pied du mont Sharp · sol 2291', en: 'Selfie at the foot of Mount Sharp · sol 2291' }, rover: 'Curiosity', camera: 'MAHLI', sol: 2291, color: '#f87171' },
    { src: '/textures/mars.jpg', title: { fr: 'Roches de Vera Rubin Ridge', en: 'Vera Rubin Ridge rocks' }, desc: { fr: 'Couches de roches sédimentaires · sol 1769', en: 'Layers of sedimentary rock · sol 1769' }, rover: 'Curiosity', camera: 'MastCam', sol: 1769, color: '#f87171' },
    { src: '/media/mars/martian-sunset.webp', title: { fr: 'Coucher de soleil martien', en: 'Martian sunset' }, desc: { fr: 'Un crépuscule bleu sur Mars, cratère Gale · sol 956', en: 'A blue sunset on Mars, Gale Crater · sol 956' }, rover: 'Curiosity', camera: 'MastCam', sol: 956, color: '#f87171' },
    { src: '/rovers/opportunity.png', title: { fr: 'Marathon Valley — Opportunity', en: 'Marathon Valley — Opportunity' }, desc: { fr: 'Au bord du cratère Endeavour · sol 3966', en: 'On the rim of Endeavour Crater · sol 3966' }, rover: 'Opportunity', camera: 'PanCam', sol: 3966, color: '#f97316' },
    { src: '/media/mars/dark-sand-dunes.webp', title: { fr: 'Dunes de sable sombre', en: 'Dark sand dunes' }, desc: { fr: 'Dunes de basalte vues par Perseverance · sol 170', en: 'Basalt dunes seen by Perseverance · sol 170' }, rover: 'Perseverance', camera: 'Hazcam', sol: 170, color: '#a78bfa' },
]

const FUN_FACTS: Array<{ icon: SpaceIconName; fact: Text }> = [
    { icon: 'mountain', fact: { fr: 'Olympus Mons est environ 2,5 fois plus haut que l’Everest, et si large qu’on ne verrait pas son bord depuis le sommet.', en: 'Olympus Mons is about 2.5 times taller than Everest, and so wide you could not see its edge from the top.' } },
    { icon: 'mountain', fact: { fr: 'Valles Marineris mesure environ 4 000 km de long : presque la largeur des États-Unis.', en: 'Valles Marineris is about 4,000 km long: almost as wide as the United States.' } },
    { icon: 'wind', fact: { fr: 'L’air de Mars est si fin que la pression au sol ressemble à celle qu’on trouve à 35 km d’altitude sur Terre.', en: 'The air on Mars is so thin that the pressure on the ground is like the pressure 35 km above Earth.' } },
    { icon: 'thermometer', fact: { fr: 'Les températures vont d’environ -140 °C aux pôles en hiver à +20 °C à l’équateur en été.', en: 'Temperatures range from about -140 °C at the poles in winter to +20 °C at the equator in summer.' } },
    { icon: 'drop', fact: { fr: 'Des orbiteurs ont trouvé des indices qu’un grand océan a peut-être couvert une partie de Mars il y a des milliards d’années.', en: 'Orbiters have found clues that a large ocean may have covered part of Mars billions of years ago.' } },
    { icon: 'mars', fact: { fr: 'Sa couleur rouge vient de l’oxyde de fer (la rouille) dans sa poussière : Mars est vraiment rouillée !', en: 'Its red colour comes from iron oxide (rust) in its dust: Mars really is rusty!' } },
]

const COPY = {
    fr: {
        badge: 'ROVERS NASA — MISSIONS VÉRIFIÉES', intro: 'Mars est la quatrième planète autour du Soleil. Deux rovers de la NASA y roulent encore et plusieurs engins l’observent depuis l’espace.',
        chooseRover: 'Choisir un rover', drag: 'Maintenir et glisser pour explorer', verified: 'NASA · vérifié le 26/07/2026',
        sourceNote: 'Données de référence et état des missions : elles ne sont pas suivies en direct.',
        factsKicker: 'REPÈRES MARTIENS', factsTitle: 'Mars en huit chiffres', factsBadge: 'Données NASA de référence', factsLabel: 'Chiffres clés de Mars', nasaSheet: 'Voir la fiche NASA',
        rover: 'Rover', running: (area: string) => `Mission en cours · ${area} · vérifié le 26/07/2026`,
        launch: 'Lancement', landing: 'Atterrissage', mass: 'Masse', distance: 'Distance parcourue', duration: 'Durée active', distanceShort: 'Distance', durationShort: 'Durée',
        model: 'Modèle 3D', nasaView: 'Vue NASA', modelHint: 'Modèle 3D manipulable : utilise la souris ou le doigt pour le faire pivoter.', imageHint: 'Image NASA/JPL de Curiosity : elle ne se manipule pas comme un modèle 3D.',
        galleryTitle: 'Galerie : les images marquantes de Mars', gallerySub: 'Une sélection de photos de Curiosity, Opportunity et Perseverance', enlarge: (title: string) => `Agrandir ${title}`,
        fullRes: '↗ Pleine résolution', close: '✕ Fermer',
        historyTitle: 'Les rovers de la NASA présentés ici', historyText: 'Ces cinq rovers de la NASA racontent l’histoire de l’exploration martienne. Curiosity et Perseverance sont des missions en cours ; leur état est daté ci-dessus.',
        active: '● Actif', ended: '○ Mission terminée', timelineTitle: 'Histoire de l’exploration martienne', didYouKnow: 'Le savais-tu ?',
    },
    en: {
        badge: 'NASA ROVERS — CHECKED MISSIONS', intro: 'Mars is the fourth planet from the Sun. Two NASA rovers are still driving there, and several spacecraft watch it from space.',
        chooseRover: 'Choose a rover', drag: 'Press and drag to explore', verified: 'NASA · checked on 26/07/2026',
        sourceNote: 'Reference data and mission status: they are not tracked live.',
        factsKicker: 'MARS AT A GLANCE', factsTitle: 'Mars in eight numbers', factsBadge: 'NASA reference data', factsLabel: 'Key figures about Mars', nasaSheet: 'See the NASA fact sheet',
        rover: 'Rover', running: (area: string) => `Mission ongoing · ${area} · checked on 26/07/2026`,
        launch: 'Launch', landing: 'Landing', mass: 'Mass', distance: 'Distance driven', duration: 'Time active', distanceShort: 'Distance', durationShort: 'Duration',
        model: '3D model', nasaView: 'NASA view', modelHint: 'A 3D model you can handle: use your mouse or finger to turn it.', imageHint: 'NASA/JPL image of Curiosity: it cannot be turned like a 3D model.',
        galleryTitle: 'Gallery: memorable pictures of Mars', gallerySub: 'A selection of photos from Curiosity, Opportunity and Perseverance', enlarge: (title: string) => `Enlarge ${title}`,
        fullRes: '↗ Full resolution', close: '✕ Close',
        historyTitle: 'The NASA rovers shown here', historyText: 'These five NASA rovers tell the story of Mars exploration. Curiosity and Perseverance are ongoing missions; their status is dated above.',
        active: '● Active', ended: '○ Mission ended', timelineTitle: 'The history of Mars exploration', didYouKnow: 'Did you know?',
    },
}

export default function MarsPage() {
    const locale = useSiteLocale()
    const t = COPY[locale]
    const [activeRover, setActiveRover] = useState<MarsRoverId>('curiosity')
    const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
    const lightboxCloseRef = useRef<HTMLButtonElement>(null)
    const lightboxPanelRef = useRef<HTMLDivElement>(null)
    const lightboxTriggerRef = useRef<HTMLElement | null>(null)
    const activeRoverDetail = ROVERS_DETAIL.find(r => r.key === activeRover)!
    const activeMission = marsRoverMission(activeRover, locale)
    const photo = lightboxIdx === null ? null : MARS_GALLERY[lightboxIdx]

    useEffect(() => {
        if (lightboxIdx === null) return
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Tab') {
                const focusable = Array.from(lightboxPanelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [])
                if (!focusable.length) return
                const first = focusable[0]
                const last = focusable[focusable.length - 1]
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault()
                    last.focus()
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault()
                    first.focus()
                }
            }
        }
        document.addEventListener('keydown', onKeyDown)
        requestAnimationFrame(() => lightboxCloseRef.current?.focus())
        return () => {
            document.removeEventListener('keydown', onKeyDown)
            lightboxTriggerRef.current?.focus()
        }
    }, [lightboxIdx])

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>

            {/* ── HERO ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center', marginBottom: '2.5rem' }} className="max-sm:grid-cols-1">
                <div className="motion-enter">
                    <div className="badge" style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', borderColor: 'rgba(239,68,68,0.25)' }}>
                        <SpaceIcon name="robot" size={18} className="inline-icon" /> {t.badge}
                    </div>
                    <h1 className="page-title">Mars</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: 440, marginBottom: '1.5rem' }}>{t.intro}</p>
                    {/* Active rover selector */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} role="tablist" aria-label={t.chooseRover}>
                        {ACTIVE_ROVERS.map(r => (
                            <button key={r.key} type="button" role="tab" aria-selected={activeRover === r.key} onClick={() => setActiveRover(r.key)} style={{
                                padding: '0.5rem 1.1rem', borderRadius: 99, fontSize: '0.82rem', fontWeight: 700,
                                cursor: 'pointer', border: `2px solid ${activeRover === r.key ? r.color : 'rgba(255,255,255,0.1)'}`,
                                background: activeRover === r.key ? `${r.color}18` : 'transparent',
                                color: activeRover === r.key ? r.color : 'var(--text-muted)',
                                transition: 'all 0.2s ease',
                            }}><SpaceIcon name={r.icon} size={16} className="inline-icon" /> {r.name}</button>
                        ))}
                    </div>
                </div>

                {/* 3D Mars globe */}
                <div className="motion-enter">
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            height: 340, borderRadius: '1.5rem', overflow: 'hidden',
                            background: 'radial-gradient(ellipse at center, rgba(40,5,0,0.92) 0%, rgba(0,0,0,0.98) 100%)',
                            border: '1px solid rgba(239,68,68,0.15)',
                            boxShadow: '0 0 60px rgba(239,68,68,0.08)',
                        }}>
                            <Planet3D textureUrl="/textures/mars.jpg" size={2.1} rotationSpeed={0.002} atmosphereColor="#ef4444" label="Mars" />
                        </div>
                        <div style={{
                            position: 'absolute', bottom: 12, left: 0, right: 0, textAlign: 'center',
                            color: 'var(--text-muted)', fontSize: '0.65rem', letterSpacing: '0.05em',
                        }}>{t.drag}</div>
                        <div style={{
                            position: 'absolute', top: 14, right: 14,
                            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(239,68,68,0.3)', borderRadius: 99,
                            padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 5,
                        }}>
                            <span aria-hidden="true">●</span>
                            <span style={{ color: '#f87171', fontSize: '0.68rem', fontWeight: 700 }}>{t.verified}</span>
                        </div>
                    </div>
                </div>
            </div>

            <KidsGuide topic="mars" />
            <DataSourceNote
                source={SCIENTIFIC_SOURCES.marsRovers.label}
                href={SCIENTIFIC_SOURCES.marsRovers.href}
                refreshed={t.sourceNote}
                checkedOn={MARS_DATA_CHECKED_ON}
                cadence="reference"
            />

            <MarsMission rover={activeMission} onChooseRover={setActiveRover} />

            {/* ── STATS ── */}
            <section className="mars-facts-section" aria-labelledby="mars-facts-title">
                <header className="mars-section-heading">
                    <div>
                        <span className="mars-kicker">{t.factsKicker}</span>
                        <h2 id="mars-facts-title">{t.factsTitle}</h2>
                    </div>
                    <span className="mars-reference-badge">{t.factsBadge}</span>
                </header>
                <MetricGrid
                    ariaLabel={t.factsLabel}
                    className="mars-metrics"
                    items={MARS_FACTS.map(s => ({ icon: s.icon, value: s.val[locale], label: s.label[locale], color: '#fca5a5' }))}
                />
                <p className="metric-grid-note mars-metrics-note">
                    {MARS_DATA_DISCLAIMER[locale]}{' '}
                    <a href={SCIENTIFIC_SOURCES.marsFacts.href} target="_blank" rel="noopener noreferrer" className="touch-link touch-link-compact">
                        {t.nasaSheet}
                    </a>
                </p>
            </section>

            {/* ── ACTIVE ROVER DETAIL ── */}
            <div className="divider" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <h2 className="section-title" style={{ color: activeRoverDetail.color, marginBottom: 0 }}>
                    {t.rover} {activeRoverDetail.name}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span aria-hidden="true" style={{ color: '#10b981' }}>●</span>
                    <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>{t.running(activeRoverDetail.area[locale])}</span>
                </div>
            </div>

            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', border: `1px solid ${activeRoverDetail.color}25` }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem', alignItems: 'start' }} className="max-sm:grid-cols-1">
                    <div>
                        <p style={{ color: 'var(--text-subtle)', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.9rem' }}>{activeRoverDetail.desc[locale]}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {activeRoverDetail.achievements[locale].map(a => (
                                <span key={a} style={{
                                    padding: '4px 10px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 600,
                                    background: `${activeRoverDetail.color}12`, border: `1px solid ${activeRoverDetail.color}28`,
                                    color: activeRoverDetail.color,
                                }}>✓ {a}</span>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: 'grid', gap: '0.625rem', minWidth: 160 }}>
                        {([
                            { label: t.launch, val: activeRoverDetail.launch[locale], icon: 'rocket' },
                            { label: t.landing, val: activeRoverDetail.land[locale], icon: 'target' },
                            { label: t.mass, val: activeRoverDetail.mass[locale], icon: 'scale' },
                            { label: t.distance, val: activeRoverDetail.distance[locale], icon: 'pin' },
                            { label: t.duration, val: activeRoverDetail.duration[locale], icon: 'clock' },
                        ] as Array<{ label: string; val: string; icon: SpaceIconName }>).map(d => (
                            <div key={d.label} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.03)' }}>
                                <SpaceIcon name={d.icon} size={18} />
                                <div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>{d.label}</div>
                                    <div style={{ color: 'var(--text)', fontSize: '0.8rem', fontWeight: 700 }}>{d.val}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── 3D ROVER VIEWER ── */}
            <div style={{ marginBottom: '2.5rem' }}>
                <h2 className="section-title" style={{ color: 'var(--text)', marginBottom: '0.5rem' }}>
                    {activeRover === 'perseverance' ? t.model : t.nasaView} — {activeRoverDetail.name}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '1rem' }}>
                    {activeRover === 'perseverance' ? t.modelHint : t.imageHint}
                </p>
                <RoverViewer3D rover={activeRover} height={360} />
            </div>

            {/* ── CURATED NASA GALLERY ── */}
            <div className="divider" />
            <div style={{ marginBottom: '2.5rem' }}>
                <h2 className="section-title" style={{ color: 'var(--text)', marginBottom: '0.25rem' }}>{t.galleryTitle}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '1.25rem' }}>{t.gallerySub}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.625rem' }} className="max-sm:grid-cols-2">
                    {MARS_GALLERY.map((item, i) => (
                        <button type="button" aria-label={t.enlarge(item.title[locale])} key={item.src} onClick={event => {
                                lightboxTriggerRef.current = event.currentTarget
                                setLightboxIdx(i)
                            }} style={{ cursor: 'pointer', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', position: 'relative', padding: 0, textAlign: 'left', background: 'transparent' }}>
                            <Image src={item.src} alt={item.title[locale]} width={640} height={400} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 300px" quality={75}
                                style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block', background: 'rgba(0,0,0,0.5)' }}
                                onError={e => {
                                    const image = e.currentTarget
                                    image.onerror = null
                                    image.src = '/textures/mars.jpg'
                                }}
                            />
                            <div style={{ padding: '0.4rem 0.6rem', background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(6px)' }}>
                                <div style={{ color: item.color, fontSize: '0.65rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{item.rover} · {item.camera}</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.6rem', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title[locale]}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── LIGHTBOX ── */}
            {photo && (
                <div className="motion-enter" onClick={() => setLightboxIdx(null)} onKeyDown={event => {
                        if (event.key === 'Escape') {
                            event.preventDefault()
                            setLightboxIdx(null)
                        }
                    }} role="dialog" aria-modal="true" aria-labelledby="mars-dialog-title" aria-describedby="mars-dialog-description" style={{
                        position: 'fixed', inset: 0, zIndex: 9000,
                        background: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(16px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
                    }}>
                    <div ref={lightboxPanelRef} onClick={e => e.stopPropagation()} style={{ maxWidth: 880, width: '100%', borderRadius: '1.25rem', overflow: 'hidden', border: `1px solid ${photo.color}30` }}>
                        <Image src={photo.src} alt={photo.title[locale]} width={1400} height={900} sizes="(max-width: 920px) 100vw, 880px" quality={80}
                            style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '65vh', objectFit: 'contain', background: '#000' }} />
                        <div style={{ padding: '1rem 1.5rem', background: 'var(--card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div>
                                <h2 id="mars-dialog-title" style={{ color: photo.color, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{photo.title[locale]}</h2>
                                <div id="mars-dialog-description" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 2 }}>{photo.desc[locale]}</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: 3 }}>{t.rover} {photo.rover} · {photo.camera} · Sol {photo.sol}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <a href={photo.src} target="_blank" rel="noopener noreferrer"
                                    style={{ padding: '0.5rem 1rem', borderRadius: 99, background: `${photo.color}15`, border: `1px solid ${photo.color}35`, color: photo.color, fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600 }}>
                                    {t.fullRes}
                                </a>
                                <button ref={lightboxCloseRef} type="button" onClick={() => setLightboxIdx(null)}
                                    style={{ padding: '0.5rem 1rem', borderRadius: 99, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}>
                                    {t.close}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── ROVER HISTORY ── */}
            <div className="divider" />
            <h2 className="section-title" style={{ color: 'var(--text)' }}>{t.historyTitle}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', marginTop: '-0.5rem' }}>{t.historyText}</p>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))' }}>
                {ROVERS_DETAIL.map((r, i) => (
                    <div key={r.name} className="card motion-enter" style={{ animationDelay: `${Math.min(i * 0.07, 0.6)}s`, padding: '1.25rem', border: `1px solid ${r.color}20`, position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${r.color}, transparent)`, borderRadius: '4px 4px 0 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                <span style={{ color: r.color }}><SpaceIcon name={r.icon} size={26} /></span>
                                <div>
                                    <h3 style={{ color: r.color, fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}>{r.name}</h3>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{r.agency}</div>
                                </div>
                            </div>
                            <span style={{
                                padding: '3px 8px', borderRadius: 99, fontSize: '0.65rem', fontWeight: 700,
                                background: r.active ? 'rgba(16,185,129,0.12)' : 'rgba(100,116,139,0.12)',
                                border: `1px solid ${r.active ? 'rgba(16,185,129,0.3)' : 'rgba(100,116,139,0.2)'}`,
                                color: r.active ? '#10b981' : 'var(--text-muted)',
                            }}>{r.active ? t.active : t.ended}</span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.65, marginBottom: '0.875rem' }}>{r.desc[locale]}</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.375rem', marginBottom: '0.875rem' }}>
                            {([
                                { icon: 'calendar', label: t.landing, val: r.land[locale] },
                                { icon: 'pin', label: t.distanceShort, val: r.distance[locale] },
                                { icon: 'clock', label: t.durationShort, val: r.duration[locale] },
                            ] as Array<{ icon: SpaceIconName; label: string; val: string }>).map(d => (
                                <div key={d.label} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', padding: '0.4rem 0.25rem' }}>
                                    <SpaceIcon name={d.icon} size={14} />
                                    <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: '0.68rem' }}>{d.val}</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>{d.label}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                            {r.achievements[locale].slice(0, 3).map(a => (
                                <div key={a} style={{ display: 'flex', gap: '0.375rem', alignItems: 'flex-start' }}>
                                    <span style={{ color: r.color, fontSize: '0.65rem', marginTop: 2, flexShrink: 0 }}>✓</span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', lineHeight: 1.5 }}>{a}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── TIMELINE ── */}
            <div className="divider" />
            <h2 className="section-title" style={{ color: 'var(--text)' }}>{t.timelineTitle}</h2>
            <div className="card" style={{ padding: '1.5rem' }}>
                {MARS_TIMELINE.map((ev, i) => (
                    <div key={`${ev.year}-${i}`} className="timeline-item">
                        <div className="timeline-dot" style={{
                            background: i === MARS_TIMELINE.length - 1
                                ? 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))'
                                : 'linear-gradient(135deg, #ef4444, #f97316)',
                            fontSize: '0.68rem', fontWeight: 700, minWidth: 32, height: 32,
                        }}>
                            {i === MARS_TIMELINE.length - 1 ? <SpaceIcon name="sparkle" size={16} /> : ev.flag[locale]}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'baseline', flexWrap: 'wrap' }}>
                                <span style={{ color: '#f87171', fontWeight: 800, fontSize: '0.78rem', fontFamily: 'var(--font-display)', flexShrink: 0 }}>{ev.year}</span>
                                <span style={{ color: 'var(--text)', fontWeight: 600, fontSize: '0.88rem' }}>{ev.event[locale]}</span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.775rem', marginTop: '0.2rem', lineHeight: 1.6 }}>{ev.detail[locale]}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── FUN FACTS ── */}
            <div className="card" style={{ padding: '1.25rem', marginTop: '1.5rem' }}>
                <h3 className="section-title" style={{ color: '#f87171', fontSize: '1rem' }}>{t.didYouKnow}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                    {FUN_FACTS.map(f => (
                        <div key={f.fact.fr} style={{ display: 'flex', gap: '0.625rem', padding: '0.875rem', borderRadius: '0.625rem', background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.08)' }}>
                            <span style={{ flexShrink: 0, color: '#fca5a5' }}><SpaceIcon name={f.icon} size={22} /></span>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.65 }}>{f.fact[locale]}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
