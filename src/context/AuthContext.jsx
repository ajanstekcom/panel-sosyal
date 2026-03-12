import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                localStorage.setItem('token', token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                try {
                    // Fetch latest user data to ensure role is up to date
                    const res = await axios.get('/auth/me');
                    setUser(res.data);
                    localStorage.setItem('user', JSON.stringify(res.data));
                } catch (e) {
                    console.error('User verify error', e);
                    setToken(null);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                delete axios.defaults.headers.common['Authorization'];
                setUser(null);
            }
            setLoading(false);
        };
        initAuth();
    }, [token]);

    const login = async (username, password) => {
        const res = await axios.post('/auth/login', { username, password });
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        return res.data;
    };

    const logout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
