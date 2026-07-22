import { ImageResponse } from 'next/og'

export const alt = 'SolarScope — L’espace expliqué aux enfants'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', padding: '72px 80px', color: '#f8fafc',
          background: 'radial-gradient(circle at 82% 25%, #273170 0%, #090a22 36%, #03040d 72%)',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 28, fontWeight: 700 }}>
          <div style={{ width: 46, height: 46, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#7161ef' }}>S</div>
          SolarScope
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: '#9ca8ff', fontSize: 22, letterSpacing: 5, textTransform: 'uppercase' }}>Pour les 8–12 ans</div>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 18, fontSize: 82, lineHeight: 0.95, fontWeight: 800, letterSpacing: -4 }}>
            <span>L’espace,</span>
            <span>enfin facile.</span>
          </div>
        </div>
        <div style={{ color: '#8a96ad', fontSize: 21 }}>Missions courtes · Lecture audio · Sources scientifiques</div>
      </div>
    ),
    size,
  )
}
