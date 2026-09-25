export type IssTle = { line1: string; line2: string }

/** Checksum of a TLE line: digits add their value, a minus sign counts 1, modulo 10. */
function tleChecksumIsValid(line: string): boolean {
  let sum = 0
  for (const character of line.slice(0, 68)) {
    if (character >= '0' && character <= '9') sum += Number(character)
    else if (character === '-') sum += 1
  }
  return sum % 10 === Number(line[68])
}

/** Extracts and validates the two ISS (NORAD 25544) element lines from a CelesTrak response. */
export function parseIssTle(text: string): IssTle | null {
  const lines = text.split(/\r?\n/).map(line => line.trimEnd())
  const line1 = lines.find(line => line.startsWith('1 25544'))
  const line2 = lines.find(line => line.startsWith('2 25544'))
  if (!line1 || !line2 || line1.length !== 69 || line2.length !== 69) return null
  if (!tleChecksumIsValid(line1) || !tleChecksumIsValid(line2)) return null
  return { line1, line2 }
}
