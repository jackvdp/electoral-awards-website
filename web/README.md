This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Email (SMTP)

All transactional email (contact form, booking confirmations, invitations,
cancellations and nomination emails) is sent over SMTP through SMTP.com, using
the shared transport in `src/backend/services/email/mailer.ts`.

Set these in `.env.local` for development and in the Vercel project settings for
preview and production:

| Variable | Purpose | Default |
|----------|---------|---------|
| `SMTP_HOST` | SMTP server | `send.smtp.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | SMTP username | none, required |
| `SMTP_PASSWORD` | SMTP password | none, required |
| `SMTP_FROM` | Default sender address | `info@electoralnetwork.org` |

Port 587 uses STARTTLS: the connection opens in the clear and is upgraded before
authentication. Implicit SSL on port 587 does not work, so `secure` stays false
and `requireTLS` stays true in the transport.

Email bodies are rendered in the app, in `src/backend/services/email/templates/`,
rather than by the mail provider.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
