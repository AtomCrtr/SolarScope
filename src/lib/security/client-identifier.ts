function firstHeaderValue(headers: Headers, names: string[]): string | null {
  for (const name of names) {
    const value = headers.get(name)?.split(',')[0]?.trim()
    if (value) return value
  }
  return null
}

/**
 * Network identifier used as the rate-limit key. On Vercel, `x-vercel-forwarded-for`
 * is set by the platform and cannot be spoofed by the client, so it takes priority.
 */
export function getClientIdentifier(request: Request): string | null {
  const headerNames = process.env.VERCEL === '1'
    ? ['x-vercel-forwarded-for', 'x-forwarded-for', 'x-real-ip']
    : ['x-forwarded-for', 'x-real-ip']
  return firstHeaderValue(request.headers, headerNames)
}
