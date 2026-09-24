type MissionArtProps = {
  label: string
}

/** Sunlight hits the air and blue light scatters across the whole sky. */
export function SkyScatterArt({ label }: MissionArtProps) {
  return (
    <svg viewBox="0 0 300 260" fill="none" role="img" aria-label={label}>
      <path d="M-10 250 Q150 150 310 250" fill="#2F6FD6" />
      <path d="M-10 250 Q150 170 310 250" fill="#3F8B5B" />
      <path d="M-10 196 Q150 60 310 196" stroke="#5B9BF0" strokeWidth="3" strokeDasharray="4 7" />
      <circle cx="52" cy="58" r="30" fill="#FF8A3D" />
      <path d="M52 14v10M52 92v10M8 58h10M86 58h10M21 27l7 7M76 82l7 7M21 89l7-7M76 34l7-7" stroke="#FF8A3D" strokeWidth="4" strokeLinecap="round" />
      <path d="M84 76 L150 118" stroke="#FFC24B" strokeWidth="5" strokeLinecap="round" />
      <path d="M150 118 L128 92 M150 118 L178 96 M150 118 L186 126 M150 118 L160 150 M150 118 L118 132" stroke="#8EC5FF" strokeWidth="4" strokeLinecap="round" />
      <circle cx="150" cy="118" r="7" fill="#EEF1FA" />
      <circle cx="126" cy="88" r="4" fill="#8EC5FF" />
      <circle cx="182" cy="92" r="4" fill="#8EC5FF" />
      <circle cx="190" cy="127" r="4" fill="#8EC5FF" />
      <circle cx="114" cy="134" r="4" fill="#8EC5FF" />
    </svg>
  )
}

/** A planet crosses its star and the measured brightness dips. */
export function TransitArt({ label }: MissionArtProps) {
  return (
    <svg viewBox="0 0 300 260" fill="none" role="img" aria-label={label}>
      <circle cx="150" cy="86" r="58" fill="#FFC24B" />
      <circle cx="150" cy="86" r="70" stroke="#FFC24B" strokeWidth="3" strokeDasharray="3 9" opacity="0.7" />
      <circle cx="130" cy="96" r="13" fill="#141D42" />
      <path d="M92 96 H112" stroke="#1C1B2E" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 6" />
      <path d="M28 196 H250" stroke="#8A99C4" strokeWidth="2" />
      <path d="M28 176 H112 Q124 176 128 200 H172 Q176 176 188 176 H272" stroke="#8EC5FF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 150 V222" stroke="#8A99C4" strokeWidth="2" />
    </svg>
  )
}
