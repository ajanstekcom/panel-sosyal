import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Receipt, ChevronDown, ChevronUp } from 'lucide-react';

const HistoryItem = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    const date = new Date(item.created_at).toLocaleString('tr-TR');

    return (
        <div style={{ borderBottom: '1px solid var(--border)', padding: '12px 0' }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            >
                <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text)' }}>
                        <Receipt size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                        {parseInt(item.total_amount).toLocaleString('tr-TR')} TL
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        <Calendar size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        {date}
                    </div>
                </div>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>

            {isOpen && (
                <div style={{ marginTop: '10px', padding: '10px', background: '#f8f9fa', borderRadius: '8px', fontSize: '12px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                            {item.data?.map((prod, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '6px 0' }}>{prod.name}</td>
                                    <td style={{ padding: '6px 0', textAlign: 'right', fontWeight: '600' }}>{prod.quantity} x {prod.price.toLocaleString('tr-TR')} TL</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const HistoryView = ({ customerId }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!customerId) return;
            setLoading(true);
            try {
                const res = await axios.get(`/api/customers/${customerId}/calculations`);
                setHistory(res.data);
            } catch (err) {
                console.error('History fetch error', err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();

        const handleRefresh = () => fetchHistory();
        window.addEventListener('refreshHistory', handleRefresh);
        return () => window.removeEventListener('refreshHistory', handleRefresh);
    }, [customerId]);

    if (loading) return <div style={{ textAlign: 'center', padding: '20px', fontSize: '12px', color: 'var(--text-secondary)' }}>Yükleniyor...</div>;
    if (history.length === 0) return <div style={{ textAlign: 'center', padding: '20px', fontSize: '12px', color: 'var(--text-secondary)' }}>Geçmiş işlem bulunamadı.</div>;

    return (
        <div style={{ marginTop: '16px' }}>
            <h4 style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '10px' }}>
                GEÇMİŞ İŞLEMLER
            </h4>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {history.map(item => <HistoryItem key={item.id} item={item} />)}
            </div>
        </div>
    );
};

export default HistoryView;
