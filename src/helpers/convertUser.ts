// helpers/convertUser.ts
import {User} from '@supabase/supabase-js';
import {MutableUserData} from 'backend/models/user';

export const convertUser = (user: User): MutableUserData => ({
    id: user.id,
    email: user.email || '',
    firstname: user.user_metadata?.firstname || '',
    lastname: user.user_metadata?.lastname || '',
    phone: user.user_metadata?.phone || '',
    country: user.user_metadata?.country || '',
    birthdate: user.user_metadata?.birthdate || '',
    biography: user.user_metadata?.biography || '',
    position: user.user_metadata?.position || '',
    organisation: user.user_metadata?.organisation || '',
    profileImage: user.user_metadata?.profile_image || '',
    role: user.user_metadata?.role || '',
});