"""
SolarScope -- Module Gemini (Google AI).
Fournit :
  1. SolarBot : chatbot educatif pour enfants
  2. Studio Video : generation de scripts + video Veo

Necessite : pip install google-genai
"""

import streamlit as st
from config import GEMINI_API_KEY, GEMINI_MODEL


def _get_client():
    """Initialise le client Gemini (singleton via session_state)."""
    if not GEMINI_API_KEY:
        return None

    if "gemini_client" not in st.session_state:
        try:
            from google import genai
            st.session_state.gemini_client = genai.Client(api_key=GEMINI_API_KEY)
        except ImportError:
            st.error(
                "Le module `google-genai` n'est pas installe. "
                "Execute : `pip install google-genai`"
            )
            return None
        except Exception as e:
            st.error(f"Erreur initialisation Gemini : {e}")
            return None

    return st.session_state.gemini_client


def ask_gemini(question, context=""):
    """
    Pose une question a Gemini, adaptee pour un public enfant.
    Retourne la reponse texte ou None en cas d'erreur.
    """
    client = _get_client()
    if client is None:
        return None

    system_prompt = (
        "Tu es SolarBot, un assistant spatial educatif pour les enfants de 7 a 14 ans. "
        "Tu expliques les concepts de l'espace de maniere simple, amusante et enthousiaste. "
        "Utilise des emojis, des comparaisons du quotidien, et des phrases courtes. "
        "Reponds toujours en francais. "
        "Si on te pose une question qui n'a pas de rapport avec l'espace ou la science, "
        "redirige gentiment vers un sujet spatial."
    )

    full_prompt = f"{system_prompt}\n\nContexte : {context}\n\nQuestion de l'enfant : {question}"

    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=full_prompt,
        )
        return response.text
    except Exception as e:
        st.error(f"Erreur Gemini : {e}")
        return None


def generate_video_script(topic):
    """
    Genere un script video educatif pour enfants sur un sujet spatial.
    """
    client = _get_client()
    if client is None:
        return None

    prompt = (
        "Tu es un scenariste de videos educatives pour enfants de 8 a 12 ans. "
        "Ecris un script de video courte (60 secondes) sur le sujet suivant : "
        f"'{topic}'. "
        "Le script doit :\n"
        "- Commencer par une accroche excitante\n"
        "- Contenir 3-4 faits simples et fascinants\n"
        "- Utiliser un ton enthousiaste et des images fortes\n"
        "- Se terminer par une question qui fait reflechir\n"
        "- Indiquer des idees visuelles entre [crochets]\n"
        "Format : scene par scene, avec duree et description visuelle.\n"
        "Reponds en francais."
    )

    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
        )
        return response.text
    except Exception as e:
        st.error(f"Erreur generation script : {e}")
        return None


def generate_video_veo(prompt_text):
    """
    Genere une video via Veo (Google Generative Media).
    Note : necessite un projet Google Cloud avec l'API activee.
    """
    client = _get_client()
    if client is None:
        return None

    try:
        operation = client.models.generate_videos(
            model="veo-2.0-generate-001",
            prompt=prompt_text,
            config={
                "number_of_videos": 1,
                "duration_seconds": 8,
                "aspect_ratio": "16:9",
            },
        )

        import time
        while not operation.done:
            time.sleep(10)
            operation = client.operations.get(operation)

        if operation.result and operation.result.generated_videos:
            return operation.result.generated_videos[0]
        else:
            st.warning("La generation video n'a produit aucun resultat.")
            return None

    except Exception as e:
        error_msg = str(e)
        if "not found" in error_msg.lower() or "permission" in error_msg.lower():
            st.warning(
                "Veo n'est pas encore active sur ton compte Google. "
                "Active l'API Vertex AI dans la console Google Cloud."
            )
        else:
            st.error(f"Erreur Veo : {e}")
        return None


def render_chat_widget():
    """
    Affiche SolarBot directement sur la page (pas dans un expander).
    """
    if not GEMINI_API_KEY:
        st.info(
            "L'assistant IA SolarBot n'est pas active. "
            "Ajoute ta cle `GEMINI_API_KEY` dans le fichier `.env` pour l'activer !"
        )
        return

    st.markdown("### SolarBot -- Assistant IA")
    st.markdown(
        "*SolarBot est un assistant IA qui explique l'espace "
        "de maniere simple et amusante !*"
    )

    # Historique de chat
    if "solarbot_history" not in st.session_state:
        st.session_state.solarbot_history = []

    # Afficher l'historique
    for msg in st.session_state.solarbot_history:
        if msg["role"] == "user":
            st.markdown(
                f"<div class='card' style='border-left: 3px solid #6366f1;'>"
                f"<b>Toi :</b> {msg['text']}</div>",
                unsafe_allow_html=True,
            )
        else:
            st.markdown(
                f"<div class='card' style='border-left: 3px solid #10b981;'>"
                f"<b>SolarBot :</b> {msg['text']}</div>",
                unsafe_allow_html=True,
            )

    # Input
    question = st.text_input(
        "Pose ta question sur l'espace :",
        placeholder="Pourquoi les etoiles brillent ?",
        key="solarbot_question",
    )

    if st.button("Demander a SolarBot", key="solarbot_btn"):
        if question.strip():
            with st.spinner("SolarBot reflechit..."):
                answer = ask_gemini(question)
                if answer:
                    st.session_state.solarbot_history.append({"role": "user", "text": question})
                    st.session_state.solarbot_history.append({"role": "bot", "text": answer})
                    st.rerun()
        else:
            st.warning("Ecris une question d'abord !")

    if st.session_state.solarbot_history:
        if st.button("Effacer l'historique", key="clear_chat"):
            st.session_state.solarbot_history = []
            st.rerun()


def render_video_studio():
    """
    Studio de creation de videos educatives.
    Combine Gemini (scripts) + Veo (generation video).
    """
    if not GEMINI_API_KEY:
        st.info(
            "Le Studio Video necessite une cle Google AI. "
            "Ajoute `GEMINI_API_KEY` dans ton fichier `.env`."
        )
        return

    st.markdown("### Studio Video IA")
    st.markdown(
        "*Cree des mini-videos educatives sur l'espace grace a l'IA Google !*"
    )

    topics = [
        "Le systeme solaire pour les debutants",
        "Comment naissent les etoiles ?",
        "Les trous noirs expliques simplement",
        "La vie sur Mars, est-ce possible ?",
        "Les anneaux de Saturne",
        "Qu'est-ce qu'une exoplanete ?",
        "Les rovers martiens : robots explorateurs",
        "Les aurores boreales",
    ]

    col1, col2 = st.columns([2, 1])
    with col1:
        topic = st.selectbox("Choisis un sujet :", topics)
    with col2:
        custom_topic = st.text_input("...ou invente le tien :", "")

    final_topic = custom_topic.strip() if custom_topic.strip() else topic

    if st.button("Generer le script video"):
        with st.spinner("Gemini ecrit le scenario..."):
            script = generate_video_script(final_topic)
            if script:
                st.session_state["video_script"] = script
                st.session_state["video_topic"] = final_topic

    if "video_script" in st.session_state:
        st.markdown("#### Script genere :")
        st.markdown(st.session_state["video_script"])

        st.markdown("---")
        st.markdown("#### Generation de la video (Veo)")
        st.markdown(
            "*Veo va creer une video de 8 secondes basee sur le script.*"
        )

        video_prompt = (
            f"A beautiful, kid-friendly, educational animation about "
            f"{st.session_state['video_topic']}. "
            f"Colorful space visuals, planets, stars, rockets. "
            f"Style: Pixar-like 3D animation, vibrant colors, fun and educational."
        )

        st.text_area("Prompt video (modifiable) :", video_prompt, key="veo_prompt")

        if st.button("Creer la video avec Veo"):
            with st.spinner("Veo genere la video... (cela peut prendre 2-3 minutes)"):
                result = generate_video_veo(st.session_state.get("veo_prompt", video_prompt))
                if result:
                    st.success("Video generee avec succes !")
                    st.video(result)
