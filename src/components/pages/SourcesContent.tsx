import Link from '@/components/ui/LocaleLink'
import SpaceIcon from '@/components/ui/SpaceIcon'
import { SCIENTIFIC_SOURCES, formatCheckedOn } from '@/lib/data/source-registry'
import type { SiteLocale } from '@/lib/i18n/paths'

const CC_BY = { fr: 'https://creativecommons.org/licenses/by/4.0/deed.fr', en: 'https://creativecommons.org/licenses/by/4.0/deed.en' }

export default function SourcesContent({ locale }: { locale: SiteLocale }) {
  const sources = Object.values(SCIENTIFIC_SOURCES)
  const en = locale === 'en'
  const external = { target: '_blank', rel: 'noopener noreferrer' } as const

  return (
    <div className="container prose-page sources-page">
      <header className="page-header">
        <div className="badge"><SpaceIcon name="search" size={18} className="inline-icon" /> {en ? 'DATA EXPLAINED' : 'DONNÉES EXPLIQUÉES'}</div>
        <h1 className="page-title">{en ? 'How do we know this?' : 'Comment savons-nous cela ?'}</h1>
        <p className="page-subtitle">{en ? 'Every important figure shows its source, its type and when it was last checked.' : 'Chaque chiffre important indique sa source, son type et sa dernière vérification.'}</p>
      </header>

      <section className="card prose-card">
        <h2>{en ? 'Two kinds of data' : 'Deux sortes de données'}</h2>
        {en ? (
          <>
            <p><strong>Reference facts</strong> — the size of a planet, the length of a year — rarely change. They are shown as average values.</p>
            <p><strong>Live data</strong> — the position of the ISS, solar weather — can change within minutes. SolarScope then shows the time of the last update, or the word “unavailable” if the service does not answer.</p>
          </>
        ) : (
          <>
            <p><strong>Les faits de référence</strong> — taille d’une planète, durée d’une année — changent rarement. Ils sont présentés comme des valeurs moyennes.</p>
            <p><strong>Les données en direct</strong> — position de l’ISS, météo solaire — peuvent changer en quelques minutes. SolarScope affiche alors une heure de mise à jour ou le mot « indisponible » si le service ne répond pas.</p>
          </>
        )}
      </section>

      <section aria-labelledby="source-list-title">
        <h2 id="source-list-title" className="parent-section-title">{en ? 'Sources we follow' : 'Sources suivies'}</h2>
        <div className="sources-grid">
          {sources.map(source => (
            <article className="card source-card" key={source.id}>
              <span className={source.cadence === 'live' ? 'source-kind is-live' : 'source-kind'}>
                {source.cadence === 'live' ? (en ? 'Updated' : 'Mise à jour') : (en ? 'Reference' : 'Référence')}
              </span>
              <h3>{source.label}</h3>
              <p>{en ? source.childNoteEn : source.childNote}</p>
              <p className="source-checked">{en ? 'Checked on ' : 'Vérifiée le '}<time dateTime={source.checkedOn}>{formatCheckedOn(source.checkedOn, locale)}</time></p>
              <a href={source.href} {...external}>{en ? 'See the source ↗' : 'Voir la source ↗'}</a>
            </article>
          ))}
        </div>
      </section>

      <section className="card prose-card">
        {en ? (
          <>
            <h2>Planet pictures and textures</h2>
            <p>The 3D maps of Jupiter, Saturn and Neptune come from <a href="https://www.solarsystemscope.com/textures/" {...external}>Solar System Scope</a>, under the <a href={CC_BY.en} {...external}>CC BY 4.0</a> licence, based on NASA images. The textures of Mercury and Uranus are illustrations made for SolarScope, not photographs.</p>
            <h2>Reusing SolarScope</h2>
            <p>The texts of the lessons, questions and guides are under the <a href={CC_BY.en} {...external}>CC BY 4.0</a> licence: you can use them in class or elsewhere as long as you credit “SolarScope”. The <a href="https://github.com/AtomCrtr/SolarScope" {...external}>source code</a> is under the MIT licence. Pictures from space agencies keep their own terms.</p>
            <h2>Missing data is never made up</h2>
            <p>When a live source is temporarily unavailable, SolarScope prefers to say so clearly. That way, an old value or an estimate is never passed off as a current observation.</p>
            <p><Link href="/parents-enseignants">← Tips for parents and teachers</Link></p>
          </>
        ) : (
          <>
            <h2>Images et textures des planètes</h2>
            <p>Les cartes 3D de Jupiter, Saturne et Neptune viennent de <a href="https://www.solarsystemscope.com/textures/" {...external}>Solar System Scope</a>, sous licence <a href={CC_BY.fr} {...external}>CC BY 4.0</a>, d’après des images de la NASA. Les textures de Mercure et d’Uranus sont des illustrations créées pour SolarScope, pas des photographies.</p>
            <h2>Réutiliser SolarScope</h2>
            <p>Les textes des leçons, des questions et des guides sont sous licence <a href={CC_BY.fr} {...external}>CC BY 4.0</a> : tu peux les reprendre en classe ou ailleurs en citant « SolarScope ». Le <a href="https://github.com/AtomCrtr/SolarScope" {...external}>code source</a> est sous licence MIT. Les images des agences spatiales gardent leurs propres conditions.</p>
            <h2>Une donnée absente n’est pas inventée</h2>
            <p>Lorsqu’une source en direct est temporairement indisponible, SolarScope préfère l’indiquer clairement. Cela évite de faire passer une ancienne valeur ou une estimation pour une observation actuelle.</p>
            <p><Link href="/parents-enseignants">← Conseils pour les parents et enseignants</Link></p>
          </>
        )}
      </section>
    </div>
  )
}
