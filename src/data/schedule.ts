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
        title: "Day 0 (Saturday, 29 November) — Arrivals",
        events: [
            { time: "All day", description: "<p>Arrival & Registration</p>" },
        ]
    },
    {
        title: "Day 1 (Sunday, 30 November) — Cultural Tour & Cultural Night",
        events: [
            { time: "Morning", description: "<p>Cultural Tour</p>" },
            { time: "Evening", description: "<p>Cultural Night</p>" },
        ]
    },
    {
        title: "Day 2 (Monday, 1 December) — Symposium (Part 1)",
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
        title: "Day 3 (Tuesday, 2 December) — Symposium (Part 2) & Awards Ceremony",
        events: [
            { time: "09:00 – 13:00", description: "<p><strong>Morning Sessions — Strengthening Public Trust & Combating Disinformation</strong></p><p>Keynotes and panels — details to be confirmed</p>" },
            { time: "09:30 – 13:00", description: "<p>(Parallel) Fringe Events / Industry Demonstrations</p>" },
            { time: "13:00", description: "<p>Lunch</p>" },
            { time: "Afternoon", description: "<p>Rest or optional local tours prior to the Awards Ceremony</p>" },
            { time: "19:00 – 22:00", description: "<h3>The International Electoral Awards</h3><p>Dinner, entertainment & presentation of the 22nd International Electoral Awards</p>" }
        ]
    },
    {
        title: "Day 4 (Wednesday, 3 December) — Departures",
        events: [
            { time: "All day", description: "<p>Departures</p>" }
        ]
    },
];
