import {User} from "@supabase/supabase-js";

interface BaseUserData {
    email: string;
    firstname: string;
    lastname: string;
    phone: string;
    country: string;
    birthdate: string;
    biography: string;
    position: string;
    organisation: string;
    profileImage: string;
    role?: string;
}

interface MutableUserData extends BaseUserData {
    id: string;
}

interface CreateUserData extends BaseUserData {
    password: string;
}

type CustomUserData = BaseUserData;

function createMutableUserData(user: User): MutableUserData {
    return {
        id: user.id,
        email: user.email!,
        firstname: user.user_metadata.firstname,
        lastname: user.user_metadata.lastname,
        phone: user.user_metadata.phone,
        country: user.user_metadata.country,
        birthdate: user.user_metadata.birthdate,
        biography: user.user_metadata.biography,
        position: user.user_metadata.position,
        organisation: user.user_metadata.organisation,
        profileImage: user.user_metadata.profileImage,
        role: user.user_metadata.role || 'user',
    };
}

function createCustomUserData(data: MutableUserData | CreateUserData): CustomUserData {
    return {
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
        phone: data.phone,
        country: data.country,
        birthdate: data.birthdate,
        biography: data.biography,
        position: data.position,
        organisation: data.organisation,
        profileImage: data.profileImage,
        role: data.role,
    };
}

interface UserTable {
    id: string | undefined;
    email: string;
    firstname: string;
    lastname: string;
    phone: string;
    country: string;
    birthdate: string;
    biography: string;
    position: string;
    organisation: string;
    profile_image: string;
    role: string | undefined;
    created_at: string;
    updated_at: string;
}

function createUserDataForDB(userId: string | undefined, userData: CreateUserData): UserTable {
    return {
        id: userId,
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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
}

export type {
    CustomUserData,
    MutableUserData,
    CreateUserData,
    UserTable
};

export {createCustomUserData, createMutableUserData, createUserDataForDB};