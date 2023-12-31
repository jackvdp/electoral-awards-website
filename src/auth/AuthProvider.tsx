import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import jwtDecode from 'jwt-decode';
import UserData, { MutableUserData } from 'backend/models/user';

interface DecodedToken {
  exp: number;
}

interface AuthProviderProps {
  children: ReactNode;
}

const tokenStorageKey = 'token'
const refreshTokenStorageKey = 'refresh_token'
const baseURL = 'https://icpsknowledgenetwork.com/api'

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoadingLogInInfo, setIsLoadingLogInInfo] = useState<boolean>(true);

  useEffect(() => {
    attemptLoginFromStorage();
  }, []);


  // MARK: - *** PRIVATE METHODS ***

  const attemptLoginFromStorage = () => {
    const token = localStorage.getItem(tokenStorageKey);
    const refreshToken = localStorage.getItem(refreshTokenStorageKey);

    if (token && refreshToken) {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        refreshTokens();
      } else {
        setIsLoggedIn(true);
        const timeoutId = setTimeout(() => {
          refreshTokens();
        }, (decoded.exp - currentTime - 60) * 1000);
        return () => clearTimeout(timeoutId);  // Clear the timer when the component unmounts
      }
    }
    setIsLoadingLogInInfo(false)
  }

  const refreshTokens = async () => {
    // Implement the logic to refresh the token using the refresh token
    // Update localStorage with the new token and refresh token
    // Update the isLoggedIn state if necessary
  };

  const accessToken = (): string | null => {
    const token = localStorage.getItem(tokenStorageKey);
    if (!token) {
      setIsLoggedIn(false)
      return null;
    }

    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      setIsLoggedIn(false)
      return null;
    }

    return token;
  }

  // MARK: - *** PUBLIC  METHODS ***

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${baseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token, refresh_token } = data;

        localStorage.setItem(tokenStorageKey, token);
        localStorage.setItem(refreshTokenStorageKey, refresh_token);

        setIsLoggedIn(true);
      } else {
        signout();
        throw new Error('Login failed');
      }
    } catch (error) {
      console.log(error)
      signout();
      throw error;
    }
  };

  const signup = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string,
    organisation: string,
    role: string
  ) => {
    try {
      const response = await fetch(`${baseURL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname: firstName,
          lastname: lastName,
          email: email,
          password: password,
          phone: phone,
          organisation: organisation,
          position: role,
          // Fields not provided are left blank
          country: "",
          birthdate: "",
          profileName: "",
          profileTitle: "",
          isNewsletterSubscribe: true,
          isProfileRestricted: true,
          interests: ["electoral"],
          skills: [],
          biography: "",
          profileImage: ""
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token, refreshToken } = data;

        localStorage.setItem(tokenStorageKey, token);
        localStorage.setItem(refreshTokenStorageKey, refreshToken);

        setIsLoggedIn(true);
      } else {
        signout()
      }
    } catch (error) {
      signout()
    }
  };

  const signout = () => {
    localStorage.removeItem(tokenStorageKey);
    localStorage.removeItem(refreshTokenStorageKey);
    setIsLoggedIn(false);
  };

  const fetchUserData = async () => {
    const token = accessToken();
    if (!token) {
      return null;
    }

    try {
      const response = await fetch(`${baseURL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData: UserData = await response.json();
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  const updateUserData = async (userData: MutableUserData, userID: number) => {
    const token = accessToken();
    if (!token) {
      return null;
    }

    try {
      const response = await fetch(`${baseURL}/users/users/${userID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const newUserData: UserData = await response.json();
      return newUserData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  const deleteUser = async (userData: MutableUserData, userID: number) => {
    const token = accessToken();
    if (!token) {
      return false;
    }

    try {
      console.log("****", userID)
      const response = await fetch(`${baseURL}/users/request-account-deletion?id=${userID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      signout();
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      isLoadingLogInInfo,
      setIsLoggedIn,
      login,
      signup,
      signout,
      fetchUserData,
      updateUserData,
      deleteUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

/****************************************
 * MARK: Custom Hook to use the auth context
 ****************************************/

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthContextProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  isLoadingLogInInfo: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string, phone: string, organisation: string, role: string) => Promise<void>;
  signout: () => void;
  fetchUserData: () => Promise<UserData | null>;
  updateUserData: (userData: MutableUserData, userID: number) => Promise<UserData | null>
  deleteUser: (userData: MutableUserData, userID: number) => Promise<boolean>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);
