import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Trash2, ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [editingPasswordId, setEditingPasswordId] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/users');
            setUsers(res.data);
        } catch (err) {
            console.error('Fetch users error', err);
            navigate('/');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/auth/register', { username, password });
            setUsername('');
            setPassword('');
            fetchUsers();
        } catch (err) {
            alert('Kullanıcı oluşturulamadı. Şifre en az 3 karakter olmalı.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Kullanıcıyı silmek istediğinize emin misiniz?')) return;
        try {
            await axios.delete(`/api/users/${id}`);
            fetchUsers();
        } catch (err) {
            console.error('Delete user error', err);
        }
    };

    const handleUpdatePassword = async (id) => {
        if (!newPassword) return;
        setLoading(true);
        try {
            await axios.put(`/api/users/${id}/password`, { password: newPassword });
            setEditingPasswordId(null);
            setNewPassword('');
            alert('Şifre başarıyla güncellendi.');
        } catch (err) {
            alert('Şifre güncellenemedi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
            <button className="btn-ghost" onClick={() => navigate('/')} style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowLeft size={18} /> Paneli Geri Dön
            </button>

            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Shield size={28} color="var(--blue)" /> Kullanıcı Yönetimi
            </h2>

            <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Yeni Kullanıcı Ekle</h3>
                <form onSubmit={handleAddUser} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: '12px' }}>
                    <input className="input" placeholder="Kullanıcı Adı" value={username} onChange={e => setUsername(e.target.value)} required />
                    <input className="input" type="password" placeholder="Şifre" value={password} onChange={e => setPassword(e.target.value)} required />
                    <button className="btn btn-primary" type="submit" disabled={loading}>
                        <UserPlus size={18} /> Ekle
                    </button>
                </form>
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8f8fa', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                            <th style={{ padding: '16px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>KULLANICI</th>
                            <th style={{ padding: '16px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>YETKİ</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>İŞLEM</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #f5f5f7' }}>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ fontWeight: '600' }}>{u.username}</div>
                                    {editingPasswordId === u.id ? (
                                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                            <input
                                                className="input"
                                                type="password"
                                                placeholder="Yeni Şifre"
                                                value={newPassword}
                                                onChange={e => setNewPassword(e.target.value)}
                                                style={{ height: '30px', fontSize: '12px' }}
                                            />
                                            <button className="btn btn-primary" style={{ padding: '0 8px', height: '30px', fontSize: '11px' }} onClick={() => handleUpdatePassword(u.id)}>Kaydet</button>
                                            <button className="btn" style={{ padding: '0 8px', height: '30px', fontSize: '11px' }} onClick={() => setEditingPasswordId(null)}>İptal</button>
                                        </div>
                                    ) : (
                                        <button
                                            className="btn-link"
                                            style={{ fontSize: '11px', color: 'var(--blue)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', marginTop: '4px' }}
                                            onClick={() => setEditingPasswordId(u.id)}
                                        >
                                            Şifreyi Değiştir
                                        </button>
                                    )}
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{
                                        padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '700',
                                        background: u.role === 'admin' ? '#fdf2f8' : '#eff6ff',
                                        color: u.role === 'admin' ? '#be185d' : '#1d4ed8'
                                    }}>
                                        {u.role.toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ padding: '16px', textAlign: 'right' }}>
                                    {u.role !== 'admin' && (
                                        <button className="btn-ghost" onClick={() => handleDelete(u.id)} style={{ padding: '8px', color: 'var(--red)' }}>
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
