import { useEffect, useState } from 'react';

/** Loads a Decap-managed JSON document, retaining bundled content if it is unavailable. */
export function useCmsContent<T>(filename: string, fallback: T): T {
  const [content, setContent] = useState<T>(fallback);

  useEffect(() => {
    const controller = new globalThis.AbortController();

    globalThis.fetch(`/content/${filename}.json`, {
      cache: 'no-cache',
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load ${filename} content (${response.status})`);
        return response.json() as Promise<T>;
      })
      .then(setContent)
      .catch((error: unknown) => {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.warn(`Using bundled ${filename} content:`, error.message);
        }
      });

    return () => controller.abort();
  }, [filename]);

  return content;
}