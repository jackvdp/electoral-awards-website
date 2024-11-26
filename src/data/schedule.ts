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
        title: "Sunday: Arrival of Delegates & Welcome Dinner",
        events: [
            { time: "1000h", description: "<p>Arrival & Registration</p>" },
            { time: "1800h", description: "<p>Welcome Drinks & Entertainment</p>" }
        ]
    },
    {
        title: "Monday: Symposium – Combating Disinformation & Harnessing AI for Fair and Secure Elections",
        events: [
            { time: "0900h", description: "<p>Symposium Registration</p>" },
            { time: "0930h", description: "<p>Symposium Opening & Welcoming Address:</p><ul><li>President of the JCE, Roman Jaquez</li><li>CEO of ICPS, Matt Gokhool</li></ul>" },
            { time: "1030h-1130h", description: "<p><strong>Morning Panel:</strong> Countering the Tide: Strategies for Combating Electoral Disinformation</p>This panel will explore multi-faceted approaches to identify, mitigate, and counter disinformation in elections. Experts will discuss the latest trends in disinformation tactics, share case studies of successful interventions, and debate the role of legislation, AI, and civic education in preserving the integrity of electoral processes.<ul><li>Speaker 1: Thomas Hicks, US Election Assistance Commission</li><li>Speaker 2: Sy Mamabolo, CEO of the Election Commission of South Africa</li><li>Speaker 3: Samira Saba, Smartmatic</li><li>Speaker 4: Ana Laura Maltos, Digital Media Observatory at Tecnologico de Monterrey</li></ul>" },
            { time: "1130h-1200h", description: "<p><strong>Keynote Presentation:</strong> JCE of the Dominican Republic</p>" },
            { time: "1200h", description: "<p>Group Photo</p>" },
            { time: "1215h", description: "<p>Lunch</p>" },
            { time: "1345h-1415h", description: "<p><strong>Keynote Presentation:</strong> Harmful Practices and Protective Measures in the Information Environment around the 2024 Elections</p><ul><li>Ingrid Bicu, specialist in disinformation</li></ul>" },
            { time: "1430h-1530h", description: "<p><strong>Afternoon Panel:</strong> AI in Action: Enhancing the Electoral Process</p>This panel will explore the strategic use of AI throughout the electoral cycle, from voter registration to ballot counting and results dissemination. Speakers will discuss the impact of cutting-edge AI tools that are enhancing transparency and efficiency in electoral systems. The session will also highlight key ethical considerations and safeguards necessary to protect voter privacy and maintain electoral integrity.<ul><li>Speaker 1: Alejandra Barrios, Misión de Observación Electoral (MOE)</li><li>Speaker 2: TBC, Digital Media Observatory at Tecnologico de Monterrey</li><li>Speaker 3: Eduardo Correia, Smartmatic</li></ul>" },
            { time: "1545h-1615h", description: "<p><strong>Keynote Presentation:</strong> Alberto Guevara</p>" },
            { time: "1615h-1730h", description: "<p><strong>Fringe Events:</strong> Industry demonstrations</p>" },
            { time: "2000h", description: "<p>Dinner at Hotel</p>" }
        ]
    },
    {
        title: "Tuesday: Awards Ceremony & Symposium – Empowering Democracy: Advancing Electoral Integrity through Staff Training and Technological Innovations",
        events: [
            { time: "0930h", description: "<p>Symposium Opening</p>" },
            { time: "0930h-1000h", description: "<p><strong>Keynote Presentation:</strong> Optimising Training and Conditions for Election Staff Success</p><ul><li>Sonali Campion, Electoral Integrity Project</li></ul>" },
            { time: "1000h-1030h", description: "<p><strong>Keynote Presentation:</strong> Do voter information campaigns make a difference?</p><ul><li>Professor Daniel Stockemer, University of Ottawa</li></ul>" },
            { time: "1045h-1145h", description: "<p><strong>Morning Panel:</strong> Safeguarding Democracy: Strengthening the Electoral Workforce to Prevent Democratic Backsliding</p>This panel will explore strategies for empowering the electoral workforce, vital for safeguarding democracy and preventing backsliding. Experts will discuss the importance of robust training systems and strong institutional frameworks to ensure electoral officials can uphold democracy effectively, even in challenging times. The session will highlight how ongoing professional development and effective management are crucial in maintaining a resilient electoral workforce.<ul><li>Chair: Ian-Michael Anthony, former Chief Elections Office of Dominica</li><li>Speaker 1: Helen G. Aguila-Flores, Deputy Executive Director for Administration of the Philippine Commission on Elections</li><li>Speaker 2: TBC</li><li>Speaker 3: Laura Villalba, International Electoral Consultant, Argentina</li></ul>" },
            { time: "1200h-1230h", description: "<p><strong>Keynote Presentation:</strong> One Nation, One Election</p><ul><li>Dr Madhukar Gupta, Commissioner, SEC Rajasthan India</li></ul>" },
            { time: "1245h-1315h", description: "<p><strong>Keynote Presentation:</strong> 2024 US Election & Beyond: the Role of the EAC</p><ul><li>Thomas Hicks, US Election Assistance Commission</li></ul>" },
            { time: "1315h", description: "<p>Symposium Closing</p>" },
            { time: "1030h-1330h", description: "<p><strong>Fringe Events:</strong> Industry demonstrations</p>" },
            { time: "1330h", description: "<p>Lunch at Hotel</p>" },
            { time: "1330h", description: "<p>Rest and/or explore places of interest nearby before the start of the Awards Ceremony</p>" },
            { time: "1900h", description: "<h3>The International Electoral Awards</h3><p>The International Electoral Awards Ceremony will start at 19:00, ending at 22:00. There will be a dinner and entertainment accompanying the awards ceremony.</p>" }
        ]
    },
    {
        title: "Wednesday: Departures and Morning Sight Seeing",
        events: [
            { time: "1000h", description: "<p>Departures and morning sightseeing. We usually reserve this day for a day tour in the morning for delegates who have late departures, and departures throughout the day.</p>" },
            { time: "1000h", description: "<p>Sightseeing trip</p>" }
        ]
    }
];