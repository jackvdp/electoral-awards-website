// pages/api/users.ts
import type {NextApiRequest, NextApiResponse} from 'next';
import supabaseAdmin from "backend/supabase/admin";
import {createCustomUserData, CreateUserData, createUserDataForDB} from "backend/models/user";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            await getUsers(req, res);
            break;
        case 'POST':
            await createUser(req, res);
            break;
        default:
            res.status(405).json({error: 'Method not allowed'});
            break;
    }
}

async function getUsers(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({error: 'Method not allowed'});
    }

    const {userIds} = req.query;
    if (!userIds || typeof userIds !== 'string') {
        return res.status(400).json({error: 'Missing or invalid userIds parameter'});
    }

    // Split the comma-separated list into an array.
    const ids = userIds.split(',');

    try {
        // For each id, fetch the user data.
        const results = await Promise.all(
            ids.map(async (id) => {
                const {data, error} = await supabaseAdmin.auth.admin.getUserById(id);
                return error ? null : (data?.user || data);
            })
        );
        return res.status(200).json(results);
    } catch (error: any) {
        return res.status(500).json({error: error.message});
    }
}

async function createUser(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({error: 'Method not allowed'});
    }

    const {
        email,
        password,
        firstname,
        lastname,
        phone,
        country,
        birthdate,
        biography,
        position,
        organisation,
        profileImage,
        role = 'user'
    } = req.body;

    const createUserData: CreateUserData = {
        email,
        password,
        firstname,
        lastname,
        phone,
        country,
        birthdate,
        biography,
        position,
        organisation,
        profileImage,
        role
    }

    if (!email || !password) {
        return res.status(400).json({error: 'Missing required fields'});
    }

    try {
        console.log('Creating user with email:', email);

        // Create the user authentication record
        const {data, error} = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: createCustomUserData(createUserData)
        });

        if (error) {
            return res.status(400).json({error: error.message});
        }

        if (!data.user) {
            return res.status(500).json({error: 'User created but no user data returned'});
        }

        // Create the user profile record
        const {error: profileError} = await supabaseAdmin
            .from('users')
            .insert([
                createUserDataForDB(data.user.id, createUserData)
            ]);

        if (profileError) {
            // If profile creation fails, clean up by deleting the auth user
            await supabaseAdmin.auth.admin.deleteUser(data.user.id);
            return res.status(400).json({error: `Profile creation failed: ${profileError.message}`});
        }

        return res.status(201).json({user: data.user});
    } catch (error: any) {
        return res.status(500).json({error: error.message});
    }
}