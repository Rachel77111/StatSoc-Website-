
export const newsletter = {
    hero: {
      title: "The StatSoc Newsletter",
      subtitle:
        "Stay connected with the latest events, career opportunities, workshops and updates from the Statistics Society at the University of Sydney.",
    },
  
    subscribeSection: {
      heading: "Subscribe to Our Newsletter",
      description:
        "Stay up to date with StatSoc events, opportunities and community news.",
      buttonLabel: "Subscribe",
      privacyNote:
        "Subscription functionality is being set up. Please check back soon.",
    },
  
    whatsInside: {
      heading: "What's Inside?",
      items: [
        {
          id: "1",
          icon: "Calendar",
          title: "Upcoming Events",
          description:
            "Discover our upcoming social events, workshops and networking activities.",
        },
        {
          id: "2",
          icon: "Briefcase",
          title: "Career Opportunities",
          description:
            "Explore internships, graduate programs and professional opportunities.",
        },
        {
          id: "3",
          icon: "BarChart2",
          title: "Statistics & Data Science",
          description:
            "Explore interesting topics, insights and developments in statistics and data science.",
        },
        {
          id: "4",
          icon: "BookOpen",
          title: "Academic Resources",
          description:
            "Find useful learning resources and opportunities for academic development.",
        },
      ],
    },
  
    socialProof: {
      heading: "From Our Community",
      // Add genuine member testimonials when available.
      quotes: [] as {
        id: string;
        text: string;
        name: string;
        year: string;
      }[],
    },
  
    archive: {
      heading: "Newsletter Archive",
      description:
        "Browse previous editions of the StatSoc newsletter.",
      // Add published newsletters when available.
      issues: [] as {
        id: string;
        tag: string;
        date: string;
        title: string;
        preview: string;
      }[],
    },
  };
  