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
        title: "Tuesday: Event registration, Symposium Opening, Dinner & Entertainment",
        events: [
            { time: "1000h", description: "Symposium Registration" },
            { time: "1030h", description: "Symposium Opening & Welcoming Address: President of the JCE, Roman Jaquez and CEO of ICPS, Matt Gokhool" },
            { time: "1100h-1200h", description: "Countering the Tide: Strategies for Combating Electoral Disinformation - This panel will explore multi-faceted approaches to identify, mitigate, and counter disinformation in elections. Experts will discuss the latest trends in disinformation tactics, share case studies of successful interventions, and debate the role of legislation, AI, and civic education in preserving the integrity of electoral processes." },
            { time: "1200h", description: "Lunch" },
            { time: "1330h-1415h", description: "Keynote Presentation: The Gender Dimension in the Use of AI-Enabled Technologies in Elections by Ingrid Bicu" },
            { time: "1430h-1530h", description: "Afternoon Panel - This panel will explore the strategic use of AI throughout the electoral cycle, from voter registration to ballot counting and results dissemination. Speakers will discuss the impact of cutting-edge AI tools that are enhancing transparency and efficiency in electoral systems. The session will also highlight key ethical considerations and safeguards necessary to protect voter privacy and maintain electoral integrity." },
            { time: "1545h-1630h", description: "Keynote Presentation" },
            { time: "1630h-1730h", description: "Fringe events: Industry demonstrations" },
            { time: "2000h", description: "Dinner & Entertainment" }
        ]
    },
    {
        title: "Wednesday: Symposium Closing & The International Electoral Awards Ceremony",
        events: [
            { time: "0930h", description: "Symposium Opening" },
            { time: "1000h-1030h", description: "Keynote Presentation: Optimising Training and Conditions for Election Staff Success by Sonali Campion, Electoral Integrity Project" },
            { time: "1030h-1100h", description: "ICPS Presentation by Paul Greenhalgh" },
            { time: "1130h-1230h", description: "Morning Panel: Safeguarding Democracy: Strengthening the Electoral Workforce to Prevent Democratic Backsliding - This panel will explore strategies for empowering the electoral workforce, vital for safeguarding democracy and preventing backsliding. Experts will discuss the importance of robust training systems and strong institutional frameworks to ensure electoral officials can uphold democracy effectively, even in challenging times. The session will highlight how ongoing professional development and effective management are crucial in maintaining a resilient electoral workforce." },
            { time: "1245h-1330h", description: "Keynote Presentation" },
            { time: "1330h", description: "Lunch at Hotel" },
            { time: "1330h", description: "Symposium Closing" },
            { time: "1430h", description: "Rest and/or explore places of interest nearby before the start of the Awards Ceremony" },
            { time: "1900h", description: "The International Electoral Awards Ceremony will start at 19:00, ending at 22:00. There will be a dinner and entertainment accompanying the awards ceremony." }
        ]
    },
    {
        title: "Thursday: Departures and Morning Sight Seeing",
        events: [
            { time: "1000h", description: "Departures and morning sightseeing. We usually reserve this day for a day tour in the morning for delegates who have late departures, and departures throughout the day." },
            { time: "1000h", description: "Sightseeing trip" }
        ]
    }
];