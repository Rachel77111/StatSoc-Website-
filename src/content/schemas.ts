import { z } from 'zod';
export const schemas = {
  pages: {
    home: z.object({
      "splash": z.object({
        "tagline": z.string()
      }),
      "hero": z.object({
        "heading": z.string(),
        "subheading": z.string(),
        "cta": z.string(),
        "stats": z.array(z.object({
          "id": z.string(),
          "value": z.string(),
          "label": z.string()
        }))
      }),
      "intro": z.object({
        "heading": z.string(),
        "body": z.array(z.object({
          "id": z.string(),
          "text": z.string()
        }))
      }),
      "events": z.object({
        "heading": z.string(),
        "subheading": z.string(),
        "items": z.array(z.object({
          "id": z.string(),
          "title": z.string(),
          "date": z.string(),
          "description": z.string(),
          "tag": z.string()
        }))
      }),
      "navCards": z.object({
        "heading": z.string(),
        "items": z.array(z.object({
          "id": z.string(),
          "title": z.string(),
          "description": z.string(),
          "href": z.string(),
          "emoji": z.string()
        }))
      })
    }),
    fun: z.object({
      "heading": z.string(),
      "subheading": z.string()
    }),
    events: z.object({
      "heading": z.string(),
      "subheading": z.string(),
      "hero": z.object({
        "title": z.string(),
        "subtitle": z.string()
      }),
      "filters": z.array(z.object({
        "id": z.string(),
        "label": z.string(),
        "value": z.string()
      })),
      "events": z.array(z.object({
        "id": z.string(),
        "title": z.string(),
        "date": z.string(),
        "time": z.string(),
        "location": z.string(),
        "category": z.string(),
        "tag": z.string(),
        "description": z.string(),
        "featured": z.boolean()
      })),
      "pastHeading": z.string(),
      "pastSubheading": z.string(),
      "pastEvents": z.array(z.object({
        "id": z.string(),
        "title": z.string(),
        "date": z.string(),
        "tag": z.string(),
        "description": z.string()
      })),
      "cta": z.object({
        "heading": z.string(),
        "body": z.string(),
        "button": z.string()
      })
    }),
    newsletter: z.object({
      "hero": z.object({
        "title": z.string(),
        "subtitle": z.string()
      }),
      "subscribeSection": z.object({
        "heading": z.string(),
        "description": z.string(),
        "buttonLabel": z.string(),
        "mailchimpUrl": z.string(),
        "privacyNote": z.string()
      }),
      "whatsInside": z.object({
        "heading": z.string(),
        "items": z.array(z.object({
          "id": z.string(),
          "icon": z.string(),
          "title": z.string(),
          "description": z.string()
        }))
      }),
      "archive": z.object({
        "heading": z.string(),
        "description": z.string(),
        "issues": z.array(z.object({
          "id": z.string(),
          "title": z.string(),
          "date": z.string(),
          "preview": z.string(),
          "tag": z.string()
        }))
      }),
      "socialProof": z.object({
        "heading": z.string(),
        "quotes": z.array(z.object({
          "id": z.string(),
          "text": z.string(),
          "name": z.string(),
          "year": z.string()
        }))
      })
    }),
    admin_login: z.object({
      "title": z.string(),
      "subtitle": z.string(),
      "googleButton": z.string(),
      "divider": z.string(),
      "emailPlaceholder": z.string(),
      "passwordPlaceholder": z.string(),
      "signInButton": z.string(),
      "footer": z.string()
    }),
    admin_dashboard: z.object({
      "eyebrow": z.string(),
      "welcomePrefix": z.string(),
      "signedInPrefix": z.string(),
      "quickLinksHeading": z.string(),
      "howToHeading": z.string(),
      "howToBody": z.string(),
      "signOut": z.string()
    })
  },
  data: {
    past_event_galleries: z.array(z.object({
      "id": z.string(),
      "slug": z.string(),
      "title": z.string(),
      "date": z.string(),
      "tag": z.string(),
      "description": z.string(),
      "attendees": z.string(),
      "photos": z.array(z.object({
        "id": z.string(),
        "src": z.string(),
        "alt": z.string(),
        "span": z.string()
      }))
    }))
  }
};
export type Schemas = typeof schemas;