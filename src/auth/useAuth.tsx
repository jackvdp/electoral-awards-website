import {createContext, useContext} from "react";
import {CreateUserData, MutableUserData} from "../backend/models/user";
import {User} from "@supabase/supabase-js";

export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthContextProps {
    isLoggedIn: boolean;
    currentUser: User | null;
    loading: boolean;
    error: CustomAuthError | null;
    login: (username: string, password: string) => Promise<void>;
    signout: () => void;
    createUser: (userData: CreateUserData) => Promise<boolean>
    getUser: () => Promise<MutableUserData | null>;
    updateUser: (userData: MutableUserData, userID: string) => Promise<MutableUserData | null>
    deleteUser: (userID: string) => Promise<boolean>
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export interface CustomAuthError {
    message: string;
    code?: string;
    details?: string;
}