import type {NextApiRequest, NextApiResponse} from 'next';
import {uploadAllImages} from "backend/use_cases/images/upload-images";

type ResponseData = {
    success: boolean;
    results?: any;
    message?: string;
    error?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    switch (req.method) {
        case 'GET':
            try {
                const results = await uploadAllImages('./bucket/photos');
                res.status(200).json({success: true, results});
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : String(error)
                });
            }
            break;

        default:
            res.status(405).json({
                success: false,
                message: `Method ${req.method} not allowed!`
            });
            break;
    }
}