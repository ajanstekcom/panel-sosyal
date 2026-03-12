import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Search, Trash2, Pencil } from 'lucide-react';

const CustomerSelector = ({ selectedCustomer, onSelect, onEdit, onAdd }) => {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchCustomers = async () => {
        try {
            const res = await axios.get('/api/customers');
            setCustomers(res.data);
        } catch (err) {
            console.error('Customer fetch error', err);
        }
    };

    useEffect(() => {
        fetchCustomers();

        // Listen for external refresh requests if any
        const handleRefresh = () => fetchCustomers();
        window.addEventListener('refreshCustomers', handleRefresh);
        return () => window.removeEventListener('refreshCustomers', handleRefresh);
    }, []);

    const handleDelete = async () => {
        if (!selectedCustomer) return;
        if (!window.confirm(`${selectedCustomer.name} isimli müşteriyi silmek istediğinize emin misiniz?`)) return;

        try {
            await axios.delete(`/api/customers/${selectedCustomer.id}`);
            onSelect(null);
            fetchCustomers();
        } catch (err) {
            alert('Müşteri silinemedi. Bu müşteriye ait işlemler olabilir.');
        }
    };

    return (
        <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                Müşteri Seçimi
            </label>

            <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <select
                        className="input"
                        style={{ paddingLeft: '32px', height: '38px', fontSize: '13px' }}
                        value={selectedCustomer?.id || ''}
                        onChange={(e) => onSelect(customers.find(c => c.id === parseInt(e.target.value)))}
                    >
                        <option value="">Kayıtlı Müşteri Seç...</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <Search size={14} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-secondary)' }} />
                </div>
                {selectedCustomer && (
                    <>
                        <button className="btn-ghost" onClick={onEdit} style={{ border: '1px solid var(--border)', height: '38px', padding: '0 8px' }} title="Müşteriyi Düzenle">
                            <Pencil size={18} color="var(--blue)" />
                        </button>
                        <button className="btn-ghost" onClick={handleDelete} style={{ border: '1px solid var(--border)', height: '38px', padding: '0 8px' }} title="Müşteriyi Sil">
                            <Trash2 size={18} color="var(--red)" />
                        </button>
                    </>
                )}
                <button className="btn btn-ghost" onClick={onAdd} style={{ border: '1px solid var(--border)', height: '38px' }} title="Yeni Müşteri">
                    <UserPlus size={18} color="var(--blue)" />
                </button>
            </div>
        </div>
    );
};

export default CustomerSelector;
