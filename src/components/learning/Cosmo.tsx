type CosmoProps = {
  className?: string
  /** Accessible name; omit when the mascot is purely decorative. */
  title?: string
}

/**
 * Cosmo, the SolarScope mascot. Same drawing as public/mascot/cosmonaute.svg,
 * inlined so the waving arm (.cosmo-wave) can be animated in CSS.
 */
export default function Cosmo({ className, title }: CosmoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 262 240"
      fill="none"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <g stroke="#FBF6EC" strokeLinecap="round" strokeLinejoin="round">
        <line x1="152" y1="44" x2="164" y2="20" strokeWidth="16" />
        <path d="M80 160 Q58 176 60 204" strokeWidth="44" />
        <path d="M76 170 Q76 150 96 148 L144 148 Q164 150 164 170 L166 212 Q166 222 156 222 L84 222 Q74 222 74 212 Z" fill="#FBF6EC" strokeWidth="18" />
        <rect x="46" y="80" width="18" height="34" rx="9" fill="#FBF6EC" strokeWidth="16" />
        <rect x="176" y="80" width="18" height="34" rx="9" fill="#FBF6EC" strokeWidth="16" />
        <circle cx="120" cy="96" r="64" fill="#FBF6EC" strokeWidth="18" />
      </g>

      <line x1="152" y1="44" x2="164" y2="20" stroke="#1C1B2E" strokeWidth="5" strokeLinecap="round" />
      <circle cx="165" cy="18" r="7" fill="#FFC24B" stroke="#1C1B2E" strokeWidth="4" />

      <path d="M80 160 Q58 176 60 204" stroke="#1C1B2E" strokeWidth="28" strokeLinecap="round" />
      <path d="M80 160 Q58 176 60 204" stroke="#FBF6EC" strokeWidth="18" strokeLinecap="round" />
      <circle cx="60" cy="206" r="11" fill="#FF8A3D" stroke="#1C1B2E" strokeWidth="5" />

      <path d="M76 170 Q76 150 96 148 L144 148 Q164 150 164 170 L166 212 Q166 222 156 222 L84 222 Q74 222 74 212 Z" fill="#FBF6EC" stroke="#1C1B2E" strokeWidth="6" strokeLinejoin="round" />
      <path d="M78 205 L162 205" stroke="#1C1B2E" strokeWidth="4" strokeLinecap="round" />
      <rect x="99" y="172" width="42" height="24" rx="7" fill="#1B2550" stroke="#1C1B2E" strokeWidth="4" />
      <circle cx="110" cy="184" r="4.5" fill="#FF8A3D" />
      <circle cx="122" cy="184" r="4.5" fill="#8EC5FF" />
      <rect x="129" y="180" width="8" height="8" rx="2" fill="#5BE3A4" />

      <g className="cosmo-wave">
        <path d="M160 160 Q204 152 212 100" stroke="#FBF6EC" strokeWidth="44" strokeLinecap="round" />
        <circle cx="214" cy="84" r="17" fill="#FBF6EC" stroke="#FBF6EC" strokeWidth="18" />
        <path d="M160 160 Q204 152 212 100" stroke="#1C1B2E" strokeWidth="28" strokeLinecap="round" />
        <path d="M160 160 Q204 152 212 100" stroke="#FBF6EC" strokeWidth="18" strokeLinecap="round" />
        <circle cx="214" cy="84" r="15" fill="#FF8A3D" stroke="#1C1B2E" strokeWidth="5" />
        <ellipse cx="199" cy="91" rx="6" ry="7" fill="#FF8A3D" stroke="#1C1B2E" strokeWidth="4" />
        <path d="M209 73 L209 81 M217 71 L217 80 M225 75 L223 83" stroke="#1C1B2E" strokeWidth="3" strokeLinecap="round" />
        <path d="M238 66 Q247 78 240 92" stroke="#FFC24B" strokeWidth="5" strokeLinecap="round" />
        <path d="M249 58 Q261 78 251 98" stroke="#FFC24B" strokeWidth="5" strokeLinecap="round" />
      </g>

      <rect x="48" y="82" width="14" height="30" rx="7" fill="#FF8A3D" stroke="#1C1B2E" strokeWidth="4" />
      <rect x="178" y="82" width="14" height="30" rx="7" fill="#FF8A3D" stroke="#1C1B2E" strokeWidth="4" />
      <circle cx="120" cy="96" r="62" fill="#FBF6EC" stroke="#1C1B2E" strokeWidth="6" />
      <ellipse cx="120" cy="100" rx="46" ry="40" fill="#1B2550" stroke="#1C1B2E" strokeWidth="5" />
      <path d="M86 86 Q92 68 110 63" stroke="#8EC5FF" strokeWidth="5" strokeLinecap="round" opacity="0.85" />
      <circle cx="148" cy="72" r="3.5" fill="#8EC5FF" opacity="0.85" />

      <ellipse cx="104" cy="100" rx="6" ry="8" fill="#FBF6EC" />
      <ellipse cx="136" cy="100" rx="6" ry="8" fill="#FBF6EC" />
      <circle cx="106" cy="97" r="2" fill="#1B2550" />
      <circle cx="138" cy="97" r="2" fill="#1B2550" />
      <circle cx="92" cy="116" r="6" fill="#FF8A7A" opacity="0.7" />
      <circle cx="148" cy="116" r="6" fill="#FF8A7A" opacity="0.7" />
      <path d="M106 116 Q120 130 134 116" stroke="#FBF6EC" strokeWidth="5" strokeLinecap="round" />

      <path d="M34 32 Q34 44 46 44 Q34 44 34 56 Q34 44 22 44 Q34 44 34 32 Z" fill="#FFC24B" />
      <path d="M206 186 Q206 196 216 196 Q206 196 206 206 Q206 196 196 196 Q206 196 206 186 Z" fill="#FF8A3D" />
      <path d="M26 142 Q26 149 33 149 Q26 149 26 156 Q26 149 19 149 Q26 149 26 142 Z" fill="#8EC5FF" />
      <path d="M236 136 Q236 144 244 144 Q236 144 236 152 Q236 144 228 144 Q236 144 236 136 Z" fill="#FFC24B" />
    </svg>
  )
}
