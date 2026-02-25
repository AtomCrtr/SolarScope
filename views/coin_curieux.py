"""
SolarScope -- Le Coin des Curieux.
Videos educatives, quiz interactif (cartes emoji), anecdotes, SolarBot.
"""

import streamlit as st
import random


VIDEOS = [
    {
        "title": "Le Systeme Solaire explique",
        "url": "https://www.youtube.com/watch?v=lsmgCY0AYmw",
        "description": "Voyage ludique a travers les 8 planetes !",
        "age": "7-12 ans",
        "emoji": "🪐",
        "thumb": "https://img.youtube.com/vi/lsmgCY0AYmw/mqdefault.jpg",
    },
    {
        "title": "Le Systeme Solaire — Les petites tetes",
        "url": "https://www.youtube.com/watch?v=MXrsJTrlmn8",
        "description": "L'astronaute Louise te guide dans une aventure captivante !",
        "age": "5-10 ans",
        "emoji": "🚀",
        "thumb": "https://img.youtube.com/vi/MXrsJTrlmn8/mqdefault.jpg",
    },
    {
        "title": "L'Univers explique aux enfants",
        "url": "https://www.youtube.com/watch?v=zRbwfN0vols",
        "description": "Galaxies, etoiles, planetes... Tout sur l'Univers.",
        "age": "8-14 ans",
        "emoji": "🌌",
        "thumb": "https://img.youtube.com/vi/zRbwfN0vols/mqdefault.jpg",
    },
    {
        "title": "Direction Mars et l'Espace",
        "url": "https://www.youtube.com/watch?v=iKUzVoxgl6Q",
        "description": "Decouvre Mars et la Station Spatiale Internationale !",
        "age": "6-12 ans",
        "emoji": "🔴",
        "thumb": "https://img.youtube.com/vi/iKUzVoxgl6Q/mqdefault.jpg",
    },
    {
        "title": "C'est pas Sorcier — Systeme Solaire",
        "url": "https://www.youtube.com/watch?v=I7cajVnzm4k",
        "description": "Le classique avec Fred et Jamy !",
        "age": "7-14 ans",
        "emoji": "🔬",
        "thumb": "https://img.youtube.com/vi/I7cajVnzm4k/mqdefault.jpg",
    },
    {
        "title": "Voyage dans l'espace",
        "url": "https://www.youtube.com/watch?v=xYfV4HEUqKQ",
        "description": "Introduction a l'espace pour les plus jeunes explorateurs.",
        "age": "6-10 ans",
        "emoji": "✨",
        "thumb": "https://img.youtube.com/vi/xYfV4HEUqKQ/mqdefault.jpg",
    },
]

QUIZ_BANK = [
    {
        "question": "Quelle est la plus grande planete du Systeme solaire ?",
        "options": ["🪐 Saturne", "🟠 Jupiter", "🔵 Neptune", "🟦 Uranus"],
        "answer": "🟠 Jupiter",
        "explication": "Jupiter est tellement grande qu'elle pourrait contenir 1 300 Terres !",
        "emoji": "🌍",
    },
    {
        "question": "Quelle planete est la plus chaude ?",
        "options": ["⚫ Mercure", "🟡 Venus", "🔴 Mars", "🟠 Jupiter"],
        "answer": "🟡 Venus",
        "explication": "Son atmosphere epaisse piege la chaleur comme une serre geante !",
        "emoji": "🌡️",
    },
    {
        "question": "Combien de lunes a Mars ?",
        "options": ["0️⃣ Zero", "1️⃣ Une", "2️⃣ Deux", "5️⃣ Cinq"],
        "answer": "2️⃣ Deux",
        "explication": "Phobos (la peur) et Deimos (la terreur) — de petites lunes rocheuses !",
        "emoji": "🌙",
    },
    {
        "question": "Qu'est-ce qu'une etoile filante ?",
        "options": ["⭐ Une etoile qui tombe", "🪨 Un morceau de roche qui brule", "🛰️ Un satellite", "🪐 Une planete lointaine"],
        "answer": "🪨 Un morceau de roche qui brule",
        "explication": "Des roches qui brulent en entrant dans l'atmosphere — pas du tout des etoiles !",
        "emoji": "☄️",
    },
    {
        "question": "Quelle planete a les plus grands anneaux ?",
        "options": ["🟠 Jupiter", "🔵 Uranus", "🪐 Saturne", "🔵 Neptune"],
        "answer": "🪐 Saturne",
        "explication": "Les anneaux de Saturne ont 282 000 km de large — mais seulement 30 m d'epaisseur !",
        "emoji": "💍",
    },
    {
        "question": "Combien de temps met la lumiere du Soleil pour arriver sur Terre ?",
        "options": ["⚡ 8 secondes", "⏱️ 8 minutes", "🕐 8 heures", "📅 8 jours"],
        "answer": "⏱️ 8 minutes",
        "explication": "La lumiere voyage a 300 000 km/s et le Soleil est a 150 millions de km !",
        "emoji": "☀️",
    },
    {
        "question": "Quel est le plus grand volcan du systeme solaire ?",
        "options": ["🌋 L'Etna", "🏔️ Olympus Mons", "⛰️ Le Mauna Kea", "💨 Le Vesuve"],
        "answer": "🏔️ Olympus Mons",
        "explication": "Olympus Mons sur Mars culmine a 21 km, soit 3 fois l'Everest !",
        "emoji": "🌋",
    },
    {
        "question": "De quoi sont faits les anneaux de Saturne ?",
        "options": ["💨 De gaz", "🧊 De glace et de roche", "🌫️ De poussiere", "🔩 De metal"],
        "answer": "🧊 De glace et de roche",
        "explication": "Des milliards de morceaux, du grain de sable a la taille d'une maison !",
        "emoji": "🪐",
    },
]

ANECDOTES = [
    ("🪐 Saturne flotte !", "Saturne est la seule planete moins dense que l'eau. Elle flotterait dans une piscine geante !"),
    ("⏰ Un jour sur Venus", "Un jour sur Venus dure plus longtemps qu'une annee entiere sur Venus. Le temps s'y ecoule a l'envers !"),
    ("👣 Empreintes eternelles", "Les empreintes des astronautes sur la Lune sont toujours la. Sans vent ni pluie, elles dureront des millions d'annees."),
    ("🌋 Le plus grand volcan", "Olympus Mons sur Mars = 21 km de haut, soit 3 fois l'Everest !"),
    ("💎 Pluie de diamants", "Sur Neptune, la pression extreme transforme le carbone en diamants... qui tombent comme de la pluie !"),
    ("🌊 Ocean cache", "Europe (lune de Jupiter) cache un ocean sous sa glace, peut-etre plus grand que tous les oceans terrestres !"),
    ("💧 Mars etait bleue", "Il y a des milliards d'annees, Mars avait des rivieres et peut-etre un ocean entier."),
    ("⚖️ Le Soleil perd du poids", "Le Soleil perd 4 millions de tonnes par seconde... mais il lui reste du carburant pour 5 milliards d'annees !"),
]


def _generate_ai_quiz():
    """Genere un quiz via Gemini."""
    try:
        from gemini_ai import ask_gemini
        prompt = (
            "Genere exactement 3 questions de quiz sur l'espace pour des enfants de 8 a 14 ans. "
            "Pour chaque question, donne : la question, 4 options (commencant chacune par un emoji different), "
            "la bonne reponse (exactement comme dans options), et une explication fun. "
            "Format STRICTEMENT en JSON (pas de markdown, juste le JSON pur) :\n"
            '[{"question":"...","options":["🔴 A","🟠 B","🟡 C","🟢 D"],"answer":"🟠 B","explication":"...","emoji":"🚀"}]'
        )
        result = ask_gemini(prompt, context="Quiz educatif spatial")
        if result:
            import json
            clean = result.strip()
            if clean.startswith("```"):
                clean = clean.split("\n", 1)[1]
            if clean.endswith("```"):
                clean = clean.rsplit("```", 1)[0]
            return json.loads(clean.strip())
    except Exception:
        pass
    return None


def render(_conn):
    st.markdown(
        "<h2 class='title-style'>🔭 Le Coin des Curieux</h2>",
        unsafe_allow_html=True,
    )
    st.markdown(
        "<p class='subtitle'>Videos, quiz, anecdotes et histoires pour les jeunes explorateurs de l'Univers !</p>",
        unsafe_allow_html=True,
    )

    # =========================================================
    # === VIDEOS EDUCATIVES — grille 3 colonnes avec miniature
    # =========================================================
    st.markdown("---")
    st.markdown(
        "<h3 style='text-align:center;'>🎬 Videos educatives</h3>"
        "<p style='text-align:center;color:#94a3b8;'>Clique sur une video pour la regarder sur YouTube !</p>",
        unsafe_allow_html=True,
    )
    st.markdown("<br>", unsafe_allow_html=True)

    cols = st.columns(3)
    for i, video in enumerate(VIDEOS):
        with cols[i % 3]:
            title = video["title"].replace("'", "&#39;")
            desc = video["description"].replace("'", "&#39;")
            st.markdown(
                f'<div class="card" style="text-align:center;">'
                f'<p style="font-size:1.6rem;margin:0 0 0.4rem 0;">{video["emoji"]}</p>'
                f'<p style="font-weight:700;color:#e2e8f0;margin:0 0 0.4rem 0;font-size:0.9rem;">{title}</p>'
                f'<p style="color:#94a3b8;font-size:0.82rem;margin:0 0 0.7rem 0;">{desc}</p>'
                f'<span style="background:#8b5cf620;color:#a78bfa;font-size:0.75rem;'
                f'padding:2px 10px;border-radius:10px;">{video["age"]}</span>'
                f'<br><br>'
                f'<a href="{video["url"]}" target="_blank" '
                f'style="display:inline-block;padding:0.45rem 1.1rem;'
                f'background:linear-gradient(135deg,#6366f1,#8b5cf6);'
                f'color:white;border-radius:8px;text-decoration:none;'
                f'font-weight:600;font-size:0.85rem;">▶ Regarder sur YouTube</a>'
                f'</div>',
                unsafe_allow_html=True,
            )
    st.markdown("<br>", unsafe_allow_html=True)

    # =========================================================
    # === QUIZ — cartes cliquables avec feedback couleur
    # =========================================================
    st.markdown("---")
    st.markdown(
        "<h3 style='text-align:center;'>🧠 Quiz Spatial</h3>"
        "<p style='text-align:center;color:#94a3b8;'>Clique sur la bonne reponse !</p>",
        unsafe_allow_html=True,
    )
    st.markdown("<br>", unsafe_allow_html=True)

    # Boutons de controle
    c1, c2, c3 = st.columns([1, 1, 1])
    with c1:
        if st.button("🎲 Nouvelles questions", use_container_width=True):
            # Nettoyer toutes les réponses précédentes
            for k in list(st.session_state.keys()):
                if k.startswith("qa_"):
                    del st.session_state[k]
            st.session_state.quiz_questions = random.sample(QUIZ_BANK, min(4, len(QUIZ_BANK)))
            st.session_state.pop("ai_quiz", None)
            st.rerun()
    with c2:
        if st.button("🤖 Quiz IA (Gemini)", use_container_width=True):
            for k in list(st.session_state.keys()):
                if k.startswith("qa_"):
                    del st.session_state[k]
            with st.spinner("Gemini prepare des questions originales..."):
                ai_q = _generate_ai_quiz()
                if ai_q:
                    st.session_state.ai_quiz = ai_q
                    st.session_state.pop("quiz_questions", None)
                    st.rerun()
                else:
                    st.warning("Quiz IA indisponible, questions classiques utilisees.")
    with c3:
        if st.button("🔄 Recommencer", use_container_width=True):
            for k in list(st.session_state.keys()):
                if k.startswith("qa_"):
                    del st.session_state[k]
            st.rerun()

    # Choix des questions
    if "ai_quiz" in st.session_state:
        quiz_data = st.session_state.ai_quiz
        st.success("✨ Questions generees par l'IA Gemini !")
    else:
        if "quiz_questions" not in st.session_state:
            st.session_state.quiz_questions = random.sample(QUIZ_BANK, min(4, len(QUIZ_BANK)))
        quiz_data = st.session_state.quiz_questions

    total_correct = 0
    total_answered = 0

    for idx, q in enumerate(quiz_data):
        key = f"qa_{idx}"
        chosen = st.session_state.get(key)

        st.markdown(
            f'<div class="card" style="border-left:4px solid #6366f1;">'
            f'<h4 style="margin:0 0 1rem 0;">{q.get("emoji","❓")} Question {idx+1} — {q["question"]}</h4>'
            f'</div>',
            unsafe_allow_html=True,
        )

        # Cartes de réponse en grille 2x2
        cols_q = st.columns(2)
        for oi, option in enumerate(q["options"]):
            with cols_q[oi % 2]:
                # Couleur selon état
                if chosen is None:
                    bg = "background:#1e293b;"
                    border = "border:2px solid #334155;"
                    txt_color = "color:#e2e8f0;"
                elif option == q["answer"]:
                    bg = "background:#10b98120;"
                    border = "border:2px solid #10b981;"
                    txt_color = "color:#10b981;"
                elif option == chosen and option != q["answer"]:
                    bg = "background:#ef444420;"
                    border = "border:2px solid #ef4444;"
                    txt_color = "color:#ef4444;"
                else:
                    bg = "background:#0f172a;"
                    border = "border:2px solid #1e293b;"
                    txt_color = "color:#475569;"

                disabled = chosen is not None
                btn_label = option

                if not disabled:
                    if st.button(
                        btn_label,
                        key=f"opt_{idx}_{oi}",
                        use_container_width=True,
                    ):
                        st.session_state[key] = option
                        st.rerun()
                else:
                    # Afficher comme carte colorée
                    st.markdown(
                        f'<div style="{bg}{border};border-radius:10px;padding:0.7rem 1rem;'
                        f'text-align:center;font-weight:600;{txt_color}font-size:0.95rem;">'
                        f'{option}</div>',
                        unsafe_allow_html=True,
                    )

        # Feedback après réponse
        if chosen is not None:
            total_answered += 1
            if chosen == q["answer"]:
                total_correct += 1
                st.markdown(
                    f'<div style="background:#10b98115;border-left:4px solid #10b981;'
                    f'border-radius:8px;padding:0.7rem 1rem;margin-top:0.5rem;">'
                    f'<b style="color:#10b981;">✅ Bravo !</b> '
                    f'<span style="color:#94a3b8;">{q.get("explication","")}</span></div>',
                    unsafe_allow_html=True,
                )
            else:
                st.markdown(
                    f'<div style="background:#ef444415;border-left:4px solid #ef4444;'
                    f'border-radius:8px;padding:0.7rem 1rem;margin-top:0.5rem;">'
                    f'<b style="color:#ef4444;">❌ Raté !</b> '
                    f'<span style="color:#94a3b8;">Bonne reponse : <b style="color:#f59e0b;">{q["answer"]}</b> — {q.get("explication","")}</span></div>',
                    unsafe_allow_html=True,
                )
        st.markdown("<br>", unsafe_allow_html=True)

    # Score final
    if total_answered == len(quiz_data) and total_answered > 0:
        pct = int(total_correct / len(quiz_data) * 100)
        if total_correct == len(quiz_data):
            st.balloons()
            st.markdown(
                f'<div style="background:linear-gradient(135deg,#10b98120,#6366f120);border:2px solid #10b981;'
                f'border-radius:16px;padding:1.5rem;text-align:center;">'
                f'<div style="font-size:2rem;">🏆</div>'
                f'<h3 style="color:#10b981;margin:0.5rem 0;">Score parfait ! {total_correct}/{len(quiz_data)}</h3>'
                f'<p style="color:#94a3b8;">Tu es un vrai astronome ! Essaie le quiz IA pour plus de challenge !</p>'
                f'</div>',
                unsafe_allow_html=True,
            )
        elif total_correct >= len(quiz_data) // 2:
            st.markdown(
                f'<div style="background:#f59e0b15;border:2px solid #f59e0b;'
                f'border-radius:16px;padding:1.5rem;text-align:center;">'
                f'<div style="font-size:2rem;">⭐</div>'
                f'<h3 style="color:#f59e0b;margin:0.5rem 0;">Bon score ! {total_correct}/{len(quiz_data)} ({pct}%)</h3>'
                f'<p style="color:#94a3b8;">Continue comme ca, explore les autres pages pour en apprendre plus !</p>'
                f'</div>',
                unsafe_allow_html=True,
            )
        else:
            st.markdown(
                f'<div style="background:#ef444415;border:2px solid #ef4444;'
                f'border-radius:16px;padding:1.5rem;text-align:center;">'
                f'<div style="font-size:2rem;">💪</div>'
                f'<h3 style="color:#ef4444;margin:0.5rem 0;">Score : {total_correct}/{len(quiz_data)}</h3>'
                f'<p style="color:#94a3b8;">Pas de panique ! Explore les pages du site et reviens tenter ta chance !</p>'
                f'</div>',
                unsafe_allow_html=True,
            )

    # =========================================================
    # === ANECDOTES — cartes WOW
    # =========================================================
    st.markdown("---")
    st.markdown(
        "<h3 style='text-align:center;'>💡 Le savais-tu ?</h3>",
        unsafe_allow_html=True,
    )
    st.markdown("<br>", unsafe_allow_html=True)

    selected = random.sample(ANECDOTES, min(4, len(ANECDOTES)))
    a_cols = st.columns(2)
    for i, (titre, texte) in enumerate(selected):
        with a_cols[i % 2]:
            st.markdown(
                f'<div class="card" style="border-top:4px solid #a78bfa;text-align:center;">'
                f'<p style="font-size:1.5rem;margin:0 0 0.5rem 0;">{titre.split()[0]}</p>'
                f'<b style="color:#a78bfa;">{titre[len(titre.split()[0]):].strip()}</b>'
                f'<p style="color:#94a3b8;margin-top:0.5rem;font-size:0.9rem;">{texte}</p>'
                f'</div>',
                unsafe_allow_html=True,
            )

    # =========================================================
    # === EVENEMENTS CELESTES
    # =========================================================
    st.markdown("---")
    st.markdown(
        "<h3 style='text-align:center;'>📅 Prochains evenements celestes</h3>",
        unsafe_allow_html=True,
    )

    events = [
        ("🌕", "14 mars 2026", "Pleine lune du Ver", "Visible a l'oeil nu"),
        ("🌑", "29 mars 2026", "Nouvelle lune", "Ideal pour observer les etoiles"),
        ("☄️", "Avril 2026", "Pluie de Lyrides", "20 etoiles filantes / heure"),
        ("🌑☀️", "12 aout 2026", "Eclipse solaire totale", "Evenement exceptionnel !"),
        ("🔴", "7 sept. 2026", "Eclipse lunaire partielle", "La Lune devient rouge"),
        ("✨", "Dec. 2026", "Pluie de Geminides", "La plus belle de l'annee"),
    ]

    ev_cols = st.columns(3)
    for i, (emoji, date, nom, detail) in enumerate(events):
        with ev_cols[i % 3]:
            highlight = "border-top:4px solid #f59e0b;" if "Eclipse" in nom and "totale" in detail else "border-top:4px solid #6366f1;"
            st.markdown(
                f'<div class="card" style="{highlight}text-align:center;padding:1rem;">'
                f'<div style="font-size:2rem;">{emoji}</div>'
                f'<p style="color:#8b5cf6;font-size:0.8rem;font-weight:600;margin:0.3rem 0;">{date}</p>'
                f'<b style="color:#e2e8f0;">{nom}</b>'
                f'<p style="color:#94a3b8;font-size:0.82rem;margin-top:0.3rem;">{detail}</p>'
                f'</div>',
                unsafe_allow_html=True,
            )

    # =========================================================
    # === GEMINI — Histoires spatiales + SolarBot
    # =========================================================
    st.markdown("---")
    try:
        from gemini_ai import ask_gemini, render_chat_widget

        st.markdown(
            "<h3 style='text-align:center;'>📖 Gemini raconte une histoire spatiale</h3>"
            "<p style='text-align:center;color:#94a3b8;'>Choisis un theme et l'IA ecrit une aventure rien que pour toi !</p>",
            unsafe_allow_html=True,
        )
        st.markdown("<br>", unsafe_allow_html=True)

        story_themes = {
            "👨‍🚀 Premier pas sur la Lune": "Raconte l'histoire du premier pas de Neil Armstrong sur la Lune en 1969, comme si l'enfant y etait. Maximum 200 mots, style aventure pour enfants de 8-12 ans.",
            "⚫ Voyage vers un trou noir": "Raconte une histoire d'un vaisseau spatial qui s'approche d'un trou noir. Explique ce qui se passe avec le temps et la lumiere. Maximum 200 mots, pour enfants de 8-12 ans.",
            "🔴 A la recherche de vie sur Mars": "Raconte l'histoire d'un rover qui decouvre quelque chose de surprenant sur Mars. Maximum 200 mots, pour enfants de 8-12 ans.",
            "👽 Rencontre extraterrestre": "Raconte l'histoire d'un premier contact avec des extraterrestres amicaux qui visitent la Terre. Maximum 200 mots, pour enfants de 8-12 ans.",
            "🌊 Mission sur Europe (lune de Jupiter)": "Raconte l'histoire d'une mission pour explorer l'ocean sous la glace d'Europe. Maximum 200 mots, pour enfants de 8-12 ans.",
        }

        theme_cols = st.columns(len(story_themes))
        if "selected_theme" not in st.session_state:
            st.session_state.selected_theme = list(story_themes.keys())[0]

        for i, (th_name, _) in enumerate(story_themes.items()):
            with theme_cols[i]:
                is_sel = st.session_state.selected_theme == th_name
                if st.button(
                    th_name,
                    key=f"theme_{i}",
                    use_container_width=True,
                ):
                    st.session_state.selected_theme = th_name
                    st.session_state.pop("generated_story", None)
                    st.rerun()

        st.markdown("<br>", unsafe_allow_html=True)
        if st.button("✨ Generer l'histoire !", key="gen_story", use_container_width=False):
            with st.spinner("Gemini ecrit ton histoire..."):
                story = ask_gemini(
                    story_themes[st.session_state.selected_theme],
                    context="Histoire spatiale pour enfants",
                )
                if story:
                    st.session_state.generated_story = story
                else:
                    st.warning("Gemini n'a pas pu generer l'histoire. Reessaie !")

        if "generated_story" in st.session_state:
            st.markdown(
                f'<div class="card" style="border-left:4px solid #a78bfa;">'
                f'<h4 style="color:#a78bfa;">{st.session_state.selected_theme}</h4>'
                f'<p style="color:#cbd5e1;line-height:1.8;">{st.session_state.generated_story}</p>'
                f'</div>',
                unsafe_allow_html=True,
            )

        st.markdown("---")
        render_chat_widget()

    except ImportError:
        pass

    # Track page
    if "visited_pages" not in st.session_state:
        st.session_state.visited_pages = set()
    st.session_state.visited_pages.add("Coin des Curieux")
