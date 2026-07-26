export type JsonBodyResult =
  | { kind: 'ok'; value: unknown }
  | { kind: 'invalid' }
  | { kind: 'too-large' }

/**
 * Reads a JSON body while enforcing the byte limit on the actual stream.
 * Content-Length is only an optimisation: it is optional for chunked requests.
 */
export async function readJsonBody(request: Request, maxBytes: number): Promise<JsonBodyResult> {
  const contentLength = Number(request.headers.get('content-length'))
  if (Number.isFinite(contentLength) && contentLength > maxBytes) return { kind: 'too-large' }

  const reader = request.body?.getReader()
  if (!reader) return { kind: 'invalid' }

  const chunks: Uint8Array[] = []
  let totalBytes = 0

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      totalBytes += value.byteLength
      if (totalBytes > maxBytes) {
        await reader.cancel()
        return { kind: 'too-large' }
      }

      chunks.push(value)
    }
  } catch {
    return { kind: 'invalid' }
  } finally {
    reader.releaseLock()
  }

  const bytes = new Uint8Array(totalBytes)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }

  try {
    return { kind: 'ok', value: JSON.parse(new TextDecoder().decode(bytes)) }
  } catch {
    return { kind: 'invalid' }
  }
}
