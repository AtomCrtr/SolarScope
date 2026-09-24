/**
 * French typography: the space before « ? ! : ; » must not break, otherwise a
 * title can end with a lone question mark on its own line.
 */
export function frenchNonBreakingSpaces(text: string): string {
  return text.replace(/ ([?!:;»])/g, ' $1').replace(/(«) /g, '$1 ')
}
