import { Event } from "@/interfaces/event"
import dayjs from "dayjs"

// Example mock events for testing and development
const mockEvents: Event[] = [
  {
    id: "0",
    title: "Aarhus Jazz Festival 2026",
    theme: { name: "Music", icon: "music" },
    format: "inperson",
    ageRestriction: 16,
    location: {
      address: "Vester Allé 15",
      city: "Aarhus",
      country: "DK",
      venue: "Musikhuset Aarhus",
      latitude: 56.1535,
      longitude: 10.1991,
    },
    dateRange: {
      startAt: dayjs("2026-07-13T12:00:00Z").toDate(),
      endAt: dayjs("2026-07-20T23:00:00Z").toDate(),
    },
    attendance: {
      interested: 8000,
    },
    sections: [
      {
        type: "images",
        srcs: [
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
        ],
      },
      { type: "description", content: "Enjoy world-class jazz in venues and open spaces across Aarhus." },
      { type: "dresscode", content: "Smart casual or jazz-inspired attire recommended." },
      {
        type: "faq",
        items: [
          { question: "Are concerts free?", answer: "Many concerts are free, but some require tickets." },
          { question: "Where can I park?", answer: "Parking is available at Musikhuset and nearby lots." },
        ],
      },
      {
        type: "guests",
        guests: [
          {
            name: "Cæcilie Norby",
            bio: "Danish jazz singer.",
            avatarUrl: "https://randomuser.me/api/portraits/women/81.jpg",
          },
          { name: "Aarhus Jazz Orchestra", bio: "Big band jazz ensemble." },
          { name: "Niels Lan Doky", bio: "Jazz pianist.", avatarUrl: "https://randomuser.me/api/portraits/men/81.jpg" },
        ],
      },
      {
        type: "tickets",
        tickets: [
          { type: "Festival Pass", price: 600, link: "https://jazzfest.dk/tickets" },
          { type: "Day Ticket", price: 150, link: "https://jazzfest.dk/tickets" },
        ],
      },
      {
        type: "resources",
        files: [
          { name: "Festival Map", url: "https://jazzfest.dk/map.pdf" },
          { name: "Artist Lineup", url: "https://jazzfest.dk/lineup" },
        ],
      },
      {
        type: "schedule",
        items: [
          { time: new Date("2026-07-13T12:00:00Z"), activity: "Opening Ceremony" },
          { time: new Date("2026-07-14T18:00:00Z"), activity: "Main Concert" },
          { time: new Date("2026-07-20T23:00:00Z"), activity: "Closing Jam" },
        ],
      },
    ],
  },
  {
    id: "1",
    title: "Copenhagen Marathon 2026",
    theme: { name: "Sports", icon: "futbol" },
    format: "inperson",
    ageRestriction: 18,
    location: {
      address: "Islands Brygge 18",
      city: "Copenhagen",
      country: "DK",
      venue: "Start/Finish: Islands Brygge",
      latitude: 55.6631,
      longitude: 12.5797,
    },
    dateRange: {
      startAt: dayjs("2026-05-17T09:30:00Z").toDate(),
      endAt: dayjs("2026-05-17T15:00:00Z").toDate(),
    },
    attendance: {
      interested: 12000,
    },
    sections: [
      {
        type: "images",
        srcs: [
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
        ],
      },
      {
        type: "description",
        content: "Join thousands of runners and experience the vibrant atmosphere of Copenhagen.",
      },
      { type: "dresscode", content: "Sportswear and running shoes required for participants." },
      {
        type: "faq",
        items: [
          {
            question: "Is the course flat?",
            answer: "Yes, the Copenhagen Marathon is known for its flat and fast course.",
          },
          { question: "Where do I collect my bib?", answer: "Bib pickup is at the Expo the day before the race." },
        ],
      },
      {
        type: "guests",
        guests: [
          { name: "Elite Runners", bio: "International marathon athletes." },
          {
            name: "Abdi Nageeye",
            bio: "Olympic marathon medalist.",
            avatarUrl: "https://randomuser.me/api/portraits/men/82.jpg",
          },
        ],
      },
      {
        type: "tickets",
        tickets: [{ type: "Marathon Entry", price: 650, link: "https://copenhagenmarathon.dk/tilmelding/" }],
      },
      {
        type: "resources",
        files: [
          { name: "Course Map", url: "https://copenhagenmarathon.dk/course-map" },
          { name: "Runner's Guide", url: "https://copenhagenmarathon.dk/guide" },
        ],
      },
      {
        type: "schedule",
        items: [
          { time: new Date("2026-05-17T09:30:00Z"), activity: "Race Start" },
          { time: new Date("2026-05-17T12:00:00Z"), activity: "Halfway Point Entertainment" },
          { time: new Date("2026-05-17T15:00:00Z"), activity: "Finish Line Ceremony" },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Aarhus Jazz Festival 2026",
    theme: { name: "Music", icon: "music" },
    format: "inperson",
    ageRestriction: 16,
    location: {
      address: "Vester Allé 15",
      city: "Aarhus",
      country: "DK",
      venue: "Musikhuset Aarhus",
      latitude: 56.1535,
      longitude: 10.1991,
    },
    dateRange: {
      startAt: dayjs("2026-07-13T12:00:00Z").toDate(),
      endAt: dayjs("2026-07-20T23:00:00Z").toDate(),
    },
    attendance: {
      interested: 8000,
    },
    sections: [
      { type: "description", content: "Enjoy world-class jazz in venues and open spaces across Aarhus." },
      { type: "dresscode", content: "Smart casual or jazz-inspired attire recommended." },
      {
        type: "faq",
        items: [{ question: "Are concerts free?", answer: "Many concerts are free, but some require tickets." }],
      },
      {
        type: "guests",
        guests: [
          {
            name: "Cæcilie Norby",
            bio: "Danish jazz singer.",
            avatarUrl: "https://randomuser.me/api/portraits/women/81.jpg",
          },
          { name: "Aarhus Jazz Orchestra", bio: "Big band jazz ensemble." },
          { name: "Niels Lan Doky", bio: "Jazz pianist.", avatarUrl: "https://randomuser.me/api/portraits/men/81.jpg" },
          { name: "DR Big Band", bio: "Danish Radio jazz orchestra." },
          { name: "Kira Skov", bio: "Jazz vocalist.", avatarUrl: "https://randomuser.me/api/portraits/women/82.jpg" },
          { name: "Steen Rasmussen", bio: "Pianist and composer." },
          {
            name: "Caroline Henderson",
            bio: "Jazz and soul singer.",
            avatarUrl: "https://randomuser.me/api/portraits/women/83.jpg",
          },
          { name: "Jacob Fischer", bio: "Jazz guitarist." },
          { name: "Mads Mathias", bio: "Saxophonist and singer." },
        ],
      },
      {
        type: "tickets",
        tickets: [{ type: "Festival Pass", price: 600, link: "https://jazzfest.dk/tickets" }],
      },
    ],
  },
  {
    id: "3",
    title: "Copenhagen Marathon 2026",
    theme: { name: "Sports", icon: "futbol" },
    format: "inperson",
    ageRestriction: 18,
    location: {
      address: "Islands Brygge 18",
      city: "Copenhagen",
      country: "DK",
      venue: "Start/Finish: Islands Brygge",
      latitude: 55.6631,
      longitude: 12.5797,
    },
    dateRange: {
      startAt: dayjs("2026-05-17T09:30:00Z").toDate(),
      endAt: dayjs("2026-05-17T15:00:00Z").toDate(),
    },
    attendance: {
      interested: 12000,
    },
    sections: [
      {
        type: "description",
        content: "Join thousands of runners and experience the vibrant atmosphere of Copenhagen.",
      },
      {
        type: "dresscode",
        content: "Sportswear and running shoes required for participants.",
      },
      {
        type: "faq",
        items: [
          {
            question: "Is the course flat?",
            answer: "Yes, the Copenhagen Marathon is known for its flat and fast course.",
          },
        ],
      },
      {
        type: "guests",
        guests: [
          { name: "Elite Runners", bio: "International marathon athletes." },
          {
            name: "Abdi Nageeye",
            bio: "Olympic marathon medalist.",
            avatarUrl: "https://randomuser.me/api/portraits/men/82.jpg",
          },
          {
            name: "Anna Holm",
            bio: "Danish marathon champion.",
            avatarUrl: "https://randomuser.me/api/portraits/women/84.jpg",
          },
          { name: "Jesper Faurschou", bio: "Olympic runner." },
          { name: "Local Running Clubs", bio: "Community participants." },
          { name: "Pacer Team", bio: "Official marathon pacers." },
        ],
      },
      {
        type: "tickets",
        tickets: [{ type: "Marathon Entry", price: 650, link: "https://copenhagenmarathon.dk/tilmelding/" }],
      },
    ],
  },
  {
    id: "4",
    title: "Odense International Film Festival 2026",
    theme: { name: "Film", icon: "film" },
    format: "inperson",
    ageRestriction: 15,
    location: {
      address: "Amfipladsen 6",
      city: "Odense",
      country: "DK",
      venue: "Odense Concert Hall",
      latitude: 55.3959,
      longitude: 10.3883,
    },
    dateRange: {
      startAt: dayjs("2026-08-26T10:00:00Z").toDate(),
      endAt: dayjs("2026-09-01T23:00:00Z").toDate(),
    },
    attendance: {
      interested: 3000,
    },
    sections: [
      { type: "description", content: "Watch award-winning short films and meet filmmakers in Odense." },
      { type: "dresscode", content: "Smart casual. Red carpet attire for opening night." },
      {
        type: "faq",
        items: [
          { question: "Are all films in Danish?", answer: "No, the festival features films from all over the world." },
        ],
      },
      {
        type: "guests",
        guests: [
          { name: "International Directors", bio: "Award-winning filmmakers." },
          {
            name: "Oscar Isaac",
            bio: "Actor and producer.",
            avatarUrl: "https://randomuser.me/api/portraits/men/83.jpg",
          },
          {
            name: "Sofie Gråbøl",
            bio: "Danish actress.",
            avatarUrl: "https://randomuser.me/api/portraits/women/85.jpg",
          },
          { name: "Film Jury", bio: "International film experts." },
          { name: "Short Film Creators", bio: "Emerging talents." },
        ],
      },
      {
        type: "tickets",
        tickets: [{ type: "Festival Pass", price: 400, link: "https://filmfestival.dk/tickets" }],
      },
    ],
  },
  {
    id: "5",
    title: "Aalborg Carnival 2026",
    theme: { name: "Parade", icon: "people-line" },
    format: "inperson",
    ageRestriction: 18,
    location: {
      address: "Boulevarden 13",
      city: "Aalborg",
      country: "DK",
      venue: "Aalborg City Centre",
      latitude: 57.0488,
      longitude: 9.9187,
    },
    dateRange: {
      startAt: dayjs("2025-10-23T10:00:00Z").toDate(),
      endAt: dayjs("2025-10-24T23:00:00Z").toDate(),
    },
    attendance: {
      interested: 60000,
    },
    sections: [
      { type: "description", content: "Join the colorful parade and party in the streets of Aalborg." },
      { type: "dresscode", content: "Carnival costumes encouraged!" },
      {
        type: "faq",
        items: [{ question: "Can anyone join the parade?", answer: "Yes, everyone is welcome to join in costume." }],
      },
      {
        type: "guests",
        guests: [
          { name: "Local Bands", bio: "Live music throughout the day." },
          {
            name: "Carnival Queen",
            bio: "Leads the parade.",
            avatarUrl: "https://randomuser.me/api/portraits/women/86.jpg",
          },
          { name: "Samba Dancers", bio: "Colorful costumes and dance." },
          { name: "Street Performers", bio: "Entertainment for all ages." },
          { name: "DJ Parade", bio: "Mobile music party." },
        ],
      },
      {
        type: "tickets",
        tickets: [{ type: "Carnival Wristband", price: 200, link: "https://aalborgkarneval.dk/billetter/" }],
      },
    ],
  },
  {
    id: "6",
    title: "Copenhagen Cooking & Food Festival 2026",
    theme: { name: "Food", icon: "utensils" },
    format: "inperson",
    ageRestriction: 21,
    location: {
      address: "Gammel Strand 34",
      city: "Copenhagen",
      country: "DK",
      venue: "Various Locations",
      latitude: 55.6781,
      longitude: 12.5797,
    },
    dateRange: {
      startAt: dayjs("2026-08-19T10:00:00Z").toDate(),
      endAt: dayjs("2026-08-28T22:00:00Z").toDate(),
    },
    attendance: {
      interested: 15000,
    },
    sections: [
      { type: "description", content: "Taste the best of Danish and Nordic food at pop-ups, tastings, and workshops." },
      {
        type: "faq",
        items: [{ question: "Are events family-friendly?", answer: "Yes, many events are suitable for all ages." }],
      },
      {
        type: "guests",
        guests: [
          {
            name: "Claus Meyer",
            bio: "Culinary entrepreneur and co-founder of Noma.",
            avatarUrl: "https://randomuser.me/api/portraits/men/84.jpg",
          },
          {
            name: "Mette Blomsterberg",
            bio: "Pastry chef and TV host.",
            avatarUrl: "https://randomuser.me/api/portraits/women/87.jpg",
          },
          { name: "Rasmus Kofoed", bio: "Michelin-starred chef." },
          { name: "Nordic Food Lab", bio: "Innovative food researchers." },
          { name: "Street Food Vendors", bio: "Local culinary talents." },
        ],
      },
      {
        type: "tickets",
        tickets: [{ type: "Festival Pass", price: 350, link: "https://copenhagencooking.dk/billetter/" }],
      },
    ],
  },
  {
    id: "7",
    title: "Aarhus Festuge 2026",
    theme: { name: "Festival", icon: "star" },
    location: {
      address: "Bispetorvet 1",
      city: "Aarhus",
      country: "DK",
      venue: "Aarhus City Centre",
      latitude: 56.1629,
      longitude: 10.2039,
    },
    dateRange: {
      startAt: dayjs("2026-08-28T12:00:00Z").toDate(),
      endAt: dayjs("2026-09-06T23:00:00Z").toDate(),
    },
    format: "inperson",
    creatorId: "u7",
    sections: [
      {
        type: "images",
        srcs: [
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
        ],
      },
      { type: "description", content: "Aarhus comes alive with concerts, street art, and performances for all ages." },
      {
        type: "faq",
        items: [{ question: "Is the festival free?", answer: "Many events are free, but some require tickets." }],
      },
      {
        type: "guests",
        guests: [{ name: "Local Artists", bio: "Music, dance, and visual art performances." }],
      },
      {
        type: "tickets",
        tickets: [{ type: "Festival Pass", price: 500, link: "https://aarhusfestuge.dk/billetter/" }],
      },
    ],
  },
  {
    id: "8",
    title: "Distortion Copenhagen 2026",
    theme: { name: "Music", icon: "music" },
    location: {
      address: "Nørrebro & Vesterbro",
      city: "Copenhagen",
      country: "DK",
      venue: "Various Streets",
      latitude: 55.6867,
      longitude: 12.5615,
    },
    dateRange: {
      startAt: dayjs("2026-05-29T16:00:00Z").toDate(),
      endAt: dayjs("2026-06-02T23:00:00Z").toDate(),
    },
    format: "inperson",
    creatorId: "u8",
    sections: [
      {
        type: "images",
        srcs: [
          "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
        ],
      },
      { type: "description", content: "Join the wildest street party in Scandinavia with music, dancing, and fun." },
      {
        type: "faq",
        items: [
          {
            question: "Is Distortion safe for families?",
            answer: "Some events are family-friendly, others are for adults only.",
          },
        ],
      },
      {
        type: "guests",
        guests: [{ name: "International DJs", bio: "Top electronic music acts." }],
      },
      {
        type: "tickets",
        tickets: [{ type: "Distortion Pass", price: 400, link: "https://cphdistortion.dk/billetter/" }],
      },
    ],
  },
  {
    id: "9",
    title: "Copenhagen Pride 2026",
    theme: { name: "Parade", icon: "people-line" },
    location: {
      address: "Rådhuspladsen 1",
      city: "Copenhagen",
      country: "DK",
      venue: "Copenhagen City Hall Square",
      latitude: 55.6761,
      longitude: 12.5683,
    },
    dateRange: {
      startAt: dayjs("2026-08-10T12:00:00Z").toDate(),
      endAt: dayjs("2026-08-17T23:00:00Z").toDate(),
    },
    format: "inperson",
    creatorId: "u9",
    sections: [
      {
        type: "images",
        srcs: [
          "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
        ],
      },
      { type: "description", content: "Celebrate love, diversity, and equality at Copenhagen Pride." },
      {
        type: "faq",
        items: [
          {
            question: "Is the parade open to everyone?",
            answer: "Yes, all are welcome to join and support LGBTQ+ rights.",
          },
        ],
      },
      {
        type: "guests",
        guests: [{ name: "LGBTQ+ Activists", bio: "Speeches and performances." }],
      },
      {
        type: "tickets",
        tickets: [{ type: "Pride Pass", price: 0, link: "https://copenhagenpride.dk/" }],
      },
    ],
  },
  {
    id: "10",
    title: "NorthSide Festival 2026",
    theme: { name: "Music", icon: "music" },
    location: {
      address: "Eskelunden",
      city: "Aarhus",
      country: "DK",
      venue: "NorthSide Festival Grounds",
      latitude: 56.1374,
      longitude: 10.1626,
    },
    dateRange: {
      startAt: dayjs("2026-06-05T12:00:00Z").toDate(),
      endAt: dayjs("2026-06-07T23:00:00Z").toDate(),
    },
    format: "inperson",
    creatorId: "u10",
    sections: [
      {
        type: "images",
        srcs: [
          "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
        ],
      },
      { type: "description", content: "Enjoy top international and Danish acts at a green festival." },
      {
        type: "faq",
        items: [{ question: "Is NorthSide cashless?", answer: "Yes, all payments are digital." }],
      },
      {
        type: "guests",
        guests: [{ name: "International Bands", bio: "Alternative and indie music." }],
      },
      {
        type: "tickets",
        tickets: [{ type: "Festival Pass", price: 1800, link: "https://northside.dk/billetter/" }],
      },
    ],
  },
  {
    id: "11",
    title: "Odense Flower Festival 2026",
    theme: { name: "Nature", icon: "leaf" },
    location: {
      address: "Flakhaven 2",
      city: "Odense",
      country: "DK",
      venue: "Odense City Centre",
      latitude: 55.3957,
      longitude: 10.3881,
    },
    dateRange: {
      startAt: dayjs("2026-08-15T10:00:00Z").toDate(),
      endAt: dayjs("2026-08-18T18:00:00Z").toDate(),
    },
    format: "inperson",
    creatorId: "u11",
    sections: [
      {
        type: "images",
        srcs: [
          "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
        ],
      },
      { type: "description", content: "See Odense transformed with floral displays and art installations." },
      {
        type: "faq",
        items: [{ question: "Are there guided tours?", answer: "Yes, guided tours are available every day." }],
      },
      {
        type: "guests",
        guests: [{ name: "Local Florists", bio: "Flower arranging demonstrations." }],
      },
      {
        type: "tickets",
        tickets: [{ type: "Festival Pass", price: 100, link: "https://blomsterfestival.dk/billetter/" }],
      },
    ],
  },
  {
    id: "12",
    title: "Esbjerg Rock Festival 2026",
    theme: { name: "Music", icon: "music" },
    location: {
      address: "Gl. Vardevej 82",
      city: "Esbjerg",
      country: "DK",
      venue: "Esbjerg Rock Festival Grounds",
      latitude: 55.4765,
      longitude: 8.4594,
    },
    dateRange: {
      startAt: dayjs("2026-06-07T12:00:00Z").toDate(),
      endAt: dayjs("2026-06-08T23:00:00Z").toDate(),
    },
    format: "inperson",
    creatorId: "u12",
    sections: [
      {
        type: "images",
        srcs: [
          "https://rockfestival.dk/wp-content/uploads/2023/06/esbjerg-rock-festival-2023.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/3/3d/Esbjerg_Rock_Festival_2018.jpg",
        ],
      },
      { type: "description", content: "Rock out with Danish and international bands in Esbjerg." },
      {
        type: "faq",
        items: [{ question: "Is camping available?", answer: "Yes, camping is available for ticket holders." }],
      },
      {
        type: "guests",
        guests: [{ name: "D-A-D", bio: "Legendary Danish rock band." }],
      },
      {
        type: "tickets",
        tickets: [{ type: "Festival Pass", price: 700, link: "https://rockfestival.dk/billetter/" }],
      },
    ],
  },
  {
    id: "13",
    title: "Bornholm Rundt 2026",
    theme: { name: "Sports", icon: "futbol" },
    location: {
      address: "Havnegade 1",
      city: "Rønne",
      country: "DK",
      venue: "Bornholm City Centre",
      latitude: 55.1042,
      longitude: 14.7065,
    },
    dateRange: {
      startAt: dayjs("2026-08-31T08:00:00Z").toDate(),
      endAt: dayjs("2026-08-31T18:00:00Z").toDate(),
    },
    format: "inperson",
    creatorId: "u13",
    sections: [
      {
        type: "images",
        srcs: [
          "https://bornholmrundt.dk/wp-content/uploads/2023/08/bornholm-rundt-2023.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/5/5e/Bornholm_Rundt_2019.jpg",
        ],
      },
      { type: "description", content: "Cycle 105 km around Denmark's sunshine island." },
      {
        type: "faq",
        items: [
          { question: "Is the race for all levels?", answer: "Yes, everyone can join regardless of experience." },
        ],
      },
      {
        type: "guests",
        guests: [{ name: "Local Cyclists", bio: "Amateur and professional riders." }],
      },
      {
        type: "tickets",
        tickets: [{ type: "Race Entry", price: 350, link: "https://bornholmrundt.dk/tilmelding/" }],
      },
    ],
  },
  {
    id: "14",
    title: "Skagen Winter Bathing Festival 2026",
    theme: { name: "Wellness", icon: "spa" },
    location: {
      address: "Sct. Laurentiivej 39",
      city: "Skagen",
      country: "DK",
      venue: "Skagen Sønderstrand",
      latitude: 57.7209,
      longitude: 10.5839,
    },
    dateRange: {
      startAt: dayjs("2026-01-20T10:00:00Z").toDate(),
      endAt: dayjs("2026-01-22T15:00:00Z").toDate(),
    },
    format: "inperson",
    creatorId: "u14",
    sections: [
      {
        type: "images",
        srcs: [
          "https://skagenvinterbadning.dk/wp-content/uploads/2023/01/skagen-winter-bathing-2023.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/6/6a/Skagen_Winter_Bathing_2018.jpg",
        ],
      },
      { type: "description", content: "Experience the thrill of winter bathing in Denmark's northernmost town." },
      {
        type: "faq",
        items: [{ question: "Is it safe?", answer: "Yes, there are lifeguards and hot drinks available." }],
      },
      {
        type: "guests",
        guests: [{ name: "Winter Bathers", bio: "Enthusiasts from all over Denmark." }],
      },
      {
        type: "tickets",
        tickets: [{ type: "Festival Pass", price: 100, link: "https://skagenvinterbadning.dk/billetter/" }],
      },
    ],
  },
  {
    id: "15",
    title: "Frederiksberg Garden Party 2026",
    theme: { name: "Family", icon: "child" },
    location: {
      address: "Frederiksberg Runddel 1",
      city: "Frederiksberg",
      country: "DK",
      venue: "Frederiksberg Gardens",
      latitude: 55.6778,
      longitude: 12.5253,
    },
    dateRange: {
      startAt: dayjs("2026-07-10T11:00:00Z").toDate(),
      endAt: dayjs("2026-07-10T18:00:00Z").toDate(),
    },
    format: "inperson",
    creatorId: "u15",
    sections: [
      {
        type: "images",
        srcs: [
          "https://frederiksbergfest.dk/wp-content/uploads/2023/07/frederiksberg-garden-party-2023.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/4/4b/Frederiksberg_Garden_Party_2019.jpg",
        ],
      },
      { type: "description", content: "Bring the whole family for a day of games, music, and picnics." },
      {
        type: "faq",
        items: [{ question: "Are pets allowed?", answer: "Yes, dogs on a leash are welcome." }],
      },
      {
        type: "guests",
        guests: [{ name: "Children's Entertainers", bio: "Games and shows for kids." }],
      },
      {
        type: "tickets",
        tickets: [{ type: "Entry", price: 50, link: "https://frederiksbergfest.dk/billetter/" }],
      },
    ],
  },
  {
    id: "16",
    title: "Aarhus Street Food Market 2026",
    theme: { name: "Food", icon: "utensils" },
    location: {
      address: "Ny Banegårdsgade 46",
      city: "Aarhus",
      country: "DK",
      venue: "Aarhus Street Food",
      latitude: 56.1502,
      longitude: 10.2031,
    },
    dateRange: {
      startAt: dayjs("2026-06-01T11:00:00Z").toDate(),
      endAt: dayjs("2026-06-01T22:00:00Z").toDate(),
    },
    format: "inperson",
    creatorId: "u16",
    sections: [
      {
        type: "images",
        srcs: [
          "https://aarhusstreetfood.com/wp-content/uploads/2023/06/aarhus-street-food-market-2023.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/7/7c/Aarhus_Street_Food_2018.jpg",
        ],
      },
      { type: "description", content: "Sample global cuisine from dozens of food stalls in the heart of Aarhus." },
      {
        type: "faq",
        items: [
          { question: "Are vegan options available?", answer: "Yes, there are many vegan and vegetarian stalls." },
        ],
      },
      {
        type: "guests",
        guests: [{ name: "Local Chefs", bio: "Street food experts from Aarhus." }],
      },
      {
        type: "tickets",
        tickets: [{ type: "Entry", price: 30, link: "https://aarhusstreetfood.com/billetter/" }],
      },
    ],
  },
  {
    id: "17",
    title: "Copenhagen Light Festival 2026",
    theme: { name: "Art", icon: "paintbrush" },
    location: {
      address: "Nyhavn",
      city: "Copenhagen",
      country: "DK",
      venue: "City Centre & Canals",
      latitude: 55.6805,
      longitude: 12.5876,
    },
    dateRange: {
      startAt: dayjs("2026-02-01T17:00:00Z").toDate(),
      endAt: dayjs("2026-02-23T23:00:00Z").toDate(),
    },
    format: "inperson",
    creatorId: "u17",
    sections: [
      {
        type: "images",
        srcs: [
          "https://copenhagenlightfestival.org/wp-content/uploads/2023/02/copenhagen-light-festival-2023.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/2/2b/Copenhagen_Light_Festival_2019.jpg",
        ],
      },
      { type: "description", content: "Walk the city and experience magical light art on buildings and bridges." },
      {
        type: "faq",
        items: [{ question: "Is it free?", answer: "Yes, all installations are free to view." }],
      },
      {
        type: "guests",
        guests: [{ name: "Light Artists", bio: "International and Danish light designers." }],
      },
      {
        type: "tickets",
        tickets: [{ type: "Entry", price: 0, link: "https://copenhagenlightfestival.org/" }],
      },
    ],
  },
  {
    id: "18",
    title: "Odense Robotics Expo 2026",
    theme: { name: "Tech", icon: "laptop-code" },
    location: {
      address: "Munkebjergvej 1",
      city: "Odense",
      country: "DK",
      venue: "Odense Congress Center",
      latitude: 55.3726,
      longitude: 10.4141,
    },
    dateRange: {
      startAt: dayjs("2026-09-10T09:00:00Z").toDate(),
      endAt: dayjs("2026-09-12T17:00:00Z").toDate(),
    },
    format: "inperson",
    creatorId: "u18",
    sections: [
      {
        type: "images",
        srcs: [
          "https://odenserobotics.dk/wp-content/uploads/2023/09/odense-robotics-expo-2023.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/8/8c/Odense_Robotics_Expo_2018.jpg",
        ],
      },
      { type: "description", content: "See the latest in robotics, drones, and automation from Danish innovators." },
      {
        type: "faq",
        items: [{ question: "Are there live demos?", answer: "Yes, see robots in action every day." }],
      },
      {
        type: "guests",
        guests: [{ name: "Danish Robotics Startups", bio: "Innovators and engineers." }],
      },
      {
        type: "tickets",
        tickets: [{ type: "Expo Pass", price: 200, link: "https://odenserobotics.dk/billetter/" }],
      },
    ],
  },
  {
    id: "19",
    title: "Aalborg Beer Walk 2026",
    theme: { name: "Food", icon: "utensils" },
    location: {
      address: "Boulevarden 13",
      city: "Aalborg",
      country: "DK",
      venue: "Aalborg City Centre",
      latitude: 57.0488,
      longitude: 9.9187,
    },
    dateRange: {
      startAt: dayjs("2026-09-12T14:00:00Z").toDate(),
      endAt: dayjs("2026-09-12T22:00:00Z").toDate(),
    },
    format: "inperson",
    creatorId: "u19",
    sections: [
      {
        type: "images",
        srcs: [
          "https://aalborgbeerwalk.dk/wp-content/uploads/2023/09/aalborg-beer-walk-2023.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/3/3e/Aalborg_Beer_Walk_2019.jpg",
        ],
      },
      { type: "description", content: "Walk Aalborg and taste beers from local microbreweries." },
      {
        type: "faq",
        items: [{ question: "Is there an age limit?", answer: "Yes, you must be 18+ to participate." }],
      },
      {
        type: "guests",
        guests: [{ name: "Local Brewers", bio: "Craft beer experts from Aalborg." }],
      },
      {
        type: "tickets",
        tickets: [{ type: "Beer Walk Pass", price: 250, link: "https://aalborgbeerwalk.dk/billetter/" }],
      },
    ],
  },
  {
    id: "20",
    title: "Copenhagen Half Marathon 2026",
    theme: { name: "Sports", icon: "futbol" },
    location: {
      address: "Øster Allé 48",
      city: "Copenhagen",
      country: "DK",
      venue: "Parken Stadium",
      latitude: 55.7026,
      longitude: 12.5724,
    },
    dateRange: {
      startAt: dayjs("2026-09-13T11:15:00Z").toDate(),
      endAt: dayjs("2026-09-13T15:00:00Z").toDate(),
    },
    format: "inperson",
    creatorId: "u20",
    sections: [
      {
        type: "images",
        srcs: [
          "https://cphhalf.dk/wp-content/uploads/2023/09/copenhagen-half-marathon-2023.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/1/1e/Copenhagen_Half_Marathon_2019.jpg",
        ],
      },
      { type: "description", content: "Join thousands of runners and experience the city like never before." },
      {
        type: "faq",
        items: [{ question: "Is the course certified?", answer: "Yes, the course is IAAF certified." }],
      },
      {
        type: "guests",
        guests: [{ name: "Elite Runners", bio: "International and Danish athletes." }],
      },
      {
        type: "tickets",
        tickets: [{ type: "Half Marathon Entry", price: 450, link: "https://cphhalf.dk/tilmelding/" }],
      },
    ],
  },
  {
    id: "21",
    title: "Vejle Fjord Festival 2026",
    theme: { name: "Festival", icon: "star" },
    location: {
      address: "Havneøen 1",
      city: "Vejle",
      country: "DK",
      venue: "Vejle Harbour",
      latitude: 55.7093,
      longitude: 9.5357,
    },
    dateRange: {
      startAt: dayjs("2026-08-20T10:00:00Z").toDate(),
      endAt: dayjs("2026-08-21T23:00:00Z").toDate(),
    },
    format: "inperson",
    creatorId: "u21",
    sections: [
      {
        type: "images",
        srcs: [
          "https://fjordfestival.dk/wp-content/uploads/2023/08/vejle-fjord-festival-2023.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/6/6d/Vejle_Fjord_Festival_2019.jpg",
        ],
      },
      { type: "description", content: "Try kayaking, SUP, and enjoy live music by the water." },
      {
        type: "faq",
        items: [
          { question: "Do I need experience for water sports?", answer: "No, all activities are beginner-friendly." },
        ],
      },
      {
        type: "guests",
        guests: [{ name: "Local Bands", bio: "Live music on the harbor stage." }],
      },
      {
        type: "tickets",
        tickets: [{ type: "Festival Pass", price: 100, link: "https://fjordfestival.dk/billetter/" }],
      },
    ],
  },
  {
    id: "22",
    title: "Randers Ugen 2026",
    theme: { name: "Festival", icon: "star" },
    location: {
      address: "Rådhustorvet 1",
      city: "Randers",
      country: "DK",
      venue: "Randers City Centre",
      latitude: 56.4614,
      longitude: 10.0364,
    },
    dateRange: {
      startAt: dayjs("2026-08-12T10:00:00Z").toDate(),
      endAt: dayjs("2026-08-19T23:00:00Z").toDate(),
    },
    format: "inperson",
    creatorId: "u22",
    sections: [
      {
        type: "images",
        srcs: [
          "https://randersugen.dk/wp-content/uploads/2023/08/randers-ugen-2023.jpg",
          "https://upload.wikimedia.org/wikipedia/commons/5/5f/Randers_Ugen_2019.jpg",
        ],
      },
      { type: "description", content: "Enjoy concerts, food markets, and family fun in Randers." },
      {
        type: "faq",
        items: [
          { question: "Are all events outdoors?", answer: "Most events are outdoors, but some are inside venues." },
        ],
      },
      {
        type: "guests",
        guests: [{ name: "Local Musicians", bio: "Live music every day." }],
      },
      {
        type: "tickets",
        tickets: [{ type: "Festival Pass", price: 100, link: "https://randersugen.dk/billetter/" }],
      },
    ],
  },
]
export default mockEvents
