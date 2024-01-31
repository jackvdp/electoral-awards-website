import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import jwtDecode from 'jwt-decode';
import UserData, { MutableUserData, CreateUser } from 'backend/models/user';

interface DecodedToken {
  exp: number;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface TokenResponse {
  token: string;
  refreshToken: string;
}

const tokenStorageKey = 'token'
const refreshTokenStorageKey = 'refresh_token'
const baseURL = 'https://icpsknowledgenetwork.com/api'

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoadingLogInInfo, setIsLoadingLogInInfo] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem(tokenStorageKey);
    const refreshToken = localStorage.getItem(refreshTokenStorageKey);

    let timeoutId: NodeJS.Timeout;

    if (token && refreshToken) {
      const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        refreshTokens();
      } else {
        setIsLoggedIn(true);
        timeoutId = setTimeout(() => {
          refreshTokens();
        }, (decoded.exp - currentTime - 60) * 1000);
      }
    }

    setIsLoadingLogInInfo(false);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

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

  const signout = () => {
    localStorage.removeItem(tokenStorageKey);
    localStorage.removeItem(refreshTokenStorageKey);
    setIsLoggedIn(false);
  };

  const createUser = async (userData: CreateUser): Promise<boolean> => {
    const response = await fetch(`${baseURL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      return false;
    }

    const tokenResponse: TokenResponse = await response.json();

    if (!tokenResponse.token || !tokenResponse.refreshToken) {
      console.log('Failed to fetch user data')
      return false
    }

    localStorage.setItem(tokenStorageKey, tokenResponse.token);
    localStorage.setItem(refreshTokenStorageKey, tokenResponse.refreshToken);

    setIsLoggedIn(true);
    return true
  }

  const getUser = async () => {
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

  const updateUser = async (userData: MutableUserData, userID: number) => {
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
      login,
      signout,
      getUser,
      updateUser,
      deleteUser,
      createUser
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
  isLoadingLogInInfo: boolean;
  login: (username: string, password: string) => Promise<void>;
  signout: () => void;
  createUser: (userData: CreateUser) => Promise<boolean>
  getUser: () => Promise<UserData | null>;
  updateUser: (userData: MutableUserData, userID: number) => Promise<UserData | null>
  deleteUser: (userData: MutableUserData, userID: number) => Promise<boolean>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);
