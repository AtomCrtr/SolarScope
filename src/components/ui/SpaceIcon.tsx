import type { ReactNode } from 'react'

export type SpaceIconName =
  | 'home'
  | 'sun'
  | 'planet'
  | 'mars'
  | 'asteroid'
  | 'meteorite'
  | 'satellite'
  | 'rocket'
  | 'telescope'
  | 'moon-stars'
  | 'camera'
  | 'exoplanet'
  | 'news'
  | 'quiz'
  | 'passport'
  | 'family'

const PATHS: Record<SpaceIconName, ReactNode> = {
  home: <path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  planet: <><circle cx="12" cy="12" r="5" /><ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(-20 12 12)" /></>,
  mars: <><circle cx="12" cy="12" r="8" /><circle cx="9" cy="10" r="1.5" /><circle cx="14.5" cy="14.5" r="2" /><path d="M6 15c2 .5 3 1.5 4 3" /></>,
  asteroid: <><path d="M7 5l6-1 5 4 1 6-4 5-7 0-4-5 1-6z" /><circle cx="10" cy="10" r="1.2" /><circle cx="14" cy="14" r="1.5" /></>,
  meteorite: <><circle cx="15" cy="15" r="5" /><path d="M3 3l7 7M6 3l5 5M3 6l5 5" /></>,
  satellite: <><rect x="9" y="9" width="6" height="6" rx="1" /><path d="M9 12H3M21 12h-6M3 9v6M21 9v6M12 15v3M10 20h4" /></>,
  rocket: <><path d="M12 15c-2-2-3-5-3-8a3 3 0 0 1 6 0c0 3-1 6-3 8z" /><path d="M9 12l-3 3 2 2M15 12l3 3-2 2M12 15v6" /></>,
  telescope: <><path d="M4 14l12-6 2 4-12 6z" /><path d="M10 17l-2 5M12 16l2 6M16 8l2-1 2 4-2 1" /></>,
  'moon-stars': <><path d="M15 4a7 7 0 1 0 5 12A8 8 0 0 1 15 4z" /><path d="M6 4v3M4.5 5.5h3M5 15v2M4 16h2" /></>,
  camera: <><rect x="3" y="7" width="18" height="13" rx="2" /><circle cx="12" cy="13.5" r="3.5" /><path d="M8 7l1.5-3h5L16 7" /></>,
  exoplanet: <><circle cx="9" cy="14" r="5" /><path d="M18 3v4M16 5h4M19 12v2M18 13h2" /></>,
  news: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
  quiz: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.01" /></>,
  passport: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M12 8l1.2 2.4 2.6.4-1.9 1.8.5 2.6L12 14l-2.4 1.2.5-2.6-1.9-1.8 2.6-.4z" /></>,
  family: <><circle cx="8" cy="7" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 20c0-3 2.2-5 5-5s5 2 5 5M13 20c0-2.5 1.7-4 4-4s4 1.5 4 4" /></>,
}

type SpaceIconProps = {
  name: SpaceIconName
  size?: number
  className?: string
}

/** Stroke icons that replace emoji: consistent across devices and silent for screen readers. */
export default function SpaceIcon({ name, size = 20, className }: SpaceIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  )
}
