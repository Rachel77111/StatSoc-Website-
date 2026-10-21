
export const home = {
  splash: {
    tagline: "Where Data Meets Community",
  },
  hero: {
    heading: "Welcome to StatSoc",
    subheading:
      "The Statistics Society at the University of Sydney.",
    stats: [
      { id: "1", value: "USYD", label: "University" },
      { id: "2", value: "Free", label: "Membership" },
      { id: "3", value: "2026", label: "Year" },
      { id: "4", value: "All", label: "Students Welcome" },
    ],
  },
  intro: {
    heading: "About StatSoc",
    body: [
      {
        id: "1",
        text: "StatSoc brings together students interested in statistics, data science and community.",
      },
    ],
  },
  events: {
    heading: "Our Events",
    subheading: "What's Happening",
    items: [] as {
      id: string;
      title: string;
      description: string;
      date: string;
      tag: string;
    }[],
  },
  navCards: {
    heading: "Explore StatSoc",
    items: [
      {
        id: "1",
        title: "Events",
        description: "Discover our events.",
        href: "/events",
      },
      {
        id: "2",
        title: "Opportunities",
        description: "Explore opportunities.",
        href: "/opportunities",
      },
      {
        id: "3",
        title: "Newsletter",
        description: "Read our newsletters.",
        href: "/newsletter",
      },
      {
        id: "4",
        title: "Membership",
        description: "Join StatSoc.",
        href: "/membership",
      },
    ],
  },
};
