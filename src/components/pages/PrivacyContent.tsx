import Link from '@/components/ui/LocaleLink'
import type { SiteLocale } from '@/lib/i18n/paths'

const COPY = {
  fr: {
    badge: 'CONFIDENTIALITÉ',
    title: 'Vos données restent sous votre contrôle',
    subtitle: 'SolarScope ne crée pas de compte utilisateur et ne vend aucune donnée personnelle.',
    sections: [
      ['Géolocalisation', ['La page « Ciel ce soir » demande votre autorisation avant d’accéder à votre position. Les coordonnées sont arrondies avant d’être transmises à Nominatim afin d’afficher une ville approximative ; le ciel est ensuite calculé sur votre appareil. Elles ne sont ni enregistrées par SolarScope ni associées à un profil. Il en va de même pour la recherche des météorites proches, où la position est arrondie à environ 10 km.']],
      ['Services externes', ['Certaines pages interrogent des services scientifiques de la NASA, de la NOAA, de l’ESA, de The Space Devs et de Where The ISS At. Ces fournisseurs peuvent recevoir les informations techniques habituelles d’une requête web, notamment l’adresse IP.']],
      ['Statistiques de visite', ['Pour savoir quelles missions sont vraiment utilisées, SolarScope compte les pages vues avec Vercel Web Analytics. Ce service ne dépose aucun cookie, ne crée pas de profil et ne suit pas les visiteurs d’un site à l’autre. SolarScope ne transmet que l’adresse de la page, sans paramètre ni code de passeport ; Vercel en déduit aussi le pays, le type d’appareil et le navigateur, de façon agrégée.']],
      ['Stockage local et intelligence artificielle', [
        'SolarScope ne crée pas de compte. Le navigateur peut conserver le public ou niveau sélectionné, le mode d’affichage léger, la progression du passeport et le carnet d’observation, l’étape ouverte dans une fiche pédagogique et un cache local temporaire de météo spatiale. Ces informations restent sur l’appareil et ne sont pas envoyées à SolarScope. La langue, elle, est simplement indiquée dans l’adresse de la page (/en pour l’anglais).',
        'Le passeport peut être effacé depuis la page « Passeport spatial ». Les autres préférences et le cache peuvent être supprimés depuis les réglages de stockage du navigateur ; le cache météo expire également automatiquement. Les questions adressées à SolarBot sont envoyées au service Gemini de Google lorsque Gemini est activé, sans être conservées dans une base de données SolarScope.',
      ]],
    ] as Array<[string, string[]]>,
    back: '← Retour à l’accueil',
  },
  en: {
    badge: 'PRIVACY',
    title: 'Your data stays under your control',
    subtitle: 'SolarScope creates no user account and sells no personal data.',
    sections: [
      ['Location', ['The “Tonight’s sky” page asks for your permission before using your position. The coordinates are rounded before being sent to Nominatim to show an approximate town; the sky is then calculated on your device. They are neither stored by SolarScope nor linked to a profile. The same goes for the nearby meteorites search, where the position is rounded to about 10 km.']],
      ['External services', ['Some pages query science services from NASA, NOAA, ESA, The Space Devs and Where The ISS At. These providers may receive the usual technical information of a web request, including the IP address.']],
      ['Visit statistics', ['To know which missions are really used, SolarScope counts page views with Vercel Web Analytics. This service sets no cookie, builds no profile and does not follow visitors from one site to another. SolarScope only sends the page address, without parameters or passport code; Vercel also works out the country, device type and browser, in aggregate.']],
      ['Local storage and artificial intelligence', [
        'SolarScope creates no account. The browser may keep the selected audience or level, the light display mode, the passport progress and stargazing logbook, the step open in a lesson card and a temporary local cache of space weather. This information stays on the device and is not sent to SolarScope. The language is simply shown in the page address (/en for English).',
        'The passport can be erased from the “Space passport” page. Other preferences and the cache can be removed in the browser’s storage settings; the weather cache also expires on its own. Questions sent to SolarBot go to Google’s Gemini service when Gemini is enabled, without being kept in a SolarScope database.',
      ]],
    ] as Array<[string, string[]]>,
    back: '← Back to the home page',
  },
}

export default function PrivacyContent({ locale }: { locale: SiteLocale }) {
  const copy = COPY[locale]
  return (
    <div className="container prose-page">
      <header className="page-header">
        <div className="badge">{copy.badge}</div>
        <h1 className="page-title">{copy.title}</h1>
        <p className="page-subtitle">{copy.subtitle}</p>
      </header>

      <section className="card prose-card">
        {copy.sections.map(([heading, paragraphs]) => (
          <div key={heading}>
            <h2>{heading}</h2>
            {paragraphs.map(paragraph => <p key={paragraph.slice(0, 24)}>{paragraph}</p>)}
          </div>
        ))}
        <p><Link href="/">{copy.back}</Link></p>
      </section>
    </div>
  )
}
