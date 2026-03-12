import React, { useState } from 'react';
import { Copy, ShoppingCart } from 'lucide-react';

const ECommerceExchange = () => {
    const [kur, setKur] = useState('');
    const [kar, setKar] = useState('0');
    const [sonuc, setSonuc] = useState(null);
    const [rawSonuc, setRawSonuc] = useState(0);

    const hesapla = () => {
        const k = parseFloat(String(kur).replace(/\./g, '').replace(',', '.')) || 0;
        const p = parseFloat(String(kar).replace(',', '.')) || 0;
        if (!k) return;

        const res = k * (1 + p / 100);
        setRawSonuc(res);
        setSonuc(res.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    };

    const addToCart = () => {
        if (!rawSonuc) return;
        const event = new CustomEvent('addToCart', {
            detail: {
                name: `E-Ticaret Kur İşlemi (${kar}%)`,
                price: rawSonuc,
                quantity: 1
            }
        });
        window.dispatchEvent(event);
    };

    const copy = () => {
        if (!sonuc) return;
        navigator.clipboard.writeText(sonuc.replace(/[^\d.,]/g, '').trim());
    };

    return (
        <div className="calc-card" style={{ margin: '6px 16px', padding: '12px', background: '#fff' }}>
            <h3 style={{ fontSize: '12px', fontWeight: '600', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: 'var(--bg)', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>6</span>
                E-Ticaret Kur
            </h3>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Merkez Kur</label>
                    <input className="input" type="text" value={kur} onChange={(e) => setKur(e.target.value)} placeholder="0,0000" style={{ height: '34px', fontSize: '12px' }} />
                </div>
                <div style={{ width: '60px' }}>
                    <label style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Kar %</label>
                    <input className="input" type="text" value={kar} onChange={(e) => setKar(e.target.value)} placeholder="0" style={{ height: '34px', fontSize: '12px' }} />
                </div>
                <button className="btn btn-primary" onClick={hesapla} style={{ height: '34px', padding: '0 12px', fontSize: '11px' }}>Hesapla</button>
            </div>
            {sonuc && (
                <div style={{ marginTop: '10px' }}>
                    <div style={{
                        padding: '8px 12px', background: '#f0f9ff', borderRadius: '8px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #bae6fd',
                        marginBottom: '8px'
                    }}>
                        <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--blue)' }}>{sonuc} TL</span>
                        <button onClick={copy} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--blue)' }}>
                            <Copy size={14} />
                        </button>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={addToCart}
                        style={{ width: '100%', height: '32px', background: 'var(--green)', border: 'none', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                        <ShoppingCart size={14} /> Sepete Ekle
                    </button>
                </div>
            )}
        </div>
    );
};

export default ECommerceExchange;
