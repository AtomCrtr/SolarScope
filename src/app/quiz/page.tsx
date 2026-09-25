'use client'

import { useEffect, useState } from 'react'
import SpaceIcon, { type SpaceIconName } from '@/components/ui/SpaceIcon'
import KidsGuide from '@/components/learning/KidsGuide'
import { useSiteLocale } from '@/components/layout/LanguageToggle'
import { recordQuizScore } from '@/lib/client/local-progress'
import { ANECDOTES, QUIZ_LEVELS, quizBank, type QuizLevelId } from '@/lib/content/quiz-bank'
import type { SiteLocale } from '@/lib/i18n/paths'

type Text = Record<SiteLocale, string>

const OBSERVATION_RESOURCES: Array<{ icon: SpaceIconName; name: Text; detail: Text; url: string }> = [
    { icon: 'moon-stars', name: { fr: 'Phases de la Lune', en: 'Moon phases' }, detail: { fr: 'Calendrier quotidien et phases calculées par la NASA.', en: 'Daily calendar and phases worked out by NASA.' }, url: 'https://science.nasa.gov/moon/daily-moon-guide/' },
    { icon: 'sun', name: { fr: 'Prochaines éclipses', en: 'Upcoming eclipses' }, detail: { fr: 'Dates, zones de visibilité et consignes de sécurité officielles.', en: 'Dates, where to see them and official safety advice.' }, url: 'https://science.nasa.gov/eclipses/future-eclipses/' },
    { icon: 'meteorite', name: { fr: 'Pluies de météores', en: 'Meteor showers' }, detail: { fr: 'Guides d’observation régulièrement mis à jour.', en: 'Regularly updated viewing guides.' }, url: 'https://science.nasa.gov/solar-system/meteors-meteorites/meteor-showers/' },
    { icon: 'telescope', name: { fr: 'Le ciel ce mois-ci', en: 'This month’s sky' }, detail: { fr: 'Le guide mensuel « What’s Up » du Jet Propulsion Laboratory.', en: 'The Jet Propulsion Laboratory’s monthly “What’s Up” guide.' }, url: 'https://science.nasa.gov/skywatching/whats-up/' },
]

const VIDEOS: Array<{ title: Text; url: string; fallback: string; fallbackLabel: Text; icon: SpaceIconName; age: Text; description: Text }> = [
    { title: { fr: 'Paxi — Le Système solaire (ESA)', en: 'Paxi — The Solar System (ESA, in French)' }, url: 'https://www.youtube.com/watch?v=shQJd3oGYn8', fallback: 'https://spaceplace.nasa.gov/menu/solar-system/', fallbackLabel: { fr: 'Découvrir le Système solaire avec la NASA', en: 'Discover the Solar System with NASA' }, icon: 'globe', age: { fr: '5-10 ans', en: 'Ages 5-10' }, description: { fr: 'L’animation officielle de l’Agence spatiale européenne pour découvrir les planètes !', en: 'The European Space Agency’s official cartoon to discover the planets!' } },
    { title: { fr: 'Le Système solaire CM1-CM2 — Maître Lucas', en: 'The Solar System — Maître Lucas (in French)' }, url: 'https://www.youtube.com/watch?v=jdInvnIkwIk', fallback: 'https://science.nasa.gov/solar-system/', fallbackLabel: { fr: 'Lire le guide NASA du Système solaire', en: 'Read NASA’s Solar System guide' }, icon: 'book', age: { fr: '7-12 ans', en: 'Ages 7-12' }, description: { fr: 'Une leçon complète sur les 8 planètes, le Soleil et les satellites naturels.', en: 'A full lesson on the 8 planets, the Sun and natural satellites.' } },
    { title: { fr: 'Les étoiles — National Geographic France', en: 'Stars — National Geographic France (in French)' }, url: 'https://www.youtube.com/watch?v=CDy6kEEClK0', fallback: 'https://science.nasa.gov/universe/stars/', fallbackLabel: { fr: 'Explorer les étoiles avec la NASA', en: 'Explore the stars with NASA' }, icon: 'sparkle', age: { fr: '8-14 ans', en: 'Ages 8-14' }, description: { fr: 'Un documentaire sur la naissance, la vie et la mort des étoiles.', en: 'A documentary on the birth, life and death of stars.' } },
    { title: { fr: 'L’espace pour les enfants — Les étoiles', en: 'Space for kids — Stars (in French)' }, url: 'https://www.youtube.com/watch?v=q_03QQmiR9Y', fallback: 'https://spaceplace.nasa.gov/', fallbackLabel: { fr: 'Découvrir l’espace avec NASA Space Place', en: 'Discover space with NASA Space Place' }, icon: 'telescope', age: { fr: '6-12 ans', en: 'Ages 6-12' }, description: { fr: 'Un voyage à travers les étoiles et l’Univers, expliqué simplement.', en: 'A journey through the stars and the Universe, explained simply.' } },
    { title: { fr: 'James Webb — les premières images (NASA)', en: 'James Webb — the first images (NASA)' }, url: 'https://www.youtube.com/watch?v=1C_zuHf6lP4', fallback: 'https://science.nasa.gov/mission/webb/', fallbackLabel: { fr: 'Voir la mission Webb sur le site de la NASA', en: 'See the Webb mission on NASA’s website' }, icon: 'telescope', age: { fr: '8-14 ans', en: 'Ages 8-14' }, description: { fr: 'Une sélection officielle d’images qui ont changé notre vision de l’Univers.', en: 'An official selection of images that changed how we see the Universe.' } },
    { title: { fr: 'La mission Perseverance sur Mars (NASA)', en: 'The Perseverance mission on Mars (NASA)' }, url: 'https://www.youtube.com/watch?v=5qqsMjy8Rx0', fallback: 'https://science.nasa.gov/mission/mars-2020-perseverance/', fallbackLabel: { fr: 'Suivre Perseverance avec la NASA', en: 'Follow Perseverance with NASA' }, icon: 'mars', age: { fr: '6-12 ans', en: 'Ages 6-12' }, description: { fr: 'La NASA explore Mars avec son rover et son hélicoptère Ingenuity.', en: 'NASA explores Mars with its rover and its Ingenuity helicopter.' } },
]

const COPY = {
    fr: {
        badge: 'COIN DES CURIEUX', title: 'Le coin des curieux', subtitle: 'Quiz, vidéos, anecdotes et événements célestes pour les jeunes explorateurs !',
        tabs: { quiz: 'Quiz', videos: 'Vidéos', events: 'Événements', anecdotes: 'Anecdotes' },
        chooseLevel: 'Choisis ton niveau', levelText: 'Chaque niveau a ses propres questions : tu peux changer à tout moment !', questions: (n: number) => `${n} questions`,
        changeLevel: 'Changer de niveau', restart: 'Recommencer', perfect: 'Parfait ! Tu es un as de l’espace !', great: 'Excellent travail ! Tu maîtrises bien l’astronomie !', keepGoing: 'Continue à explorer, tu vas y arriver !',
        again: 'Refais ce niveau : tu vas consolider tes découvertes !', ready: (name: string) => `Prêt pour le niveau ${name} ?`, easier: (name: string) => `Essaie le niveau ${name} pour reprendre confiance.`,
        redo: 'Refaire ce niveau', tryLevel: (name: string) => `Essayer le niveau ${name}`, question: (n: number) => `Question ${n}`,
        right: 'Bravo !', wrong: (answer: string) => `Raté ! Bonne réponse : ${answer}`, score: (ok: number, total: number, percent: number) => `Score : ${ok}/${total} (${percent} %)`,
        perfectEnd: 'Score parfait ! Tu es un vrai astronome !', middleEnd: 'Continue comme ça, explore les autres pages pour en apprendre plus !', lowEnd: 'Pas de panique ! Explore les pages du site et reviens tenter ta chance !',
        watch: '▶ Regarder sur YouTube', unavailable: (label: string) => `Si la vidéo est indisponible : ${label} ↗`,
        eventsText: 'Les calendriers astronomiques changent chaque année. Ces liens officiels donnent toujours les dates les plus récentes.', openNasa: 'Ouvrir la source NASA ↗',
    },
    en: {
        badge: 'CURIOUS CORNER', title: 'The curious corner', subtitle: 'Quizzes, videos, fun facts and sky events for young explorers!',
        tabs: { quiz: 'Quiz', videos: 'Videos', events: 'Events', anecdotes: 'Fun facts' },
        chooseLevel: 'Choose your level', levelText: 'Each level has its own questions: you can switch at any time!', questions: (n: number) => `${n} questions`,
        changeLevel: 'Change level', restart: 'Start again', perfect: 'Perfect! You are a space ace!', great: 'Great work! You know your astronomy!', keepGoing: 'Keep exploring, you will get there!',
        again: 'Try this level again: it will help the ideas stick!', ready: (name: string) => `Ready for the ${name} level?`, easier: (name: string) => `Try the ${name} level to build your confidence.`,
        redo: 'Try this level again', tryLevel: (name: string) => `Try the ${name} level`, question: (n: number) => `Question ${n}`,
        right: 'Well done!', wrong: (answer: string) => `Not this time! The right answer: ${answer}`, score: (ok: number, total: number, percent: number) => `Score: ${ok}/${total} (${percent}%)`,
        perfectEnd: 'Perfect score! You are a real astronomer!', middleEnd: 'Keep it up, and explore the other pages to learn more!', lowEnd: 'Don’t worry! Explore the site and come back to try again!',
        watch: '▶ Watch on YouTube', unavailable: (label: string) => `If the video is unavailable: ${label} ↗`,
        eventsText: 'Sky calendars change every year. These official links always give the latest dates.', openNasa: 'Open the NASA source ↗',
    },
}

function shuffledIndexes(length: number): number[] {
    return Array.from({ length }, (_, index) => index).sort(() => Math.random() - 0.5)
}

type Tab = 'quiz' | 'videos' | 'events' | 'anecdotes'

export default function QuizPage() {
    const locale = useSiteLocale()
    const t = COPY[locale]
    const [level, setLevel] = useState<QuizLevelId | null>(null)
    // Question order and answers are stored as indexes, so they stay valid in both languages.
    const [order, setOrder] = useState<number[]>([])
    const [answers, setAnswers] = useState<Record<number, number>>({})
    const [anecdoteOrder, setAnecdoteOrder] = useState<number[]>(() => ANECDOTES.map((_, index) => index).slice(0, 4))
    const [tab, setTab] = useState<Tab>('quiz')

    const startLevel = (id: QuizLevelId) => {
        setLevel(id)
        setOrder(shuffledIndexes(quizBank(id, locale).length))
        setAnswers({})
    }
    const currentLevel = QUIZ_LEVELS.find(item => item.id === level)
    const bank = level ? quizBank(level, locale) : []
    const questions = order.map(index => bank[index]).filter(Boolean)

    const totalAnswered = Object.keys(answers).length
    const totalCorrect = Object.entries(answers).filter(([position, option]) => questions[Number(position)]?.options[option] === questions[Number(position)]?.answer).length
    const finished = questions.length > 0 && totalAnswered === questions.length
    const currentLevelIndex = QUIZ_LEVELS.findIndex(item => item.id === level)
    const suggestedLevel = !finished || !currentLevel ? null
        : totalCorrect >= Math.ceil(questions.length * 0.8) && currentLevelIndex < QUIZ_LEVELS.length - 1
            ? QUIZ_LEVELS[currentLevelIndex + 1]
            : totalCorrect <= Math.floor(questions.length / 2) && currentLevelIndex > 0
                ? QUIZ_LEVELS[currentLevelIndex - 1]
                : currentLevel
    const suggestionText = !currentLevel || !suggestedLevel ? ''
        : suggestedLevel.id === currentLevel.id
            ? t.again
            : suggestedLevel.id === QUIZ_LEVELS[currentLevelIndex + 1]?.id
                ? t.ready(suggestedLevel.label[locale])
                : t.easier(suggestedLevel.label[locale])

    useEffect(() => {
        if (finished) recordQuizScore(Math.round(totalCorrect / questions.length * 100))
    }, [finished, questions.length, totalCorrect])

    const reset = () => { setLevel(null); setOrder([]); setAnswers({}) }
    const openAnecdotes = () => {
        setAnecdoteOrder(shuffledIndexes(ANECDOTES.length).slice(0, 4))
        setTab('anecdotes')
    }
    const percent = questions.length ? Math.round(totalCorrect / questions.length * 100) : 0

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
            <div className="page-header motion-enter">
                <div className="badge"><SpaceIcon name="quiz" size={18} className="inline-icon" /> {t.badge}</div>
                <h1 className="page-title">{t.title}</h1>
                <p className="page-subtitle">{t.subtitle}</p>
            </div>

            <KidsGuide topic="quiz" />

            {/* Tab bar */}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
                {(['quiz', 'videos', 'events', 'anecdotes'] as const).map(id => (
                    <button key={id} aria-pressed={tab === id} onClick={() => (id === 'anecdotes' ? openAnecdotes() : setTab(id))} style={{
                        padding: '0.6rem 1.25rem', borderRadius: 10, fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                        background: tab === id ? 'var(--sun)' : 'rgba(255,255,255,0.04)',
                        color: tab === id ? 'var(--ink)' : 'var(--text-muted)',
                        border: tab === id ? 'none' : '1px solid rgba(255,255,255,0.07)',
                    }}>{t.tabs[id]}</button>
                ))}
            </div>

            {tab === 'quiz' && (
                <div className="motion-enter" key="quiz">
                    {!currentLevel ? (
                        <div>
                            <h2 style={{ textAlign: 'center', color: 'var(--text)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.5rem' }}>{t.chooseLevel}</h2>
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{t.levelText}</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                                {QUIZ_LEVELS.map(lv => (
                                    <button key={lv.id} onClick={() => startLevel(lv.id)} style={{
                                        padding: '1.5rem', borderRadius: '1rem', cursor: 'pointer', textAlign: 'center',
                                        background: `${lv.color}10`, border: `2px solid ${lv.color}30`, transition: 'all 0.2s',
                                    }}>
                                        <div style={{ color: lv.color, marginBottom: '0.5rem' }}><SpaceIcon name={lv.icon} size={36} /></div>
                                        <div style={{ color: lv.color, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.25rem' }}>{lv.label[locale]}</div>
                                        <div style={{ color: 'var(--text-subtle)', fontSize: '0.82rem', marginBottom: '0.75rem' }}>{lv.ages[locale]}</div>
                                        <div style={{ padding: '0.375rem 0.75rem', borderRadius: 99, background: `${lv.color}20`, color: lv.color, fontSize: '0.72rem', fontWeight: 700 }}>
                                            {t.questions(lv.bank[locale].length)}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            {/* Level badge + controls */}
                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                                <div style={{ padding: '0.3rem 0.875rem', borderRadius: 99, background: `${currentLevel.color}18`, border: `1px solid ${currentLevel.color}35`, color: currentLevel.color, fontSize: '0.75rem', fontWeight: 700 }}>
                                    {currentLevel.label[locale]} · {currentLevel.ages[locale]}
                                </div>
                                <button onClick={reset} className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}><SpaceIcon name="refresh" size={18} className="inline-icon" /> {t.changeLevel}</button>
                                {finished && <button onClick={() => startLevel(currentLevel.id)} style={{ padding: '0.5rem 1rem', borderRadius: 12, background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}><SpaceIcon name="refresh" size={18} className="inline-icon" /> {t.restart}</button>}
                            </div>

                            {/* Score banner when finished */}
                            {finished && (
                                <div className="card" style={{ textAlign: 'center', padding: '1.5rem', marginBottom: '1.5rem', background: totalCorrect >= Math.ceil(questions.length * 0.8) ? 'rgba(16,185,129,0.06)' : 'rgba(251,191,36,0.06)', border: `2px solid ${totalCorrect >= Math.ceil(questions.length * 0.8) ? '#10b981' : '#f59e0b'}30` }}>
                                    <div style={{ marginBottom: '0.5rem', color: 'var(--gold)' }}><SpaceIcon name={totalCorrect === questions.length ? 'trophy' : totalCorrect >= Math.ceil(questions.length * 0.8) ? 'sparkle' : 'target'} size={48} /></div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>{totalCorrect}/{questions.length}</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                                        {totalCorrect === questions.length ? t.perfect : totalCorrect >= Math.ceil(questions.length * 0.8) ? t.great : t.keepGoing}
                                    </div>
                                    {suggestedLevel && <div className="adaptive-quiz-next" data-adaptive-quiz>
                                        <p>{suggestionText}</p>
                                        <button type="button" onClick={() => startLevel(suggestedLevel.id)}>
                                            {suggestedLevel.id === currentLevel.id ? t.redo : t.tryLevel(suggestedLevel.label[locale])}
                                        </button>
                                    </div>}
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {questions.map((q, idx) => {
                                    const chosen = answers[idx]
                                    const answered = chosen !== undefined
                                    const correct = answered && q.options[chosen] === q.answer
                                    return (
                                        <div key={`${level}-${order[idx]}`} className="card" style={{ padding: '1.5rem' }}>
                                            <h3 style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                                                <SpaceIcon name={q.icon} size={20} className="inline-icon" />
                                                <span>{t.question(idx + 1)} — {q.question}</span>
                                            </h3>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginBottom: answered ? '0.875rem' : 0 }}>
                                                {q.options.map((opt, optionIndex) => {
                                                    let bg = 'rgba(255,255,255,0.04)', border = '1px solid rgba(255,255,255,0.07)', color = '#94a3b8'
                                                    if (answered) {
                                                        if (opt === q.answer) { bg = 'rgba(16,185,129,0.12)'; border = '2px solid #10b981'; color = '#10b981' }
                                                        else if (optionIndex === chosen) { bg = 'rgba(239,68,68,0.12)'; border = '2px solid #ef4444'; color = '#f87171' }
                                                    }
                                                    return answered ? (
                                                        <div key={opt} style={{ padding: '0.75rem 1rem', borderRadius: 10, background: bg, border, color, fontWeight: 600, fontSize: '0.85rem' }}>{opt}</div>
                                                    ) : (
                                                        <button key={opt} onClick={() => setAnswers(prev => ({ ...prev, [idx]: optionIndex }))} style={{
                                                            padding: '0.75rem 1rem', borderRadius: 10, background: bg, border, color,
                                                            fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                                                        }}>{opt}</button>
                                                    )
                                                })}
                                            </div>
                                            {answered && (
                                                <div style={{ padding: '0.75rem 1rem', borderRadius: '0.625rem', background: correct ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', borderLeft: `3px solid ${correct ? '#10b981' : '#f87171'}` }}>
                                                    <span style={{ color: correct ? '#10b981' : '#f87171', fontWeight: 700 }}>{correct ? t.right : t.wrong(q.answer)}</span>
                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginLeft: '0.5rem' }}>{q.explanation}</span>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            {finished && (
                                <div className="motion-enter" style={{
                                    marginTop: '2rem', padding: '2rem', borderRadius: '1.25rem', textAlign: 'center',
                                    background: totalCorrect === questions.length ? 'linear-gradient(135deg, rgba(16,185,129,0.1),rgba(99,102,241,0.1))' : 'rgba(255,255,255,0.04)',
                                    border: `2px solid ${totalCorrect === questions.length ? '#10b981' : totalCorrect >= questions.length / 2 ? '#f59e0b' : '#f87171'}`,
                                }}>
                                    <div style={{ marginBottom: '0.5rem' }}>
                                        <SpaceIcon name={totalCorrect === questions.length ? 'trophy' : totalCorrect >= questions.length / 2 ? 'sparkle' : 'target'} size={40} />
                                    </div>
                                    <h3 style={{ color: totalCorrect === questions.length ? '#10b981' : totalCorrect >= questions.length / 2 ? '#f59e0b' : '#f87171', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.4rem', marginBottom: '0.5rem' }}>
                                        {t.score(totalCorrect, questions.length, percent)}
                                    </h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                        {totalCorrect === questions.length ? t.perfectEnd : totalCorrect >= questions.length / 2 ? t.middleEnd : t.lowEnd}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {tab === 'videos' && (
                <div className="motion-enter" key="videos">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                        {VIDEOS.map(v => (
                            <div key={v.url} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                                <div style={{ color: 'var(--nebula)', marginBottom: '0.5rem' }}><SpaceIcon name={v.icon} size={36} /></div>
                                <h3 style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.375rem' }}>{v.title[locale]}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.6, marginBottom: '0.875rem' }}>{v.description[locale]}</p>
                                <span style={{ fontSize: '0.72rem', color: 'var(--nebula)', background: 'rgba(167,139,250,0.1)', padding: '2px 10px', borderRadius: 999 }}>{v.age[locale]}</span>
                                <br /><br />
                                <a href={v.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>{t.watch}</a>
                                <a href={v.fallback} target="_blank" rel="noopener noreferrer" className="video-fallback">{t.unavailable(v.fallbackLabel[locale])}</a>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {tab === 'events' && (
                <div className="motion-enter" key="events">
                    <p style={{ color: 'var(--text-subtle)', marginBottom: '1rem', lineHeight: 1.7 }}>{t.eventsText}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                        {OBSERVATION_RESOURCES.map(resource => (
                            <a key={resource.url} href={resource.url} target="_blank" rel="noopener noreferrer" className="card" style={{ padding: '1.25rem', textAlign: 'center', borderTop: '4px solid #6366f1', textDecoration: 'none' }}>
                                <div aria-hidden="true" style={{ color: 'var(--nebula)', marginBottom: '0.5rem' }}><SpaceIcon name={resource.icon} size={32} /></div>
                                <strong style={{ color: 'var(--text)', display: 'block', marginBottom: '0.25rem' }}>{resource.name[locale]}</strong>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{resource.detail[locale]}</p>
                                <span style={{ color: 'var(--nebula)', fontSize: '0.72rem', display: 'inline-block', marginTop: '0.75rem' }}>{t.openNasa}</span>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {tab === 'anecdotes' && (
                <div className="motion-enter" key="anecdotes">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                        {anecdoteOrder.map((index, i) => {
                            const a = ANECDOTES[index]
                            return (
                                <div key={a.title.fr} className="card motion-enter" style={{ animationDelay: `${Math.min(i * 0.1, 0.6)}s`, padding: '1.5rem', textAlign: 'center', borderTop: '4px solid #a78bfa' }}>
                                    <div style={{ color: 'var(--nebula)', marginBottom: '0.5rem' }}><SpaceIcon name={a.icon} size={32} /></div>
                                    <strong style={{ color: 'var(--nebula)', display: 'block', marginBottom: '0.625rem' }}>{a.title[locale]}</strong>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7 }}>{a.text[locale]}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
