"""
SolarScope -- Photo du Jour (APOD).
Image astronomique du jour de la NASA, galerie et explication pour les enfants.
"""

import streamlit as st
import pandas as pd
from datetime import datetime


def _simplify_description(text, max_len=300):
    """Tronque proprement une description anglaise."""
    if not text:
        return ""
    text = str(text)
    if len(text) <= max_len:
        return text
    return text[:max_len].rsplit(" ", 1)[0] + "..."


def render(conn):
    st.markdown(
        "<h2 class='title-style'>🌠 Photo du Jour</h2>",
        unsafe_allow_html=True,
    )
    st.markdown(
        "<p class='subtitle'>Chaque jour, la NASA choisit sa plus belle photo de l'Univers. Laquelle preferes-tu ?</p>",
        unsafe_allow_html=True,
    )

    # Lien live NASA
    st.markdown(
        '<div style="text-align:right;margin-bottom:0.5rem;">'
        '<a href="https://apod.nasa.gov/apod/astropix.html" target="_blank" '
        'style="color:#a78bfa;font-size:0.85rem;">📡 Voir la photo du jour en direct sur NASA →</a>'
        '</div>',
        unsafe_allow_html=True,
    )

    try:
        df = pd.read_sql(
            "SELECT title, description, url, date FROM media ORDER BY date DESC",
            conn,
        )
    except Exception as e:
        st.error(f"Erreur de chargement : {e}")
        return

    if df.empty:
        st.info("Aucune image APOD. Lancez le pipeline d'ingestion.")
        return

    # === Image héro — la plus récente ===
    latest = df.iloc[0]
    date_str = str(latest["date"])
    try:
        dt = datetime.strptime(date_str[:10], "%Y-%m-%d")
        mois = ["janv.", "fevr.", "mars", "avr.", "mai", "juin",
                "juil.", "aout", "sept.", "oct.", "nov.", "dec."]
        date_fr = f"{dt.day} {mois[dt.month-1]} {dt.year}"
    except Exception:
        date_fr = date_str[:10]

    st.markdown(
        f'<div class="update-badge">Derniere image : {date_fr} — {len(df)} photos dans la collection</div>',
        unsafe_allow_html=True,
    )
    st.markdown("<br>", unsafe_allow_html=True)

    # Carte héro
    if latest["url"]:
        col_img, col_info = st.columns([3, 2])
        with col_img:
            st.image(latest["url"], use_column_width=True)
        with col_info:
            desc = _simplify_description(latest["description"], 400)
            st.markdown(
                f'<div class="card" style="height:100%;border-left:4px solid #6366f1;">'
                f'<div style="background:#6366f120;color:#a78bfa;font-size:0.75rem;'
                f'padding:3px 10px;border-radius:10px;display:inline-block;margin-bottom:0.7rem;">'
                f'⭐ Image du {date_fr}</div>'
                f'<h3 style="margin:0 0 0.8rem 0;color:#e2e8f0;">{latest["title"]}</h3>'
                f'<p style="color:#94a3b8;line-height:1.7;font-size:0.9rem;">{desc}</p>'
                f'<a href="https://apod.nasa.gov/apod/astropix.html" target="_blank" '
                f'style="display:inline-block;margin-top:1rem;padding:0.5rem 1.2rem;'
                f'background:linear-gradient(135deg,#6366f1,#8b5cf6);'
                f'color:white;border-radius:8px;text-decoration:none;font-weight:600;">'
                f'Voir sur NASA APOD</a>'
                f'</div>',
                unsafe_allow_html=True,
            )
    st.markdown("<br>", unsafe_allow_html=True)

    # === Fun fact sur les APODs ===
    st.markdown(
        '<div class="card" style="border-left:4px solid #f59e0b;">'
        '<h4>💡 Le savais-tu ?</h4>'
        '<p>L\'APOD (Astronomy Picture of the Day) existe depuis <b>1995</b> ! '
        'C\'est l\'une des pages les plus visitees de NASA. Chaque image est choisie par des astronomes '
        'et accompagnee d\'une explication scientifique. Il y a maintenant plus de <b>10 000 images</b> dans la collection !</p>'
        '</div>',
        unsafe_allow_html=True,
    )

    # === Galerie des images précédentes ===
    if len(df) > 1:
        st.markdown("---")
        st.markdown(
            "<h3 style='text-align:center;'>🖼️ Galerie des images recentes</h3>",
            unsafe_allow_html=True,
        )
        st.markdown("<br>", unsafe_allow_html=True)

        gallery = df.iloc[1:13]  # 12 images
        cols = st.columns(3)
        for i, (_, row) in enumerate(gallery.iterrows()):
            if row["url"]:
                with cols[i % 3]:
                    try:
                        # Format date
                        d = str(row["date"])[:10]
                        try:
                            mois_c = ["janv.", "fevr.", "mars", "avr.", "mai", "juin",
                                      "juil.", "aout", "sept.", "oct.", "nov.", "dec."]
                            dt2 = datetime.strptime(d, "%Y-%m-%d")
                            d_fr = f"{dt2.day} {mois_c[dt2.month-1]}"
                        except Exception:
                            d_fr = d

                        st.image(row["url"], use_column_width=True)
                        st.markdown(
                            f'<p style="font-size:0.78rem;color:#94a3b8;text-align:center;'
                            f'margin:-0.5rem 0 1rem 0;">{row["title"][:50]}{"..." if len(str(row["title"]))>50 else ""} '
                            f'<span style="color:#6366f1;">({d_fr})</span></p>',
                            unsafe_allow_html=True,
                        )
                    except Exception:
                        pass

    # === Liens utiles ===
    st.markdown("---")
    st.markdown(
        '<div class="card">'
        '<h4>🔗 Explorer plus loin</h4>'
        '<ul style="color:#cbd5e1;">'
        '<li><a href="https://apod.nasa.gov/apod/astropix.html" target="_blank" style="color:#a78bfa;">NASA APOD en direct</a> — La photo du jour en temps reel</li>'
        '<li><a href="https://apod.nasa.gov/apod/archivepix.html" target="_blank" style="color:#a78bfa;">Archives APOD</a> — Toutes les images depuis 1995</li>'
        '<li><a href="https://www.nasa.gov/multimedia/imagegallery/" target="_blank" style="color:#a78bfa;">Galerie NASA</a> — Des milliers d\'images spatiales</li>'
        '</ul>'
        '</div>',
        unsafe_allow_html=True,
    )
