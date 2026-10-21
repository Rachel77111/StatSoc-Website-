
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
  
  export const events = {
    hero: {
      title: "Our Events",
      subtitle:
        "Explore upcoming workshops, networking opportunities, social gatherings and past events with StatSoc.",
    },
  
    filters: [
      { id: "all", label: "All Events", value: "all" },
      { id: "social", label: "Social", value: "social" },
      { id: "workshop", label: "Workshops", value: "workshop" },
      { id: "careers", label: "Careers", value: "careers" },
      { id: "networking", label: "Networking", value: "networking" },
    ],
  
    // Demo placeholders for previewing the event cards and category filters.
    // Replace these entries with confirmed event details when available.
    events: [
      {
        id: "ev1",
        title: "StatSoc Welcome Social",
        description: "Meet fellow statistics and data science students over snacks, games and a relaxed evening on campus.",
        date: "29 Oct 2026",
        time: "5:30 PM – 7:30 PM",
        location: "Manning Bar, University of Sydney",
        tag: "Social",
        category: "social",
        featured: true,
        image: "/events/illustrations/social-gathering.svg",
      },
      {
        id: "ev2",
        title: "Data Visualisation Workshop",
        description: "Turn raw data into clear, compelling stories in this beginner-friendly hands-on workshop.",
        date: "5 Nov 2026",
        time: "2:00 PM – 4:00 PM",
        location: "Carslaw Lecture Theatre 157",
        tag: "Workshop",
        category: "workshop",
        featured: true,
        image: "/events/illustrations/workshop-data.svg",
      },
      {
        id: "ev3",
        title: "Careers in Analytics Panel",
        description: "Hear how graduates use statistics in consulting, technology, health and the public sector.",
        date: "12 Nov 2026",
        time: "6:00 PM – 7:30 PM",
        location: "Abercrombie Business School, Room 2130",
        tag: "Careers",
        category: "careers",
        featured: true,
        image: "/events/illustrations/careers-panel.svg",
      },
      {
        id: "ev4",
        title: "Coffee & Connections",
        description: "Drop by for a casual coffee, meet the committee and find a study buddy for the semester.",
        date: "18 Nov 2026",
        time: "10:30 AM – 12:00 PM",
        location: "Courtyard Café, Camperdown Campus",
        tag: "Networking",
        category: "networking",
        featured: false,
        image: "/events/illustrations/networking-coffee.svg",
      },
      {
        id: "ev5",
        title: "The Great Stats Challenge",
        description: "Team up to solve playful data puzzles and compete for bragging rights and small prizes.",
        date: "25 Nov 2026",
        time: "4:00 PM – 6:00 PM",
        location: "Susan Wakil Health Building, Seminar Room 208",
        tag: "Social",
        category: "social",
        featured: false,
        image: "/events/illustrations/stats-challenge.svg",
      },
      {
        id: "ev6",
        title: "Intro to R: Data in Practice",
        description: "Get started with R by exploring a real dataset and learning a few essential analysis workflows.",
        date: "2 Dec 2026",
        time: "1:00 PM – 3:00 PM",
        location: "Carslaw Learning Hub, Lab 3",
        tag: "Workshop",
        category: "workshop",
        featured: false,
        image: "/events/illustrations/student-collaboration.svg",
      },
    ] as EventItem[],
  
    pastHeading: "Past Events",
    pastSubheading:
      "Take a look back at the events and memories we've shared.",
  
    // Demo archive entries. Replace the sample dates and imagery with real event records.
    pastEvents: [
      {
        id: "past-welcome-2026",
        title: "Semester One Welcome Social",
        description: "A relaxed start to the semester with games, snacks and new connections.",
        date: "12 Mar 2026",
        tag: "Social",
      },
      {
        id: "past-data-workshop-2026",
        title: "Data Visualisation Workshop",
        description: "An afternoon of practical data storytelling and visualisation.",
        date: "23 Apr 2026",
        tag: "Workshop",
      },
      {
        id: "past-careers-panel-2026",
        title: "Analytics Careers Panel",
        description: "Students met graduates working across analytics and data science.",
        date: "21 May 2026",
        tag: "Careers",
      },
    ] as PastEventItem[],
  
    cta: {
      heading: "Stay Connected with StatSoc",
      body:
        "Don't miss our upcoming events, opportunities and community updates.",
      button: "Read Our Newsletter",
    },
  };
  
  // Sample collages use the site's existing event photography as visual placeholders.
  export const past_event_galleries: PastEventGallery[] = [
    {
      id: "past-welcome-2026",
      slug: "semester-one-welcome-social-2026",
      title: "Semester One Welcome Social",
      description: "A relaxed start to the semester with games, snacks and new connections.",
      date: "12 Mar 2026",
      tag: "Social",
      attendees: "48",
      photos: [
        { id: "welcome-1", src: "/events/illustrations/social-gathering.svg", alt: "Illustration of students meeting at the StatSoc welcome social", span: "wide" },
        { id: "welcome-2", src: "/events/illustrations/networking-coffee.svg", alt: "Illustration of students chatting and making connections" },
        { id: "welcome-3", src: "/events/illustrations/student-collaboration.svg", alt: "Illustration of a lively campus gathering", span: "tall" },
        { id: "welcome-4", src: "/events/illustrations/stats-challenge.svg", alt: "Illustration of students enjoying an activity together" },
        { id: "welcome-5", src: "/events/illustrations/social-gathering.svg", alt: "Illustration of a candid moment from the social" },
        { id: "welcome-6", src: "/events/illustrations/networking-coffee.svg", alt: "Illustration of friends spending time together" },
      ],
    },
    {
      id: "past-data-workshop-2026",
      slug: "data-visualisation-workshop-2026",
      title: "Data Visualisation Workshop",
      description: "An afternoon of practical data storytelling and visualisation.",
      date: "23 Apr 2026",
      tag: "Workshop",
      attendees: "32",
      photos: [
        { id: "workshop-1", src: "/events/illustrations/workshop-data.svg", alt: "Illustration of students taking part in a data workshop", span: "wide" },
        { id: "workshop-2", src: "/events/illustrations/student-collaboration.svg", alt: "Illustration of a workshop in progress" },
        { id: "workshop-3", src: "/events/illustrations/stats-challenge.svg", alt: "Illustration of students collaborating on an exercise", span: "tall" },
        { id: "workshop-4", src: "/events/illustrations/careers-panel.svg", alt: "Illustration of a presenter sharing ideas with students" },
        { id: "workshop-5", src: "/events/illustrations/workshop-data.svg", alt: "Illustration of participants discussing their work" },
        { id: "workshop-6", src: "/events/illustrations/student-collaboration.svg", alt: "Illustration of a team working through a data challenge" },
      ],
    },
    {
      id: "past-careers-panel-2026",
      slug: "analytics-careers-panel-2026",
      title: "Analytics Careers Panel",
      description: "Students met graduates working across analytics and data science.",
      date: "21 May 2026",
      tag: "Careers",
      attendees: "56",
      photos: [
        { id: "careers-1", src: "/events/illustrations/careers-panel.svg", alt: "Illustration of panelists sharing career insights", span: "wide" },
        { id: "careers-2", src: "/events/illustrations/workshop-data.svg", alt: "Illustration of students listening to a careers discussion" },
        { id: "careers-3", src: "/events/illustrations/networking-coffee.svg", alt: "Illustration of students connecting with industry guests", span: "tall" },
        { id: "careers-4", src: "/events/illustrations/student-collaboration.svg", alt: "Illustration of a small group discussing career pathways" },
        { id: "careers-5", src: "/events/illustrations/social-gathering.svg", alt: "Illustration of networking after the panel" },
        { id: "careers-6", src: "/events/illustrations/stats-challenge.svg", alt: "Illustration of guests and students meeting at the event" },
      ],
    },
  ];
  