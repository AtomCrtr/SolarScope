'use client'

import { useEffect, useState } from 'react'
import { replaceLocalProgress, type LocalProgress } from '@/lib/client/local-progress'
import { decodePassportCode, encodePassportCode, mergePassport, type PassportCodeContent } from '@/lib/client/passport-code'
import { SITE_URL } from '@/lib/config/site'
import { useSiteLocale } from '@/components/layout/LanguageToggle'

const COPY = {
  fr: {
    title: 'Continuer sur un autre appareil',
    intro: 'Ton code résume tes tampons en 9 caractères. Tape-le ou scanne le QR code sur l’autre appareil : rien ne passe par un serveur.',
    code: 'Ton code de passeport',
    copy: 'Copier le code',
    copied: 'Code copié.',
    showQr: 'Afficher le QR code',
    hideQr: 'Masquer le QR code',
    qrLabel: 'QR code qui ouvre SolarScope avec ton code de passeport',
    importLabel: 'J’ai un code venant d’un autre appareil',
    importButton: 'Ajouter ces tampons',
    invalid: 'Ce code ne semble pas correct. Vérifie chaque caractère.',
    preview: (stamps: number) => `Ce code contient ${stamps} tampon${stamps > 1 ? 's' : ''}. Les tampons déjà présents ici sont gardés.`,
    confirm: 'Oui, les ajouter',
    cancel: 'Annuler',
    done: 'Tampons ajoutés à ce passeport.',
  },
  en: {
    title: 'Continue on another device',
    intro: 'Your code sums up your stamps in 9 characters. Type it or scan the QR code on the other device: nothing goes through a server.',
    code: 'Your passport code',
    copy: 'Copy the code',
    copied: 'Code copied.',
    showQr: 'Show the QR code',
    hideQr: 'Hide the QR code',
    qrLabel: 'QR code that opens SolarScope with your passport code',
    importLabel: 'I have a code from another device',
    importButton: 'Add these stamps',
    invalid: 'This code does not look right. Check each character.',
    preview: (stamps: number) => `This code holds ${stamps} stamp${stamps === 1 ? '' : 's'}. Stamps already here are kept.`,
    confirm: 'Yes, add them',
    cancel: 'Cancel',
    done: 'Stamps added to this passport.',
  },
}

// The code travels in the #fragment, which browsers never send to the server.
const readCodeFromHash = () => (typeof window === 'undefined' ? null : new URLSearchParams(window.location.hash.slice(1)).get('code'))

export default function PassportTransfer({ progress }: { progress: LocalProgress }) {
  const locale = useSiteLocale()
  const copy = COPY[locale]
  const code = encodePassportCode(progress)
  const [qrSvg, setQrSvg] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [pending, setPending] = useState<PassportCodeContent | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [status, setStatus] = useState<'copied' | 'invalid' | 'done' | null>(null)

  useEffect(() => {
    const fromLink = readCodeFromHash()
    if (!fromLink) return
    window.history.replaceState(null, '', window.location.pathname)
    queueMicrotask(() => {
      setExpanded(true)
      setInput(fromLink)
      const decoded = decodePassportCode(fromLink)
      if (decoded) setPending(decoded)
      else setStatus('invalid')
    })
  }, [])

  const toggleQr = async () => {
    if (qrSvg) {
      setQrSvg(null)
      return
    }
    const { renderSVG } = await import('uqr')
    setQrSvg(renderSVG(`${SITE_URL}/passeport#code=${code}`, { border: 2, pixelSize: 6, whiteColor: '#ffffff', blackColor: '#1c1b2e' }))
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setStatus('copied')
    } catch {
      setStatus(null)
    }
  }

  const check = (event: React.FormEvent) => {
    event.preventDefault()
    const decoded = decodePassportCode(input)
    setPending(decoded)
    setStatus(decoded ? null : 'invalid')
  }

  const confirmImport = () => {
    if (!pending) return
    replaceLocalProgress(mergePassport(progress, pending))
    setPending(null)
    setInput('')
    setStatus('done')
  }

  return (
    <details className="passport-transfer" open={expanded} onToggle={event => setExpanded(event.currentTarget.open)}>
      <summary>{copy.title}</summary>
      <p>{copy.intro}</p>
      <div className="passport-code-row">
        <div>
          <span>{copy.code}</span>
          <output className="passport-code" aria-live="polite">{code}</output>
        </div>
        <button type="button" className="btn-ghost" onClick={copyCode}>{copy.copy}</button>
        <button type="button" className="btn-ghost" aria-expanded={qrSvg !== null} onClick={toggleQr}>{qrSvg ? copy.hideQr : copy.showQr}</button>
      </div>
      {qrSvg && <div className="passport-qr" role="img" aria-label={copy.qrLabel} dangerouslySetInnerHTML={{ __html: qrSvg }} />}

      <form className="passport-import" onSubmit={check}>
        <label htmlFor="passport-import-code">{copy.importLabel}</label>
        <div>
          <input
            id="passport-import-code"
            value={input}
            onChange={event => { setInput(event.target.value); setPending(null) }}
            placeholder="ABC-DEF-GHJ"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={13}
          />
          <button type="submit" className="btn-primary">{copy.importButton}</button>
        </div>
      </form>

      {pending && (
        <div className="passport-import-confirm" role="alertdialog" aria-labelledby="passport-import-preview">
          <p id="passport-import-preview">{copy.preview(pending.completed.size)}</p>
          <div>
            <button type="button" className="btn-primary" onClick={confirmImport}>{copy.confirm}</button>
            <button type="button" className="btn-ghost" onClick={() => setPending(null)}>{copy.cancel}</button>
          </div>
        </div>
      )}
      {status && <p className={`passport-transfer-status is-${status}`} role="status">{copy[status]}</p>}
    </details>
  )
}
