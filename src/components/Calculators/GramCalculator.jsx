import React, { useState } from 'react';
import { Copy, ShoppingCart } from 'lucide-react';

const GramCalculator = () => {
    const [fiyat, setFiyat] = useState('');
    const [miktar, setMiktar] = useState('');
    const [tl, setTl] = useState('');
    const [sonuc, setSonuc] = useState(null);
    const [rawSonuc, setRawSonuc] = useState(null); // { value, type }

    const hesapla = () => {
        const f = parseFloat(String(fiyat).replace(/\./g, '').replace(',', '.')) || 0;
        const m = parseFloat(String(miktar).replace(/\./g, '').replace(',', '.')) || 0;
        const t = parseFloat(String(tl).replace(/\./g, '').replace(',', '.')) || 0;

        if (t > 0 && f > 0) {
            const res = t / f;
            setRawSonuc({ value: res, type: 'gr', display: res.toLocaleString('tr-TR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) + ' gr' });
            setSonuc(res.toLocaleString('tr-TR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }) + ' gr');
        } else if (f > 0 && m > 0) {
            const res = f * m;
            setRawSonuc({ value: res, type: 'tl', display: res.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' TL' });
            setSonuc(res.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' TL');
        }
    };

    const addToCart = () => {
        if (!rawSonuc) return;

        // If the result is 'gr', we consider it a product with price 1 and quantity = grams? 
        // Or if it's 'TL', price = total and quantity = 1.
        // Usually, in this context, the user wants to add the money value or the weight as a line item.
        // Let's assume they want the monetary value added to the cart if type is 'tl'.
        // If type is 'gr', it's a bit ambiguous, but we'll use the 'rawSonuc.value' as quantity and 'fiyat' as price if available.

        const f = parseFloat(String(fiyat).replace(/\./g, '').replace(',', '.')) || 0;

        const detail = rawSonuc.type === 'tl'
            ? { name: `Gram Altın İşlemi (${miktar} gr)`, price: rawSonuc.value, quantity: 1 }
            : { name: `Gram Altın Alımı (TL: ${tl})`, price: 1, quantity: rawSonuc.value }; // Placeholder logic

        const event = new CustomEvent('addToCart', { detail });
        window.dispatchEvent(event);
    };

    const copy = () => {
        if (!sonuc) return;
        navigator.clipboard.writeText(sonuc.replace(/[^\d.,]/g, '').trim());
    };

    return (
        <div className="calc-card" style={{ margin: '6px 16px', padding: '12px', background: '#fff' }}>
            <h3 style={{ fontSize: '12px', fontWeight: '600', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: 'var(--bg)', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>3</span>
                Gram KDV'li İşlem
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div>
                    <label style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Gram Fiyatı</label>
                    <input className="input" type="text" value={fiyat} onChange={(e) => setFiyat(e.target.value)} placeholder="0,00" style={{ height: '34px', fontSize: '12px' }} />
                </div>
                <div>
                    <label style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Miktarı (gr)</label>
                    <input className="input" type="text" value={miktar} onChange={(e) => setMiktar(e.target.value)} placeholder="0,000" style={{ height: '34px', fontSize: '12px' }} />
                </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>TL Girin (Gram bulur)</label>
                    <input className="input" type="text" value={tl} onChange={(e) => setTl(e.target.value)} placeholder="0,00" style={{ height: '34px', fontSize: '12px' }} />
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
                        <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--blue)' }}>{sonuc}</span>
                        <button onClick={copy} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--blue)' }}>
                            <Copy size={14} />
                        </button>
                    </div>
                    {rawSonuc?.type === 'tl' && (
                        <button
                            className="btn btn-primary"
                            onClick={addToCart}
                            style={{ width: '100%', height: '32px', background: 'var(--green)', border: 'none', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        >
                            <ShoppingCart size={14} /> Sepete Ekle
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default GramCalculator;
