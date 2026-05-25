// pages/api/user/[id].ts
import type {NextApiRequest, NextApiResponse} from 'next';
import supabaseAdmin from "backend/supabase/admin";
import {createCustomUserData} from "backend/models/user";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // Determine which operation to perform based on HTTP method
    switch (req.method) {
        case 'PUT':
            return updateUser(req, res);
        case 'DELETE':
            return deleteUser(req, res);
        default:
            return res.status(405).json({error: 'Method not allowed'});
    }
}

// Handler to update a user
async function updateUser(req: NextApiRequest, res: NextApiResponse) {
    const {id} = req.query;
    const userData = req.body;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({error: 'Missing or invalid user id'});
    }

    if (!userData) {
        return res.status(400).json({error: 'Missing user data'});
    }

    try {
        // Update auth metadata
        const {data: authData, error: authUpdateError} = await supabaseAdmin.auth.admin.updateUserById(
            id,
            {user_metadata: createCustomUserData(userData)}
        );

        if (authUpdateError) {
            return res.status(500).json({error: authUpdateError.message});
        }

        console.log('*** role', userData.role);

        // Update user profile in users table
        const {error: profileUpdateError} = await supabaseAdmin
            .from('users')
            .update({
                email: userData.email,
                firstname: userData.firstname,
                lastname: userData.lastname,
                phone: userData.phone,
                country: userData.country,
                birthdate: userData.birthdate,
                biography: userData.biography,
                position: userData.position,
                organisation: userData.organisation,
                profile_image: userData.profileImage,
                role: userData.role,
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (profileUpdateError) {
            return res.status(500).json({error: profileUpdateError.message});
        }

        return res.status(200).json({
            message: 'User updated successfully',
            user: {
                ...userData,
                id
            }
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({error: 'Failed to update user'});
    }
}

// Handler to delete a user
async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
    const {id} = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({error: 'Missing or invalid user id'});
    }

    try {
        // First delete user profile from your "users" table if needed
        const {error: profileError} = await supabaseAdmin
            .from('users')
            .delete()
            .eq('id', id);

        if (profileError) {
            return res.status(500).json({error: profileError.message});
        }

        // Now delete the auth user
        const {error: authError} = await supabaseAdmin.auth.admin.deleteUser(id);

        if (authError) {
            return res.status(500).json({error: authError.message});
        }

        return res.status(200).json({message: 'User deleted successfully'});
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({error: 'Failed to delete user'});
    }
}