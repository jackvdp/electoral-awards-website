import supabaseAdmin from 'backend/supabase/admin';

interface UserSearchResult {
    id: string;
    firstname: string;
    lastname: string;
    organisation: string;
    profile_image: string;
}

async function searchUsers(query: string, limit: number = 8): Promise<UserSearchResult[]> {
    if (!query || query.trim().length < 2) {
        return [];
    }

    const term = query.trim();

    const { data, error } = await supabaseAdmin
        .from('users')
        .select('id, firstname, lastname, organisation, profile_image')
        .or(`firstname.ilike.%${term}%,lastname.ilike.%${term}%`)
        .limit(limit);

    if (error || !data) {
        return [];
    }

    return data as UserSearchResult[];
}

export type { UserSearchResult };
export default searchUsers;
