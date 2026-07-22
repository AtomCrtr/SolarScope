'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const QUIZ_BANK_DEBUTANT = [
    { question: 'Quelle est la plus grande planète du Système solaire ?', options: ['🪐 Saturne', '🟠 Jupiter', '🔵 Neptune', '🟦 Uranus'], answer: '🟠 Jupiter', explication: 'Jupiter est tellement grande qu\'elle pourrait contenir 1 300 Terres !', emoji: '🌍' },
    { question: 'Quelle planète est la plus chaude ?', options: ['⚫ Mercure', '🟡 Vénus', '🔴 Mars', '🟠 Jupiter'], answer: '🟡 Vénus', explication: 'Son atmosphère épaisse piège la chaleur comme une serre géante !', emoji: '🌡️' },
    { question: 'Combien de lunes a Mars ?', options: ['0️⃣ Zéro', '1️⃣ Une', '2️⃣ Deux', '5️⃣ Cinq'], answer: '2️⃣ Deux', explication: 'Phobos (la peur) et Deimos (la terreur) — de petites lunes rocheuses !', emoji: '🌙' },
    { question: 'Quelle planète a les plus grands anneaux ?', options: ['🟠 Jupiter', '🔵 Uranus', '🪐 Saturne', '🔵 Neptune'], answer: '🪐 Saturne', explication: 'Les anneaux de Saturne ont 282 000 km de large — mais seulement 30 m d\'épaisseur !', emoji: '💍' },
    { question: 'Le Soleil est une étoile ?', options: ['✔️ Oui', '❌ Non', '🤷 On ne sait pas'], answer: '✔️ Oui', explication: 'Le Soleil est une étoile de type naine jaune, comme des milliards d\'autres dans l\'Univers !', emoji: '☀️' },
    { question: 'Combien de planètes dans le Système solaire ?', options: ['7️ 7', '8️ 8', '9️ 9', '🔟 12'], answer: '8️ 8', explication: 'Mercure, Vénus, Terre, Mars, Jupiter, Saturne, Uranus et Neptune !', emoji: '🪐' },
]

const QUIZ_BANK_EXPLORATEUR = [
    { question: "Qu'est-ce qu'une étoile filante ?", options: ['⭐ Une étoile qui tombe', '🩨 Un morceau de roche qui brûle', '🛰️ Un satellite', '🪐 Une planète lointaine'], answer: '🩨 Un morceau de roche qui brûle', explication: "Des roches qui brûlent en entrant dans l'atmosphère — pas du tout des étoiles !", emoji: '☄️' },
    { question: 'Combien de temps met la lumière du Soleil pour arriver sur Terre ?', options: ['⚡ 8 secondes', '⏱️ 8 minutes', '🕐 8 heures', '📅 8 jours'], answer: '⏱️ 8 minutes', explication: 'La lumière voyage à 300 000 km/s et le Soleil est à 150 millions de km !', emoji: '☀️' },
    { question: 'Quel est le plus grand volcan du système solaire ?', options: ["L'Etna", '🏔️ Olympus Mons', '⛰️ Le Mauna Kea', '💨 Le Vésuve'], answer: '🏔️ Olympus Mons', explication: 'Olympus Mons sur Mars culmine à 21 km, soit 3 fois l\'Everest !', emoji: '🌋' },
    { question: 'De quoi sont faits les anneaux de Saturne ?', options: ['💨 De gaz', '🧣 De glace et de roche', '🌫️ De poussière', '🔩 De métal'], answer: '🧣 De glace et de roche', explication: 'Des milliards de morceaux, du grain de sable à la taille d\'une maison !', emoji: '🪐' },
    { question: 'Quelle agence a envoyé Perseverance sur Mars ?', options: ['🇪🇺 ESA', '🇺🇸 NASA', '🇷🇺 Roscosmos', '🇨🇳 CNSA'], answer: '🇺🇸 NASA', explication: 'Perseverance a atterri sur Mars en février 2021 avec son hélicoptère Ingenuity !', emoji: '🔴' },
    { question: 'Qu\'est-ce qu\'une année-lumière ?', options: ['⏱️ Une durée de temps', '🚀 Une distance', '🌟 La luminosité d\'une étoile', '🤔 Un type d\'étoile'], answer: '🚀 Une distance', explication: 'C\'est la distance que la lumière parcourt en un an : environ 9 460 milliards de km !', emoji: '💡' },
]

const QUIZ_BANK_EXPERT = [
    { question: 'Qu\'est-ce que la "singularité" d\'un trou noir ?', options: ['🌀 La zone d\'accrétion', '🟥 Le point central de densité infinie', '🌟 L\'horizon des événements', '💥 L\'explosion initiale'], answer: '🟥 Le point central de densité infinie', explication: 'La singularité est un point mathématique où les lois de la physique cessent de fonctionner !', emoji: '⚫' },
    { question: 'Qu\'est-ce que la radiation de Hawking ?', options: ['🌟 Une radiation cosémique de fond', '🟥 La radiation émise par les trous noirs', '📅 Les rayons gamma d\'une supernova', '🔴 Les émissions de Mars'], answer: '🟥 La radiation émise par les trous noirs', explication: 'Stephen Hawking a prédit que les trous noirs émettent de la radiation thermique et s\'évaporent !', emoji: '⬅️' },
    { question: 'Quelle est la période de rotation de synodique de Jupiter ?', options: ['📅 398 jours', '📅 780 jours', '📅 116 jours', '📅 687 jours'], answer: '📅 398 jours', explication: 'La période synodique est l\'intervalle entre deux oppositions de Jupiter vu depuis la Terre !', emoji: '🪐' },
    { question: 'Quelle est la température au cœur du Soleil ?', options: ['🔥 6 000°C', '🔥 150 000°C', '🔥 15 millions °C', '🔥 1 milliard °C'], answer: '🔥 15 millions °C', explication: 'La fusion nucléaire nécessite une température colossale de 15 millions de degrés au cœur !', emoji: '☀️' },
    { question: 'Qu\'est-ce que le décalage vers le rouge (redshift) ?', options: ['🟥 La couleur de Mars', '🌌 L\'allongement de longueur d\'onde d\'une source qui s\'éloigne', '💥 L\'énergie libérée par une supernova', '🔭 L\'effet de la gravité sur la lumière'], answer: '🌌 L\'allongement de longueur d\'onde d\'une source qui s\'éloigne', explication: 'L\'Univers est en expansion : plus une galaxie est loin, plus son écart vers le rouge est grand (loi de Hubble) !', emoji: '🌌' },
]

const LEVELS = [
    { id: 'debutant', label: '👶 Débutant', sublabel: '5 — 8 ans', color: '#10b981', bank: QUIZ_BANK_DEBUTANT },
    { id: 'explorateur', label: '💡 Explorateur', sublabel: '9 — 13 ans', color: '#3b82f6', bank: QUIZ_BANK_EXPLORATEUR },
    { id: 'expert', label: '🔭 Expert', sublabel: '14+ ans', color: '#a855f7', bank: QUIZ_BANK_EXPERT },
]


const ANECDOTES = [
    { emoji: '🪐', title: 'Saturne flotte !', text: 'Saturne est la seule planète moins dense que l\'eau. Elle flotterait dans une piscine géante !' },
    { emoji: '⏰', title: 'Un jour sur Vénus', text: 'Un jour sur Vénus dure plus longtemps qu\'une année entière sur Vénus. Le temps s\'y écoule à l\'envers !' },
    { emoji: '👣', title: 'Empreintes éternelles', text: 'Les empreintes des astronautes sur la Lune sont toujours là. Sans vent ni pluie, elles dureront des millions d\'années.' },
    { emoji: '🌋', title: 'Le plus grand volcan', text: 'Olympus Mons sur Mars = 21 km de haut, soit 3 fois l\'Everest !' },
    { emoji: '💎', title: 'Pluie de diamants', text: 'Sur Neptune, la pression extrême transforme le carbone en diamants... qui tombent comme de la pluie !' },
    { emoji: '🌊', title: 'Océan caché', text: 'Europe (lune de Jupiter) cache un océan sous sa glace, peut-être plus grand que tous les océans terrestres !' },
    { emoji: '💧', title: 'Mars était bleue', text: 'Il y a des milliards d\'années, Mars avait des rivières et peut-être un océan entier.' },
    { emoji: '⚖️', title: 'Le Soleil perd du poids', text: 'Le Soleil perd 4 millions de tonnes par seconde... mais il lui reste du carburant pour 5 milliards d\'années !' },
]

const OBSERVATION_RESOURCES = [
    { emoji: '🌕', name: 'Phases de la Lune', detail: 'Calendrier quotidien et phases calculées par la NASA.', url: 'https://science.nasa.gov/moon/daily-moon-guide/' },
    { emoji: '🌑☀️', name: 'Prochaines éclipses', detail: 'Dates, zones de visibilité et consignes de sécurité officielles.', url: 'https://science.nasa.gov/eclipses/future-eclipses/' },
    { emoji: '☄️', name: 'Pluies de météores', detail: 'Guides d’observation régulièrement actualisés.', url: 'https://science.nasa.gov/solar-system/meteors-meteorites/meteor-showers/' },
    { emoji: '🔭', name: 'Le ciel ce mois-ci', detail: 'Le guide mensuel « What’s Up » du Jet Propulsion Laboratory.', url: 'https://science.nasa.gov/skywatching/whats-up/' },
]

const VIDEOS = [
    { title: 'Paxi — Le Système Solaire (ESA)', url: 'https://www.youtube.com/watch?v=shQJd3oGYn8', emoji: '🌍', age: '5-10 ans', description: 'L\'animation officielle de l\'Agence Spatiale Européenne pour découvrir les planètes !' },
    { title: 'Le Système Solaire CM1‑CM2 — Maître Lucas', url: 'https://www.youtube.com/watch?v=jdInvnIkwIk', emoji: '🌟', age: '7-12 ans', description: 'Cours complet sur les 8 planètes, le Soleil et les satellites naturels.' },
    { title: 'Les Étoiles — National Geographic France', url: 'https://www.youtube.com/watch?v=CDy6kEEClK0', emoji: '★', age: '8-14 ans', description: 'Documentaire de qualité sur la naissance, la vie et la mort des étoiles.' },
    { title: 'L’Espace pour les enfants — Les étoiles 🚀', url: 'https://www.youtube.com/watch?v=q_03QQmiR9Y', emoji: '🔭', age: '6-12 ans', description: 'Voyage à travers les étoiles et l’Univers, expliqué simplement pour les ados.' },
    { title: 'James Webb — Les premières images révolutionnaires (NASA)', url: 'https://www.youtube.com/watch?v=nmMRMIE_asw', emoji: '🔭', age: '8-14 ans', description: 'Les images qui ont changé notre vision de l\'Univers — en direct de la NASA.' },
    { title: 'Mission Perseverance sur Mars (NASA)', url: 'https://www.youtube.com/watch?v=5qqsMjy8Rx0', emoji: '🔴', age: '6-12 ans', description: 'La NASA explore Mars avec son rover et son hélicoptère Ingenuity.' },
]

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5) }

export default function QuizPage() {
    const [level, setLevel] = useState<string | null>(null)
    const [questions, setQuestions] = useState(shuffle(QUIZ_BANK_DEBUTANT).slice(0, 5))
    const [answers, setAnswers] = useState<Record<number, string>>({})
    const [anecdotes] = useState(shuffle(ANECDOTES).slice(0, 4))
    const [tab, setTab] = useState<'quiz' | 'videos' | 'events' | 'anecdotes'>('quiz')

    const startLevel = (id: string) => {
        const lv = LEVELS.find(l => l.id === id)!
        setLevel(id)
        setQuestions(shuffle(lv.bank))
        setAnswers({})
    }
    const currentLevel = LEVELS.find(l => l.id === level)

    const totalAnswered = Object.keys(answers).length
    const totalCorrect = Object.entries(answers).filter(([i, a]) => a === questions[parseInt(i)].answer).length
    const finished = totalAnswered === questions.length

    const reset = () => { setQuestions(shuffle(currentLevel?.bank ?? QUIZ_BANK_DEBUTANT)); setLevel(null); setAnswers({}) }

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="page-header">
                <div className="badge">🎮 COIN DES CURIEUX</div>
                <h1 className="page-title" style={{ background: 'linear-gradient(135deg, #d8b4fe, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Le Coin des Curieux
                </h1>
                <p className="page-subtitle">Vidéos, quiz, anecdotes et événements célestes pour les jeunes explorateurs !</p>
            </motion.div>

            {/* Tab bar */}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
                {[{ id: 'quiz', label: '🧠 Quiz' }, { id: 'videos', label: '🎬 Vidéos' }, { id: 'events', label: '📅 Événements' }, { id: 'anecdotes', label: '💡 Anecdotes' }].map(t => (
                    <button key={t.id} onClick={() => setTab(t.id as typeof tab)} style={{
                        padding: '0.6rem 1.25rem', borderRadius: 10, fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                        background: tab === t.id ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.04)',
                        color: tab === t.id ? '#fff' : '#94a3b8',
                        border: tab === t.id ? 'none' : '1px solid rgba(255,255,255,0.07)',
                        boxShadow: tab === t.id ? '0 0 20px rgba(99,102,241,0.35)' : 'none',
                    }}>{t.label}</button>
                ))}
            </div>

            {tab === 'quiz' && (
                <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {!level ? (
                        /* Level picker */
                        <div>
                            <h2 style={{ textAlign: 'center', color: '#e2e8f0', fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                                🎯 Choisis ton niveau
                            </h2>
                            <p style={{ textAlign: 'center', color: '#475569', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
                                Chaque niveau a ses propres questions — tu peux changer à tout moment !
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                                {LEVELS.map(lv => (
                                    <motion.button key={lv.id} onClick={() => startLevel(lv.id)}
                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        style={{
                                            padding: '1.5rem', borderRadius: '1rem', cursor: 'pointer', textAlign: 'center',
                                            background: `${lv.color}10`, border: `2px solid ${lv.color}30`,
                                            transition: 'all 0.2s',
                                        }}>
                                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{lv.label.split(' ')[0]}</div>
                                        <div style={{ color: lv.color, fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                                            {lv.label.split(' ').slice(1).join(' ')}
                                        </div>
                                        <div style={{ color: '#475569', fontSize: '0.78rem', marginBottom: '0.75rem' }}>{lv.sublabel}</div>
                                        <div style={{ padding: '0.375rem 0.75rem', borderRadius: 99, background: `${lv.color}20`, color: lv.color, fontSize: '0.72rem', fontWeight: 700 }}>
                                            {lv.bank.length} questions
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            {/* Level badge + controls */}
                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                                <div style={{ padding: '0.3rem 0.875rem', borderRadius: 99, background: `${currentLevel!.color}18`, border: `1px solid ${currentLevel!.color}35`, color: currentLevel!.color, fontSize: '0.75rem', fontWeight: 700 }}>
                                    {currentLevel!.label} · {currentLevel!.sublabel}
                                </div>
                                <button onClick={reset} className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>🔄 Changer de niveau</button>
                                {finished && <button onClick={reset} style={{ padding: '0.5rem 1rem', borderRadius: 12, background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>🔄 Recommencer</button>}
                            </div>

                            {/* Score banner when finished */}
                            {finished && (
                                <div className="card" style={{ textAlign: 'center', padding: '1.5rem', marginBottom: '1.5rem', background: totalCorrect >= Math.ceil(questions.length * 0.8) ? 'rgba(16,185,129,0.06)' : 'rgba(251,191,36,0.06)', border: `2px solid ${totalCorrect >= Math.ceil(questions.length * 0.8) ? '#10b981' : '#f59e0b'}30` }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{totalCorrect === questions.length ? '🏆' : totalCorrect >= Math.ceil(questions.length * 0.8) ? '🎉' : '💪'}</div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'Outfit', color: '#e2e8f0' }}>{totalCorrect}/{questions.length}</div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                                        {totalCorrect === questions.length ? 'Parfait ! Tu es un expert de l\'espace ! 🌟' : totalCorrect >= Math.ceil(questions.length * 0.8) ? 'Excellent travail ! Tu maîtrises bien l\'astronomie !' : 'Continue à explorer, tu y arriveras !'}
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {questions.map((q, idx) => {
                                    const chosen = answers[idx]
                                    return (
                                        <div key={idx} className="card" style={{ padding: '1.5rem' }}>
                                            <h3 style={{ color: '#e2e8f0', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>
                                                {q.emoji} Question {idx + 1} — {q.question}
                                            </h3>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginBottom: chosen ? '0.875rem' : 0 }}>
                                                {q.options.map((opt) => {
                                                    let bg = 'rgba(255,255,255,0.04)', border = '1px solid rgba(255,255,255,0.07)', color = '#94a3b8'
                                                    if (chosen) {
                                                        if (opt === q.answer) { bg = 'rgba(16,185,129,0.12)'; border = '2px solid #10b981'; color = '#10b981' }
                                                        else if (opt === chosen) { bg = 'rgba(239,68,68,0.12)'; border = '2px solid #ef4444'; color = '#ef4444' }
                                                        else { color = '#475569' }
                                                    }
                                                    return chosen ? (
                                                        <div key={opt} style={{ padding: '0.75rem 1rem', borderRadius: 10, background: bg, border, color, fontWeight: 600, fontSize: '0.85rem' }}>{opt}</div>
                                                    ) : (
                                                        <button key={opt} onClick={() => setAnswers(prev => ({ ...prev, [idx]: opt }))} style={{
                                                            padding: '0.75rem 1rem', borderRadius: 10, background: bg, border, color,
                                                            fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left',
                                                            transition: 'all 0.15s',
                                                        }}>{opt}</button>
                                                    )
                                                })}
                                            </div>
                                            {chosen && (
                                                <div style={{ padding: '0.75rem 1rem', borderRadius: '0.625rem', background: chosen === q.answer ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', borderLeft: `3px solid ${chosen === q.answer ? '#10b981' : '#ef4444'}` }}>
                                                    <span style={{ color: chosen === q.answer ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                                                        {chosen === q.answer ? '✅ Bravo !' : `❌ Raté ! Bonne réponse : ${q.answer}`}
                                                    </span>
                                                    <span style={{ color: '#94a3b8', fontSize: '0.82rem', marginLeft: '0.5rem' }}>{q.explication}</span>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            {finished && (
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{
                                    marginTop: '2rem', padding: '2rem', borderRadius: '1.25rem', textAlign: 'center',
                                    background: totalCorrect === questions.length ? 'linear-gradient(135deg, rgba(16,185,129,0.1),rgba(99,102,241,0.1))' : 'rgba(255,255,255,0.04)',
                                    border: `2px solid ${totalCorrect === questions.length ? '#10b981' : totalCorrect >= questions.length / 2 ? '#f59e0b' : '#ef4444'}`,
                                }}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                                        {totalCorrect === questions.length ? '🏆' : totalCorrect >= questions.length / 2 ? '⭐' : '💪'}
                                    </div>
                                    <h3 style={{ color: totalCorrect === questions.length ? '#10b981' : totalCorrect >= questions.length / 2 ? '#f59e0b' : '#ef4444', fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.4rem', marginBottom: '0.5rem' }}>
                                        Score : {totalCorrect}/{questions.length} ({Math.round(totalCorrect / questions.length * 100)}%)
                                    </h3>
                                    <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                                        {totalCorrect === questions.length ? 'Score parfait ! Tu es un vrai astronome ! 🌟' : totalCorrect >= questions.length / 2 ? 'Continue comme ça, explore les autres pages pour en apprendre plus !' : 'Pas de panique ! Explore les pages du site et reviens tenter ta chance !'}
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    )}
                </motion.div>
            )}

            {tab === 'videos' && (
                <motion.div key="videos" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                        {VIDEOS.map(v => (
                            <div key={v.title} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{v.emoji}</div>
                                <h3 style={{ color: '#e2e8f0', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.375rem' }}>{v.title}</h3>
                                <p style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: 1.6, marginBottom: '0.875rem' }}>{v.description}</p>
                                <span style={{ fontSize: '0.72rem', color: '#a78bfa', background: 'rgba(167,139,250,0.1)', padding: '2px 10px', borderRadius: 999 }}>{v.age}</span>
                                <br /><br />
                                <a href={v.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>▶ Regarder sur YouTube</a>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {tab === 'events' && (
                <motion.div key="events" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p style={{ color: 'var(--text-subtle)', marginBottom: '1rem', lineHeight: 1.7 }}>
                        Les calendriers astronomiques évoluent chaque année. Ces liens officiels remplacent l’ancien
                        calendrier figé afin de toujours afficher les dates les plus récentes.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                        {OBSERVATION_RESOURCES.map(resource => (
                            <a key={resource.name} href={resource.url} target="_blank" rel="noopener noreferrer" className="card" style={{ padding: '1.25rem', textAlign: 'center', borderTop: '4px solid #6366f1', textDecoration: 'none' }}>
                                <div aria-hidden="true" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{resource.emoji}</div>
                                <strong style={{ color: '#e2e8f0', display: 'block', marginBottom: '0.25rem' }}>{resource.name}</strong>
                                <p style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{resource.detail}</p>
                                <span style={{ color: '#a78bfa', fontSize: '0.72rem', display: 'inline-block', marginTop: '0.75rem' }}>Ouvrir la source NASA ↗</span>
                            </a>
                        ))}
                    </div>
                </motion.div>
            )}

            {tab === 'anecdotes' && (
                <motion.div key="anecdotes" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                        {anecdotes.map((a, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card" style={{ padding: '1.5rem', textAlign: 'center', borderTop: '4px solid #a78bfa' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{a.emoji}</div>
                                <strong style={{ color: '#a78bfa', display: 'block', marginBottom: '0.625rem' }}>{a.title}</strong>
                                <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.7 }}>{a.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    )
}
