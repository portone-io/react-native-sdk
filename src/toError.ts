export function toError(error: unknown): Error {
  if (typeof error === 'object' && error !== null) {
    const { message } = error as { message?: unknown }
    return Object.defineProperties(
      new Error(typeof message === 'string' ? message : undefined),
      Object.getOwnPropertyDescriptors(error)
    )
  }
  return new Error(typeof error === 'string' ? error : undefined)
}
