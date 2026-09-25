'use client'

import dynamic from 'next/dynamic'
import type { ComponentProps, ReactNode } from 'react'
import { setDisplayChoice, useLightMode } from '@/lib/client/light-mode'
import { useSiteLocale } from '@/components/layout/LanguageToggle'

// The WebGL components are only downloaded when the device can afford them.
const Planet3D = dynamic(() => import('@/components/space/Planet3D'), { ssr: false })
const Sun3D = dynamic(() => import('@/components/space/Sun3D'), { ssr: false })
const RoverViewer3D = dynamic(() => import('@/components/space/RoverViewer3D'), { ssr: false })
const ISSGlobe = dynamic(() => import('@/components/space/ISSGlobe'), { ssr: false })

/** Still image, and an offer to load the 3D scene when light mode was chosen automatically. */
function Still({ children, offer3d }: { children: ReactNode; offer3d: boolean }) {
  const locale = useSiteLocale()
  return (
    <div className="scene-still">
      {children}
      {offer3d && (
        <button type="button" className="scene-still-button" onClick={() => setDisplayChoice('full')}>
          {locale === 'en' ? 'Show in 3D' : 'Voir en 3D'}
        </button>
      )}
    </div>
  )
}

function useStill() {
  const mode = useLightMode()
  return { still: mode !== 'full', offer3d: mode === 'light-auto' }
}

type PlanetProps = ComponentProps<typeof Planet3D>

/** A texture-mapped disc with shading: reads as a planet, costs one image. */
function PlanetStill({ textureUrl, hasRings, ringColor = '#c8a96e', atmosphereColor, label = 'planète', fallbackColor = '#64748b' }: PlanetProps) {
  return (
    <div className="planet-still" role="img" aria-label={label}>
      {hasRings && <span className="planet-still-ring" style={{ borderColor: ringColor }} />}
      <span
        className="planet-still-disc"
        style={{
          backgroundColor: fallbackColor,
          backgroundImage: `radial-gradient(circle at 32% 30%, rgba(255,255,255,0.18), rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 78%), url(${textureUrl})`,
          boxShadow: atmosphereColor ? `0 0 28px ${atmosphereColor}66` : undefined,
        }}
      />
    </div>
  )
}

export function PlanetScene(props: PlanetProps) {
  const { still, offer3d } = useStill()
  return still ? <Still offer3d={offer3d}><PlanetStill {...props} /></Still> : <Planet3D {...props} />
}

export function SunScene(props: ComponentProps<typeof Sun3D>) {
  const { still, offer3d } = useStill()
  if (!still) return <Sun3D {...props} />
  return (
    <Still offer3d={offer3d}>
      <div className="sun-still" style={{ height: props.height ?? 480 }} role="img" aria-label="Le Soleil"><span /></div>
    </Still>
  )
}

export function RoverScene(props: ComponentProps<typeof RoverViewer3D>) {
  const { still, offer3d } = useStill()
  if (!still) return <RoverViewer3D {...props} />
  const name = props.rover === 'curiosity' ? 'Curiosity' : 'Perseverance'
  return (
    <Still offer3d={offer3d}>
      <div className="rover-still" style={{ height: props.height ?? 340 }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- local illustration, sized by CSS */}
        <img src={`/rovers/${props.rover}.png`} alt={`Le rover ${name}`} loading="lazy" />
      </div>
    </Still>
  )
}

export function ISSGlobeScene(props: ComponentProps<typeof ISSGlobe>) {
  const { still, offer3d } = useStill()
  if (!still) return <ISSGlobe {...props} />
  const position = props.issPos
  return (
    <Still offer3d={offer3d}>
      {/* A flat world map (equirectangular texture) with the station's point. */}
      <div className="iss-still" role="img" aria-label={position ? `Position de l’ISS : latitude ${position.latitude.toFixed(1)}, longitude ${position.longitude.toFixed(1)}` : 'Carte du monde'}>
        {position && <span style={{ left: `${((position.longitude + 180) / 360) * 100}%`, top: `${((90 - position.latitude) / 180) * 100}%` }} />}
      </div>
    </Still>
  )
}
