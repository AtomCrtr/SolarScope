const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash-lite'
const PROBE_TTL = 5 * 60 * 1_000

let cachedProbe: { available: boolean; checkedAt: number } | null = null

export function getGeminiConfig() {
  const apiKey = process.env.GEMINI_API_KEY
  const model = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`
  return { apiKey, model, endpoint }
}

export async function checkGeminiAvailability() {
  const now = Date.now()
  if (cachedProbe && now - cachedProbe.checkedAt < PROBE_TTL) return cachedProbe.available

  const { apiKey, endpoint } = getGeminiConfig()
  if (!apiKey) {
    cachedProbe = { available: false, checkedAt: now }
    return false
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'Réponds uniquement OK.' }] }],
        generationConfig: { temperature: 0, maxOutputTokens: 2 },
      }),
      signal: AbortSignal.timeout(5_000),
      cache: 'no-store',
    })
    const available = response.ok
    cachedProbe = { available, checkedAt: now }
    return available
  } catch {
    cachedProbe = { available: false, checkedAt: now }
    return false
  }
}
