# Sponsor nominations ask

## When to use

Asking a signed sponsor or exhibitor to nominate the electoral commissions and officials they have worked with, ahead of a nominations deadline. The pitch: a nomination showcases an excellent deployment of the vendor's products, and recognises the partner's work beyond the project itself.

Sponsors themselves are not eligible (categories are open to EMBs, officials, CSOs, NGOs and individuals), so the ask is always to nominate partner commissions, never themselves.

## Recipients

The sponsor's named contact. "Hi" and "Best," for established contacts; "Dear" and "Kind regards," for more formal relationships. When sending to several sponsors in one sitting, vary the opener and middle phrasing so the emails do not read as a mail merge. No prices, VAT or payment details.

## Subject

`Award nominations close [DATE]`

## Fields to substitute

- Contact name
- Host city, edition number, closing day and date
- Live submit URL, hyperlinked on "the nomination form" (2026: https://www.electoralnetwork.org/awards/submit)

## Body

```bash
.claude/skills/email-inbox/compose.sh \
  --to "placeholder@example.com" \
  --subject "Award nominations close [DATE]" \
  --html \
  --body "<p>Hi [NAME],</p>
<p>I hope you're well. A note ahead of [CITY]: nominations for the [EDITION] International Electoral Awards close on [DAY DATE].</p>
<p>If a commission you've worked with has run a strong deployment this cycle, a nomination is a good way to get that work in front of the judges, and to recognise what your partner has done beyond the project itself. It takes about ten minutes on <a href='[SUBMIT URL]'>the nomination form</a>, and an organisation can go in for more than one category.</p>
<p>If you have any questions, please ask.</p>
<p>Best,</p>"
```

## Manila 2026 notes (prune when the edition closes)

- First sends went to the Manila 2026 sponsors on 4 September 2026 (individual drafts, varied wording); check the `Electoral/Awards 26 Sponsors` mailbox before re-sending to anyone already asked.
