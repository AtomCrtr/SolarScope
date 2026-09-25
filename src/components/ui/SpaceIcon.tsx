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
  | 'compass'
  | 'bulb'
  | 'target'
  | 'book'
  | 'speaker'
  | 'stop'
  | 'clock'
  | 'child'
  | 'alert'
  | 'check'
  | 'shield'
  | 'lock'
  | 'thermometer'
  | 'scale'
  | 'ruler'
  | 'pin'
  | 'calendar'
  | 'bolt'
  | 'refresh'
  | 'globe'
  | 'sparkle'
  | 'trophy'
  | 'signal'
  | 'robot'
  | 'wind'
  | 'magnet'
  | 'search'
  | 'print'
  | 'chat'
  | 'trash'
  | 'send'
  | 'coin'
  | 'mountain'
  | 'drop'
  | 'eye'
  | 'play'
  | 'chart'
  | 'map'

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
  bulb: <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3z" />,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
  book: <><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 21V5M9 8h6M9 12h4" /></>,
  speaker: <><path d="M4 9v6h4l5 4V5L8 9z" /><path d="M16.5 8.5a5 5 0 0 1 0 7" /></>,
  stop: <rect x="6" y="6" width="12" height="12" rx="2" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  child: <><circle cx="12" cy="6" r="3" /><path d="M12 9v7M8 12h8M9 21l3-5 3 5" /></>,
  compass: <><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></>,
  family: <><circle cx="8" cy="7" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 20c0-3 2.2-5 5-5s5 2 5 5M13 20c0-2.5 1.7-4 4-4s4 1.5 4 4" /></>,
  alert: <><path d="M12 3l10 18H2z" /><path d="M12 10v5M12 18v.01" /></>,
  check: <path d="M5 12l5 5 9-10" />,
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />,
  lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  thermometer: <path d="M10 14V5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0z" />,
  scale: <><path d="M12 3v18M7 21h10M4 7h16" /><path d="M7 7l-3 7a3 3 0 0 0 6 0zM17 7l-3 7a3 3 0 0 0 6 0z" /></>,
  ruler: <><path d="M3 17L17 3l4 4L7 21z" /><path d="M7 13l2 2M10 10l2 2M13 7l2 2" /></>,
  pin: <><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  refresh: <path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7" />,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" /></>,
  sparkle: <path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />,
  trophy: <path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M9 17h6" />,
  signal: <><circle cx="12" cy="12" r="1.5" /><path d="M12 14v7M8.5 8.5a5 5 0 0 1 7 0M5.6 5.6a9 9 0 0 1 12.8 0" /></>,
  robot: <><rect x="5" y="8" width="14" height="11" rx="3" /><path d="M12 5v3M9 13v1M15 13v1M9.5 16.5h5" /><circle cx="12" cy="4" r="1" /></>,
  wind: <path d="M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h8" />,
  magnet: <path d="M6 3v8a6 6 0 0 0 12 0V3h-4v8a2 2 0 0 1-4 0V3zM6 7h4M14 7h4" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="M16 16l5 5" /></>,
  print: <path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z" />,
  chat: <path d="M4 5h16v11H9l-5 4z" />,
  trash: <path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14" />,
  send: <path d="M4 12l16-8-6 16-3-7z" />,
  coin: <><circle cx="12" cy="12" r="9" /><path d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.4 0-2.5.8-2.5 2s1.1 1.7 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2c-1 0-2-.5-2.5-1.5M12 6v2M12 16v2" /></>,
  mountain: <path d="M3 20l6-11 4 6 2-3 6 8z" />,
  drop: <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  play: <path d="M7 4l13 8-13 8z" />,
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  map: <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14" />,
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
