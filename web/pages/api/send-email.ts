import { NextApiRequest, NextApiResponse } from 'next';
import { sendMail } from 'backend/services/email/mailer';

const CONTACT_ADDRESS = 'jack.vanderpump@publicpolicyexchange.co.uk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { message, subject } = req.body;

    if (!message) {
      return res.status(400).json({ message: "No message provided in request body" });
    }

    try {
      await sendMail({
        to: CONTACT_ADDRESS,
        from: CONTACT_ADDRESS,
        subject: typeof subject === 'string' && subject.trim() ? subject.trim() : 'New Contact Form Submission',
        text: message,
      });
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Email not sent:', error);
      res.status(400).json({ message: `Email not sent ${error}` });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
