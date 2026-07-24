import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

interface RateLimitEntry {
  count: number
  resetAt: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfter: number
}

export interface DistributedRateLimitResult extends RateLimitResult {
  provider: 'upstash' | 'local'
  unavailable: boolean
}

interface DistributedRateLimitOptions {
  namespace: string
  limit: number
  windowSeconds: number
}

declare global {
  var solarScopeRateLimits: Map<string, RateLimitEntry> | undefined
}

const buckets = globalThis.solarScopeRateLimits ?? new Map<string, RateLimitEntry>()
globalThis.solarScopeRateLimits = buckets

const sharedLimiters = new Map<string, Ratelimit>()

function getSharedRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

function getSharedLimiter(options: DistributedRateLimitOptions) {
  const cacheKey = `${options.namespace}:${options.limit}:${options.windowSeconds}`
  const existing = sharedLimiters.get(cacheKey)
  if (existing) return existing

  const redis = getSharedRedis()
  if (!redis) return null

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(options.limit, `${options.windowSeconds} s`),
    prefix: `solarscope:rate-limit:${options.namespace}`,
    analytics: false,
    timeout: 1_000,
  })
  sharedLimiters.set(cacheKey, limiter)
  return limiter
}

function unavailableRateLimit(): DistributedRateLimitResult {
  return { allowed: false, remaining: 0, retryAfter: 60, provider: 'upstash', unavailable: true }
}

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

export async function checkDistributedRateLimit(
  key: string,
  options: DistributedRateLimitOptions,
): Promise<DistributedRateLimitResult> {
  const limiter = getSharedLimiter(options)
  if (!limiter) {
    if (process.env.VERCEL === '1') return unavailableRateLimit()
    return { ...checkRateLimit(key, options.limit, options.windowSeconds * 1_000), provider: 'local', unavailable: false }
  }

  try {
    const result = await limiter.limit(key)
    return {
      allowed: result.success,
      remaining: result.remaining,
      retryAfter: result.success ? 0 : Math.max(1, Math.ceil((result.reset - Date.now()) / 1_000)),
      provider: 'upstash',
      unavailable: false,
    }
  } catch {
    if (process.env.VERCEL === '1') return unavailableRateLimit()
    return { ...checkRateLimit(key, options.limit, options.windowSeconds * 1_000), provider: 'local', unavailable: false }
  }
}

export function resetRateLimitsForTests() {
  buckets.clear()
  sharedLimiters.clear()
}
