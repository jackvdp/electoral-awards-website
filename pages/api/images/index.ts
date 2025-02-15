import {NextApiRequest, NextApiResponse} from 'next';

export const config = {
    api: {
        bodyParser: false, // Disables the default body parser to allow for files greater than 1MB
    },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        default:
            res.status(405).json({message: 'Method not allowed!' + req.method});
            break;
    }
}