'use client'

export default function PrintableGuidesButton() {
  return (
    <button
      type="button"
      className="parent-print-button"
      onClick={() => window.print()}
      data-printable-guides
    >
      🖨️ Imprimer les fiches express
    </button>
  )
}
