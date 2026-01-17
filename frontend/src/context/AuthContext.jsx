import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import authAPI from '../api/authAPI';
import { Loader } from 'lucide-react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const checkUser = async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const response = await authAPI.getMe();
                if (response?.data?.data) {
                    setUser(response.data.data);
                    setIsAuthenticated(true);
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                    localStorage.removeItem('accessToken');
                }
            } catch (error) {
                // Only clear token if it's explicitly an auth error
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    localStorage.removeItem('accessToken');
                    setUser(null);
                    setIsAuthenticated(false);
                }
                // Otherwise keep the token and let them stay logged in (might be a network error)
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Handle logout broadcast from other tabs
        const handleStorageChange = (e) => {
            if (e.key === 'accessToken' && !e.newValue) {
                setUser(null);
                setIsAuthenticated(false);
                navigate('/login');
            }
        };

        checkUser();
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [navigate]);

    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials);
            const { accessToken } = response.data.data;
            localStorage.setItem('accessToken', accessToken);
            const userRes = await authAPI.getMe();
            setUser(userRes.data.data);
            setIsAuthenticated(true);
            return userRes.data.data;
        } catch {
            setUser(null);
            setIsAuthenticated(false);
            throw new Error('Login failed');
        }
    };

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);
            const { accessToken } = response.data.data;
            localStorage.setItem('accessToken', accessToken);
            const userRes = await authAPI.getMe();
            setUser(userRes.data.data);
            setIsAuthenticated(true);
            return userRes.data.data;
        } catch {
            setUser(null);
            setIsAuthenticated(false);
            throw new Error('Registration failed');
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch {
            // Error handled silently as it's a cleanup step
        } finally {
            localStorage.removeItem('accessToken');
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated, login, register, logout, checkUser }}>
            {!loading ? children : (
                <div className="h-screen w-full flex items-center justify-center bg-white">
                    <Loader className="w-10 h-10 animate-spin text-primary" />
                </div>
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
