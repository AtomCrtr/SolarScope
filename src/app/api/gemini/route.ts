import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

interface Message {
    role: 'user' | 'bot'
    text: string
}

type GeminiMode = 'chat' | 'story'

export async function POST(req: NextRequest) {
    if (!GEMINI_API_KEY) {
        return NextResponse.json(
            { error: 'Clé API Gemini non configurée côté serveur.' },
            { status: 500 }
        )
    }

    const body = await req.json().catch(() => null)
    const { question, history = [], mode = 'chat' } = (body ?? {}) as {
        question?: string
        history?: Message[]
        mode?: GeminiMode
    }

    const trimmedQuestion = question?.trim() ?? ''

    if (!trimmedQuestion) {
        return NextResponse.json({ error: 'Question vide.' }, { status: 400 })
    }

    if (trimmedQuestion.length > 4000) {
        return NextResponse.json({ error: 'Question trop longue.' }, { status: 400 })
    }

    const safeHistory = Array.isArray(history) ? history : []

    const systemPrompt = mode === 'story'
        ? `Tu es SolarBot, conteur spatial pour enfants 8-12 ans.
Tu écris des histoires spatiales éducatives, poétiques et scientifiquement prudentes.
Réponds toujours en français, en 180 à 220 mots maximum.`
        : `Tu es SolarBot, assistant spatial pour enfants 7-14 ans.
Tu expliques l'espace simplement, avec des emojis et des phrases courtes.
Réponds toujours en français, max 3-4 phrases.`

    const histCtx = safeHistory
        .slice(-4)
        .filter((m: Message) => m?.text && (m.role === 'user' || m.role === 'bot'))
        .map((m: Message) => `${m.role === 'user' ? 'Enfant' : 'SolarBot'}: ${m.text.slice(0, 1000)}`)
        .join('\n')

    const fullPrompt = `${systemPrompt}\n\n${histCtx}\n\nEnfant: ${trimmedQuestion}\nSolarBot:`

    try {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: fullPrompt }] }],
                    generationConfig: { temperature: mode === 'story' ? 0.9 : 0.8, maxOutputTokens: mode === 'story' ? 700 : 300 },
                }),
            }
        )

        if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            console.error('[Gemini API error]', res.status, err)

            if (res.status === 429) {
                return NextResponse.json({ error: '⏳ Limite de requêtes atteinte. Réessaie dans quelques minutes !' }, { status: 429 })
            }
            if (res.status === 403) {
                return NextResponse.json({ error: '🔑 Clé API Gemini invalide ou désactivée.' }, { status: 403 })
            }
            return NextResponse.json({ error: '🤖 Erreur API Gemini. Réessaie !' }, { status: 502 })
        }

        const data = await res.json()
        const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '🤖 Réessaie !'
        return NextResponse.json({ text })
    } catch (err) {
        console.error('[Gemini fetch error]', err)
        return NextResponse.json({ error: '🌐 Erreur de connexion. Réessaie !' }, { status: 500 })
    }
}
