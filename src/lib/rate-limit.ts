interface RateLimitEntry {
  count: number
  resetAt: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfter: number
}

declare global {
  var solarScopeRateLimits: Map<string, RateLimitEntry> | undefined
}

const buckets = globalThis.solarScopeRateLimits ?? new Map<string, RateLimitEntry>()
globalThis.solarScopeRateLimits = buckets

export function checkRateLimit(
  key: string,
  limit = 8,
  windowMs = 60_000,
  now = Date.now(),
): RateLimitResult {
  const current = buckets.get(key)

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, retryAfter: 0 }
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1_000)),
    }
  }

  current.count += 1
  return { allowed: true, remaining: limit - current.count, retryAfter: 0 }
}

export function resetRateLimitsForTests() {
  buckets.clear()
}
