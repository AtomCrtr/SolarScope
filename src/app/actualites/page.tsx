'use client'

import { useEffect, useMemo, useState } from 'react'
import SpaceIcon from '@/components/ui/SpaceIcon'

import type { NewsArticle } from '@/lib/data/space-data'
import KidsGuide from '@/components/learning/KidsGuide'
import { useSiteLocale } from '@/components/layout/LanguageToggle'

const CATEGORY_COLORS: Record<string, string> = {
  'Système solaire': '#ffb27a',
  Mars: '#f87171',
  Univers: '#a78bfa',
  Astéroïdes: '#fb923c',
  Exploration: '#818cf8',
  Soleil: '#fbbf24',
  Terre: '#34d399',
  Sciences: '#38bdf8',
}

// Categories are computed in French by the server; English pages translate them for display.
const CATEGORY_EN: Record<string, string> = {
  'Système solaire': 'Solar System', Mars: 'Mars', Univers: 'Universe', Astéroïdes: 'Asteroids',
  Exploration: 'Exploration', Soleil: 'Sun', Terre: 'Earth', Sciences: 'Science',
}

const COPY = {
  fr: {
    date: 'fr-FR', unknownDate: 'Date inconnue', all: 'Toutes', badge: 'PUBLICATIONS OFFICIELLES', title: 'Actualités spatiales',
    subtitle: 'Les nouvelles publiées par la NASA, avec leur date et leur source pour pouvoir les vérifier.',
    feedDown: 'Flux temporairement indisponible', feedOk: 'Flux officiel NASA connecté', updated: (time: string) => `Actualisé à ${time}`, syncing: 'Synchronisation en cours', english: 'Articles en anglais',
    checkSource: 'Vérifier la source ↗', searchLabel: 'Rechercher dans les articles', search: 'Rechercher dans les publications…', loading: 'Chargement…', count: (n: number) => `${n} publication${n > 1 ? 's' : ''}`,
    loadingLabel: 'Chargement des actualités', downTitle: 'Impossible de joindre le flux NASA', downText: 'Réessayez dans quelques instants ou consultez directement la source officielle.',
    empty: 'Aucun article ne correspond à cette recherche.', read: 'Lire l’article ↗',
  },
  en: {
    date: 'en-GB', unknownDate: 'Unknown date', all: 'All', badge: 'OFFICIAL PUBLICATIONS', title: 'Space news',
    subtitle: 'News published by NASA, with its date and source so you can check it.',
    feedDown: 'Feed temporarily unavailable', feedOk: 'Official NASA feed connected', updated: (time: string) => `Updated at ${time}`, syncing: 'Syncing', english: 'Articles in English',
    checkSource: 'Check the source ↗', searchLabel: 'Search the articles', search: 'Search the publications…', loading: 'Loading…', count: (n: number) => `${n} publication${n === 1 ? '' : 's'}`,
    loadingLabel: 'Loading the news', downTitle: 'Cannot reach the NASA feed', downText: 'Try again in a few moments, or go straight to the official source.',
    empty: 'No article matches this search.', read: 'Read the article ↗',
  },
}

type Copy = (typeof COPY)['fr']

function formatDate(date: string | null, copy: Copy) {
  if (!date) return copy.unknownDate
  return new Date(date).toLocaleDateString(copy.date, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function ActualitesPage() {
  const locale = useSiteLocale()
  const t = COPY[locale]
  const categoryName = (category: string) => (locale === 'en' ? CATEGORY_EN[category] ?? category : category)
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

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
    () => ['all', ...Array.from(new Set(articles.map(article => article.category)))],
    [articles],
  )

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return articles.filter(article =>
      (category === 'all' || article.category === category) &&
      (!query || `${article.title} ${article.summary}`.toLowerCase().includes(query)),
    )
  }, [articles, category, search])

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
      <header className="page-header motion-enter">
        <div className="badge"><SpaceIcon name="news" size={18} className="inline-icon" /> {t.badge}</div>
        <h1 className="page-title">{t.title}</h1>
        <p className="page-subtitle">{t.subtitle}</p>
      </header>

      <KidsGuide topic="actualites" />

      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span className={error ? 'live-orb is-loading' : 'live-orb'} />
          <div>
            <div style={{ color: 'var(--text)', fontSize: '0.8rem', fontWeight: 700 }}>
              {error ? t.feedDown : t.feedOk}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>
              {updatedAt ? t.updated(new Date(updatedAt).toLocaleTimeString(t.date, { hour: '2-digit', minute: '2-digit' })) : t.syncing} · {t.english}
            </div>
          </div>
        </div>
        <a href="https://www.nasa.gov/rss-feeds/" target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ padding: '0.55rem 1rem', fontSize: '0.75rem' }}>
          {t.checkSource}
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 1fr) auto', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem' }} className="max-sm:grid-cols-1">
        <label style={{ position: 'relative' }}>
          <span className="sr-only">{t.searchLabel}</span>
          <input
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder={t.search}
            style={{
              width: '100%', padding: '0.8rem 1rem 0.8rem 2.6rem', borderRadius: '0.85rem',
              background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)',
              font: 'inherit', fontSize: '0.82rem', outline: 'none',
            }}
          />
          <span aria-hidden="true" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>⌕</span>
        </label>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textAlign: 'right' }} aria-live="polite">
          {loading ? t.loading : t.count(filtered.length)}
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
              {item === 'all' ? t.all : categoryName(item)}
            </button>
          )
        })}
      </div>

      {loading && (
        <div className="grid-3" role="status" aria-label={t.loadingLabel} aria-busy="true">
          {[0, 1, 2, 3, 4, 5].map(index => <div key={index} className="skeleton-card" style={{ height: 240 }} />)}
        </div>
      )}

      {!loading && error && (
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}><SpaceIcon name="signal" size={18} className="inline-icon" /></div>
          <h2 style={{ color: 'var(--text)', font: "700 1.1rem var(--font-display)" }}>{t.downTitle}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.4rem' }}>{t.downText}</p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="card" style={{ padding: '2rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          {t.empty}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1rem' }}>
          {filtered.map((article, index) => {
            const color = CATEGORY_COLORS[article.category] || '#818cf8'
            return (
              <a key={`${article.url}-${index}`} href={article.url} target="_blank" rel="noopener noreferrer" className="card motion-enter" style={{ animationDelay: `${Math.min(index * 0.035, 0.35)}s`, minHeight: 245, padding: '1.4rem', textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'center' }}>
                  <span style={{ color, background: `${color}12`, border: `1px solid ${color}30`, borderRadius: 999, padding: '0.2rem 0.65rem', fontSize: '0.64rem', fontWeight: 800 }}>
                    {categoryName(article.category)}
                  </span>
                  <time dateTime={article.date ?? undefined} style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>{formatDate(article.date, t)}</time>
                </div>
                <h2 lang="en" style={{ margin: '1rem 0 0.6rem', color: 'var(--text)', font: "750 1rem/1.45 var(--font-display)" }}>{article.title}</h2>
                <p lang="en" style={{ color: 'var(--text-muted)', fontSize: '0.77rem', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {article.summary}
                </p>
                <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', color: '#7c8ca4', fontSize: '0.7rem' }}>
                  <span>NASA</span><span style={{ color }}>{t.read}</span>
                </div>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
