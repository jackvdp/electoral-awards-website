type Event = {
    time: string;
    description: string;
};

export type Day = {
    title: string;
    events: Event[];
};

export const schedule: Day[] = [
    {
        title: "Monday: Arrival of Delegates & Welcome Dinner",
        events: [
            { time: "1000h", description: "Arrival & Registration" },
            { time: "1800h", description: "Welcome Drinks & Entertainment" }
        ]
    },
    {
        title: "Tuesday: Event registration, Symposium Opening, Dinner",
        events: [
            { time: "1000h", description: "Symposium Registration" },
            { time: "1030h", description: "Chair's Welcome and Openning Address from President of the JCE" },
            { time: "1100h-1200h", description: "Morning Panel" },
            { time: "1200h-1215h", description: "Coffee Break" },
            { time: "1215h-1315h", description: "Keynote Presentation" },
            { time: "1315-1430h", description: "Lunch" },
            { time: "1430h-1445h", description: "Symposium resumes" },
            { time: "1445h-1545h", description: "Afternoon Panel" },
            { time: "1545h-1600h", description: "Coffee Break" },
            { time: "1600h-1700", description: "Keynote Presentation" },
            { time: "1700h-1800h", description: "Fringe events: Industry demonstrations" },
            { time: "2000h", description: "Dinner" }
        ]
    },
    {
        title: "Wednesday: Symposium Closing & The International Electoral Awards Ceremony",
        events: [
            { time: "0930h", description: "Symposium Opening" },
            { time: "0945h-1045h", description: "Keynote Presentation" },
            { time: "1045h-1100h", description: "Coffee Break" },
            { time: "1100h-1200h", description: "Morning Panel" },
            { time: "1215h-1315", description: "Keynote Presentation" },
            { time: "1315-1330h", description: "Symposium Closing" },
            { time: "1330h-1430h", description: "Fringe events: Industry demonstrations" },
            { time: "1430h", description: "Rest and/or explore places of interest nearby before the start of the Awards Ceremony" },
            { time: "1900h", description: "The International Electoral Awards Ceremony will start at 19:00, ending at 22:00. There will be a dinner and entertainment accompanying the awards ceremony." }
        ]
    },
    {
        title: "Thursday: Departures & Morning Sight Seeing",
        events: [
            { time: "1000h", description: "Departures and morning sight seeing. We usually reserve this day for a day tour in the morning for delegates who have late departures, and departures throughout the day." },
            { time: "1000h", description: "Sight seeing trip" }
        ]
    }
];