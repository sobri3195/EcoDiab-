export function logEvent(event: string, payload?: Record<string, unknown>) {
  console.info('[EcoDiab:event]', event, payload ?? {});
}

export function logError(source: string, error: unknown, payload?: Record<string, unknown>) {
  console.error('[EcoDiab:error]', source, error, payload ?? {});
}
