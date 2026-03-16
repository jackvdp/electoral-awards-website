import { NextApiRequest, NextApiResponse } from 'next';
import createClient from 'backend/supabase/api';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const supabase = createClient(req, res);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || session.user.user_metadata.role !== 'admin') {
        return res.status(401).json({ error: 'Unauthorised' });
    }

    const { filename } = req.query;
    if (typeof filename !== 'string' || !/^[\w\-]+\.eml$/.test(filename)) {
        return res.status(400).json({ error: 'Invalid filename' });
    }

    const filePath = path.join(process.cwd(), 'emails', filename);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Template not found' });
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    res.setHeader('Content-Type', 'message/rfc822');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(content);
}
