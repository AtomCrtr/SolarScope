'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { NewsArticle } from '@/lib/space-data'

const CATEGORY_COLORS: Record<string, string> = {
  Mars: '#f87171',
  Univers: '#a78bfa',
  Astéroïdes: '#fb923c',
  Exploration: '#818cf8',
  Soleil: '#fbbf24',
  Terre: '#34d399',
  Sciences: '#38bdf8',
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function ActualitesPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Tous')

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/news', { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error('news unavailable')
        return response.json() as Promise<{ articles: NewsArticle[]; updatedAt: string }>
      })
      .then(data => {
        setArticles(data.articles)
        setUpdatedAt(data.updatedAt)
      })
      .catch(fetchError => {
        if (fetchError instanceof DOMException && fetchError.name === 'AbortError') return
        setError(true)
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [])

  const categories = useMemo(
    () => ['Tous', ...Array.from(new Set(articles.map(article => article.category)))],
    [articles],
  )

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return articles.filter(article =>
      (category === 'Tous' || article.category === category) &&
      (!query || `${article.title} ${article.summary}`.toLowerCase().includes(query)),
    )
  }, [articles, category, search])

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
      <motion.header initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="page-header">
        <div className="badge">📰 PUBLICATIONS OFFICIELLES</div>
        <h1 className="page-title gradient-text-blue">Actualités spatiales</h1>
        <p className="page-subtitle">
          Le fil récemment publié par la NASA, sans titres artificiels ni dates figées.
        </p>
      </motion.header>

      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span className={error ? 'live-orb is-loading' : 'live-orb'} />
          <div>
            <div style={{ color: 'var(--text)', fontSize: '0.8rem', fontWeight: 700 }}>
              {error ? 'Flux temporairement indisponible' : 'Flux officiel NASA connecté'}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>
              {updatedAt ? `Actualisé à ${new Date(updatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` : 'Synchronisation en cours'} · Articles en anglais
            </div>
          </div>
        </div>
        <a href="https://www.nasa.gov/rss-feeds/" target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ padding: '0.55rem 1rem', fontSize: '0.75rem' }}>
          Vérifier la source ↗
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 1fr) auto', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem' }} className="max-sm:grid-cols-1">
        <label style={{ position: 'relative' }}>
          <span className="sr-only">Rechercher dans les articles</span>
          <input
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Rechercher dans les publications…"
            style={{
              width: '100%', padding: '0.8rem 1rem 0.8rem 2.6rem', borderRadius: '0.85rem',
              background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)',
              font: 'inherit', fontSize: '0.82rem', outline: 'none',
            }}
          />
          <span aria-hidden="true" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>⌕</span>
        </label>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textAlign: 'right' }}>
          {loading ? 'Chargement…' : `${filtered.length} publication${filtered.length > 1 ? 's' : ''}`}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {categories.map(item => {
          const color = CATEGORY_COLORS[item] || '#818cf8'
          const selected = item === category
          return (
            <button
              key={item}
              onClick={() => setCategory(item)}
              aria-pressed={selected}
              style={{
                padding: '0.38rem 0.8rem', borderRadius: 999, cursor: 'pointer',
                background: selected ? `${color}18` : 'var(--surface)',
                border: `1px solid ${selected ? `${color}55` : 'var(--border)'}`,
                color: selected ? color : 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 700,
              }}
            >
              {item}
            </button>
          )
        })}
      </div>

      {loading && (
        <div className="grid-3" aria-label="Chargement des actualités">
          {[0, 1, 2, 3, 4, 5].map(index => <div key={index} className="skeleton-card" style={{ height: 240 }} />)}
        </div>
      )}

      {!loading && error && (
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📡</div>
          <h2 style={{ color: 'var(--text)', font: "700 1.1rem 'Outfit', sans-serif" }}>Impossible de joindre le flux NASA</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.4rem' }}>Réessayez dans quelques instants ou consultez directement la source officielle.</p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="card" style={{ padding: '2rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          Aucun article ne correspond à cette recherche.
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1rem' }}>
          {filtered.map((article, index) => {
            const color = CATEGORY_COLORS[article.category] || '#818cf8'
            return (
              <motion.a
                key={`${article.url}-${index}`}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.035, 0.35) }}
                style={{ minHeight: 245, padding: '1.4rem', textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'center' }}>
                  <span style={{ color, background: `${color}12`, border: `1px solid ${color}30`, borderRadius: 999, padding: '0.2rem 0.65rem', fontSize: '0.64rem', fontWeight: 800 }}>
                    {article.category}
                  </span>
                  <time dateTime={article.date} style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>{formatDate(article.date)}</time>
                </div>
                <h2 style={{ margin: '1rem 0 0.6rem', color: 'var(--text)', font: "750 1rem/1.45 'Outfit', sans-serif" }}>{article.title}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.77rem', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {article.summary}
                </p>
                <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', color: '#7c8ca4', fontSize: '0.7rem' }}>
                  <span>NASA</span><span style={{ color }}>Lire l’article ↗</span>
                </div>
              </motion.a>
            )
          })}
        </div>
      )}
    </div>
  )
}
