import { NextApiRequest, NextApiResponse } from 'next';
import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';

// Configure AWS Bucker
const s3Config = new S3Client({
    region: 'eu-west-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
    }
});

// Configure multer middleware for file upload
const upload = multer({
    storage: multerS3({
        s3: s3Config,
        bucket: 'electoralwebsite',
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, `images/${Date.now().toString()}-${file.originalname}`);
        },
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
});

// Perform the operation
export default async function imageUpload(
    r: NextApiRequest,
    res: NextApiResponse
) {
    const req = r as NextApiRequestWithFile;
    try {
        await runMiddleware(req, res, upload.single('image'));
        if (!req.file || !req.file.location) {
            return res.status(400).json({ error: 'No file uploaded or location unavailable' });
        }

        const imageUrl = req.file.location;
        return res.status(200).json({ imageUrl });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


const runMiddleware = (req: NextApiRequestWithFile, res: NextApiResponse, fn: any) => {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
};

export interface NextApiRequestWithFile extends NextApiRequest {
    file: File & { location?: string };
}