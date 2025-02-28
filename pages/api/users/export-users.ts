// pages/api/users/export-users.ts
import type {NextApiRequest, NextApiResponse} from 'next';
import supabaseAdmin from 'backend/supabase/admin';
import createClient from "backend/supabase/api";

// Helper function to escape CSV field values
const escapeCSV = (field: string | null | undefined): string => {
    if (field === null || field === undefined) return '';
    const stringField = String(field);
    // If the field contains commas, quotes, or newlines, wrap it in quotes
    if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
        // Double up any quotes
        return `"${stringField.replace(/"/g, '""')}"`;
    }
    return stringField;
};

// Convert users array to CSV format
const generateCSV = (users: any[]): string => {
    // Define columns to include in the CSV (customize as needed)
    const columns = [
        'id',
        'email',
        'firstname',
        'lastname',
        'organisation',
        'position',
        'country',
        'role',
        'created_at'
    ];

    // Create header row
    const header = columns.join(',');

    // Create data rows
    const rows = users.map(user => {
        return columns.map(col => escapeCSV(user[col])).join(',');
    });

    // Combine header and rows
    return [header, ...rows].join('\n');
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Only allow GET method
    if (req.method !== 'GET') {
        return res.status(405).json({error: 'Method not allowed'});
    }

    try {
        // Create authenticated Supabase client
        const supabase = createClient(req, res);

        // Verify user is authenticated and is an admin
        const {data: {session}} = await supabase.auth.getSession();
        if (!session || session.user.user_metadata.role !== 'admin') {
            return res.status(401).json({error: 'Unauthorized'});
        }

        // Fetch all users from the database
        const {data: users, error} = await supabaseAdmin
            .from('users')
            .select('*')
            .order('lastname', {ascending: true});

        if (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({error: 'Failed to fetch users'});
        }

        // Generate CSV content
        const csv = generateCSV(users);

        // Set response headers for file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="users.csv"');

        // Send the CSV data
        res.status(200).send(csv);
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({error: 'Internal server error'});
    }
}