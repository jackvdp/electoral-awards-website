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
        title: "Day 1 — Arrival of Delegates & Welcome Drinks",
        events: [
            { time: "All day", description: "<p>Arrival & Registration</p>" },
            { time: "18:00", description: "<p>Welcome Drinks / Informal Networking Reception</p>" }
        ]
    },
    {
        title: "Day 2 — Symposium",
        events: [
            { time: "09:00", description: "<p>Symposium Registration</p>" },
            { time: "09:30", description: "<p><strong>Opening & Welcoming Session</strong></p><p>Directors of Ceremonies - IEC & ICPS</p><ul><li>National Anthem – Botswana Police Service Band</li><li>Prayer</li><li>Introductions – District Commissioner</li><li>Welcome Remarks – Hon Justice Barnabas Nyamadzabo, Chairman, Independent Electoral Commission of Botswana</li><li>Official Opening – Advocate Duma Gideon Boko, President of the Republic of Botswana</li><li>Remarks - CEO, International Centre for Parliamentary Studies (ICPS)</li><li>Vote of Thanks – Commissioner Thebeyame T. Tsimako, IEC, Botswana</li></ul>" },
            { time: "10:00", description: "<p>Group Photo</p>" },
            { time: "10:15 – 10:30", description: "<p>Coffee Break</p>" },
            { time: "10:30 – 11:30", description: "<p><strong>Keynote Presentation: \"Trust‑Building and Integrity in Emerging Democracies in Electoral Management\"</strong></p><p>Hon Justice Gaolapelwe Ketlogetswe, Chief Justice, Botswana</p>" },
            { time: "11:45 – 12:15", description: "<p><strong>Morning Panel — \"Botswana 2024: Good Practices, Opportunities & Challenges\"</strong></p><p>Session Moderator – Commissioner Wame T. Thanke, IEC, Botswana</p><ul><li>Jeff Siamisang, SIEC - Review of 2024 General Elections of Botswana: Perspectives from Election Management Body – Independent Electoral Commission of Botswana</li></ul>" },
            { time: "12:30 – 13:45", description: "<p>Lunch</p>" },
            { time: "14:00 – 14:30", description: "<p><strong>Keynote — \"Designing Inclusive Electoral Frameworks: Gender, Youth & Disability\"</strong></p><p>Maureen Shonge, Regional Policy Specialist – Women’s Political Participation, UN Women East & Southern Africa</p>"},
            { time: "14:45 – 15:45", description: "<p><strong>Afternoon Panel — \"From Access to Influence: Making Elections Truly Inclusive\"</strong></p><ol><li>Melatwork Hailu – Chairperson of the National Election Board of Ethiopia</li><li>Misheck Gondo – South Africa Youth Forum</li><li>Zvanguwo Sachikonye – Professor of Political Science based at the University of Zimbabwe</li><li>Helen G. Aguila-Flores, Commission on Elections Philippines</li><li>Industry Voice</li></ol>" },
            { time: "15:45 – 16:00", description: "<p>Coffee Break</p>" },
            { time: "16:00 – 16:30", description: "<p><strong>Keynote — \"Digital Tools for Inclusive Voter Education\"</strong></p><p>Mr Kenneth Setimela – Founder & MD at LeveragePoint</p>" },
            { time: "16:45 – 17:15", description: "<p>Industry Voice Presentation</p>" },
            { time: "17:15 – 18:00", description: "<p>Fringe Events</p>" },
        ]
    },
    {
        title: "Day 3 — Awards Ceremony & Symposium",
        events: [
            { time: "09:00", description: "<p>Symposium Opening</p>" },
            { time: "09:00 – 09:30", description: "<p><strong>Keynote Presentation: \"Election Challenges in Libya from 2012 to 2022\"</strong></p><p>Dr Khaled Elkadiki</p>" },
            { time: "09:45 – 10:15", description: "<p><strong>In Conversation</strong></p><ul><li>Lee Jung-ok – Former Minister of Gender Equality and Family of South Korea</li><li>Bruno Kaufmann – Director of International Cooperation, Swiss Democracy Foundation</li></ul>" },
            { time: "10:15 – 11:15", description: "<p><strong>Morning Panel — \"Improving Trust in Election: Global Approaches & Tools\"</strong></p><ol><li>Commissioner Dr Gerson Sindano – Electoral Commission of Namibia</li><li>Tamar Tsertsvadze, Central Election Commission of Georgia</li><li>Industry Voice</li><li>TBC</li></ol>" },
            { time: "11:15 – 11:30", description: "<p>Coffee Break</p>" },
            { time: "11:30 – 12:00", description:  "<p><strong>Keynote: \"Tackling Misinformation\"</strong></p><p>Sy Mamabolo – CEO of the Electoral Commission of South Africa</p>" },
            { time: "12:15 – 12:45", description: "<p><strong>Keynote — \"Election Truth in the Age of AI‑Generated Content\"</strong></p><p>Commissioner Thomas Hicks – United States EAC</p>" },
            { time: "12:45 – 13:00", description: "<p><strong>Symposium Closing</strong></p><p>Hon. Moeti Caesar Mohwasa, Minister for State President, Republic of Botswana</p>" },
            { time: "09:30 – 13:00", description: "<p>(Parallel) Fringe Events / Industry Demonstrations</p>" },
            { time: "13:00", description: "<p>Lunch</p>" },
            { time: "Afternoon", description: "<p>Rest or optional local tours prior to the Awards Ceremony</p>" },
            { time: "19:00 – 22:00", description: "<h3>The International Electoral Awards</h3><p>Dinner, entertainment & presentation of awards</p>" }
        ]
    },
    {
        title: "Day 4 — Departures & Morning Sightseeing",
        events: [
            { time: "10:00", description: "<p>Optional City / Cultural Tour for delegates with late flights</p>" },
            { time: "All day", description: "<p>Departures</p>" }
        ]
    }
];