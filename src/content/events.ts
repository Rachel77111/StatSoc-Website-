import eventContent from '../../content/events.json';

export interface EventItem {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    tag: string;
    category: string;
    featured: boolean;
    image?: string;
    details?: string;
    highlights?: string[];
    price?: string;
    registrationUrl?: string;
  }
  
  export interface PastEventItem {
    id: string;
    title: string;
    description: string;
    date: string;
    tag: string;
  }
  
  export interface PastEventGallery {
    id: string;
    slug: string;
    title: string;
    description: string;
    date: string;
    tag: string;
    attendees: string;
    photos: {
      id: string;
      src: string;
      alt: string;
      span?: 'wide' | 'tall' | 'square';
    }[];
  }
  
// Keep bundled fallback content aligned with the admin-managed event archive.
export const events = {
  ...eventContent,
  events: eventContent.events as EventItem[],
  pastEvents: eventContent.pastEvents as PastEventItem[],
};

export const past_event_galleries = eventContent.past_event_galleries as PastEventGallery[];
