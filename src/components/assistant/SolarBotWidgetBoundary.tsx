'use client'

import { usePathname } from 'next/navigation'
import SolarBotWidget from '@/components/assistant/SolarBotWidget'

export default function SolarBotWidgetBoundary() {
  const pathname = usePathname()
  return pathname === '/solarbot' || pathname.startsWith('/solarbot/') ? null : <SolarBotWidget />
}
