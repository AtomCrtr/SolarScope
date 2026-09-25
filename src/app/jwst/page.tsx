'use client'

import { useState, useEffect } from 'react'
import SpaceIcon, { type SpaceIconName } from '@/components/ui/SpaceIcon'
import Image from 'next/image'
import KidsGuide from '@/components/learning/KidsGuide'
import DataSourceNote from '@/components/learning/DataSourceNote'
import MetricGrid from '@/components/space/MetricGrid'
import { useSiteLocale } from '@/components/layout/LanguageToggle'
import { SCIENTIFIC_SOURCES } from '@/lib/data/source-registry'
import type { SiteLocale } from '@/lib/i18n/paths'

type Text = Record<SiteLocale, string>

interface WebbImage {
  nasa_id: string
  title: string
  description: string
  date_created: string
  href: string
  thumb: string
}

/* ── Curated JWST highlights ── */
const HIGHLIGHTS: Array<{ title: Text; desc: Text; img: string; category: Text; color: string; year: string }> = [
  {
    title: { fr: 'Nébuleuse de la Carène — « Falaises cosmiques »', en: 'Carina Nebula — “Cosmic Cliffs”' },
    desc: { fr: 'Webb a révélé des centaines d’étoiles cachées dans cette région où naissent des étoiles. Ses plus hauts « sommets » de gaz mesurent environ 7 années-lumière.', en: 'Webb revealed hundreds of stars hidden in this star-forming region. Its tallest “peaks” of gas are about 7 light-years high.' },
    img: '/media/jwst/carina.webp', category: { fr: 'Nébuleuse', en: 'Nebula' }, color: '#f97316', year: '2022',
  },
  {
    title: { fr: 'SMACS 0723 — premier champ profond', en: 'SMACS 0723 — first deep field' },
    desc: { fr: 'La première image publique de Webb : des milliers de galaxies sur un morceau de ciel aussi petit qu’un grain de sable tenu à bout de bras. La lumière de certaines a voyagé plus de 13 milliards d’années.', en: 'Webb’s first public image: thousands of galaxies in a patch of sky as small as a grain of sand held at arm’s length. Light from some of them travelled for more than 13 billion years.' },
    img: '/smacs0723.png', category: { fr: 'Galaxies lointaines', en: 'Distant galaxies' }, color: '#c4b5fd', year: '2022',
  },
  {
    title: { fr: 'Piliers de la Création (M16)', en: 'Pillars of Creation (M16)' },
    desc: { fr: 'Une vue infrarouge des Piliers de la Création. De jeunes étoiles (points rouges) apparaissent à travers les colonnes de poussière.', en: 'An infrared view of the Pillars of Creation. Young stars (red dots) show through the columns of dust.' },
    img: '/media/jwst/pillars-of-creation.webp', category: { fr: 'Nébuleuse', en: 'Nebula' }, color: '#10b981', year: '2022',
  },
  {
    title: { fr: 'Nébuleuse de l’Anneau austral', en: 'Southern Ring Nebula' },
    desc: { fr: 'Une étoile en fin de vie rejette ses couches extérieures. Webb montre deux étoiles au centre, dont l’une façonne ces formes complexes.', en: 'A dying star throws off its outer layers. Webb shows two stars at the centre, one of which shapes these complex patterns.' },
    img: '/media/jwst/southern-ring.webp', category: { fr: 'Nébuleuse', en: 'Nebula' }, color: '#c084fc', year: '2022',
  },
  {
    title: { fr: 'Quintette de Stephan', en: 'Stephan’s Quintet' },
    desc: { fr: 'Des galaxies qui interagissent, à environ 290 millions d’années-lumière. Webb montre comment ces rencontres créent des ondes de choc.', en: 'Interacting galaxies about 290 million light-years away. Webb shows how these encounters create shock waves.' },
    img: '/media/jwst/stephans-quintet.webp', category: { fr: 'Galaxies', en: 'Galaxies' }, color: '#0ea5e9', year: '2022',
  },
  {
    title: { fr: 'Nébuleuse de la Tarentule', en: 'Tarantula Nebula' },
    desc: { fr: 'La plus grande et la plus brillante pouponnière d’étoiles de notre Groupe local de galaxies. Webb y voit des milliers de jeunes étoiles cachées par la poussière.', en: 'The largest and brightest star nursery in our Local Group of galaxies. Webb sees thousands of young stars hidden by dust there.' },
    img: '/media/jwst/tarantula.webp', category: { fr: 'Nébuleuse', en: 'Nebula' }, color: '#f87171', year: '2022',
  },
]

const SCIENCE_STATS: Array<{ icon: SpaceIconName; val: Text; label: Text }> = [
  { icon: 'telescope', val: { fr: '6,5 m', en: '6.5 m' }, label: { fr: 'Diamètre du miroir', en: 'Mirror diameter' } },
  { icon: 'thermometer', val: { fr: '-233 °C', en: '-233 °C' }, label: { fr: 'Température de travail', en: 'Working temperature' } },
  { icon: 'signal', val: { fr: '1 500 000 km', en: '1,500,000 km' }, label: { fr: 'Distance de la Terre', en: 'Distance from Earth' } },
  { icon: 'sparkle', val: { fr: '≈ 6×', en: '≈ 6×' }, label: { fr: 'Surface de miroir comparée à Hubble', en: 'Mirror area compared with Hubble' } },
  { icon: 'coin', val: { fr: '10 milliards $', en: '$10 billion' }, label: { fr: 'Coût total', en: 'Total cost' } },
  { icon: 'calendar', val: { fr: '25 ans', en: '25 years' }, label: { fr: 'Du projet au lancement', en: 'From plan to launch' } },
  { icon: 'shield', val: { fr: '5 couches', en: '5 layers' }, label: { fr: 'Pare-soleil', en: 'Sunshield' } },
  { icon: 'search', val: { fr: '0,6–28,5 µm', en: '0.6–28.5 µm' }, label: { fr: 'Lumière observée', en: 'Light observed' } },
]

const CATEGORIES: Array<{ icon: SpaceIconName; title: Text; desc: Text; color: string }> = [
  { icon: 'sparkle', title: { fr: 'Premières galaxies', en: 'First galaxies' }, desc: { fr: 'Il détecte des galaxies formées quelques centaines de millions d’années après le Big Bang.', en: 'It detects galaxies that formed a few hundred million years after the Big Bang.' }, color: '#a5b4fc' },
  { icon: 'sparkle', title: { fr: 'Naissance des étoiles', en: 'How stars are born' }, desc: { fr: 'Il révèle les pouponnières d’étoiles cachées dans les nébuleuses, invisibles en lumière visible.', en: 'It reveals star nurseries hidden in nebulae, invisible in ordinary light.' }, color: '#f97316' },
  { icon: 'planet', title: { fr: 'Atmosphères d’exoplanètes', en: 'Exoplanet atmospheres' }, desc: { fr: 'Il analyse de quoi sont faites les atmosphères de planètes situées à des dizaines d’années-lumière.', en: 'It works out what the atmospheres of planets tens of light-years away are made of.' }, color: '#10b981' },
  { icon: 'target', title: { fr: 'Trous noirs', en: 'Black holes' }, desc: { fr: 'Il observe en infrarouge la matière qui tourne autour des trous noirs géants et leurs jets.', en: 'It observes, in infrared, the matter swirling around giant black holes and their jets.' }, color: '#c084fc' },
]

const COMPARISON: Array<[Text, Text, Text]> = [
  [{ fr: 'Miroir principal', en: 'Main mirror' }, { fr: '2,4 m', en: '2.4 m' }, { fr: '6,5 m', en: '6.5 m' }],
  [{ fr: 'Lancement', en: 'Launch' }, { fr: '1990', en: '1990' }, { fr: '25 déc. 2021', en: '25 Dec 2021' }],
  [{ fr: 'Orbite', en: 'Orbit' }, { fr: 'environ 520 km autour de la Terre', en: 'about 520 km around Earth' }, { fr: '1 500 000 km (point L2)', en: '1,500,000 km (L2 point)' }],
  [{ fr: 'Lumière observée', en: 'Light observed' }, { fr: 'UV, visible et proche infrarouge', en: 'UV, visible and near infrared' }, { fr: 'Infrarouge proche et moyen', en: 'Near and mid infrared' }],
  [{ fr: 'Température', en: 'Temperature' }, { fr: 'Proche de la température ambiante', en: 'Close to room temperature' }, { fr: '-233 °C (très froid)', en: '-233 °C (very cold)' }],
  [{ fr: 'Galaxies les plus lointaines', en: 'Farthest galaxies' }, { fr: 'environ 400 millions d’années après le Big Bang', en: 'about 400 million years after the Big Bang' }, { fr: 'environ 300 millions d’années après le Big Bang', en: 'about 300 million years after the Big Bang' }],
  [{ fr: 'Sensibilité', en: 'Sensitivity' }, { fr: 'Référence', en: 'Reference' }, { fr: 'jusqu’à 100 fois plus', en: 'up to 100 times more' }],
]

const COPY = {
  fr: {
    title: 'Télescope Webb', subtitle: 'Un immense œil dans l’espace qui capte une lumière invisible et observe des galaxies très anciennes.',
    stats: 'Chiffres clés du télescope James Webb', galleries: 'Galeries d’images du télescope James Webb', chooseGallery: 'Choisir une galerie Webb',
    iconic: 'Images célèbres de Webb', live: 'Galerie NASA en direct', enlarge: (title: string) => `Agrandir ${title}`, nasaPage: (title: string) => `${title} — voir la fiche sur le site de la NASA (nouvel onglet)`,
    close: '✕ Fermer', research: 'Ce que Webb étudie', versus: 'Webb et Hubble', compare: 'Comparatif des télescopes spatiaux', head: ['Caractéristique', 'Hubble', 'James Webb'],
  },
  en: {
    title: 'Webb Telescope', subtitle: 'A huge eye in space that catches invisible light and observes very old galaxies.',
    stats: 'Key figures about the James Webb telescope', galleries: 'James Webb telescope image galleries', chooseGallery: 'Choose a Webb gallery',
    iconic: 'Famous Webb images', live: 'Live NASA gallery', enlarge: (title: string) => `Enlarge ${title}`, nasaPage: (title: string) => `${title} — see it on NASA’s website (new tab)`,
    close: '✕ Close', research: 'What Webb studies', versus: 'Webb and Hubble', compare: 'Space telescope comparison', head: ['Feature', 'Hubble', 'James Webb'],
  },
}

export default function JWSTPage() {
  const locale = useSiteLocale()
  const t = COPY[locale]
  const [nasaImages, setNasaImages] = useState<WebbImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedHighlight, setSelectedHighlight] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'gallery' | 'nasa'>('gallery')
  const highlight = selectedHighlight === null ? null : HIGHLIGHTS[selectedHighlight]

  useEffect(() => {
    fetch('/api/jwst-images')
      .then(r => r.json())
      .then(d => {
        setNasaImages(Array.isArray(d.images) ? d.images : [])
      })
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (selectedHighlight === null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedHighlight(null)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [selectedHighlight])

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>

      {/* HERO */}
      <div className="page-header motion-enter">
        <div className="badge" style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--nebula)', borderColor: 'rgba(99,102,241,0.25)' }}>
          <SpaceIcon name="telescope" size={18} className="inline-icon" /> JAMES WEBB SPACE TELESCOPE
        </div>
        <h1 className="page-title">{t.title}</h1>
        <p className="page-subtitle">{t.subtitle}</p>
      </div>

      <KidsGuide topic="jwst" />
      <DataSourceNote
        source={SCIENTIFIC_SOURCES.jwstFacts.label}
        href={SCIENTIFIC_SOURCES.jwstFacts.href}
        refreshed={locale === 'en' ? SCIENTIFIC_SOURCES.jwstFacts.childNoteEn : SCIENTIFIC_SOURCES.jwstFacts.childNote}
        checkedOn={SCIENTIFIC_SOURCES.jwstFacts.checkedOn}
        cadence="reference"
      />

      {/* Stats */}
      <MetricGrid
        ariaLabel={t.stats}
        className="metric-grid-block jwst-metrics"
        items={SCIENCE_STATS.map(s => ({ icon: s.icon, value: s.val[locale], label: s.label[locale], color: '#a5b4fc' }))}
      />

      <h2 className="sr-only">{t.galleries}</h2>
      {/* Tabs */}
      <div role="tablist" aria-label={t.chooseGallery} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['gallery', 'nasa'] as const).map(tab => (
          <button key={tab} role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)} style={{
            padding: '0.5rem 1.25rem', borderRadius: 99, fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
            background: activeTab === tab ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${activeTab === tab ? 'rgba(99,102,241,0.45)' : 'rgba(255,255,255,0.07)'}`,
            color: activeTab === tab ? 'var(--nebula)' : 'var(--text-muted)', transition: 'all 0.2s',
          }}>
            {tab === 'gallery' ? t.iconic : t.live}
          </button>
        ))}
      </div>

      {/* Gallery — Curated highlights */}
      {activeTab === 'gallery' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '2rem' }} className="max-sm:grid-cols-1">
          {HIGHLIGHTS.map((h, i) => (
            <button className="motion-enter" type="button" aria-label={t.enlarge(h.title[locale])} key={h.img} onClick={() => setSelectedHighlight(i)} style={{ animationDelay: `${Math.min(i * 0.06, 0.6)}s`, cursor: 'pointer', borderRadius: '1rem', overflow: 'hidden', border: `1px solid ${h.color}20`, position: 'relative', padding: 0, textAlign: 'left', background: 'transparent' }}>
              <Image src={h.img} alt={h.title[locale]} width={800} height={440}
                style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
                onError={e => { e.currentTarget.style.visibility = 'hidden' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 55%)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem' }}>
                <div style={{ fontSize: '0.62rem', fontWeight: 700, color: h.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
                  {h.category[locale]} · {h.year}
                </div>
                <h3 style={{ color: 'var(--text)', fontSize: '0.88rem', fontWeight: 700, fontFamily: 'var(--font-display)', lineHeight: 1.3 }}>{h.title[locale]}</h3>
              </div>
              <div style={{ position: 'absolute', top: 10, right: 10, background: `${h.color}20`, border: `1px solid ${h.color}40`, borderRadius: 99, padding: '2px 8px', fontSize: '0.65rem', color: h.color, fontWeight: 700 }}>
                JWST
              </div>
            </button>
          ))}
        </div>
      )}

      {/* NASA live images (titles come from NASA, in English) */}
      {activeTab === 'nasa' && (
        loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.625rem', marginBottom: '2rem' }}>
            {[...Array(8)].map((_, i) => <div key={i} style={{ height: 180, borderRadius: '0.75rem', background: 'rgba(255,255,255,0.04)' }} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.625rem', marginBottom: '2rem' }} className="max-sm:grid-cols-2">
            {nasaImages.map((img, i) => (
              <a className="motion-enter" key={img.nasa_id} href={img.href} target="_blank" rel="noopener noreferrer" aria-label={t.nasaPage(img.title)} style={{ animationDelay: `${Math.min(i * 0.03, 0.6)}s`, display: 'block', textDecoration: 'none', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid rgba(99,102,241,0.12)' }}>
                <Image src={img.thumb} alt={img.title} width={600} height={400} style={{ width: '100%', height: 170, objectFit: 'cover', display: 'block' }}
                  onError={e => { e.currentTarget.style.visibility = 'hidden' }} />
                <div style={{ padding: '0.5rem 0.625rem', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
                  <div lang="en" style={{ color: '#c7d2fe', fontSize: '0.65rem', fontWeight: 600, lineHeight: 1.3 }}>{img.title?.slice(0, 55)}{img.title?.length > 55 ? '…' : ''}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.6rem', marginTop: 2 }}>{img.date_created}</div>
                </div>
              </a>
            ))}
          </div>
        )
      )}

      {/* Lightbox */}
      {highlight && (
        <div className="motion-enter" onClick={() => setSelectedHighlight(null)} role="dialog" aria-modal="true" aria-labelledby="jwst-dialog-title" style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(0,0,0,0.93)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: 900, width: '100%', borderRadius: '1.25rem', overflow: 'hidden', border: '1px solid rgba(99,102,241,0.2)' }}>
            <Image src={highlight.img} alt={highlight.title[locale]} width={1400} height={900} style={{ width: '100%', height: 'auto', maxHeight: '60vh', objectFit: 'contain', background: '#000', display: 'block' }} />
            <div style={{ padding: '1.25rem 1.5rem', background: 'var(--card)' }}>
              <div style={{ color: highlight.color, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.375rem' }}>
                {highlight.category[locale]} · JWST {highlight.year}
              </div>
              <h2 id="jwst-dialog-title" style={{ color: 'var(--text)', fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '0.625rem' }}>{highlight.title[locale]}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.7 }}>{highlight.desc[locale]}</p>
              <button onClick={() => setSelectedHighlight(null)} style={{ marginTop: '1rem', padding: '0.5rem 1rem', borderRadius: 99, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>{t.close}</button>
            </div>
          </div>
        </div>
      )}

      {/* Science categories */}
      <div className="divider" />
      <h2 className="section-title" style={{ color: 'var(--text)' }}>{t.research}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.875rem', marginBottom: '2rem' }} className="max-sm:grid-cols-1">
        {CATEGORIES.map((c, i) => (
          <div key={c.title.fr} className="card motion-enter" style={{ animationDelay: `${Math.min(i * 0.07, 0.6)}s`, padding: '1.25rem', border: `1px solid ${c.color}18`, display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <span style={{ flexShrink: 0, color: c.color }}><SpaceIcon name={c.icon} size={32} /></span>
            <div>
              <h3 style={{ color: c.color, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '0.375rem' }}>{c.title[locale]}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.65 }}>{c.desc[locale]}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Webb vs Hubble */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h2 className="section-title" style={{ color: 'var(--text)' }}>{t.versus}</h2>
        <div role="region" aria-label={t.compare} tabIndex={0} style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr>
                {t.head.map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map(row => (
                <tr key={row[0].fr} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '0.625rem 1rem', color: 'var(--text-muted)', fontWeight: 600 }}>{row[0][locale]}</td>
                  <td style={{ padding: '0.625rem 1rem', color: 'var(--text-muted)' }}>{row[1][locale]}</td>
                  <td style={{ padding: '0.625rem 1rem', color: 'var(--nebula)', fontWeight: 700 }}>{row[2][locale]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
