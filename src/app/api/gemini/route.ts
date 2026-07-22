import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite'
const MAX_BODY_BYTES = 32_000

interface Message {
  role: 'user' | 'bot'
  text: string
}

type GeminiMode = 'chat' | 'story'

function clientIdentifier(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'anonymous'
}

function fallbackAnswer(question: string, mode: GeminiMode): string {
  if (mode === 'story') {
    return 'SolarBot recharge ses circuits. En attendant, imagine une petite sonde quittant la Terre, saluant la Lune puis suivant la lumière du Soleil. Elle découvre que chaque planète est un monde différent et rapporte une idée essentielle : dans l’espace, la curiosité est le meilleur moteur. 🚀'
  }

  const value = question.toLowerCase()
  if (/soleil|étoile/.test(value)) return 'Le Soleil est l’étoile au centre de notre système. Sa lumière met environ 8 minutes et 20 secondes pour atteindre la Terre. ☀️'
  if (/mars|perseverance|curiosity/.test(value)) return 'Mars est une planète rocheuse froide, reconnaissable à l’oxyde de fer de son sol. Curiosity et Perseverance y étudient son histoire et son potentiel passé pour la vie. 🔴'
  if (/iss|station spatiale/.test(value)) return 'L’ISS est un laboratoire habité qui tourne autour de la Terre à environ 400 km d’altitude. Elle effectue presque 16 orbites par jour. 🛰️'
  if (/trou noir/.test(value)) return 'Un trou noir est une région où la gravité est si intense que la lumière ne peut plus s’échapper au-delà de son horizon. On le détecte grâce à ses effets sur la matière voisine. ⚫'
  if (/lune/.test(value)) return 'La Lune est le satellite naturel de la Terre. Elle nous présente presque toujours la même face et accomplit un tour autour de la Terre en environ 27 jours. 🌕'
  return 'SolarBot est momentanément limité, mais les pages de SolarScope restent disponibles. Essaie une question sur le Soleil, Mars, la Lune, l’ISS ou les trous noirs. 🔭'
}

async function wait(milliseconds: number) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds))
}

async function requestGemini(payload: unknown): Promise<Response> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent`

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY || '',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20_000),
      cache: 'no-store',
    })

    if (response.ok || (response.status !== 429 && response.status < 500)) return response
    if (attempt === 0) {
      const retryAfter = Number(response.headers.get('retry-after'))
      await wait(Number.isFinite(retryAfter) ? Math.min(retryAfter * 1_000, 3_000) : 750)
    }
  }

  throw new Error('Gemini temporarily unavailable')
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get('content-length') || 0)
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Requête trop volumineuse.' }, { status: 413 })
  }

  const rateLimit = checkRateLimit(`gemini:${clientIdentifier(request)}`)
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Trop de questions rapprochées. Réessaie dans un instant.' },
      {
        status: 429,
        headers: {
          'Cache-Control': 'no-store',
          'Retry-After': String(rateLimit.retryAfter),
          'X-RateLimit-Remaining': '0',
        },
      },
    )
  }

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Corps de requête invalide.' }, { status: 400 })
  }

  const record = body as Record<string, unknown>
  const question = typeof record.question === 'string' ? record.question.trim() : ''
  const mode: GeminiMode = record.mode === 'story' ? 'story' : 'chat'
  const history = Array.isArray(record.history) ? record.history : []

  if (!question) return NextResponse.json({ error: 'Question vide.' }, { status: 400 })
  if (question.length > 1_000) return NextResponse.json({ error: 'Question trop longue.' }, { status: 400 })

  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { text: fallbackAnswer(question, mode), degraded: true },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  }

  const systemPrompt = mode === 'story'
    ? 'Tu es SolarBot, conteur spatial pour enfants de 8 à 12 ans. Écris en français une histoire éducative, poétique et scientifiquement prudente de 180 à 220 mots. Ne demande jamais de donnée personnelle.'
    : 'Tu es SolarBot, assistant spatial pour enfants de 7 à 14 ans. Explique en français avec des phrases courtes, au maximum quatre phrases. Signale clairement les incertitudes et ne demande jamais de donnée personnelle.'

  const safeHistory = history
    .slice(-4)
    .filter((item): item is Message => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) return false
      const candidate = item as Record<string, unknown>
      return (candidate.role === 'user' || candidate.role === 'bot') && typeof candidate.text === 'string'
    })
    .map((message) => ({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: message.text.slice(0, 600) }],
    }))

  const payload = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents: [...safeHistory, { role: 'user', parts: [{ text: question }] }],
    generationConfig: {
      temperature: mode === 'story' ? 0.85 : 0.65,
      maxOutputTokens: mode === 'story' ? 700 : 300,
    },
    safetySettings: [
      'HARM_CATEGORY_HARASSMENT',
      'HARM_CATEGORY_HATE_SPEECH',
      'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      'HARM_CATEGORY_DANGEROUS_CONTENT',
    ].map((category) => ({ category, threshold: 'BLOCK_MEDIUM_AND_ABOVE' })),
  }

  try {
    const response = await requestGemini(payload)
    if (!response.ok) {
      return NextResponse.json(
        { text: fallbackAnswer(question, mode), degraded: true },
        { headers: { 'Cache-Control': 'no-store', 'X-SolarBot-Mode': 'fallback' } },
      )
    }

    const data = await response.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    }
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    return NextResponse.json(
      { text: text || fallbackAnswer(question, mode), degraded: !text },
      {
        headers: {
          'Cache-Control': 'no-store',
          'X-RateLimit-Remaining': String(rateLimit.remaining),
        },
      },
    )
  } catch {
    return NextResponse.json(
      { text: fallbackAnswer(question, mode), degraded: true },
      { headers: { 'Cache-Control': 'no-store', 'X-SolarBot-Mode': 'fallback' } },
    )
  }
}
