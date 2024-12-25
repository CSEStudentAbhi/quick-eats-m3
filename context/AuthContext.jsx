import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    const login = async (newToken, userData) => {
        try {
            await AsyncStorage.setItem('userToken', newToken);
            setToken(newToken);
            setUser(userData);
        } catch (error) {
            console.error('Error storing token:', error);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            setToken(null);
            setUser(null);
        } catch (error) {
            console.error('Error removing token:', error);
        }
    };

    const getToken = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('userToken');
            if (storedToken) {
                setToken(storedToken);
            }
            return storedToken;
        } catch (error) {
            console.error('Error getting token:', error);
            return null;
        }
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, getToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
} 