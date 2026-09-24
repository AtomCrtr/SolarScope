'use client'

import { Fragment, useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SolarBotSourceLinks, { SolarBotReliabilityNote } from '@/components/assistant/SolarBotSourceLinks'
import type { PublicSolarBotSource } from '@/lib/content/solarbot-sources'
import SolarBotStatus, { type SolarBotRuntimeStatus, useSolarBotStatus } from '@/components/assistant/SolarBotStatus'

interface Message {
    role: 'user' | 'bot'
    text: string
    sources?: PublicSolarBotSource[]
    degraded?: boolean
}

type SolarBotAnswer = { text: string; sources: PublicSolarBotSource[]; degraded: boolean; status: Exclude<SolarBotRuntimeStatus, 'checking'> }

const QUICK_QUESTIONS = [
    'Pourquoi les étoiles brillent ?',
    "C'est quoi un trou noir ?",
    'Vie sur Mars ?',
    'Combien de planètes ?',
]

async function askSolarBot(question: string, history: Message[]): Promise<SolarBotAnswer> {
    try {
        const res = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question, history }),
        })
        const data = await res.json()
        if (!res.ok) return { text: data.error ?? '🤖 Réessaie !', sources: [], degraded: true, status: 'unavailable' }
        const degraded = Boolean(data.degraded)
        return { text: data.text ?? '🤖 Réessaie !', sources: Array.isArray(data.sources) ? data.sources : [], degraded, status: degraded ? 'fallback' : 'available' }
    } catch {
        return { text: '🌐 Erreur de connexion. Réessaie !', sources: [], degraded: true, status: 'unavailable' }
    }
}

function FormattedText({ text }: { text: string }) {
    return (
        <>
            {text.split('\n').map((line, lineIndex) => (
                <Fragment key={`${lineIndex}-${line}`}>
                    {lineIndex > 0 && <br />}
                    {line.split(/(\*\*[^*]+\*\*)/g).map((part, partIndex) => (
                        part.startsWith('**') && part.endsWith('**')
                            ? <strong key={partIndex}>{part.slice(2, -2)}</strong>
                            : <Fragment key={partIndex}>{part}</Fragment>
                    ))}
                </Fragment>
            ))}
        </>
    )
}

export default function SolarBotWidget() {
    const { status, updateFromAnswer } = useSolarBotStatus()
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', text: "👋 Salut ! Je suis SolarBot 🚀\nPose-moi n'importe quelle question sur l'espace !" }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [pulse, setPulse] = useState(true)
    const bottomRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, open])

    useEffect(() => {
        if (!open) return
        inputRef.current?.focus()
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpen(false)
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [open])

    const send = async (text?: string) => {
        const q = (text || input).trim()
        if (!q || loading) return
        setInput('')
        const userMsg: Message = { role: 'user', text: q }
        setMessages(prev => [...prev, userMsg])
        setLoading(true)
        const answer = await askSolarBot(q, messages)
        updateFromAnswer(answer.status)
        setMessages(prev => [...prev, { role: 'bot', text: answer.text, sources: answer.sources, degraded: answer.degraded }])
        setLoading(false)
    }

    return (
        <>
            {/* Floating bubble button */}
            <div className="solarbot-launcher" style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 1000 }}>
                <AnimatePresence>
                    {!open && pulse && (
                        <motion.div className="solarbot-tip"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            style={{
                                position: 'absolute', bottom: '110%', right: 0, marginBottom: '0.5rem',
                                background: 'rgba(11,16,38,0.96)', border: '1px solid var(--orbit)',
                                backdropFilter: 'blur(12px)', borderRadius: '0.75rem', padding: '0.625rem 0.875rem',
                                whiteSpace: 'nowrap', color: 'var(--text)', fontSize: '0.8rem', fontWeight: 500,
                            }}
                        >
                            🤖 Pose-moi une question !
                            <div style={{ position: 'absolute', bottom: -6, right: 20, width: 12, height: 12, background: 'rgba(11,16,38,0.96)', transform: 'rotate(45deg)', borderRight: '1px solid var(--orbit)', borderBottom: '1px solid var(--orbit)' }} />
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button className="solarbot-toggle"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        setOpen(!open)
                        if (!open) setPulse(false)
                    }}
                    style={{
                        width: 58, height: 58, borderRadius: '50%',
                        background: 'var(--sun)',
                        border: 'none', cursor: 'pointer', fontSize: '1.6rem',
                        boxShadow: '0 6px 24px rgba(255,138,61,0.35), 0 4px 20px rgba(0,0,0,0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative',
                    }}
                    aria-label={open ? 'Fermer SolarBot' : 'Ouvrir SolarBot'}
                    aria-expanded={open}
                    aria-controls="solarbot-dialog"
                >
                    {open ? '✕' : '🤖'}
                    {pulse && !open && (
                        <span style={{
                            position: 'absolute', top: 0, right: 0, width: 16, height: 16, borderRadius: '50%',
                            background: '#10b981', border: '2px solid var(--bg)',
                            animation: 'ping 1.5s ease-in-out infinite',
                        }} />
                    )}
                </motion.button>
            </div>

            {/* Chat panel */}
            <AnimatePresence>
                {open && (
                    <motion.div className="solarbot-dialog"
                        id="solarbot-dialog"
                        role="dialog"
                        aria-label="Discussion avec SolarBot"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        style={{
                            position: 'fixed', bottom: '5.5rem', right: '1.5rem', zIndex: 999,
                            width: 340, maxWidth: 'calc(100vw - 2rem)',
                            background: 'rgba(11,16,38,0.97)',
                            border: '1px solid var(--orbit)',
                            backdropFilter: 'blur(24px)',
                            borderRadius: '1.25rem',
                            boxShadow: '0 12px 48px rgba(0,0,0,0.6)',
                            overflow: 'hidden',
                            display: 'flex', flexDirection: 'column',
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '0.875rem 1rem',
                            background: 'var(--card-2)',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                            display: 'flex', alignItems: 'center', gap: '0.625rem',
                        }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: '50%',
                                background: 'var(--sun)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
                                flexShrink: 0,
                            }}>🤖</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'var(--font-display)' }}>SolarBot</div>
                                <SolarBotStatus status={status} compact />
                            </div>
                            <button onClick={() => setMessages([messages[0]])} aria-label="Effacer la conversation" title="Effacer" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', padding: '4px' }}>🗑</button>
                        </div>

                        <p id="solarbot-privacy-tip" style={{ padding: '0.55rem 0.875rem', color: '#bfdbfe', background: 'rgba(14,165,233,0.08)', borderBottom: '1px solid rgba(125,211,252,0.14)', fontSize: '0.7rem', lineHeight: 1.45 }}>
                            <span aria-hidden="true">🔒 </span>Garde ton nom, ton école, ton adresse, ton téléphone et ton e-mail pour toi.
                        </p>

                        {/* Messages */}
                        <div aria-live="polite" aria-busy={loading} style={{ flex: 1, overflowY: 'auto', padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.625rem', maxHeight: 280 }}>
                            {messages.map((msg, i) => (
                                <div key={i} style={{ display: 'flex', gap: '0.5rem', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                    {msg.role === 'bot' && (
                                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--sun)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0 }}>🤖</div>
                                    )}
                                    <div style={{ maxWidth: '80%' }}>
                                        <div style={{
                                            padding: '0.5rem 0.75rem',
                                            borderRadius: msg.role === 'user' ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
                                            background: msg.role === 'user' ? '#2a3566' : 'rgba(255,255,255,0.06)',
                                            border: msg.role === 'bot' ? '1px solid rgba(255,255,255,0.06)' : 'none',
                                            color: 'var(--text)', fontSize: '0.82rem', lineHeight: 1.65,
                                        }}><FormattedText text={msg.text} /></div>
                                        {msg.role === 'bot' && <SolarBotReliabilityNote degraded={msg.degraded} compact />}
                                        {msg.role === 'bot' && <SolarBotSourceLinks sources={msg.sources} compact />}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--sun)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>🤖</div>
                                    <div style={{ padding: '0.625rem 0.875rem', borderRadius: '1rem 1rem 1rem 0', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                        <div style={{ display: 'flex', gap: 4 }}>
                                            {[0, 1, 2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--sun)', display: 'inline-block', animation: `botBounce 1s ${i * 0.15}s ease-in-out infinite` }} />)}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={bottomRef} />
                        </div>

                        {/* Quick questions */}
                        <div style={{ padding: '0.5rem 0.875rem', display: 'flex', gap: '0.375rem', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                            {QUICK_QUESTIONS.map(q => (
                                <button key={q} onClick={() => send(q)} disabled={loading} style={{
                                    padding: '0.3rem 0.625rem', borderRadius: 999, fontSize: '0.7rem', cursor: 'pointer',
                                    background: 'var(--card-2)', color: 'var(--nebula)',
                                    border: '1px solid var(--orbit)', fontWeight: 500,
                                }}>{q}</button>
                            ))}
                        </div>

                        {/* Input area */}
                        <div style={{ padding: '0.625rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '0.5rem' }}>
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && send()}
                                placeholder="Ta question sur l'espace..."
                                aria-label="Question pour SolarBot"
                                aria-describedby="solarbot-privacy-tip"
                                maxLength={1000}
                                disabled={loading}
                                style={{
                                    flex: 1, padding: '0.5rem 0.75rem', borderRadius: 10, fontSize: '0.82rem',
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
                                    color: 'var(--text)', outline: 'none',
                                }}
                            />
                            <button aria-label="Envoyer la question" onClick={() => send()} disabled={loading || !input.trim()} style={{
                                width: 36, height: 36, borderRadius: 10, background: 'var(--sun)',
                                border: 'none', cursor: 'pointer', fontSize: '0.9rem', opacity: loading || !input.trim() ? 0.5 : 1,
                            }}>🚀</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
        @keyframes ping { 0% { transform: scale(1); opacity: 1; } 75%, 100% { transform: scale(1.8); opacity: 0; } }
        @keyframes botBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
      `}</style>
        </>
    )
}
