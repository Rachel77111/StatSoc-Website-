import { useEffect, useState } from 'react';

import {
  events as fallbackEvents,
  past_event_galleries as fallbackPastGalleries,
  type EventItem,
  type PastEventGallery,
  type PastEventItem,
} from '@/content/events';

export interface EventsContent {
  hero: { title: string; subtitle: string };
  filters: { id: string; label: string; value: string }[];
  events: EventItem[];
  pastHeading: string;
  pastSubheading: string;
  pastEvents: PastEventItem[];
  past_event_galleries: PastEventGallery[];
  cta: { heading: string; body: string; button: string };
}

const fallbackContent: EventsContent = {
  ...fallbackEvents,
  past_event_galleries: fallbackPastGalleries,
};

/** Fetches the JSON document edited by Decap CMS; bundled content remains as fallback. */
export function useEventsContent(): EventsContent {
  const [content, setContent] = useState<EventsContent>(fallbackContent);

  useEffect(() => {
    const controller = new globalThis.AbortController();

    globalThis.fetch('/content/events.json', { cache: 'no-cache', signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load event content (${response.status})`);
        return response.json() as Promise<EventsContent>;
      })
      .then((loadedContent) => {
        if (Array.isArray(loadedContent.events) && Array.isArray(loadedContent.past_event_galleries)) {
          setContent(loadedContent);
        }
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.warn('Using bundled StatSoc event content:', error.message);
        }
      });

    return () => controller.abort();
  }, []);

  return content;
}
