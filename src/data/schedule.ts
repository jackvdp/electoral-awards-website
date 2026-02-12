export type Event = {
    time: string;
    description: string;
};

export type Day = {
    title: string;
    events: Event[];
};

export const schedule: Day[] = [
    {
        title: "Day 1 (Wednesday, 25 November) — Arrival of Delegates & Welcome Reception",
        events: [
            { time: "All day", description: "<p>Arrival & Registration</p>" },
            { time: "18:00", description: "<p>Welcome Reception / Informal Networking</p>" }
        ]
    },
    {
        title: "Day 2 (Thursday, 26 November) — Symposium: Electoral Innovation & Technology in Asia-Pacific",
        events: [
            { time: "08:30", description: "<p>Symposium Registration</p>" },
            { time: "09:00", description: "<p><strong>Opening & Welcoming Session</strong></p><p>Addresses from COMELEC and ICPS leadership</p>" },
            { time: "10:00", description: "<p>Group Photo</p>" },
            { time: "10:15 – 10:30", description: "<p>Coffee Break</p>" },
            { time: "10:45 – 12:30", description: "<p><strong>Morning Sessions</strong></p><p>Keynotes and panels — details to be confirmed</p>" },
            { time: "12:30 – 14:00", description: "<p>Lunch</p>" },
            { time: "14:00 – 17:00", description: "<p><strong>Afternoon Sessions</strong></p><p>Keynotes, panels and fringe events — details to be confirmed</p>" },
        ]
    },
    {
        title: "Day 3 (Friday, 27 November) — Symposium & Awards Ceremony",
        events: [
            { time: "09:00 – 13:00", description: "<p><strong>Morning Sessions — Strengthening Public Trust & Combating Disinformation</strong></p><p>Keynotes and panels — details to be confirmed</p>" },
            { time: "09:30 – 13:00", description: "<p>(Parallel) Fringe Events / Industry Demonstrations</p>" },
            { time: "13:00", description: "<p>Lunch</p>" },
            { time: "Afternoon", description: "<p>Rest or optional local tours prior to the Awards Ceremony</p>" },
            { time: "19:00 – 22:00", description: "<h3>The International Electoral Awards</h3><p>Dinner, entertainment & presentation of the 22nd International Electoral Awards</p>" }
        ]
    },
    {
        title: "Day 4 (Saturday, 28 November) — Cultural Tour & Departures",
        events: [
            { time: "10:00", description: "<p>Optional Cultural Tour for delegates with late flights</p>" },
            { time: "All day", description: "<p>Departures</p>" }
        ]
    },
];
