export type HistoryTurn = { role: 'user' | 'model'; text: string }

/**
 * Gemini expects turns that alternate and start with the user. Trimming the history to its last
 * messages can leave a leading bot reply or two identical roles in a row: drop those turns, and a
 * trailing user turn, since the new question is appended as the next user turn.
 */
export function normalizeHistory(turns: HistoryTurn[]): HistoryTurn[] {
  const result: HistoryTurn[] = []
  for (const turn of turns) {
    if (result.length === 0 && turn.role !== 'user') continue
    const previous = result[result.length - 1]
    if (previous?.role === turn.role) result[result.length - 1] = turn
    else result.push(turn)
  }
  if (result[result.length - 1]?.role === 'user') result.pop()
  return result
}
