import React, {useState, useEffect, ReactNode} from 'react';
import {MutableUserData, CreateUserData, createCustomUserData} from 'backend/models/user';
import {createClient} from "../backend/supabase/component";
import {AuthContext, CustomAuthError} from './useAuth';
import {User} from '@supabase/supabase-js';

interface AuthState {
    isLoggedIn: boolean;
    currentUser: User | null;
    loading: boolean;
    error: CustomAuthError | null;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [state, setState] = useState<AuthState>({
        isLoggedIn: false,
        currentUser: null,
        loading: true,
        error: null
    });

    const supabase = createClient();

    useEffect(() => {
        checkUser();

        // Set up auth state listener
        const {data: authListener} = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN') {
                setState(prev => ({
                    ...prev,
                    isLoggedIn: true,
                    currentUser: session?.user || null,
                    loading: false,
                    error: null
                }));
            } else if (event === 'SIGNED_OUT') {
                setState(prev => ({
                    ...prev,
                    isLoggedIn: false,
                    currentUser: null,
                    loading: false,
                    error: null
                }));
            }
        });

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    const checkUser = async () => {
        try {
            const {data: {user}, error} = await supabase.auth.getUser();

            if (error) {
                throw error;
            }

            setState(prev => ({
                ...prev,
                isLoggedIn: !!user,
                currentUser: user,
                loading: false,
                error: null
            }));
        } catch (error) {
            handleError(error);
        }
    };

    const handleError = (error: any) => {
        const authError: CustomAuthError = {
            message: error.message || 'An unexpected error occurred',
            code: error.code,
            details: error.details
        };

        setState(prev => ({
            ...prev,
            error: authError,
            loading: false
        }));
    };

    const login = async (email: string, password: string): Promise<void> => {
        try {
            setState(prev => ({...prev, loading: true, error: null}));

            const {data, error} = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            setState(prev => ({
                ...prev,
                isLoggedIn: true,
                currentUser: data.user,
                loading: false,
                error: null
            }));
        } catch (error) {
            handleError(error);
            throw error;
        }
    };

    const createUser = async (userData: CreateUserData): Promise<boolean> => {
        try {
            setState(prev => ({...prev, loading: true, error: null}));

            // Sign up with auth
            const {data, error} = await supabase.auth.signUp({
                email: userData.email,
                password: userData.password,
                options: {
                    data: createCustomUserData(userData)  // Store base data in metadata
                }
            });

            if (error) throw error;

            // Create queryable user profile
            const {error: profileError} = await supabase
                .from('users')
                .insert([
                    {
                        id: data.user?.id,
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
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }
                ]);

            if (profileError) throw profileError;

            setState(prev => ({
                ...prev,
                loading: false,
                error: null
            }));

            return true;
        } catch (error) {
            handleError(error);
            return false;
        }
    };

    const getUser = async (): Promise<MutableUserData | null> => {
        try {
            setState(prev => ({...prev, loading: true, error: null}));

            const {data: {user}, error: authError} = await supabase.auth.getUser();

            if (authError) throw authError;
            if (!user) return null;

            const {data, error} = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) throw error;

            const userData: MutableUserData = {
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                phone: data.phone,
                country: data.country,
                birthdate: data.birthdate,
                biography: data.biography,
                position: data.position,
                organisation: data.organisation,
                profileImage: data.profile_image  // Note the case conversion
            };

            setState(prev => ({
                ...prev,
                loading: false,
                error: null
            }));

            return userData;
        } catch (error) {
            handleError(error);
            return null;
        }
    };

    const updateUser = async (userData: MutableUserData, userID: string): Promise<boolean> => {
        try {
            setState(prev => ({...prev, loading: true, error: null}));

            // Update auth metadata
            const {error: authUpdateError} = await supabase.auth.updateUser({
                data: createCustomUserData(userData)
            });

            if (authUpdateError) throw authUpdateError;

            // Update user profile in users table
            const {error: profileUpdateError} = await supabase
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
                    updated_at: new Date().toISOString()
                })
                .eq('id', userID);

            if (profileUpdateError) throw profileUpdateError;

            setState(prev => ({
                ...prev,
                loading: false,
                error: null
            }));

            return true;
        } catch (error) {
            handleError(error);
            return false;
        }
    };

    const deleteUser = async (userID: string): Promise<boolean> => {
        try {
            setState(prev => ({...prev, loading: true, error: null}));

            // Delete user profile from users table first
            const {error: profileDeleteError} = await supabase
                .from('users')
                .delete()
                .eq('id', userID);

            if (profileDeleteError) throw profileDeleteError;

            // Delete auth user
            const {error: authDeleteError} = await supabase.auth.admin.deleteUser(userID);

            if (authDeleteError) throw authDeleteError;

            setState(prev => ({
                ...prev,
                isLoggedIn: false,
                currentUser: null,
                loading: false,
                error: null
            }));

            return true;
        } catch (error) {
            handleError(error);
            return false;
        }
    };

    const signout = async (): Promise<void> => {
        try {
            setState(prev => ({...prev, loading: true, error: null}));

            const {error} = await supabase.auth.signOut();

            if (error) throw error;

            setState(prev => ({
                ...prev,
                isLoggedIn: false,
                currentUser: null,
                loading: false,
                error: null
            }));
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <AuthContext.Provider value={{
            isLoggedIn: state.isLoggedIn,
            currentUser: state.currentUser,
            loading: state.loading,
            error: state.error,
            login,
            signout,
            createUser,
            getUser,
            updateUser,
            deleteUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};