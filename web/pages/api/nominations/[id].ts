import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import dbConnect from 'backend/mongo';
import createSupabaseClient from 'backend/supabase/api';
import Nomination, { INominationDocument } from 'backend/models/nomination';
import { UploadedFile, NominationValidationError } from 'backend/use_cases/nominations/createNomination';
import {
    updateNomination,
    NominationForbiddenError,
    NominationNotFoundError,
} from 'backend/use_cases/nominations/updateNomination';

export const config = {
    api: {
        bodyParser: false, // multipart for PUT is parsed by multer; cookies still available on req
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

async function getSessionUserId(req: NextApiRequest, res: NextApiResponse): Promise<string | undefined> {
    const supabase = createSupabaseClient(req, res);
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            return GET(req, res);
        case 'PUT':
            return PUT(req as NextApiRequestWithFiles, res);
        default:
            return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        const userId = await getSessionUserId(req, res);
        if (!userId) return res.status(401).json({ error: 'Not authenticated' });

        const { id } = req.query;
        await dbConnect();
        const nomination = await Nomination.findById(id).lean() as ({ userId?: string } | null);

        // Don't reveal records the user does not own.
        if (!nomination || nomination.userId !== userId) {
            return res.status(404).json({ error: 'Nomination not found' });
        }

        return res.status(200).json({ success: true, data: nomination });
    } catch (error) {
        console.error('Error fetching nomination:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}

async function PUT(req: NextApiRequestWithFiles, res: NextApiResponse) {
    try {
        const userId = await getSessionUserId(req, res);
        if (!userId) return res.status(401).json({ error: 'Not authenticated' });

        await runMiddleware(req, res, upload.array('documents'));

        const files = (req.files ?? []) as Express.Multer.File[];
        const invalid = files.find(f => !ALLOWED_FILE_TYPES.includes(f.mimetype));
        if (invalid) {
            return res.status(400).json({ error: `Invalid file type: ${invalid.originalname}. Allowed: PDF, DOC, DOCX, JPG, PNG.` });
        }

        const newFiles: UploadedFile[] = files.map(f => ({
            buffer: f.buffer,
            originalname: f.originalname,
            mimetype: f.mimetype,
            size: f.size,
        }));

        let keepDocuments: INominationDocument[] = [];
        if (typeof req.body.keepDocuments === 'string' && req.body.keepDocuments.trim()) {
            try {
                keepDocuments = JSON.parse(req.body.keepDocuments);
            } catch {
                return res.status(400).json({ error: 'Invalid keepDocuments payload.' });
            }
        }

        const { id } = req.query;
        const nomination = await updateNomination({
            id: id as string,
            userId,
            input: req.body,
            newFiles,
            keepDocuments,
        });

        return res.status(200).json({ success: true, id: nomination._id });
    } catch (error) {
        if (error instanceof NominationValidationError) {
            return res.status(400).json({ error: error.message });
        }
        if (error instanceof NominationForbiddenError) {
            return res.status(403).json({ error: error.message });
        }
        if (error instanceof NominationNotFoundError) {
            return res.status(404).json({ error: error.message });
        }
        if (error instanceof multer.MulterError) {
            const message = error.code === 'LIMIT_FILE_SIZE'
                ? 'A file exceeds the 10MB limit.'
                : `Upload error: ${error.message}`;
            return res.status(400).json({ error: message });
        }
        console.error('Error updating nomination:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
