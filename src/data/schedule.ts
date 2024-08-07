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
            { time: "1000h", description: "<p>Arrival & Registration</p>" },
            { time: "1800h", description: "<p>Welcome Drinks & Entertainment</p>" }
        ]
    },
    {
        title: "Tuesday: Symposium – Combating Disinformation & Harnessing AI for Fair and Secure Elections",
        events: [
            { time: "1000h", description: "<p>Symposium Registration</p>" },
            { time: "1030h", description: "<p>Symposium Opening & Welcoming Address:</p><ul><li>President of the JCE, Roman Jaquez</li><li>CEO of ICPS, Matt Gokhool</li></ul>" },
            { time: "1100h-1200h", description: "<p><strong>Morning Panel:</strong> Countering the Tide: Strategies for Combating Electoral Disinformation</p><ul><li>This panel will explore multi-faceted approaches to identify, mitigate, and counter disinformation in elections.</li><li>Experts will discuss the latest trends in disinformation tactics, share case studies of successful interventions, and debate the role of legislation, AI, and civic education in preserving the integrity of electoral processes.</li></ul>" },
            { time: "1200h", description: "<p>Lunch</p>" },
            { time: "1330h-1415h", description: "<p><strong>Keynote Presentation:</strong> The Gender Dimension in the Use of AI-Enabled Technologies in Elections</p><ul><li>Ingrid Bicu</li></ul>" },
            { time: "1430h-1530h", description: "<p><strong>Afternoon Panel:</strong> AI in Action: Enhancing the Electoral Process</p> <ul><li>This panel will explore the strategic use of AI throughout the electoral cycle, from voter registration to ballot counting and results dissemination.</li><li>Speakers will discuss the impact of cutting-edge AI tools that are enhancing transparency and efficiency in electoral systems.</li><li>The session will also highlight key ethical considerations and safeguards necessary to protect voter privacy and maintain electoral integrity.</li></ul>" },
            { time: "1545h-1630h", description: "<p><strong>Keynote Presentation</strong></p>" },
            { time: "1630h-1730h", description: "<p><strong>Fringe Events:</strong> Industry demonstrations</p>" },
            { time: "2000h", description: "<p>Dinner & Entertainment</p>" }
        ]
    },
    {
        title: "Wednesday: Awards Ceremony & Symposium – Empowering Democracy: Advancing Electoral Integrity through Staff Training and Technological Innovations",
        events: [
            { time: "0930h", description: "<p>Symposium Opening</p>" },
            { time: "1000h-1030h", description: "<p><strong>Keynote Presentation:</strong> Optimising Training and Conditions for Election Staff Success</p><ul><li>Sonali Campion, Electoral Integrity Project</li></ul>" },
            { time: "1030h-1100h", description: "<p><strong>Keynote Presentation</strong><ul><li>Paul Greenhalgh, CEO, ICPS Skillwise</li></ul></p>" },
            { time: "1130h-1230h", description: "<p><strong>Morning Panel:</strong> Safeguarding Democracy: Strengthening the Electoral Workforce to Prevent Democratic Backsliding</p><ul><li>This panel will explore strategies for empowering the electoral workforce, vital for safeguarding democracy and preventing backsliding.</li><li>Experts will discuss the importance of robust training systems and strong institutional frameworks to ensure electoral officials can uphold democracy effectively, even in challenging times.</li><li>The session will highlight how ongoing professional development and effective management are crucial in maintaining a resilient electoral workforce.</li></ul>" },
            { time: "1245h-1330h", description: "<p><strong>Keynote Presentation:</strong> TBC</p>" },
            { time: "1330h", description: "<p>Symposium Closing</p>" },
            { time: "1330h", description: "<p>Lunch at Hotel</p>" },
            { time: "1430h", description: "<p>Rest and/or explore places of interest nearby before the start of the Awards Ceremony</p>" },
            { time: "1900h", description: "<h3>The 20th International Electoral Awards</h3><ul><li>Ceremony will start at 19:00, ending at 22:00. There will be a dinner and entertainment accompanying the awards ceremony.</li></ul>" }
        ]
    },
    {
        title: "Thursday: Departures and Morning Sight Seeing",
        events: [
            { time: "1000h", description: "<p>Departures and morning sightseeing. We usually reserve this day for a day tour in the morning for delegates who have late departures, and departures throughout the day.</p>" },
            { time: "1000h", description: "<p>Sightseeing trip</p>" }
        ]
    }
];