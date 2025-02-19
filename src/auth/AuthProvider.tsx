import React, {ReactNode, useEffect, useState} from 'react';
import {createCustomUserData, CreateUserData, MutableUserData} from 'backend/models/user';
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
        const {data: authListener} = supabase.auth.onAuthStateChange((event, session) => {
            // Ignore PASSWORD_RECOVERY events so the user isn’t auto‑signed in
            if (event === 'PASSWORD_RECOVERY') {
                console.log("PASSWORD_RECOVERY event detected – not auto signing in.");
                return;
            }
            if (event === 'SIGNED_IN' && session?.user) {
                setState(prev => ({
                    ...prev,
                    isLoggedIn: true,
                    currentUser: session.user,
                    loading: false,
                    error: null,
                }));
            } else if (event === 'SIGNED_OUT') {
                setState(prev => ({
                    ...prev,
                    isLoggedIn: false,
                    currentUser: null,
                    loading: false,
                    error: null,
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
            const user = state.currentUser;
            console.log("**** 2", user)
            if (user === null) return null;

            console.log("**** 3", user.id)

            const {data, error} = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            console.log("error", error)
            if (error) throw error;

            return {
                id: data.id,
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
        } catch (error) {
            handleError(error);
            return null;
        }
    };

    const updateUser = async (userData: MutableUserData, userID: string): Promise<MutableUserData | null> => {
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

            return userData;
        } catch (error) {
            handleError(error);
            return null;
        }
    };

    const deleteUser = async (userID: string, password: string): Promise<boolean> => {
        try {
            setState(prev => ({...prev, loading: true, error: null}));
            if (!state.currentUser?.email) {
                throw new Error("No current user email found");
            }
            const supabase = createClient();
            const {data: {session}, error: signInError} = await supabase.auth.signInWithPassword({
                email: state.currentUser.email,
                password: password,
            });
            if (signInError) {
                // Throw a new error with a custom message:
                throw new Error("Incorrect password");
            }

            // Call your secure API route to delete the user.
            const response = await fetch('/api/user', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({userId: userID}),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to delete user. Please try again later.");
            }

            // Reset state after deletion.
            setState(prev => ({
                ...prev,
                isLoggedIn: false,
                currentUser: null,
                loading: false,
                error: null,
            }));
            return true;
        } catch (error: any) {
            // Call your error handler (e.g., log the error) and then re-throw.
            handleError(error);
            throw error;
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