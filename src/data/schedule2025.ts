import { Day } from "./schedule";

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
            { time: "08:30", description: "<p>Symposium Registration</p>" },
            { time: "09:00", description: "<p><strong>Opening & Welcoming Session</strong></p><p>Directors of Ceremonies - IEC & ICPS</p><ul><li>National Anthem – Botswana Police Service Band</li><li>Prayer</li><li>Introductions – District Commissioner</li><li>Welcome Remarks – Hon Justice Barnabas Nyamadzabo, Chairman, Independent Electoral Commission of Botswana</li><li>Official Opening – Advocate Duma Gideon Boko, President of the Republic of Botswana</li><li>Remarks - CEO, International Centre for Parliamentary Studies (ICPS)</li><li>Vote of Thanks – Commissioner Thebeyame T. Tsimako, IEC, Botswana</li></ul>" },
            { time: "10:00", description: "<p>Group Photo</p>" },
            { time: "10:15 – 10:30", description: "<p>Coffee Break</p>" },
            { time: "10:45 – 11:15", description: "<p><strong>Keynote Presentation: \"Trust‑Building and Integrity in Emerging Democracies in Electoral Management\"</strong></p><p>Hon Justice Gaolapelwe Ketlogetswe, Chief Justice, Botswana</p>" },
            { time: "11:30 – 12:30", description: "<p><strong>Morning Panel — \"Botswana 2024: Good Practices, Opportunities & Challenges\"</strong></p><p>Session Moderator – Commissioner Wame T. Thanke, IEC, Botswana</p><ul><li>Jeff Siamisang, SIEC - Review of 2024 General Elections of Botswana: Perspectives from Election Management Body – Independent Electoral Commission of Botswana</li><li> Prof David Sebudubudu – Perspectives from an academic</li></ul>" },
            { time: "12:30 – 13:45", description: "<p>Lunch</p>" },
            { time: "14:00 – 14:30", description: "<p><strong>Keynote — \"Designing Inclusive Electoral Frameworks: Gender, Youth & Disability\"</strong></p><p>Maureen Shonge, Regional Policy Specialist – Women's Political Participation, UN Women East & Southern Africa</p>"},
            { time: "14:45 – 15:45", description: "<p><strong>Afternoon Panel — \"From Access to Influence: Making Elections Truly Inclusive\"</strong></p><ol><li>Melatwork Hailu – Chairperson of the National Election Board of Ethiopia</li><li>Mr. Kutlwano Pelontle – Botswana Coalition of Non-Governmental Organisations (BOCONGO)</li><li>Executive Director, Federation of Disabled People's Organisations – Botswana</li><li>Ms Pamela Dube – Gender Links</li><li>Helen G. Aguila-Flores – Commission on Elections Philippines</li></ol>" },
            { time: "15:45 – 16:00", description: "<p>Coffee Break</p>" },
            { time: "16:00 – 16:30", description: "<p><strong>Keynote — \"Digital Tools for Inclusive Voter Education\"</strong></p><p>Mr Kenneth Setimela – Founder & MD at LeveragePoint</p>" },
            { time: "16:45 – 17:15", description: "<p><strong>Keynote — \"Buenos Aires City Elections 2025\"</strong></p><p>Dr. Federico Fahey – Electoral Management Institute Buenos Aires</p>" },
            { time: "17:30 – 18:00", description: "<p><strong>Keynote – \"Online Voting Introduction: How to introduce online voting in the electoral process\"</strong></p><p>Victor Hidalgo – Global Solutions Manager, Lumi</p>" },
        ]
    },
    {
        title: "Day 3 — Awards Ceremony & Symposium",
        events: [
            { time: "09:00", description: "<p>Symposium Opening</p>" },
            { time: "09:00 – 09:20", description: "<p><strong>Reflection on the 2024 Indian Election</strong></p><ul><li>Dr Madhukar Gupta – State Election Commissioner of Rajasthan, State Election Commission</li></ul>" },
            { time: "09:25 – 09:40", description: "<p><strong>Reflection on the 2024 Somaliland Presidential Election</strong></p><ul><li>Musa Hassan Yousuf, Chairman of the Electoral Commission of the Republic of Somaliland</li></ul>" },
            { time: "09:45 – 10:15", description: "<p><strong>In Conversation</strong></p><ul><li>Lee Jung-ok – Former Minister of Gender Equality and Family of South Korea</li><li>Joe Matthews – Founder-Publisher of Democracy Local,</li></ul>" },
            { time: "10:15 – 11:15", description: "<p><strong>Morning Panel — \"Improving Trust in Election: Global Approaches & Tools\"</strong></p><ol><li>Commissioner Dr Gerson Sindano – Electoral Commission of Namibia</li><li>Tamar Tsertsvadze, Central Election Commission of Georgia</li><li>Juan Pablo Prezzoli, Director of International Relations, Comitia</li></ol>" },
            { time: "11:15 – 11:30", description: "<p>Coffee Break</p>" },
            { time: "11:30 – 12:00", description:  "<p><strong>Keynote – \"Tackling Misinformation\"</strong></p><p>Sy Mamabolo – CEO of the Electoral Commission of South Africa</p>" },
            { time: "12:15 – 12:45", description: "<p><strong>Keynote — \"Election Truth in the Age of AI‑Generated Content\"</strong></p><p>Commissioner Thomas Hicks – United States EAC</p>" },
            { time: "12:45 – 13:00", description: "<p><strong>Symposium Closing</strong></p>" },
            { time: "09:30 – 13:00", description: "<p>(Parallel) Fringe Events / Industry Demonstrations</p>" },
            { time: "13:00", description: "<p>Lunch</p>" },
            { time: "Afternoon", description: "<p>Rest or optional local tours prior to the Awards Ceremony</p>" },
            { time: "19:00 – 22:00", description: "<h3>The International Electoral Awards</h3><p>Dinner, entertainment & presentation of awards; as well as closing delivered by Hon. Moeti Caesar Mohwasa, Minister for State President, Republic of Botswana</p>" }
        ]
    },
    {
        title: "Day 4 — Departures & Morning Sightseeing",
        events: [
            { time: "10:00", description: "<p>Optional City / Cultural Tour for delegates with late flights</p>" },
            { time: "All day", description: "<p>Departures</p>" }
        ]
    },

    {
        title: "Awards Ceremony Timings",
        events: [
            { time: "19:00", description: "<h3>The International Electoral Awards</h3><p>Move attendees into main ballroom</p>" },
            { time: "19:15", description: "<b>Award Ceremony Start</b>" },
            { time: "19:25", description: "<p>Presentation from CEO of ICPS</p>" },
            { time: "19:30", description: "<p>Presentation from IEC</p>" },
            { time: "19:40", description: "<b>Opening Entertainment</b>" },
            { time: "19:50", description: "<p>Presentation 1: International Institutional Engagement Award</p>" },
            { time: "20:00", description: "<p>Presentation 2: Electoral Conflict Management Award</p>" },
            { time: "20:10", description: "<p>Presentation 3: Meritorious Achievement Award</p>" },
            { time: "20:20", description: "<b>Entertainment</b>" },
            { time: "20:30", description: "<p>Presentation 4: Accessibility for All Award</p>" },
            { time: "20:40", description: "<p>Presentation 5: First Time Voter Award</p>" },
            { time: "20:50", description: "<p>Presentation 6: Election Management Award</p>" },
            { time: "21:00", description: "<b>Entertainment & Main Course to be served</b>" },
            { time: "21:10", description: "<p>Presentation 7: Citizens' Engagement Award</p>" },
            { time: "21:20", description: "<p>Presentation 8: Electoral Ergonomic Award</p>" },
            { time: "21:30", description: "<p>Presentation 9: Lifetime Achievement Award</p>" },
            { time: "21:40", description: "<b>Dessert to be served</b>" },
            { time: "21:50", description: "<p>Presentation 11: Electoral Commission of the Year</p>" },
            { time: "22:00", description: "<p>Presentation 12: Electoral Commissioner of the Year</p>" },
            { time: "22:10", description: "<b>Mr Matt Gokhool, CEO of ICPS & Hon. Ms Maipelo Mophuting, Assistant Minister for State President, Republic of Botswana, closing speech</b>" }
        ]
    },
];
