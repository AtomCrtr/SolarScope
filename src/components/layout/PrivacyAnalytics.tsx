'use client'

import { Analytics, type BeforeSendEvent } from '@vercel/analytics/next'

// Cookieless page counts only. Query strings and #fragments are dropped: they can hold a rounded
// position (?lat=) or a passport code (#code=), which have nothing to do in visit statistics.
function keepPathOnly(event: BeforeSendEvent): BeforeSendEvent {
  const url = new URL(event.url)
  return { ...event, url: `${url.origin}${url.pathname}` }
}

export default function PrivacyAnalytics() {
  return <Analytics beforeSend={keepPathOnly} />
}
