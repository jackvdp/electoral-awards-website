/**
 * Image Upload API Endpoint
 * 
 * Setup:
 * 1. Place the bucket folder at the root of your repo (not in public/ or src/)
 * 2. Add your photos in subfolders: bucket/photos/[Folder Name]/
 *    Example: bucket/photos/Botswana October 2025/photo1.jpg
 * 3. Ensure BLOB_READ_WRITE_TOKEN is set in your .env file
 * 
 * Usage:
 * Start your dev server: npm run dev
 * Then run: curl http://localhost:3000/api/images/upload-folder
 * 
 * You'll see processing logs in the terminal where npm run dev is running.
 * Results are saved to upload-results.json at the project root.
 */

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