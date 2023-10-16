export type Event = {
    type: 'Roundtable' | 'Keynote Presentation' | 'In Conversation';
    title: string;
    time: string; // This could be further broken down into date and time objects if needed
    overview?: string;
    speakers: Speaker[];
};

export type Speaker = {
    name: string;
    title: string;
    organization?: string;
};

export const events: Array<Event> = [
    {
        type: 'Roundtable',
        title: 'Navigating Elections in a Pandemic: Lessons Learned from COVID-19',
        time: 'Tuesday 14th 1100h-1200h',
        overview: 'The COVID-19 pandemic has presented unique challenges for electoral management bodies (EMBs) around the globe. As countries grappled with the public health crisis, maintaining the integrity and accessibility of elections became a critical concern. This panel discussion will explore the various strategies and measures implemented by EMBs to ensure safe, inclusive, and transparent elections during the pandemic. Panelists will share their experiences, the challenges faced, and the lessons learned from navigating elections in these unprecedented times.',
        speakers: [
            { name: 'João Almeida', title: 'Commissioner', organization: 'Portuguese National Election Commission' },
            { name: 'Joaquim Morgado', title: 'Commissioner', organization: 'Portuguese National Election Commission' },
            { name: 'Laura Matjošaitytė', title: 'Former Chairperson', organization: 'The Central Electoral Commission of The Republic of Lithuania' },
            { name: 'TBC', title: '' },
        ]
    },
    {
        type: 'Keynote Presentation',
        title: 'The Observer & the Observed – How the Electoral Cycle is Monitored',
        time: 'Tuesday 14th 1330h-1415h',
        speakers: [
            { name: 'Alberto Guevara', title: 'Former Director', organization: 'the Electoral Tribunal of the Federal Judiciary (Mexico)' }
        ]
    },
    {
        type: 'Roundtable',
        title: 'The Future of Voting: Voter Identification, Biometrics, and Electronic Voting',
        time: 'Tuesday 14th 1430h-1530h',
        overview: 'Technological advancements offer new possibilities for improving electoral management processes, including voter identification, biometrics, and electronic voting. This panel discussion will delve into the potential benefits, challenges, and implications of these emerging technologies for EMBs. Panelists will examine case studies, share their experiences, and discuss best practices for successfully integrating technology into the electoral process.',
        speakers: [
            { name: 'Alberto Guevara', title: 'Former Director', organization: 'the Electoral Tribunal of the Federal Judiciary (Mexico)' },
            { name: 'Greg Essensa', title: 'Chief Electoral Officer', organization: 'Elections Ontario' },
            { name: 'Nasim Zaidi', title: 'Former Chief Election Commissioner', organization: 'India' },
            { name: 'TBC', title: '' }
        ]
    },
    {
        type: 'In Conversation',
        title: 'Kenya Election 2022 – A Success Story',
        time: 'Tuesday 14th 1545h-1630h',
        speakers: [
            { name: 'Wafula Chebukati', title: 'Former Chairman', organization: 'Independent Electoral and Boundaries Commission (Kenya)' }
        ]
    },
    {
        type: 'Keynote Presentation',
        title: 'Demystifying Electoral Regulations & Procedures',
        time: 'Wednesday 15th 1015h-1045h',
        speakers: [
            { name: 'Dr. Madhukar Gupta', title: 'State Election Commissioner', organization: 'Election Commission of Rajasthan, India' }
        ]
    },
    {
        type: 'Roundtable',
        title: 'Combating Disinformation: Strategies for Protecting Electoral Integrity',
        time: 'Wednesday 15th 1100h-1200h',
        overview: 'The spread of disinformation poses a significant threat to the integrity of elections and democratic processes. In the age of social media and digital communication, the rapid dissemination of false information can have far-reaching consequences. This panel discussion will focus on strategies and best practices for EMBs to identify, address, and counter disinformation during electoral campaigns. Panelists will share their experiences, discuss the role of various stakeholders, and explore potential solutions for safeguarding the democratic process.',
        speakers: [
            { name: 'Chair & Expert in Electoral Disinformation', title: '' },
            { name: 'Thomas Hicks', title: 'Commissioner', organization: 'U.S. Election Assistance Commission' },
            { name: 'Ingrid Bicu', title: 'Expert in Gender Disinformation' },
            { name: 'Anna Nyqvist', title: 'Chief Executive', organization: 'Swedish Electoral Authority' }
        ]
    }
];