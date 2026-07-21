'use client'

import { Fragment, useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
    role: 'user' | 'bot'
    text: string
}

const QUICK_QUESTIONS = [
    'Pourquoi les étoiles brillent ?',
    "C'est quoi un trou noir ?",
    'Vie sur Mars ?',
    'Combien de planètes ?',
]

async function askSolarBot(question: string, history: Message[]): Promise<string> {
    try {
        const res = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question, history }),
        })
        const data = await res.json()
        if (!res.ok) return data.error ?? '🤖 Réessaie !'
        return data.text ?? '🤖 Réessaie !'
    } catch {
        return '🌐 Erreur de connexion. Réessaie !'
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
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', text: "👋 Salut ! Je suis SolarBot 🚀\nPose-moi n'importe quelle question sur l'espace !" }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [pulse, setPulse] = useState(true)
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (open) { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); setPulse(false) }
    }, [messages, open])

    const send = async (text?: string) => {
        const q = (text || input).trim()
        if (!q || loading) return
        setInput('')
        const userMsg: Message = { role: 'user', text: q }
        setMessages(prev => [...prev, userMsg])
        setLoading(true)
        const answer = await askSolarBot(q, messages)
        setMessages(prev => [...prev, { role: 'bot', text: answer }])
        setLoading(false)
    }

    return (
        <>
            {/* Floating bubble button */}
            <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 1000 }}>
                <AnimatePresence>
                    {!open && pulse && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            style={{
                                position: 'absolute', bottom: '110%', right: 0, marginBottom: '0.5rem',
                                background: 'rgba(4,4,15,0.95)', border: '1px solid rgba(139,92,246,0.3)',
                                backdropFilter: 'blur(12px)', borderRadius: '0.75rem', padding: '0.625rem 0.875rem',
                                whiteSpace: 'nowrap', color: '#e2e8f0', fontSize: '0.8rem', fontWeight: 500,
                            }}
                        >
                            🤖 Pose-moi une question !
                            <div style={{ position: 'absolute', bottom: -6, right: 20, width: 12, height: 12, background: 'rgba(4,4,15,0.95)', transform: 'rotate(45deg)', borderRight: '1px solid rgba(139,92,246,0.3)', borderBottom: '1px solid rgba(139,92,246,0.3)' }} />
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOpen(!open)}
                    style={{
                        width: 58, height: 58, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        border: 'none', cursor: 'pointer', fontSize: '1.6rem',
                        boxShadow: '0 0 30px rgba(99,102,241,0.6), 0 4px 20px rgba(0,0,0,0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative',
                    }}
                    aria-label="SolarBot"
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
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        style={{
                            position: 'fixed', bottom: '5.5rem', right: '1.5rem', zIndex: 999,
                            width: 340, maxWidth: 'calc(100vw - 2rem)',
                            background: 'rgba(4,4,15,0.97)',
                            border: '1px solid rgba(139,92,246,0.3)',
                            backdropFilter: 'blur(24px)',
                            borderRadius: '1.25rem',
                            boxShadow: '0 8px 60px rgba(0,0,0,0.8), 0 0 40px rgba(99,102,241,0.2)',
                            overflow: 'hidden',
                            display: 'flex', flexDirection: 'column',
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '0.875rem 1rem',
                            background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                            display: 'flex', alignItems: 'center', gap: '0.625rem',
                        }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: '50%',
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
                                flexShrink: 0,
                            }}>🤖</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'Outfit, sans-serif' }}>SolarBot</div>
                                <div style={{ color: '#10b981', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                                    En ligne · Propulsé par Gemini
                                </div>
                            </div>
                            <button onClick={() => setMessages([messages[0]])} title="Effacer" style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '0.8rem', padding: '4px' }}>🗑</button>
                        </div>

                        {/* Messages */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.625rem', maxHeight: 280 }}>
                            {messages.map((msg, i) => (
                                <div key={i} style={{ display: 'flex', gap: '0.5rem', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                    {msg.role === 'bot' && (
                                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0 }}>🤖</div>
                                    )}
                                    <div style={{
                                        maxWidth: '80%', padding: '0.5rem 0.75rem',
                                        borderRadius: msg.role === 'user' ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
                                        background: msg.role === 'user' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.06)',
                                        border: msg.role === 'bot' ? '1px solid rgba(255,255,255,0.06)' : 'none',
                                        color: '#e2e8f0', fontSize: '0.82rem', lineHeight: 1.65,
                                    }}><FormattedText text={msg.text} /></div>
                                </div>
                            ))}
                            {loading && (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>🤖</div>
                                    <div style={{ padding: '0.625rem 0.875rem', borderRadius: '1rem 1rem 1rem 0', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                        <div style={{ display: 'flex', gap: 4 }}>
                                            {[0, 1, 2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#8b5cf6', display: 'inline-block', animation: `botBounce 1s ${i * 0.15}s ease-in-out infinite` }} />)}
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
                                    background: 'rgba(139,92,246,0.08)', color: '#c084fc',
                                    border: '1px solid rgba(139,92,246,0.18)', fontWeight: 500,
                                }}>{q}</button>
                            ))}
                        </div>

                        {/* Input area */}
                        <div style={{ padding: '0.625rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '0.5rem' }}>
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && send()}
                                placeholder="Ta question sur l'espace..."
                                disabled={loading}
                                style={{
                                    flex: 1, padding: '0.5rem 0.75rem', borderRadius: 10, fontSize: '0.82rem',
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
                                    color: '#e2e8f0', outline: 'none',
                                }}
                            />
                            <button onClick={() => send()} disabled={loading || !input.trim()} style={{
                                width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
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
