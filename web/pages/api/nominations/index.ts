import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import dbConnect from 'backend/mongo';
import createSupabaseClient from 'backend/supabase/api';
import {
    createNomination,
    NominationValidationError,
    UploadedFile,
} from 'backend/use_cases/nominations/createNomination';
import { sendNominationEmails } from 'backend/use_cases/nominations/sendNominationEmails';

export const config = {
    api: {
        bodyParser: false, // multipart form data is parsed by multer below
    },
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
];

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE },
});

interface NextApiRequestWithFiles extends NextApiRequest {
    files?: Express.Multer.File[];
}

const runMiddleware = (req: NextApiRequestWithFiles, res: NextApiResponse, fn: any) =>
    new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) return reject(result);
            return resolve(result);
        });
    });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'POST':
            return POST(req as NextApiRequestWithFiles, res);
        default:
            return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}

async function POST(req: NextApiRequestWithFiles, res: NextApiResponse) {
    try {
        await runMiddleware(req, res, upload.array('documents'));

        const files = (req.files ?? []) as Express.Multer.File[];

        const invalid = files.find(f => !ALLOWED_FILE_TYPES.includes(f.mimetype));
        if (invalid) {
            return res.status(400).json({ error: `Invalid file type: ${invalid.originalname}. Allowed: PDF, DOC, DOCX, JPG, PNG.` });
        }

        const uploadedFiles: UploadedFile[] = files.map(f => ({
            buffer: f.buffer,
            originalname: f.originalname,
            mimetype: f.mimetype,
            size: f.size,
        }));

        // Link the nomination to the logged-in user, if there is a valid session.
        let userId: string | undefined;
        try {
            const supabase = createSupabaseClient(req, res);
            const { data: { session } } = await supabase.auth.getSession();
            userId = session?.user?.id;
        } catch (authError) {
            console.error('Could not read session for nomination (continuing as anonymous):', authError);
        }

        await dbConnect();
        const nomination = await createNomination(req.body, uploadedFiles, userId);

        // Confirmation to the nominator and notification to the administrator.
        // Never throws, so a mail failure cannot fail the saved submission.
        await sendNominationEmails(nomination);

        return res.status(201).json({ success: true, id: nomination._id });
    } catch (error) {
        if (error instanceof NominationValidationError) {
            return res.status(400).json({ error: error.message });
        }
        if (error instanceof multer.MulterError) {
            const message = error.code === 'LIMIT_FILE_SIZE'
                ? 'A file exceeds the 10MB limit.'
                : `Upload error: ${error.message}`;
            return res.status(400).json({ error: message });
        }
        console.error('Error creating nomination:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
