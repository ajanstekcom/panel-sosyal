import React, { useState, useEffect } from 'react';
import { Copy, ShoppingCart } from 'lucide-react';
import { useLiveData } from '../../hooks/useLiveData.js';

const AYAR_MILYEM = {
    '8': 333,
    '14': 585,
    '18': 750,
    '21': 875,
    '22': 916,
    '24': 995,
};

const MilyemCalculator = () => {
    const { data } = useLiveData();
    const [selectedAyar, setSelectedAyar] = useState(null);
    const [milyem, setMilyem] = useState('');
    const [gram, setGram] = useState('');
    const [hasFiyat, setHasFiyat] = useState('');
    const [iscilik, setIscilik] = useState('');
    const [igKar, setIgKar] = useState('');
    const [sonuc, setSonuc] = useState(null);

    const handleAyarSelect = (ayar) => {
        setSelectedAyar(ayar);
        setMilyem(AYAR_MILYEM[ayar]);
        if (data?.altin) {
            const has = data.altin.find(a => a.urun === 'HAS ALTIN');
            if (has) setHasFiyat(has.satis);
        }
    };

    const parseVal = (v) => parseFloat(String(v).replace(/\./g, '').replace(',', '.')) || 0;

    const hesapla = () => {
        const m = parseVal(milyem);
        const g = parseVal(gram);
        const hf = parseVal(hasFiyat);
        const isc = parseVal(iscilik);

        if (!m || !g || !hf) return;

        const hasGram = g * (m / 1000);
        const hasTutar = hasGram * hf;
        const iscilikTutar = isc * g;
        const toplam = hasTutar + iscilikTutar;

        setSonuc({
            name: `${selectedAyar ? selectedAyar + ' Ayar' : 'Özel Milyem'} Ürün`,
            hasGram: hasGram.toLocaleString('tr-TR', { minimumFractionDigits: 3, maximumFractionDigits: 3 }),
            toplam: toplam,
            formattedToplam: toplam.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        });
    };

    const addToCart = () => {
        if (!sonuc) return;
        const event = new CustomEvent('addToCart', {
            detail: {
                name: sonuc.name,
                price: sonuc.toplam,
                quantity: 1
            }
        });
        window.dispatchEvent(event);
    };

    const igKarVal = parseVal(igKar);
    const finalPrice = sonuc ? sonuc.toplam + igKarVal : null;

    return (
        <div className="card" style={{ padding: '20px', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px', color: 'var(--text)', letterSpacing: '-0.3px' }}>MİLYEM HESAPLAMA</h3>

            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
                {Object.keys(AYAR_MILYEM).map(ayar => (
                    <button
                        key={ayar}
                        onClick={() => handleAyarSelect(ayar)}
                        className="btn"
                        style={{
                            padding: '6px 12px',
                            fontSize: '11px',
                            background: selectedAyar === ayar ? 'var(--accent)' : 'var(--bg)',
                            color: selectedAyar === ayar ? '#fff' : 'var(--text)',
                            borderRadius: '100px',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {ayar} Ayar ({AYAR_MILYEM[ayar]}‰)
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Milyem</label>
                    <input className="input" type="text" value={milyem} onChange={(e) => setMilyem(e.target.value)} placeholder="000" style={{ height: '38px' }} />
                </div>
                <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Ürün Gramı (gr)</label>
                    <input className="input" type="text" value={gram} onChange={(e) => setGram(e.target.value)} placeholder="0,000" style={{ height: '38px' }} />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Has Fiyatı (TL/gr)</label>
                    <input className="input" type="text" value={hasFiyat} onChange={(e) => setHasFiyat(e.target.value)} placeholder="0,00" style={{ height: '38px' }} />
                </div>
                <div>
                    <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>İşçilik (TL/gr)</label>
                    <input className="input" type="text" value={iscilik} onChange={(e) => setIscilik(e.target.value)} placeholder="0,00" style={{ height: '38px' }} />
                </div>
            </div>

            <button className="btn btn-primary" onClick={hesapla} style={{ width: '100%', height: '40px', marginBottom: '16px' }}>Hesapla</button>

            {sonuc && (
                <div style={{ background: '#f8f9fa', borderRadius: '10px', padding: '16px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Has Gram:</span>
                        <span style={{ fontWeight: '700', color: 'var(--accent)' }}>{sonuc.hasGram} gr</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderTop: '1px solid #eee', paddingTop: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>Toplam Tutar:</span>
                        <span style={{ fontWeight: '800', fontSize: '18px', color: 'var(--blue)' }}>{sonuc.formattedToplam} TL</span>
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={addToCart}
                        style={{ width: '100%', height: '38px', marginBottom: '12px', background: 'var(--green)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                        <ShoppingCart size={18} /> Sepete Ekle
                    </button>

                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '2px dashed #eee' }}>
                        <h4 style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Instagram Satış Kar Ekle</h4>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                className="input"
                                type="text"
                                value={igKar}
                                onChange={(e) => setIgKar(e.target.value)}
                                placeholder="Kar Tutarı (TL)"
                                style={{ height: '38px' }}
                            />
                        </div>
                        {finalPrice !== null && igKarVal > 0 && (
                            <div style={{
                                marginTop: '12px', padding: '12px', background: '#fdf2f8',
                                border: '1px solid #fbcfe8', borderRadius: '8px',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '10px', color: '#be185d', textTransform: 'uppercase', fontWeight: '700' }}>Final Satış Fiyatı</span>
                                    <span style={{ fontWeight: '800', fontSize: '16px', color: '#9d174d' }}>{finalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span>
                                </div>
                                <button className="btn" style={{ background: '#fff', border: '1px solid #fbcfe8', padding: '6px' }} onClick={() => navigator.clipboard.writeText(finalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 }))}>
                                    <Copy size={16} color="#9d174d" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MilyemCalculator;
