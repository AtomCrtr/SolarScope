"""
SolarScope -- Actualites Spatiales.
Sources RSS francophones uniquement, fiables et adaptees aux enfants.
"""

import re
import streamlit as st
from datetime import datetime


# Sources RSS francophones uniquement — testees et fiables
RSS_FEEDS = {
    "🔬 Science et Vie": {
        "url": "https://www.science-et-vie.com/feed",
        "show_images": False,   # bloque le hotlinking
    },
    "🔭 Sciences et Avenir - Espace": {
        "url": "https://www.sciencesetavenir.fr/espace/rss.xml",
        "show_images": True,
    },
    "🗞️ Le Monde - Sciences": {
        "url": "https://www.lemonde.fr/sciences/rss_full.xml",
        "show_images": True,
    },
    "🧪 CNRS Le Journal": {
        "url": "https://lejournal.cnrs.fr/rss",
        "show_images": True,
    },
}


def _fetch_rss(url, max_items=8):
    """Recupere les articles d'un flux RSS."""
    try:
        import feedparser
        feed = feedparser.parse(url)
        return feed.entries[:max_items]
    except ImportError:
        return None
    except Exception:
        return []


def _clean_html(text):
    """Supprime les balises HTML et tronque."""
    return re.sub(r"<[^>]+>", "", text or "").strip()


def _extract_image(entry):
    """Extrait l'URL de la premiere image d'un article RSS (multi-format)."""
    # 1. media:content (format le plus courant)
    if hasattr(entry, "media_content") and entry.media_content:
        for m in entry.media_content:
            if "url" in m:
                return m["url"]
    # 2. enclosure
    if hasattr(entry, "enclosures") and entry.enclosures:
        for enc in entry.enclosures:
            if enc.get("type", "").startswith("image"):
                return enc.get("href", "")
    # 3. content:encoded (Science et Vie, Le Monde...)
    if hasattr(entry, "content") and entry.content:
        for c in entry.content:
            val = c.get("value", "")
            match = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', val)
            if match:
                url = match.group(1)
                if url.startswith("http"):
                    return url
    # 4. img dans le summary
    summary_raw = entry.get("summary", "")
    match = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', summary_raw)
    if match:
        url = match.group(1)
        if url.startswith("http"):
            return url
    return None


def _format_date(published):
    """Formate la date en francais."""
    try:
        from email.utils import parsedate_to_datetime
        dt = parsedate_to_datetime(published)
        mois = ["janv.", "fevr.", "mars", "avr.", "mai", "juin",
                "juil.", "aout", "sept.", "oct.", "nov.", "dec."]
        return f"{dt.day} {mois[dt.month - 1]} {dt.year}"
    except Exception:
        return published[:16] if published else ""


def render(_conn):
    st.markdown(
        "<h2 class='title-style'>📰 Actualites Spatiales</h2>",
        unsafe_allow_html=True,
    )
    st.markdown(
        "<p class='subtitle'>Les dernieres nouvelles de l'espace en francais !</p>",
        unsafe_allow_html=True,
    )

    st.markdown(
        f"<div class='update-badge'>Mis a jour le {datetime.now().strftime('%d/%m/%Y a %H:%M')}</div>",
        unsafe_allow_html=True,
    )

    try:
        import feedparser
    except ImportError:
        st.error("Le module `feedparser` n'est pas installe. Execute : `pip install feedparser`")
        return

    st.markdown("<br>", unsafe_allow_html=True)

    # Selecteur de source
    source_name = st.selectbox(
        "Choisir la source :",
        list(RSS_FEEDS.keys()),
        index=0,
    )

    source = RSS_FEEDS[source_name]
    show_images = source.get("show_images", True)

    with st.spinner("Chargement des actualites..."):
        entries = _fetch_rss(source["url"])

    if entries is None:
        st.error("Module feedparser manquant.")
        return

    if not entries:
        st.warning(f"Aucun article disponible pour *{source_name}* en ce moment. Essaie une autre source !")
        return

    st.markdown(f"**{len(entries)}** articles | *{source_name}*")
    st.markdown("<br>", unsafe_allow_html=True)

    # Affichage des articles
    for entry in entries:
        title = _clean_html(entry.get("title", "Sans titre"))
        raw_summary = _clean_html(entry.get("summary", entry.get("description", "")))
        published = _format_date(entry.get("published", entry.get("updated", "")))
        link = entry.get("link", "")
        img_url = _extract_image(entry) if show_images else None
        summary = raw_summary[:350] + ("..." if len(raw_summary) > 350 else "")

        # Image centree en HTML (gestion erreur integree)
        img_html = ""
        if img_url:
            img_html = (
                f'<div style="text-align:center;margin:0.5rem 0;">'
                f'<img src="{img_url}" '
                f'style="max-height:180px;max-width:100%;border-radius:10px;object-fit:cover;" '
                f'onerror="this.style.display=\'none\'" />'
                f'</div>'
            )

        lien_html = ""
        if link:
            lien_html = f'<a href="{link}" target="_blank" style="color:#a78bfa;font-size:0.85rem;">Lire l&#39;article &rarr;</a>'

        st.markdown(
            f'<div class="card">'
            f'{img_html}'
            f'<h4>{title}</h4>'
            f'<p style="font-size:0.8rem;color:#8b5cf6;font-weight:500;">{published}</p>'
            f'<p style="color:#cbd5e1;font-size:0.9rem;">{summary}</p>'
            f'{lien_html}'
            f'</div>',
            unsafe_allow_html=True,
        )

        st.markdown("<br>", unsafe_allow_html=True)

    # Mini-dictionnaire
    st.markdown("---")
    with st.expander("📖 Dictionnaire spatial — comprendre les articles"):
        vocab = {
            "Asteroide 🪨": "Un gros rocher qui flotte dans l'espace, souvent entre Mars et Jupiter.",
            "Comete ☄️": "Une boule de glace et de poussiere qui forme une belle queue pres du Soleil.",
            "Eruption solaire ⚡": "Une explosion a la surface du Soleil qui envoie des particules dans l'espace.",
            "Exoplanete 🪐": "Une planete qui tourne autour d'une autre etoile que le Soleil.",
            "Galaxie 🌌": "Un ensemble de milliards d'etoiles. La notre s'appelle la Voie Lactee.",
            "Nebuleuse ✨": "Un nuage de gaz et de poussiere ou naissent les etoiles.",
            "Rover 🤖": "Un robot-vehicule envoye sur une planete pour l'explorer.",
            "Trou noir ⚫": "Un endroit ou la gravite est si forte que meme la lumiere ne s'en echappe pas.",
            "Annee-lumiere 📏": "La distance parcourue par la lumiere en 1 an : 9 461 milliards de km !",
            "Zone habitable 💧": "La zone autour d'une etoile ou l'eau peut etre liquide et la vie possible.",
        }
        cols = st.columns(2)
        for i, (terme, definition) in enumerate(vocab.items()):
            with cols[i % 2]:
                st.markdown(
                    f'<div class="card" style="padding:0.8rem;">'
                    f'<b style="color:#a78bfa;">{terme}</b><br>'
                    f'<span style="color:#cbd5e1;font-size:0.9rem;">{definition}</span>'
                    f'</div>',
                    unsafe_allow_html=True,
                )

    # Track page
    if "visited_pages" not in st.session_state:
        st.session_state.visited_pages = set()
    st.session_state.visited_pages.add("Actualites Spatiales")
