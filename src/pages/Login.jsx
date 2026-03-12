import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/App.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) navigate('/');
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError('Geçersiz kullanıcı adı veya şifre');
        }
    };

    return (
        <div className="auth-container">
            <div className="card" style={{ width: '360px', padding: '32px' }}>
                <h2 style={{ marginBottom: '24px', textAlign: 'center', fontSize: '22px', fontWeight: '700' }}>
                    Topaloğlu Panel
                </h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                            Kullanıcı Adı
                        </label>
                        <input
                            className="input"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                            Şifre
                        </label>
                        <input
                            className="input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p style={{ color: 'var(--red)', marginBottom: '16px', fontSize: '12px', textAlign: 'center' }}>{error}</p>}
                    <button className="btn btn-primary" style={{ width: '100%', height: '42px' }} type="submit">
                        Giriş Yap
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
