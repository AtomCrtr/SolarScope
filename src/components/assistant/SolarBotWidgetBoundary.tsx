'use client'

import { usePagePath } from '@/components/layout/LanguageToggle'
import SolarBotWidget from '@/components/assistant/SolarBotWidget'

export default function SolarBotWidgetBoundary() {
  const pathname = usePagePath()
  return pathname === '/solarbot' || pathname.startsWith('/solarbot/') ? null : <SolarBotWidget />
}
