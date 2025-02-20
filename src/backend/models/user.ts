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

export {createCustomUserData};