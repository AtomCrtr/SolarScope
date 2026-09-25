'use client'

import { useEffect, useState } from 'react'
import type { TonightSky as TonightSkyData } from '@/lib/astronomy/tonight'
import { skyWords } from '@/lib/astronomy/sky-words'
import type { IssPass } from '@/lib/astronomy/iss-passes'
import SpaceIcon from '@/components/ui/SpaceIcon'
import Link from '@/components/ui/LocaleLink'
import { useSiteLocale } from '@/components/layout/LanguageToggle'
import { toggleObservation, useLocalProgress, type SkyObjectId } from '@/lib/client/local-progress'

type TonightSkyProps = {
  latitude: number | null
  longitude: number | null
  place: string
}

type IssState = { status: 'loading' } | { status: 'ready'; passes: IssPass[] } | { status: 'unavailable' }

const PLANETS: Record<string, { fr: { name: string; tip: string }; en: { name: string; tip: string } }> = {
  mercury: { fr: { name: 'Mercure', tip: 'Elle reste très basse, peu après le coucher du Soleil ou avant son lever.' }, en: { name: 'Mercury', tip: 'It stays very low, just after sunset or before sunrise.' } },
  venus: { fr: { name: 'Vénus', tip: 'On l’appelle « l’étoile du Berger », mais c’est une planète !' }, en: { name: 'Venus', tip: 'People call it the “evening star”, but it is a planet!' } },
  mars: { fr: { name: 'Mars', tip: 'Cherche un point orangé qui ne scintille presque pas.' }, en: { name: 'Mars', tip: 'Look for an orange dot that hardly twinkles.' } },
  jupiter: { fr: { name: 'Jupiter', tip: 'Avec des jumelles bien calées, tu peux voir ses quatre grandes lunes.' }, en: { name: 'Jupiter', tip: 'With steady binoculars, you can see its four big moons.' } },
  saturn: { fr: { name: 'Saturne', tip: 'Avec un petit télescope, on devine ses anneaux.' }, en: { name: 'Saturn', tip: 'With a small telescope, you can make out its rings.' } },
}

const COPY = {
  fr: {
    date: 'fr-FR', tonight: 'Ce soir', tomorrow: 'Demain',
    heading: 'Ce soir depuis chez toi', from: (place: string) => `Ce soir depuis ${place}`, computing: 'Calcul du ciel de ce soir…',
    darkNow: 'Il fait déjà nuit : voici le ciel en ce moment.', sunset: (sunset: string, dark: string) => `Le Soleil se couche vers ${sunset}. Le ciel est bien sombre vers ${dark}.`,
    onDevice: 'Calculé sur ton appareil', moon: 'La Lune', lit: (n: number) => `${n} % éclairée`,
    look: (where: string, height: string) => `Regarde ${where}, ${height}.`, notRisen: (time: string) => `Elle n’est pas encore levée : elle apparaît vers ${time}.`, belowHorizon: 'Elle reste sous l’horizon cette nuit.',
    moonBright: 'Très lumineuse, elle cache les étoiles les plus faibles.', planets: 'Planètes à l’œil nu', noPlanet: 'Aucune planète brillante n’est bien placée ce soir. Profites-en pour chercher les constellations !',
    iss: 'Passages de l’ISS', issLoading: 'Calcul de l’orbite…', issDown: 'L’orbite de l’ISS n’a pas pu être chargée. Réessaie plus tard.',
    pass: (day: string, time: string) => `${day} à ${time}`, upTo: (degrees: number) => `jusqu’à ${degrees}° de hauteur`, issLooks: 'Elle ressemble à une étoile très brillante qui avance sans clignoter.', noPass: 'Pas de passage visible dans les trois prochains jours depuis ta zone.',
    seen: (label: string) => `J’ai vu ${label}`, noted: (label: string) => `${label} : noté dans mon carnet`, moonLabel: 'la Lune', issLabel: 'l’ISS',
    logbook: ['Coche ce que tu as vraiment vu : ta première observation te fait gagner le tampon ', 'Observateur·rice du ciel', '. '], logbookLink: 'Voir mon carnet',
    footer: 'Calculs astronomiques faits dans ton navigateur (astronomy-engine, orbite CelesTrak). La météo et les lumières de la ville peuvent gêner l’observation.', nasaGuide: 'Guide du mois de la NASA ↗',
  },
  en: {
    date: 'en-GB', tonight: 'Tonight', tomorrow: 'Tomorrow',
    heading: 'Tonight from where you are', from: (place: string) => `Tonight from ${place}`, computing: 'Working out tonight’s sky…',
    darkNow: 'It is already dark: here is the sky right now.', sunset: (sunset: string, dark: string) => `The Sun sets around ${sunset}. The sky is nice and dark around ${dark}.`,
    onDevice: 'Worked out on your device', moon: 'The Moon', lit: (n: number) => `${n}% lit`,
    look: (where: string, height: string) => `Look ${where}, ${height}.`, notRisen: (time: string) => `It has not risen yet: it appears around ${time}.`, belowHorizon: 'It stays below the horizon tonight.',
    moonBright: 'Very bright, it hides the faintest stars.', planets: 'Planets you can see', noPlanet: 'No bright planet is well placed tonight. A great time to look for constellations!',
    iss: 'ISS passes', issLoading: 'Working out the orbit…', issDown: 'The ISS orbit could not be loaded. Try again later.',
    pass: (day: string, time: string) => `${day} at ${time}`, upTo: (degrees: number) => `up to ${degrees}° high`, issLooks: 'It looks like a very bright star moving without blinking.', noPass: 'No visible pass in the next three days from your area.',
    seen: (label: string) => `I saw ${label}`, noted: (label: string) => `${label}: noted in my logbook`, moonLabel: 'the Moon', issLabel: 'the ISS',
    logbook: ['Tick what you really saw: your first observation earns you the ', 'Sky observer', ' stamp. '], logbookLink: 'Open my logbook',
    footer: 'Astronomy calculations done in your browser (astronomy-engine, CelesTrak orbit). Weather and city lights can make observing harder.', nasaGuide: 'NASA’s monthly sky guide ↗',
  },
}

type Copy = (typeof COPY)['fr']

const formatTime = (date: Date, copy: Copy) => {
  const value = date.toLocaleTimeString(copy.date, { hour: '2-digit', minute: '2-digit' })
  return copy.date === 'fr-FR' ? value.replace(':', ' h ') : value
}

function dayLabel(date: Date, now: Date, copy: Copy): string {
  const days = Math.round((new Date(date).setHours(0, 0, 0, 0) - new Date(now).setHours(0, 0, 0, 0)) / 86_400_000)
  if (days === 0) return copy.tonight
  if (days === 1) return copy.tomorrow
  return date.toLocaleDateString(copy.date, { weekday: 'long' }).replace(/^./, letter => letter.toUpperCase())
}

/** The Moon drawn at its real phase: lit side on the right while it grows, on the left while it shrinks. */
function MoonPhaseIcon({ fraction, waxing }: { fraction: number; waxing: boolean }) {
  const c = 32
  const r = 28
  const rx = Math.abs(2 * fraction - 1) * r
  const crescent = fraction < 0.5
  const edgeSweep = waxing ? 1 : 0
  const terminatorSweep = waxing ? (crescent ? 0 : 1) : (crescent ? 1 : 0)
  const lit = `M ${c} ${c - r} A ${r} ${r} 0 0 ${edgeSweep} ${c} ${c + r} A ${rx} ${r} 0 0 ${terminatorSweep} ${c} ${c - r} Z`
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx={c} cy={c} r={r} fill="#1b2550" stroke="#2a3566" strokeWidth="2" />
      {fraction > 0.02 && <path d={lit} fill="#eef1fa" />}
    </svg>
  )
}

/** « Je l'ai vu ! » : ticks the object in the passport's observation log. Nothing leaves the device. */
function SeenButton({ object, label, copy }: { object: SkyObjectId; label: string; copy: Copy }) {
  const progress = useLocalProgress()
  const seen = Boolean(progress?.observed?.[object])
  return (
    <button type="button" className="tonight-seen" aria-pressed={seen} onClick={() => toggleObservation(object)}>
      <SpaceIcon name={seen ? 'check' : 'eye'} size={16} />
      {seen ? copy.noted(label.replace(/^./, letter => letter.toUpperCase())) : copy.seen(label)}
    </button>
  )
}

export default function TonightSky({ latitude, longitude, place }: TonightSkyProps) {
  const locale = useSiteLocale()
  const copy = COPY[locale]
  const words = skyWords(locale)
  const [sky, setSky] = useState<TonightSkyData | null>(null)
  const [iss, setIss] = useState<IssState>({ status: 'loading' })
  const [now] = useState(() => new Date())

  useEffect(() => {
    if (latitude === null || longitude === null) return
    let cancelled = false

    // Loaded on demand: the astronomy code only ships with this page, once the place is known.
    import('@/lib/astronomy/tonight').then(({ computeTonight }) => {
      if (!cancelled) setSky(computeTonight(new Date(), latitude, longitude))
    })

    Promise.all([
      fetch('/api/iss-tle').then(response => {
        if (!response.ok) throw new Error('ISS TLE unavailable')
        return response.json() as Promise<{ line1: string; line2: string }>
      }),
      import('@/lib/astronomy/iss-passes'),
    ])
      .then(([tle, { findVisibleIssPasses }]) => {
        if (!cancelled) setIss({ status: 'ready', passes: findVisibleIssPasses(tle.line1, tle.line2, latitude, longitude, new Date()) })
      })
      .catch(() => {
        if (!cancelled) setIss({ status: 'unavailable' })
      })

    return () => { cancelled = true }
  }, [latitude, longitude])

  if (!sky) {
    return (
      <section className="card tonight-sky" aria-labelledby="tonight-title" aria-busy="true">
        <h2 id="tonight-title" className="section-title">{copy.heading}</h2>
        <p className="tonight-muted" role="status">{copy.computing}</p>
      </section>
    )
  }

  return (
    <section className="card tonight-sky" aria-labelledby="tonight-title">
      <header className="tonight-header">
        <div>
          <h2 id="tonight-title" className="section-title">{copy.from(place)}</h2>
          <p className="tonight-muted">
            {sky.isNow ? copy.darkNow : copy.sunset(sky.sunset ? formatTime(sky.sunset, copy) : '—', formatTime(sky.observedAt, copy))}
          </p>
        </div>
        <span className="tonight-privacy"><SpaceIcon name="compass" size={16} />{copy.onDevice}</span>
      </header>

      <div className="tonight-grid">
        <article className="tonight-block" aria-labelledby="tonight-moon">
          <div className="tonight-moon">
            <MoonPhaseIcon fraction={sky.moon.illuminatedPercent / 100} waxing={sky.moon.waxing} />
            <div>
              <h3 id="tonight-moon">{copy.moon}</h3>
              <p className="tonight-strong">{words.moonPhaseName(sky.moon.phaseAngle)}</p>
              <p className="tonight-muted">{copy.lit(sky.moon.illuminatedPercent)}</p>
            </div>
          </div>
          <p>
            {sky.moon.isUp
              ? copy.look(sky.moon.direction ? words.towards(sky.moon.direction) : '', words.heightLabel(sky.moon.altitude))
              : sky.moon.nextRise
                ? copy.notRisen(formatTime(sky.moon.nextRise, copy))
                : copy.belowHorizon}
          </p>
          {sky.moon.illuminatedPercent > 70 && <p className="tonight-note">{copy.moonBright}</p>}
          <SeenButton object="moon" label={copy.moonLabel} copy={copy} />
        </article>

        <article className="tonight-block" aria-labelledby="tonight-planets">
          <h3 id="tonight-planets">{copy.planets}</h3>
          {sky.planets.length ? (
            <ul className="tonight-list">
              {sky.planets.map(planet => {
                const text = PLANETS[planet.id]?.[locale] ?? { name: planet.name, tip: planet.tip }
                return (
                  <li key={planet.id}>
                    <strong>{text.name}</strong>
                    <span>{words.towards(planet.direction)}, {words.heightLabel(planet.altitude)} · {words.brightness(planet.magnitude)}</span>
                    <small>{text.tip}</small>
                    <SeenButton object={planet.id as SkyObjectId} label={text.name} copy={copy} />
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="tonight-muted">{copy.noPlanet}</p>
          )}
        </article>

        <article className="tonight-block" aria-labelledby="tonight-iss">
          <h3 id="tonight-iss">{copy.iss}</h3>
          {iss.status === 'loading' && <p className="tonight-muted" role="status">{copy.issLoading}</p>}
          {iss.status === 'unavailable' && <p className="tonight-muted">{copy.issDown}</p>}
          {iss.status === 'ready' && (iss.passes.length ? (
            <>
              <ul className="tonight-list">
                {iss.passes.map(pass => (
                  <li key={pass.start.toISOString()}>
                    <strong>{copy.pass(dayLabel(pass.start, now, copy), formatTime(pass.start, copy))}</strong>
                    <span>{words.fromDirection(pass.startDirection)} {words.towards(pass.endDirection)} · {copy.upTo(pass.maxAltitude)}</span>
                  </li>
                ))}
              </ul>
              <p className="tonight-note">{copy.issLooks}</p>
              <SeenButton object="iss" label={copy.issLabel} copy={copy} />
            </>
          ) : (
            <p className="tonight-muted">{copy.noPass}</p>
          ))}
        </article>
      </div>

      <p className="tonight-logbook">
        <SpaceIcon name="passport" size={18} />
        <span>{copy.logbook[0]}<strong>{copy.logbook[1]}</strong>{copy.logbook[2]}<Link href="/passeport#carnet">{copy.logbookLink}</Link></span>
      </p>

      <p className="tonight-footer">
        {copy.footer}{' '}
        <a href="https://science.nasa.gov/skywatching/whats-up/" target="_blank" rel="noopener noreferrer">{copy.nasaGuide}</a>
      </p>
    </section>
  )
}
