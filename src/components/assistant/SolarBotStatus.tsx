'use client'

import { useCallback, useEffect, useState } from 'react'

export type SolarBotRuntimeStatus = 'checking' | 'available' | 'fallback' | 'unavailable'

const STATUS_COPY: Record<SolarBotRuntimeStatus, { label: string; detail: string }> = {
  checking: { label: 'Vérification…', detail: 'Vérification de Gemini' },
  available: { label: 'Gemini disponible', detail: 'Les réponses utilisent Gemini' },
  fallback: { label: 'Mode de secours', detail: 'Réponses limitées à partir de repères vérifiés' },
  unavailable: { label: 'Indisponible', detail: 'SolarBot ne peut pas répondre pour le moment' },
}

export function useSolarBotStatus() {
  const [status, setStatus] = useState<SolarBotRuntimeStatus>('checking')

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/health', { signal: controller.signal, cache: 'no-store' })
      .then(async response => response.json() as Promise<{ sources?: { gemini?: boolean } }>)
      .then(payload => setStatus(payload.sources?.gemini ? 'available' : 'fallback'))
      .catch(error => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setStatus('unavailable')
      })
    return () => controller.abort()
  }, [])

  const updateFromAnswer = useCallback((answerStatus: Exclude<SolarBotRuntimeStatus, 'checking'>) => {
    setStatus(answerStatus)
  }, [])

  return { status, updateFromAnswer }
}

export default function SolarBotStatus({ status, compact = false }: { status: SolarBotRuntimeStatus; compact?: boolean }) {
  const copy = STATUS_COPY[status]
  return (
    <span
      className={`solarbot-runtime-status is-${status}${compact ? ' is-compact' : ''}`}
      role="status"
      title={copy.detail}
    >
      <span aria-hidden="true" />
      {copy.label}
    </span>
  )
}
