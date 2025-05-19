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
        title: "Monday: Arrival of Delegates & Welcome Dinner",
        events: [
            { time: "All day", description: "<p>Arrival & Registration</p>" },
            { time: "18:00", description: "<p>Welcome Drinks / Informal Networking Reception</p>" }
        ]
    },
    {
        title: "Tuesday: Symposium – Botswana’s 2024 Elections & Inclusive Participation",
        events: [
            { time: "09:00", description: "<p>Symposium Registration</p>" },
            { time: "09:30", description: "<p>Opening & Welcoming Address</p><ul><li>President of the Republic of Botswana</li><li>Chair, Independent Electoral Commission of Botswana</li><li>CEO, International Centre for Parliamentary Studies (ICPS)</li></ul>" },
            { time: "10:00 – 10:15", description: "<p>Coffee Break</p>" },
            { time: "10:15 – 11:15", description: "<p><strong>Morning Panel:</strong> Botswana 2024: Good Practices, Opportunities & Challenges</p><ul><li>Commissioner, IEC Botswana</li><li>Head of Mission, African Union Election Observation</li><li>Regional Director, International IDEA Southern Africa</li></ul>" },
            { time: "11:30 – 12:00", description: "<p><strong>Keynote:</strong> Post‑Election Trust‑Building in Emerging Democracies</p>" },
            { time: "12:00", description: "<p>Group Photo</p>" },
            { time: "12:15 – 13:30", description: "<p>Lunch</p>" },
            { time: "13:45 – 14:15", description: "<p><strong>Keynote:</strong> Designing Inclusive Electoral Frameworks: Gender, Youth & Disability</p>" },
            { time: "14:30 – 15:30", description: "<p><strong>Afternoon Panel:</strong> From Access to Influence: Making Elections Truly Inclusive</p><ul><li>Executive Director, Federation of Disabled People’s Organisations – Botswana</li><li>Youth Coalition Representative</li><li>Civil Society Lead, Women’s Leadership Centre</li></ul>" },
            { time: "15:30 – 15:45", description: "<p>Coffee Break</p>" },
            { time: "15:45 – 16:15", description: "<p><strong>Keynote:</strong> Digital Tools for Inclusive Voter Education</p>" },
            { time: "16:30 – 17:00", description: "<p>Flash Talk Series (3 × 10 min) — industry partners showcasing accessible election tech</p>" },
            { time: "17:00 – 18:00", description: "<p>Fringe Events / Industry Demonstrations</p>" },
            { time: "20:00", description: "<p>Dinner</p>" }
        ]
    },
    {
        title: "Wednesday: Symposium – Disinformation & Misinformation in Elections",
        events: [
            { time: "09:30", description: "<p>Symposium Opening</p>" },
            { time: "09:45 – 10:15", description: "<p><strong>Keynote:</strong> Election Truth in the Age of AI‑Generated Content</p>" },
            { time: "10:15 – 10:45", description: "<p><strong>Presentation:</strong> FactShield: Real‑Time Misinformation Response</p>" },
            { time: "10:45 – 11:00", description: "<p>Coffee Break</p>" },
            { time: "11:00 – 12:00", description: "<p><strong>Morning Panel:</strong> Scaling Counter‑Disinformation Efforts: Global Approaches & Tools</p><ul><li>US Election Assistance Commission</li><li>Policy Lead, Social Media Election Integrity</li><li>Senior Researcher, Academic Institute</li></ul>" },
            { time: "12:15 – 12:45", description: "<p><strong>Keynote:</strong> Rapid‑Response Monitoring: Insights from Botswana 2024</p>" },
            { time: "12:45 – 13:00", description: "<p>Symposium Closing</p>" },
            { time: "09:30 – 13:00", description: "<p>(Parallel) Fringe Events / Industry Demonstrations</p>" },
            { time: "13:00", description: "<p>Lunch</p>" },
            { time: "Afternoon", description: "<p>Rest or optional local tours prior to the Awards Ceremony</p>" },
            { time: "19:00 – 22:00", description: "<h3>The International Electoral Awards</h3><p>Dinner, entertainment & presentation of awards</p>" }
        ]
    },
    {
        title: "Thursday: Departures & Morning Sightseeing",
        events: [
            { time: "10:00", description: "<p>Optional City / Cultural Tour for delegates with late flights</p>" },
            { time: "All day", description: "<p>Departures</p>" }
        ]
    }
];
