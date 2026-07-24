const PERSONAL_INFORMATION_PATTERNS = [
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  /\b(?:\+33|0033|0)[1-9](?:[\s.-]?\d{2}){4}\b/,
  /\b\d{1,4}\s+(?:rue|avenue|boulevard|chemin|impasse|place|all[eé]e)\b/i,
  /\b(?:je m['’]appelle|mon nom(?: complet)? est|j['’]habite|mon adresse|mon code postal|mon (?:num[eé]ro|t[eé]l[eé]phone)|mon [eé]cole)\b/i,
]

export const SOLARBOT_PRIVACY_REMINDER = 'Pour ta sécurité, ne partage pas ton nom, ton école, ton adresse, ton téléphone ou ton e-mail. Pose plutôt ta question sans information personnelle.'

export function containsSensitivePersonalInformation(value: string): boolean {
  return PERSONAL_INFORMATION_PATTERNS.some((pattern) => pattern.test(value))
}

export function solarBotContentIsSafe(question: string, history: Array<{ text: string }>): boolean {
  return !containsSensitivePersonalInformation(question)
    && history.every((message) => !containsSensitivePersonalInformation(message.text))
}
