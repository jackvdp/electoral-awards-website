import {User} from "@supabase/supabase-js";

interface BaseUserData {
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
    email: string;
    id: string;
}

interface CreateUserData extends BaseUserData {
    email: string;
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
        role: user.user_metadata.role,
    };
}

function createCustomUserData(data: MutableUserData | CreateUserData): CustomUserData {
    return {
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

export type {
    CustomUserData,
    MutableUserData,
    CreateUserData
};

export {createCustomUserData, createMutableUserData};