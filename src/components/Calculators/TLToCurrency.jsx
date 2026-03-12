import React, { useState, useEffect } from 'react';
import { Copy, ShoppingCart } from 'lucide-react';
import { useLiveData } from '../../hooks/useLiveData.js';

const TLToCurrency = () => {
    const { data } = useLiveData();
    const [tl, setTl] = useState('');
    const [kur, setKur] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [kdvOran, setKdvOran] = useState('0.0007');
    const [sonuc, setSonuc] = useState(null);
    const [rawSonuc, setRawSonuc] = useState(0);

    const currencies = data?.doviz || [];

    const handleProductSelect = (e) => {
        const prodName = e.target.value;
        setSelectedProduct(prodName);
        const prod = currencies.find(p => p.urun === prodName);
        if (prod) {
            setKur(prod.satis);
        }
    };

    const hesapla = () => {
        // ... (rest of logic remains same)
        const t = parseFloat(String(tl).replace(/\./g, '').replace(',', '.')) || 0;
        const k = parseFloat(String(kur).replace(/\./g, '').replace(',', '.')) || 0;
        const o = parseFloat(kdvOran) || 0;
        if (!t || !k) return;

        const kdvAmount = t * o;
        const netTl = t - kdvAmount;
        const res = netTl / k;

        setRawSonuc(res);
        setSonuc(res.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    };

    const addToCart = () => {
        if (!rawSonuc) return;
        const event = new CustomEvent('addToCart', {
            detail: {
                name: `TL -> Döviz Alımı (Kur: ${kur})`,
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
                <span style={{ background: 'var(--bg)', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>4</span>
                TL → Döviz
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div>
                    <label style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Gönderilen TL</label>
                    <input className="input" type="text" value={tl} onChange={(e) => setTl(e.target.value)} placeholder="0,00" style={{ height: '34px', fontSize: '12px' }} />
                </div>
                <div>
                    <label style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>KDV Oranı</label>
                    <select className="input" value={kdvOran} onChange={(e) => setKdvOran(e.target.value)} style={{ height: '34px', fontSize: '11px', padding: '0 4px' }}>
                        <option value="0.0007">10.000'de 7</option>
                        <option value="0.001">Binde 1</option>
                    </select>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Döviz Seçin</label>
                    <select className="input" value={selectedProduct} onChange={handleProductSelect} style={{ height: '34px', fontSize: '12px' }}>
                        <option value="">Seçiniz...</option>
                        {currencies.map((c, i) => <option key={i} value={c.urun}>{c.urun} ({c.satis})</option>)}
                    </select>
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Kur Fiyatı (TL)</label>
                    <input className="input" type="text" value={kur} onChange={(e) => setKur(e.target.value)} placeholder="0,0000" style={{ height: '34px', fontSize: '12px' }} />
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

export default TLToCurrency;
