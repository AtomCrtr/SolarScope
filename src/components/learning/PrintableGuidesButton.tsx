'use client'
import SpaceIcon from '@/components/ui/SpaceIcon'

export default function PrintableGuidesButton() {
  return (
    <button
      type="button"
      className="parent-print-button"
      onClick={() => window.print()}
      data-printable-guides
    >
      <SpaceIcon name="print" size={18} className="inline-icon" /> Imprimer les fiches express
    </button>
  )
}
