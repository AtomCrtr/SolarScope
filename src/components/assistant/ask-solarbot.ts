import type { PublicSolarBotSource } from '@/lib/content/solarbot-sources'
import type { SolarBotRuntimeStatus } from '@/components/assistant/SolarBotStatus'
import type { SiteLocale } from '@/lib/i18n/paths'

export type SolarBotMessage = { role: 'user' | 'bot'; text: string }
export type SolarBotAnswer = { text: string; sources: PublicSolarBotSource[]; degraded: boolean; status: Exclude<SolarBotRuntimeStatus, 'checking'> }

const FAILURES = {
  fr: { thinking: 'SolarBot réfléchit encore… Réessaie !', offline: 'Erreur de connexion. Vérifie ta connexion Internet et réessaie.' },
  en: { thinking: 'SolarBot is still thinking… Try again!', offline: 'Connection error. Check your internet connection and try again.' },
}

/** Sends the question with the page language: SolarBot then answers in French or in English. */
export async function askSolarBot(question: string, history: SolarBotMessage[], locale: SiteLocale, mode: 'chat' | 'story' = 'chat'): Promise<SolarBotAnswer> {
  const failures = FAILURES[locale]
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-SolarScope-Locale': locale },
      body: JSON.stringify({ question, history, mode }),
    })
    const data = await response.json()
    if (!response.ok) return { text: data.error ?? failures.thinking, sources: [], degraded: true, status: 'unavailable' }
    const degraded = Boolean(data.degraded)
    return { text: data.text ?? failures.thinking, sources: Array.isArray(data.sources) ? data.sources : [], degraded, status: degraded ? 'fallback' : 'available' }
  } catch {
    return { text: failures.offline, sources: [], degraded: true, status: 'unavailable' }
  }
}
