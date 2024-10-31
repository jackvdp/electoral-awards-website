export type Judge = {
    name: string;
    title: string;
    organisation: string;
    country: string;
    image: string;
};

export const judges: Judge[] = [
    {
        name: "Matt Gokhool",
        title: "Chief Executive Officer",
        organisation: "International Centre for Parliamentary Studies",
        country: "United Kingdom",
        image: "/img/judges/gokhool.jpeg"
    },
    {
        name: "Román Andrés Jáquez",
        title: "President",
        organisation: "Junta Central Electoral",
        country: "Domincan Republic",
        image: "/img/judges/roman.jpg"
    },
    {
        name: "Michael Bruter",
        title: "Director",
        organisation: "Electoral Psychology Observatory",
        country: "France",
        image: "/img/judges/bruter.jpg"
    },
    {
        name: "Thomas Hicks",
        title: "Commissioner",
        organisation: "U.S. Election Assistance Commission",
        country: "USA",
        image: "/img/judges/hicks.jpg"
    },
    {
        name: "Natia Zaalishvili",
        title: "Director",
        organisation: "Centre for Electoral Systems Development, Reforms and Trainings",
        country: "Georgia",
        image: "/img/judges/natia.jpg"
    },
    {
        name: "Alberto Guevara",
        title: "Former Director",
        organisation: "Electoral Tribunal of the Federal Judiciary",
        country: "Mexico",
        image: "/img/judges/alberto.jpg"
    },
    {
        name: "Toby James",
        title: "Director",
        organisation: "Electoral Integrity Project",
        country: "United Kingdom",
        image: "/img/judges/james.png"
    }
];