import React, {ReactNode, useEffect, useState} from 'react';
import {createCustomUserData, CreateUserData, createUserDataForDB, MutableUserData} from 'backend/models/user';
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

    const logInWithMagicLink = async (email: string): Promise<void> => {
        try {
            setState(prev => ({...prev, loading: true, error: null}));

            const {data, error} = await supabase.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: false,
                    emailRedirectTo: process.env.NEXT_PUBLIC_BASE_URL,
                },
            });

            if (error) {
                console.log("error", error)
                throw error
            }

            setState(prev => ({
                ...prev,
                loading: false,
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
                    createUserDataForDB(data.user?.id, userData)
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

    const createUserWithoutSignup = async (userData: CreateUserData): Promise<boolean> => {
        try {
            setState(prev => ({...prev, loading: true, error: null}));

            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create user');
            }

            const data = await response.json();

            setState(prev => ({
                ...prev,
                loading: false,
                error: null
            }));

            return true;
        } catch (error) {
            setState(prev => ({...prev, loading: false}));
            handleError(error);
            return false;
        }
    };

    const getUser = async (): Promise<MutableUserData | null> => {
        try {
            const user = state.currentUser;
            if (user === null) return null;

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
                profileImage: data.profile_image,
                role: data.role,
            };
        } catch (error) {
            handleError(error);
            return null;
        }
    };

    const updateUser = async (userData: MutableUserData, userID: string): Promise<MutableUserData | null> => {
        try {
            setState(prev => ({...prev, loading: true, error: null}));

            // Call the API endpoint instead of direct Supabase calls
            const response = await fetch(`/api/users/${userID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update user');
            }

            const result = await response.json();

            setState(prev => ({
                ...prev,
                loading: false,
                error: null
            }));

            return result.user;
        } catch (error) {
            handleError(error);
            return null;
        }
    };

    // Shared method to handle user deletion core functionality
    const deleteUserCore = async (userID: string): Promise<boolean> => {
        try {
            // Call your secure API route to delete the user
            const response = await fetch(`/api/users/${userID}`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to delete user. Please try again later.");
            }

            // Reset state after deletion
            setState(prev => ({
                ...prev,
                isLoggedIn: false,
                currentUser: null,
                loading: false,
                error: null,
            }));
            return true;
        } catch (error: any) {
            handleError(error);
            throw error;
        }
    };

    const deleteUser = async (userID: string, password: string): Promise<boolean> => {
        try {
            setState(prev => ({...prev, loading: true, error: null}));
            if (!state.currentUser?.email) {
                throw new Error("No current user email found");
            }

            // Verify user password
            const supabase = createClient();
            const {error: signInError} = await supabase.auth.signInWithPassword({
                email: state.currentUser.email,
                password: password,
            });

            if (signInError) {
                throw new Error("Incorrect password");
            }

            // Proceed with deletion
            return await deleteUserCore(userID);
        } catch (error: any) {
            // Set loading to false in case of error
            setState(prev => ({...prev, loading: false}));
            handleError(error);
            throw error;
        }
    };

// Method for admin use that doesn't require password
    const deleteUserWithoutPassword = async (userID: string): Promise<boolean> => {
        try {
            setState(prev => ({...prev, loading: true, error: null}));
            if (!state.currentUser?.email) {
                throw new Error("No current user email found");
            }

            return await deleteUserCore(userID);
        } catch (error: any) {
            setState(prev => ({...prev, loading: false}));
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
            logInWithMagicLink,
            signout,
            createUser,
            createUserWithoutSignup,
            getUser,
            updateUser,
            deleteUser,
            deleteUserWithoutPassword
        }}>
            {children}
        </AuthContext.Provider>
    );
};