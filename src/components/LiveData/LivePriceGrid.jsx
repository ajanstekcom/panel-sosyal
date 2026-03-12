import React from 'react';
import { useLiveData } from '../../hooks/useLiveData.js';
import { ArrowUp, ArrowDown } from 'lucide-react';

const PriceTable = ({ title, items, isDarphane }) => (
    <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: '16px' }}>
        <div style={{
            padding: '12px 16px', background: '#f8f8f9', borderBottom: '1px solid var(--border)',
            fontWeight: '700', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px'
        }}>
            {title}
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', background: '#fafafa' }}>
                    <th style={{ padding: '10px 16px', fontWeight: '500', color: 'var(--text-secondary)', fontSize: '11px' }}>Ürün</th>
                    {isDarphane ? (
                        <>
                            <th style={{ padding: '10px 16px', fontWeight: '500', color: 'var(--text-secondary)', fontSize: '11px' }}>Y. Alış/Satış</th>
                            <th style={{ padding: '10px 16px', fontWeight: '500', color: 'var(--text-secondary)', fontSize: '11px' }}>E. Alış/Satış</th>
                        </>
                    ) : (
                        <>
                            <th style={{ padding: '10px 16px', fontWeight: '500', color: 'var(--text-secondary)', fontSize: '11px' }}>Alış</th>
                            <th style={{ padding: '10px 16px', fontWeight: '500', color: 'var(--text-secondary)', fontSize: '11px' }}>Satış</th>
                        </>
                    )}
                </tr>
            </thead>
            <tbody>
                {items?.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f9f9f9' }}>
                        <td style={{ padding: '12px 16px', fontWeight: '600' }}>{item.urun}</td>
                        {isDarphane ? (
                            <>
                                <td style={{ padding: '12px 16px' }}>{item.yeni_alis} / {item.yeni_satis}</td>
                                <td style={{ padding: '12px 16px' }}>{item.eski_alis} / {item.eski_satis}</td>
                            </>
                        ) : (
                            <>
                                <td style={{ padding: '12px 16px' }}>{item.alis}</td>
                                <td style={{
                                    padding: '12px 16px',
                                    color: item.satis_trend === 'up' ? 'var(--green)' : item.satis_trend === 'down' ? 'var(--red)' : 'inherit',
                                    fontWeight: '600'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        {item.satis}
                                        {item.satis_trend === 'up' && <ArrowUp size={12} />}
                                        {item.satis_trend === 'down' && <ArrowDown size={12} />}
                                    </div>
                                </td>
                            </>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const LivePriceGrid = () => {
    const { data, loading, error } = useLiveData();

    if (loading) return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)', fontSize: '14px' }}>Veriler güncelleniyor...</div>;
    if (error) return <div style={{ color: 'var(--red)', padding: '20px', textAlign: 'center' }}>API Hatası: Veriler alınamadı.</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '800px', margin: '0 auto' }}>
            {data.altin && <PriceTable title="Altın" items={data.altin} />}
            {data.sarrafiye && <PriceTable title="Sarrafiye" items={data.sarrafiye} />}
            {data.doviz && <PriceTable title="Döviz" items={data.doviz} />}
            {data.capraz && <PriceTable title="Çapraz" items={data.capraz} />}
            {data.darphane && <PriceTable title="Darphane" items={data.darphane} isDarphane />}
        </div>
    );
};

export default LivePriceGrid;
