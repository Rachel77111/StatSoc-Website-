/** Accept only absolute paths that stay on the current origin. */
export function toSafeInternalPath(value: string | null | undefined): string | null {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return null;
  // Backslashes and control characters can change how browsers parse a URL.
  if (/[\\\u0000-\u0020\u007f]/.test(value)) return null;

  const base = 'https://internal.invalid';
  try {
    const url = new URL(value, base);
    return url.origin === base ? `${url.pathname}${url.search}${url.hash}` : null;
  } catch {
    return null;
  }
}
