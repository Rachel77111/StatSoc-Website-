export function eventDetailsPath(id: string): string {
  return `/events/upcoming/${encodeURIComponent(id)}`;
}

export function eventRegistrationUrl(value?: string): string | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}
