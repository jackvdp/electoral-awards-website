interface UserData {
    id: number;
    firstname: string;
    lastname: string;
    password?: string;
    email: string;
    phone: string;
    country: string;
    birthdate: string;
    profileName: string;
    profileTitle: string;
    isNewsletterSubscribe: boolean;
    isVerified: boolean;
    isBlocked: boolean;
    isProfileRestricted: boolean;
    isOnline: boolean;
    isMVP: boolean;
    interests: string[];
    skills: string[];
    biography: string;
    position: string;
    organisation: string;
    profileImage: string;
    topics: string[];
    lastOnlineAt: string;
    isRegistrationComplete: boolean;
}

interface MutableUserData {
    firstname: string;
    lastname: string;
    phone: string;
    country: string;
    birthdate: string;
    profileName: string;
    profileTitle: string;
    isNewsletterSubscribe: boolean;
    isProfileRestricted: boolean;
    interests: string[];
    skills: string[];
    biography: string;
    position: string;
    organisation: string;
    profileImage: string;
    topics: string[];
}

interface CreateUser {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phone: string;
    country: string;
    birthdate: string;
    profileName: string;
    profileTitle: string;
    isNewsletterSubscribe: boolean;
    isProfileRestricted: boolean;
    interests: string[];
    skills: string[];
    biography: string;
    position: string;
    organisation: string;
    profileImage: string;
    topics: string[];
}

export default UserData
export type { MutableUserData, CreateUser }