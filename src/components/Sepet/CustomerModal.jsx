import React, { useState, useEffect } from 'react';
import { X, Upload, Check, User } from 'lucide-react';
import axios from 'axios';

const CustomerModal = ({ isOpen, onClose, customer, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        tc_id: '',
        notes: ''
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (customer) {
            setFormData({
                name: customer.name || '',
                phone: customer.phone || '',
                tc_id: customer.tc_id || '',
                notes: customer.notes || ''
            });
            setPreview(customer.photo_path ? customer.photo_path : null);
        } else {
            setFormData({ name: '', phone: '', tc_id: '', notes: '' });
            setFile(null);
            setPreview(null);
        }
    }, [customer, isOpen]);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('phone', formData.phone);
            data.append('tc_id', formData.tc_id);
            data.append('notes', formData.notes);
            if (file) data.append('photo', file);
            if (customer?.id) data.append('id', customer.id);

            const res = await axios.post('/api/customers', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onSave(res.data);
            window.dispatchEvent(new CustomEvent('refreshCustomers'));
            onClose();
        } catch (err) {
            console.error('Save customer error', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
            <div className="card" style={{ width: '450px', padding: '0', overflow: 'hidden', position: 'relative' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{customer ? 'Müşteri Düzenle' : 'Yeni Müşteri Kaydı'}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                </div>

                <form onSubmit={handleSave} style={{ padding: '24px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                            Kimlik Fotoğrafı (Zorunlu Değil)
                        </label>
                        <div style={{
                            width: '100%', height: '160px', borderRadius: '12px', background: '#f5f5f7',
                            border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            position: 'relative', overflow: 'hidden', cursor: 'pointer'
                        }}>
                            {preview ? (
                                <img src={preview} alt="Kimlik Ön İzleme" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            ) : (
                                <div style={{ textAlign: 'center' }}>
                                    <Upload size={32} color="#ccc" style={{ marginBottom: '8px' }} />
                                    <div style={{ fontSize: '11px', color: '#999' }}>Fotoğraf Yüklemek İçin Tıklayın</div>
                                </div>
                            )}
                            <input
                                type="file"
                                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0, cursor: 'pointer' }}
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div>
                            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Ad Soyad</label>
                            <input className="input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required style={{ height: '38px' }} />
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Telefon</label>
                            <input className="input" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="05XX XXX XX XX" style={{ height: '38px' }} />
                        </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>TC Kimlik No</label>
                        <input className="input" value={formData.tc_id} onChange={e => setFormData({ ...formData, tc_id: e.target.value })} maxLength={11} style={{ height: '38px' }} />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Notlar</label>
                        <textarea className="input" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} style={{ height: '80px', paddingTop: '8px', resize: 'none' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="button" className="btn" onClick={onClose} style={{ flex: 1, border: '1px solid var(--border)' }}>İptal</button>
                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1, height: '42px' }}>
                            {loading ? 'Kaydediliyor...' : <><Check size={18} style={{ marginRight: '8px' }} /> Kaydet</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerModal;
