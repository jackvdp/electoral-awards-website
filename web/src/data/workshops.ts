/**
 * Hands-on workshops at the 22nd International Electoral Awards & Symposium
 * (Manila, 29 November to 3 December 2026). New for the 2026 edition.
 *
 * Places are booked by email rather than through the site, so each workshop
 * carries its own booking address and subject line. Add further workshops to
 * the array as they are confirmed; the workshops page renders them in order.
 */

export interface Workshop {
    /** Anchor id, used for deep links such as /awards/workshops#trusted-records */
    id: string;
    title: string;
    /** Partner organisation the session was designed with, if any */
    partner?: string;
    duration: string;
    venue: string;
    dates: string;
    /** Short standfirst shown under the title */
    summary: string;
    /** The problem the session addresses, one entry per paragraph */
    background: string[];
    /** How the session runs */
    format: string;
    /** Topics covered during the session */
    covers: string[];
    /** What delegates leave with */
    takeaways: string[];
    bookingEmail: string;
    bookingSubject: string;
}

export const workshops: Workshop[] = [
    {
        id: 'trusted-records',
        title: "Who's Trained, Who's Cleared? Trusted Records for the Election Workforce",
        partner: 'BSVA',
        duration: 'Two hours',
        venue: 'The Manila Hotel, Manila, Philippines',
        dates: '29 November to 3 December 2026',
        summary:
            'A two-hour interactive working session, designed by ICPS with our partner BSVA, on recording and verifying the training, qualification and clearance of the election workforce.',
        background: [
            'Every election depends on being able to show that the people running it are trained, qualified and cleared for their role, often across hundreds of thousands of temporary staff.',
            'In most jurisdictions that record sits on paper or is scattered across systems, and it is lost between cycles. Staff are re-vetted and re-trained at real cost, and no one can quickly prove who is qualified.',
        ],
        format:
            'This is a working session, not a lecture. Most of the two hours will be spent designing practical solutions with colleagues facing the same problem.',
        covers: [
            'Vetting staff before they are appointed',
            'Recording training and competence reliably',
            'Verifying a worker’s status quickly at the polls, including offline',
            'Keeping trusted records between elections',
        ],
        takeaways: [
            'Practical ways to record, share and verify who is trained and cleared, drawn from peers around the world',
            'A one-page solution sketch for your own jurisdiction',
            'New contacts working on the same challenge',
        ],
        bookingEmail: 'electoral@parlicentre.org',
        bookingSubject: 'Workshop place request: Trusted Records for the Election Workforce',
    },
];

/** Builds the mailto link used by the "Reserve my place" buttons. */
export const workshopBookingLink = (workshop: Workshop): string =>
    `mailto:${workshop.bookingEmail}?subject=${encodeURIComponent(workshop.bookingSubject)}`;
