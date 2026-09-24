'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return

    const version = encodeURIComponent(process.env.NEXT_PUBLIC_BUILD_ID || 'dev')
    navigator.serviceWorker.register(`/sw.js?v=${version}`, { scope: '/' }).catch(() => {
      // The website remains fully usable when installation is unavailable.
    })
  }, [])

  return null
}
