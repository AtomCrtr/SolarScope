'use client'

import { Fragment, useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
    role: 'user' | 'bot'
    text: string
    time: string
}

const QUICK_QUESTIONS = [
    'Pourquoi les étoiles brillent-elles ?',
    'C\'est quoi un trou noir ?',
    'Y a-t-il de la vie sur Mars ?',
    'Comment fonctionne un télescope ?',
    'Qu\'est-ce qu\'une galaxie ?',
    'Pourquoi la Lune change de forme ?',
    'Combien de planètes dans le système solaire ?',
    'Comment naît une étoile ?',
]

const STORY_THEMES = [
    { emoji: '👨‍🚀', label: 'Premier pas sur la Lune', prompt: 'Raconte l\'histoire du premier pas de Neil Armstrong sur la Lune en 1969, comme si l\'enfant y était. Maximum 200 mots, style aventure pour enfants de 8-12 ans. Réponds en français.' },
    { emoji: '⚫', label: 'Voyage vers un trou noir', prompt: 'Raconte une histoire d\'un vaisseau spatial qui s\'approche d\'un trou noir. Explique ce qui se passe avec le temps et la lumière. Maximum 200 mots, pour enfants de 8-12 ans. En français.' },
    { emoji: '🔴', label: 'Découverte sur Mars', prompt: 'Raconte l\'histoire d\'un rover qui découvre quelque chose de surprenant sur Mars. Maximum 200 mots, pour enfants de 8-12 ans. En français.' },
    { emoji: '👽', label: 'Rencontre extraterrestre', prompt: 'Raconte l\'histoire d\'un premier contact avec des extraterrestres amicaux. Maximum 200 mots, pour enfants de 8-12 ans. En français.' },
    { emoji: '🌊', label: 'Mission sur Europe', prompt: 'Raconte l\'histoire d\'une mission pour explorer l\'océan sous la glace d\'Europe (lune de Jupiter). Maximum 200 mots, pour enfants de 8-12 ans. En français.' },
]

async function askSolarBot(question: string, history: Message[], mode: 'chat' | 'story' = 'chat'): Promise<string> {
    try {
        const res = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question, history, mode }),
        })
        const data = await res.json()
        if (!res.ok) return data.error ?? '🤖 SolarBot réfléchit encore... Réessaie !'
        return data.text ?? '🤖 SolarBot réfléchit encore... Réessaie !'
    } catch {
        return '🌐 Erreur de connexion. Vérifie ta connexion Internet et réessaie.'
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

export default function SolarBotPage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', text: '👋 Bonjour ! Je suis **SolarBot**, ton assistant spatial ! 🚀\n\nPose-moi n\'importe quelle question sur l\'espace, les planètes, les étoiles, les trous noirs... Je suis là pour tout expliquer de façon simple et amusante ! 🌟', time: 'maintenant' }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [tab, setTab] = useState<'chat' | 'story'>('chat')
    const [story, setStory] = useState('')
    const [storyLoading, setStoryLoading] = useState(false)
    const [selectedTheme, setSelectedTheme] = useState(0)
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, loading])

    const sendMessage = async (text?: string) => {
        const q = (text || input).trim()
        if (!q || loading) return
        setInput('')
        const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        const userMsg: Message = { role: 'user', text: q, time: now }
        setMessages(prev => [...prev, userMsg])
        setLoading(true)
        const answer = await askSolarBot(q, messages)
        setMessages(prev => [...prev, { role: 'bot', text: answer, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }])
        setLoading(false)
    }

    const generateStory = async () => {
        setStoryLoading(true)
        const answer = await askSolarBot(STORY_THEMES[selectedTheme].prompt, [], 'story')
        setStory(answer)
        setStoryLoading(false)
    }

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem', maxWidth: 860 }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="page-header">
                <div className="badge" style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa', borderColor: 'rgba(139,92,246,0.25)' }}>
                    🤖 PROPULSÉ PAR GOOGLE GEMINI AI
                </div>
                <h1 className="page-title" style={{ background: 'linear-gradient(135deg, #e9d5ff, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    SolarBot
                </h1>
                <p className="page-subtitle">Ton assistant spatial IA — questions, anecdotes et histoires sur l&apos;Univers !</p>
            </motion.div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '2rem' }}>
                {[{ id: 'chat', label: '💬 Chat' }, { id: 'story', label: '📖 Histoires IA' }].map(t => (
                    <button key={t.id} onClick={() => setTab(t.id as 'chat' | 'story')} style={{
                        padding: '0.6rem 1.5rem', borderRadius: 10, fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
                        background: tab === t.id ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.04)',
                        color: tab === t.id ? '#fff' : '#94a3b8',
                        border: tab === t.id ? 'none' : '1px solid rgba(255,255,255,0.07)',
                        boxShadow: tab === t.id ? '0 0 20px rgba(99,102,241,0.4)' : 'none',
                    }}>{t.label}</button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {tab === 'chat' ? (
                    <motion.div key="chat" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                        {/* Quick questions */}
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            {QUICK_QUESTIONS.map(q => (
                                <button key={q} onClick={() => sendMessage(q)} disabled={loading} style={{
                                    padding: '0.4rem 0.875rem', borderRadius: 999, fontSize: '0.78rem', cursor: 'pointer',
                                    background: 'rgba(139,92,246,0.08)', color: '#c084fc',
                                    border: '1px solid rgba(139,92,246,0.2)', fontWeight: 500,
                                    transition: 'all 0.15s',
                                }}>{q}</button>
                            ))}
                        </div>

                        {/* Chat window */}
                        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            {/* Messages */}
                            <div style={{ height: 420, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {messages.map((msg, i) => (
                                    <motion.div key={i}
                                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: '0.75rem', alignItems: 'flex-end' }}>
                                        <div style={{
                                            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                                            background: msg.role === 'bot' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'linear-gradient(135deg, #0f172a, #1e293b)',
                                            border: msg.role === 'bot' ? '2px solid rgba(99,102,241,0.4)' : '2px solid rgba(255,255,255,0.1)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem'
                                        }}>
                                            {msg.role === 'bot' ? '🤖' : '👦'}
                                        </div>
                                        <div style={{ maxWidth: '75%' }}>
                                            <div style={{
                                                padding: '0.875rem 1rem', borderRadius: msg.role === 'user' ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
                                                background: msg.role === 'user' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                                                border: msg.role === 'bot' ? '1px solid rgba(255,255,255,0.07)' : 'none',
                                                color: '#e2e8f0', fontSize: '0.88rem', lineHeight: 1.7,
                                            }}><FormattedText text={msg.text} /></div>
                                            <div style={{ fontSize: '0.68rem', color: '#475569', marginTop: '0.25rem', textAlign: msg.role === 'user' ? 'right' : 'left' }}>{msg.time}</div>
                                        </div>
                                    </motion.div>
                                ))}
                                {loading && (
                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🤖</div>
                                        <div style={{ padding: '0.875rem 1rem', borderRadius: '1rem 1rem 1rem 0', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                            <div style={{ display: 'flex', gap: 4 }}>
                                                {[0, 1, 2].map(i => (
                                                    <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#8b5cf6', display: 'inline-block', animation: `bounce 1s ${i * 0.15}s infinite` }} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={bottomRef} />
                            </div>

                            {/* Input */}
                            <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: '0.75rem' }}>
                                <input
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                                    placeholder="Pose ta question sur l'espace..."
                                    disabled={loading}
                                    style={{
                                        flex: 1, padding: '0.75rem 1rem', borderRadius: 12, fontSize: '0.9rem',
                                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#e2e8f0', outline: 'none',
                                    }}
                                />
                                <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{
                                    padding: '0.75rem 1.25rem', borderRadius: 12, fontWeight: 700,
                                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                    color: 'white', border: 'none', cursor: 'pointer', fontSize: '1rem',
                                    opacity: loading || !input.trim() ? 0.5 : 1,
                                }}>🚀</button>
                                {messages.length > 1 && (
                                    <button onClick={() => setMessages([messages[0]])} title="Effacer" style={{
                                        padding: '0.75rem', borderRadius: 12, background: 'rgba(239,68,68,0.1)',
                                        color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer',
                                    }}>🗑</button>
                                )}
                            </div>
                        </div>

                        <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }`}</style>
                    </motion.div>
                ) : (
                    <motion.div key="story" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                            <h2 className="section-title" style={{ color: '#c084fc' }}>📖 Histoires spatiales générées par Gemini</h2>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Choisis un thème et l&apos;IA écrit une aventure rien que pour toi !</p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                {STORY_THEMES.map((t, i) => (
                                    <button key={i} onClick={() => setSelectedTheme(i)} style={{
                                        padding: '0.875rem', borderRadius: 12, cursor: 'pointer', textAlign: 'center',
                                        background: selectedTheme === i ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))' : 'rgba(255,255,255,0.04)',
                                        border: `1px solid ${selectedTheme === i ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.07)'}`,
                                        color: selectedTheme === i ? '#e2e8f0' : '#94a3b8', fontWeight: 600, fontSize: '0.82rem',
                                    }}>
                                        <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>{t.emoji}</div>
                                        {t.label}
                                    </button>
                                ))}
                            </div>

                            <button onClick={generateStory} disabled={storyLoading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', opacity: storyLoading ? 0.7 : 1 }}>
                                {storyLoading ? '✨ Gemini écrit...' : '✨ Générer l\'histoire !'}
                            </button>

                            {story && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
                                    marginTop: '1.5rem', padding: '1.5rem', borderRadius: '1rem',
                                    background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)',
                                    borderLeft: '4px solid #8b5cf6',
                                }}>
                                    <div style={{ color: '#c084fc', fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: '0.75rem' }}>
                                        {STORY_THEMES[selectedTheme].emoji} {STORY_THEMES[selectedTheme].label}
                                    </div>
                                    <div style={{ color: '#cbd5e1', lineHeight: 1.85, fontSize: '0.9rem' }}><FormattedText text={story} /></div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* API key note */}
            <div style={{
                marginTop: '1.5rem', padding: '1rem 1.25rem', borderRadius: '0.875rem',
                background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
            }}>
                <p style={{ color: '#94a3b8', fontSize: '0.78rem', lineHeight: 1.6 }}>
                    <span style={{ color: '#f87171', fontWeight: 700 }}>⚙️ Configuration :</span> Crée le fichier{' '}
                    <code style={{ background: 'rgba(0,0,0,0.3)', padding: '1px 6px', borderRadius: 4, color: '#a78bfa' }}>.env.local</code>
                    {' '}à la racine du projet et ajoute :<br />
                    <code style={{ color: '#86efac', display: 'block', marginTop: '0.4rem' }}>GEMINI_API_KEY=ta_clé_ici</code>
                    Obtiens une clé gratuite sur{' '}<a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa' }}>aistudio.google.com</a>
                </p>
            </div>
        </div>
    )
}
