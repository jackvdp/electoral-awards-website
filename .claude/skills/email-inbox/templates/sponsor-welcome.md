# Sponsor welcome / point-of-contact email

First logistics email to a newly signed sponsor or exhibitor for an Awards & Symposium edition. Sent by Jack once Tracy confirms the package. Two variants, both used for the 22nd edition (Manila 2026). Substitute the package bullets from the sponsor's booking form or the electoral dashboard (electoral-dashboard.vercel.app, PhilippinesSponsor table).

Conventions: no prices or payment details (Jack is logistics, not finance); compose via Outlook `compose.sh --html`; end at the closing line, no signature.

## Variant A — fuller version (sent to Al Ghurair, 30 June 2026)

Subject: `22nd International Electoral Awards & Symposium, Manila: your point of contact`

```
Hi [NAME],

Lovely to be in touch. Tracy has passed me the details of [COMPANY]'s involvement
in the 22nd International Electoral Awards & Symposium, and I will be your main
point of contact for everything from here[, as with previous events], so do come
to me with anything you need between now and the event.

A quick recap of the event and what your package includes.

The event: the 22nd International Electoral Awards & Symposium, jointly hosted by
the International Centre for Parliamentary Studies (ICPS) and the Commission on
Elections of the Philippines (COMELEC), takes place from Saturday 29 November to
Wednesday 3 December 2026 at [VENUE], Manila. It brings together electoral
leaders and professionals from across Asia-Pacific and beyond for a five-day
programme of symposium sessions, fringe demonstrations, networking, and the
International Electoral Awards Ceremony.

Your package includes:
- A [SIZE] exhibition space
- [N] delegate passes
- A full-page advert in the conference programme
- Logo and hyperlink on the event website and materials
- A copy of the delegate list
- Airport shuttles

I will be in touch with the practical details (artwork specifications, deadlines,
and on-site logistics) in good time, but in the meantime do let me know if you
have any questions. You can find more on our website.

Warm regards from London,
```

## Variant B — shorter version (sent to Mantratec, 7 July 2026)

Subject: `Welcome to the 22nd International Electoral Awards & Symposium`

```
Hi [NAME],

I hope you are well. I am Jack Vanderpump from ICPS, and I will be your point of
contact for logistics for the 22nd International Electoral Awards & Symposium in
Manila this November. Delighted to have [COMPANY] on board.

Here is a quick recap of what you have booked:
- A [SIZE] exhibition space
- [N] delegate passes
- A full-page advert in the conference programme
- Your logo and a hyperlink
- A copy of the delegate list
- Airport shuttles

I will be in touch shortly with more on next steps and timings. If you want to
check anything in the meantime, just drop me a line.

You can also see public details about the event here:
https://www.electoralnetwork.org/awards

Best wishes,
```

## Notes

- Venue caution (Aug 2026): a venue change from The Manila Hotel is pending with COMELEC. Prefer Variant B (no venue named) or leave the venue line out until confirmed.
- Ask for a logo if the sponsor is not yet on the website sponsors list (`web/src/data/sponsors.ts`).
