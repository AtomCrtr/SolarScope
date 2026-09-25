'use client'

import { Fragment, useState, useRef, useEffect } from 'react'
import SpaceIcon, { type SpaceIconName } from '@/components/ui/SpaceIcon'

import KidsGuide from '@/components/learning/KidsGuide'
import SolarBotSourceLinks, { SolarBotReliabilityNote } from '@/components/assistant/SolarBotSourceLinks'
import type { PublicSolarBotSource } from '@/lib/content/solarbot-sources'
import SolarBotStatus, { useSolarBotStatus } from '@/components/assistant/SolarBotStatus'
import { askSolarBot } from '@/components/assistant/ask-solarbot'
import { useSiteLocale } from '@/components/layout/LanguageToggle'

interface Message {
    role: 'user' | 'bot'
    text: string
    time: string
    sources?: PublicSolarBotSource[]
    degraded?: boolean
}

const COPY = {
    fr: {
        time: 'fr-FR', now: 'maintenant',
        welcome: 'Bonjour ! Je suis **SolarBot**, ton compagnon spatial.\n\nPose une question à la fois et je l’expliquerai avec des mots simples. Je peux parfois me tromper : vérifie les faits importants et ne partage jamais ton nom complet, ton adresse ou ton école.',
        quick: ['Pourquoi les étoiles brillent-elles ?', 'C’est quoi un trou noir ?', 'Y a-t-il de la vie sur Mars ?', 'Comment fonctionne un télescope ?', 'Qu’est-ce qu’une galaxie ?', 'Pourquoi la Lune change-t-elle de forme ?', 'Combien de planètes dans le Système solaire ?', 'Comment naît une étoile ?'],
        stories: [
            { icon: 'rocket', label: 'Premier pas sur la Lune', prompt: 'Raconte l’histoire du premier pas de Neil Armstrong sur la Lune en 1969, comme si l’enfant y était. 200 mots maximum, style aventure pour enfants de 8 à 12 ans.' },
            { icon: 'target', label: 'Voyage vers un trou noir', prompt: 'Raconte l’histoire d’un vaisseau spatial qui s’approche d’un trou noir. Explique ce qui arrive au temps et à la lumière. 200 mots maximum, pour enfants de 8 à 12 ans.' },
            { icon: 'mars', label: 'Découverte sur Mars', prompt: 'Raconte l’histoire d’un rover qui découvre quelque chose de surprenant sur Mars. 200 mots maximum, pour enfants de 8 à 12 ans.' },
            { icon: 'sparkle', label: 'Rencontre extraterrestre', prompt: 'Raconte l’histoire d’un premier contact avec des extraterrestres amicaux, en précisant que c’est de la fiction. 200 mots maximum, pour enfants de 8 à 12 ans.' },
            { icon: 'drop', label: 'Mission sur Europe', prompt: 'Raconte l’histoire d’une mission qui explore l’océan sous la glace d’Europe, une lune de Jupiter. 200 mots maximum, pour enfants de 8 à 12 ans.' },
        ],
        subtitle: 'Pose une question et demande une explication courte, une comparaison ou une histoire clairement annoncée.',
        tabs: { chat: 'Chat', story: 'Histoires IA' }, inputLabel: 'Question pour SolarBot', placeholder: 'Pose ta question sur l’espace…', send: 'Envoyer la question', clear: 'Effacer la conversation', clearTitle: 'Effacer',
        storiesTitle: 'Histoires spatiales assistées', storiesText: 'Choisis un thème. Gemini écrit l’aventure lorsqu’il est disponible ; sinon SolarBot propose une histoire de secours clairement signalée.',
        writing: 'SolarBot écrit…', generate: 'Écrire l’histoire !',
        privacy: 'Ne partage jamais ton nom complet, ton adresse ou ton école. SolarBot peut se tromper : vérifie les informations importantes grâce aux sources scientifiques proposées sur le site.',
    },
    en: {
        time: 'en-GB', now: 'now',
        welcome: 'Hello! I am **SolarBot**, your space companion.\n\nAsk one question at a time and I will explain it with simple words. I can sometimes be wrong: check important facts, and never share your full name, your address or your school.',
        quick: ['Why do stars shine?', 'What is a black hole?', 'Is there life on Mars?', 'How does a telescope work?', 'What is a galaxy?', 'Why does the Moon change shape?', 'How many planets are in the Solar System?', 'How is a star born?'],
        stories: [
            { icon: 'rocket', label: 'First step on the Moon', prompt: 'Tell the story of Neil Armstrong’s first step on the Moon in 1969, as if the child were there. 200 words maximum, an adventure for children aged 8 to 12.' },
            { icon: 'target', label: 'Journey to a black hole', prompt: 'Tell the story of a spaceship getting close to a black hole. Explain what happens to time and light. 200 words maximum, for children aged 8 to 12.' },
            { icon: 'mars', label: 'Discovery on Mars', prompt: 'Tell the story of a rover finding something surprising on Mars. 200 words maximum, for children aged 8 to 12.' },
            { icon: 'sparkle', label: 'Meeting aliens', prompt: 'Tell the story of a first meeting with friendly aliens, making clear that it is fiction. 200 words maximum, for children aged 8 to 12.' },
            { icon: 'drop', label: 'Mission to Europa', prompt: 'Tell the story of a mission exploring the ocean under the ice of Europa, a moon of Jupiter. 200 words maximum, for children aged 8 to 12.' },
        ],
        subtitle: 'Ask a question and ask for a short explanation, a comparison or a story clearly marked as a story.',
        tabs: { chat: 'Chat', story: 'AI stories' }, inputLabel: 'Question for SolarBot', placeholder: 'Ask your question about space…', send: 'Send the question', clear: 'Clear the conversation', clearTitle: 'Clear',
        storiesTitle: 'Assisted space stories', storiesText: 'Choose a theme. Gemini writes the adventure when it is available; otherwise SolarBot offers a backup story, clearly marked.',
        writing: 'SolarBot is writing…', generate: 'Write the story!',
        privacy: 'Never share your full name, your address or your school. SolarBot can be wrong: check important information with the science sources offered on the site.',
    },
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
    const locale = useSiteLocale()
    const t = COPY[locale]
    const { status, updateFromAnswer } = useSolarBotStatus()
    // The welcome message is not stored: it follows the page language.
    const [conversation, setConversation] = useState<Message[]>([])
    const messages: Message[] = [{ role: 'bot', text: t.welcome, time: t.now }, ...conversation]
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [tab, setTab] = useState<'chat' | 'story'>('chat')
    const [story, setStory] = useState('')
    const [storySources, setStorySources] = useState<PublicSolarBotSource[]>([])
    const [storyDegraded, setStoryDegraded] = useState(false)
    const [storyLoading, setStoryLoading] = useState(false)
    const [selectedTheme, setSelectedTheme] = useState(0)
    const messagesRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (conversation.length === 0 && !loading) return
        const panel = messagesRef.current
        panel?.scrollTo({ top: panel.scrollHeight, behavior: 'smooth' })
    }, [conversation, loading])

    const sendMessage = async (text?: string) => {
        const q = (text || input).trim()
        if (!q || loading) return
        setInput('')
        const now = new Date().toLocaleTimeString(t.time, { hour: '2-digit', minute: '2-digit' })
        const userMsg: Message = { role: 'user', text: q, time: now }
        setConversation(prev => [...prev, userMsg])
        setLoading(true)
        const answer = await askSolarBot(q, conversation, locale)
        updateFromAnswer(answer.status)
        setConversation(prev => [...prev, { role: 'bot', text: answer.text, sources: answer.sources, degraded: answer.degraded, time: new Date().toLocaleTimeString(t.time, { hour: '2-digit', minute: '2-digit' }) }])
        setLoading(false)
    }

    const generateStory = async () => {
        setStoryLoading(true)
        const answer = await askSolarBot(t.stories[selectedTheme].prompt, [], locale, 'story')
        updateFromAnswer(answer.status)
        setStory(answer.text)
        setStorySources(answer.sources)
        setStoryDegraded(answer.degraded)
        setStoryLoading(false)
    }

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem', maxWidth: 860 }}>
            <div className="page-header motion-enter">
                <div className="badge solarbot-hero-status" style={{ background: 'rgba(139,92,246,0.12)', color: 'var(--nebula)', borderColor: 'rgba(139,92,246,0.25)' }}>
                    <SpaceIcon name="robot" size={18} className="inline-icon" /> <SolarBotStatus status={status} />
                </div>
                <h1 className="page-title">SolarBot</h1>
                <p className="page-subtitle">{t.subtitle}</p>
            </div>

            <KidsGuide topic="solarbot" />

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '2rem' }}>
                {(['chat', 'story'] as const).map(id => (
                    <button key={id} aria-pressed={tab === id} onClick={() => setTab(id)} style={{
                        padding: '0.6rem 1.5rem', borderRadius: 10, fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
                        background: tab === id ? 'var(--sun)' : 'rgba(255,255,255,0.04)',
                        color: tab === id ? 'var(--ink)' : 'var(--text-muted)',
                        border: tab === id ? 'none' : '1px solid rgba(255,255,255,0.07)',
                    }}>{t.tabs[id]}</button>
                ))}
            </div>

            <>
                {tab === 'chat' ? (
                    <div className="motion-enter" key="chat">
                        {/* Quick questions */}
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            {t.quick.map(q => (
                                <button key={q} onClick={() => sendMessage(q)} disabled={loading} style={{
                                    padding: '0.4rem 0.875rem', borderRadius: 999, fontSize: '0.78rem', cursor: 'pointer',
                                    background: 'var(--card-2)', color: 'var(--nebula)',
                                    border: '1px solid var(--orbit)', fontWeight: 500,
                                    transition: 'all 0.15s',
                                }}>{q}</button>
                            ))}
                        </div>

                        {/* Chat window */}
                        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                            {/* Messages */}
                            <div ref={messagesRef} aria-live="polite" aria-busy={loading} style={{ height: 420, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {messages.map((msg, i) => (
                                    <div className="motion-enter" key={i} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: '0.75rem', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                        <div style={{
                                            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                                            background: msg.role === 'bot' ? 'var(--sun)' : 'linear-gradient(135deg, #0f172a, #1e293b)',
                                            border: msg.role === 'bot' ? '2px solid rgba(99,102,241,0.4)' : '2px solid rgba(255,255,255,0.1)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem'
                                        }}>
                                            <SpaceIcon name={msg.role === 'bot' ? 'robot' : 'child'} size={20} />
                                        </div>
                                        <div style={{ maxWidth: '75%' }}>
                                            <div style={{
                                                padding: '0.875rem 1rem', borderRadius: msg.role === 'user' ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
                                                background: msg.role === 'user' ? '#2a3566' : 'rgba(255,255,255,0.05)',
                                                border: msg.role === 'bot' ? '1px solid rgba(255,255,255,0.07)' : 'none',
                                                color: 'var(--text)', fontSize: '0.88rem', lineHeight: 1.7,
                                            }}><FormattedText text={msg.text} /></div>
                                            {msg.role === 'bot' && <SolarBotReliabilityNote degraded={msg.degraded} />}
                                            {msg.role === 'bot' && <SolarBotSourceLinks sources={msg.sources} />}
                                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.25rem', textAlign: msg.role === 'user' ? 'right' : 'left' }}>{msg.time}</div>
                                        </div>
                                    </div>
                                ))}
                                {loading && (
                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--sun)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><SpaceIcon name="robot" size={18} className="inline-icon" /></div>
                                        <div style={{ padding: '0.875rem 1rem', borderRadius: '1rem 1rem 1rem 0', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                            <div style={{ display: 'flex', gap: 4 }}>
                                                {[0, 1, 2].map(i => (
                                                    <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--sun)', display: 'inline-block', animation: `bounce 1s ${i * 0.15}s infinite` }} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Input */}
                            <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: '0.75rem' }}>
                                <input
                                    aria-label={t.inputLabel}
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                                    placeholder={t.placeholder}
                                    maxLength={1000}
                                    disabled={loading}
                                    style={{
                                        flex: 1, padding: '0.75rem 1rem', borderRadius: 12, fontSize: '0.9rem',
                                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                        color: 'var(--text)', outline: 'none',
                                    }}
                                />
                                <button aria-label={t.send} onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{
                                    padding: '0.75rem 1.25rem', borderRadius: 12, fontWeight: 700,
                                    background: 'var(--sun)',
                                    color: 'var(--ink)', border: 'none', cursor: 'pointer', fontSize: '1rem',
                                    opacity: loading || !input.trim() ? 0.5 : 1,
                                }}><SpaceIcon name="rocket" size={18} className="inline-icon" /></button>
                                {conversation.length > 0 && (
                                    <button aria-label={t.clear} onClick={() => setConversation([])} title={t.clearTitle} style={{
                                        padding: '0.75rem', borderRadius: 12, background: 'rgba(239,68,68,0.1)',
                                        color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer',
                                    }}><SpaceIcon name="trash" size={18} className="inline-icon" /></button>
                                )}
                            </div>
                        </div>

                        <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }`}</style>
                    </div>
                ) : (
                    <div className="motion-enter" key="story">
                        <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                            <h2 className="section-title" style={{ color: '#c084fc' }}>{t.storiesTitle}</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>{t.storiesText}</p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                {t.stories.map((theme, i) => (
                                    <button key={theme.label} aria-pressed={selectedTheme === i} onClick={() => setSelectedTheme(i)} style={{
                                        padding: '0.875rem', borderRadius: 12, cursor: 'pointer', textAlign: 'center',
                                        background: selectedTheme === i ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))' : 'rgba(255,255,255,0.04)',
                                        border: `1px solid ${selectedTheme === i ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.07)'}`,
                                        color: selectedTheme === i ? 'var(--text)' : 'var(--text-muted)', fontWeight: 600, fontSize: '0.82rem',
                                    }}>
                                        <div style={{ marginBottom: '0.3rem' }}><SpaceIcon name={theme.icon as SpaceIconName} size={24} /></div>
                                        {theme.label}
                                    </button>
                                ))}
                            </div>

                            <button onClick={generateStory} disabled={storyLoading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', opacity: storyLoading ? 0.7 : 1 }}>
                                {storyLoading ? t.writing : t.generate}
                            </button>

                            {story && (
                                <div className="motion-enter" style={{
                                    marginTop: '1.5rem', padding: '1.5rem', borderRadius: '1rem',
                                    background: 'rgba(139,92,246,0.06)', border: '1px solid var(--orbit)',
                                    borderLeft: '4px solid var(--sun)',
                                }}>
                                    <div style={{ color: '#c084fc', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '0.75rem' }}>
                                        <SpaceIcon name={t.stories[selectedTheme].icon as SpaceIconName} size={18} className="inline-icon" /> {t.stories[selectedTheme].label}
                                    </div>
                                    <div style={{ color: 'var(--text-subtle)', lineHeight: 1.85, fontSize: '0.9rem' }}><FormattedText text={story} /></div>
                                    <SolarBotReliabilityNote degraded={storyDegraded} />
                                    <SolarBotSourceLinks sources={storySources} />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </>

            {/* API key note */}
            <div style={{
                marginTop: '1.5rem', padding: '1rem 1.25rem', borderRadius: '0.875rem',
                background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)',
            }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: 1.6 }}>
                    <SpaceIcon name="lock" size={18} className="inline-icon" /> {t.privacy}
                </p>
            </div>
        </div>
    )
}
