import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Trash2, ArrowLeft, Users, Search, Pencil, Phone, IdCard, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CustomerModal from '../components/Sepet/CustomerModal.jsx';

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/customers');
            setCustomers(res.data);
        } catch (err) {
            console.error('Fetch customers error', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleDelete = async (customer) => {
        if (!window.confirm(`${customer.name} isimli müşteriyi silmek istediğinize emin misiniz?`)) return;
        try {
            await axios.delete(`/api/customers/${customer.id}`);
            fetchCustomers();
        } catch (err) {
            alert('Müşteri silinemedi. Bu müşteriye ait işlemler olabilir.');
        }
    };

    const handleEdit = (customer) => {
        setSelectedCustomer(customer);
        setShowModal(true);
    };

    const filteredCustomers = customers.filter(c =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm) ||
        c.tc_id?.includes(searchTerm)
    );

    return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
            <button className="btn-ghost" onClick={() => navigate('/')} style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowLeft size={18} /> Paneli Geri Dön
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
                    <Users size={28} color="var(--blue)" /> Müşteri Yönetimi
                </h2>
                <button className="btn btn-primary" onClick={() => { setSelectedCustomer(null); setShowModal(true); }}>
                    <UserPlus size={18} /> Yeni Müşteri
                </button>
            </div>

            <div className="card" style={{ padding: '16px', marginBottom: '24px' }}>
                <div style={{ position: 'relative' }}>
                    <input
                        className="input"
                        placeholder="Müşteri Ara (Ad, Telefon, TC)..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '40px', height: '45px' }}
                    />
                    <Search size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-secondary)' }} />
                </div>
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8f8fa', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                            <th style={{ padding: '16px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>FOTO</th>
                            <th style={{ padding: '16px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>MÜŞTERİ BİLGİLERİ</th>
                            <th style={{ padding: '16px', fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>İLETİŞİM / TC</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>İŞLEM</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Yükleniyor...</td></tr>
                        ) : filteredCustomers.length === 0 ? (
                            <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Müşteri bulunamadı.</td></tr>
                        ) : (
                            filteredCustomers.map(c => (
                                <tr key={c.id} style={{ borderBottom: '1px solid #f5f5f7' }}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{
                                            width: '45px', height: '45px', borderRadius: '8px',
                                            background: '#f0f0f5', overflow: 'hidden', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {c.photo_path ? (
                                                <img src={c.photo_path} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <Users size={20} color="#ccc" />
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontWeight: '700', fontSize: '15px' }}>{c.name}</div>
                                        {c.notes && (
                                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                                <FileText size={12} /> {c.notes.substring(0, 30)}{c.notes.length > 30 ? '...' : ''}
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Phone size={14} color="var(--blue)" /> {c.phone || '-'}
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                            <IdCard size={14} /> {c.tc_id || '-'}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                            <button className="btn-ghost" onClick={() => handleEdit(c)} style={{ padding: '8px', color: 'var(--blue)' }} title="Düzenle">
                                                <Pencil size={18} />
                                            </button>
                                            <button className="btn-ghost" onClick={() => handleDelete(c)} style={{ padding: '8px', color: 'var(--red)' }} title="Sil">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <CustomerModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                customer={selectedCustomer}
                onSave={() => {
                    fetchCustomers();
                    setShowModal(false);
                }}
            />
        </div>
    );
};

export default CustomerManagement;
