import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, Trash2, Copy, Save, Check, Plus, UserSearch, History, Calculator, ShoppingBag } from 'lucide-react';
import { useLiveData } from '../../hooks/useLiveData.js';
import CustomerSelector from './CustomerSelector.jsx';
import CustomerModal from './CustomerModal.jsx';
import HistoryView from './HistoryView.jsx';
import axios from 'axios';
import CardCommission from '../Calculators/CardCommission.jsx';
import VATCalculator from '../Calculators/VATCalculator.jsx';
import GramCalculator from '../Calculators/GramCalculator.jsx';
import TLToCurrency from '../Calculators/TLToCurrency.jsx';
import CurrencyToTL from '../Calculators/CurrencyToTL.jsx';
import ECommerceExchange from '../Calculators/ECommerceExchange.jsx';

const CartSystem = () => {
    const { data } = useLiveData();
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [items, setItems] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        const handleAddToCart = (e) => {
            const { name, price, quantity: qty } = e.detail;
            const newItem = {
                id: Date.now(),
                name,
                price: parseFloat(price),
                quantity: qty,
                total: parseFloat(price) * qty
            };
            setItems(prev => [...prev, newItem]);
            setIsSaved(false);
        };

        window.addEventListener('addToCart', handleAddToCart);
        return () => window.removeEventListener('addToCart', handleAddToCart);
    }, []);

    const allProducts = useMemo(() => {
        if (!data) return [];
        return [
            ...(data.altin || []),
            ...(data.sarrafiye || []),
            ...(data.doviz || []),
            ...(data.darphane || []).map(d => ({ ...d, urun: `${d.urun} (Yeni)`, satis: d.yeni_satis })),
            ...(data.darphane || []).map(d => ({ ...d, urun: `${d.urun} (Eski)`, satis: d.eski_satis })),
        ];
    }, [data]);

    const addItem = () => {
        const prod = allProducts.find(p => p.urun === selectedProduct);
        if (!prod) return;

        const price = parseFloat(String(prod.satis).replace(/\./g, '').replace(',', '.')) || 0;
        const qty = parseInt(quantity) || 1;

        const newItem = {
            id: Date.now(),
            name: prod.urun,
            price: price,
            quantity: qty,
            total: price * qty
        };

        setItems(prev => [...prev, newItem]);
        setIsSaved(false);
    };

    const removeItem = (id) => {
        setItems(prev => prev.filter(i => i.id !== id));
        setIsSaved(false);
    };

    const totals = useMemo(() => {
        const subtotal = items.reduce((acc, curr) => acc + curr.total, 0);
        const kdv = subtotal * 0.0007;
        return {
            subtotal,
            kdv,
            grandTotal: subtotal + kdv
        };
    }, [items]);

    const saveOrder = async () => {
        if (!selectedCustomer || items.length === 0) return;
        try {
            await axios.post('/api/calculations', {
                customer_id: selectedCustomer.id,
                data: items,
                total_amount: totals.grandTotal
            });
            setIsSaved(true);
            window.dispatchEvent(new CustomEvent('refreshHistory'));
            setItems([]); // Clear cart after successful save
            setTimeout(() => setIsSaved(false), 2000);
        } catch (err) {
            console.error('Save error', err);
        }
    };

    const copySummary = () => {
        let text = `--- SEPET ÖZETİ ---\n`;
        if (selectedCustomer) text += `Müşteri: ${selectedCustomer.name}\n`;
        text += items.map(i => `${i.quantity} x ${i.name} = ${i.total.toLocaleString('tr-TR')} TL`).join('\n');
        text += `\n------------------\n`;
        text += `Ara Toplam: ${totals.subtotal.toLocaleString('tr-TR')} TL\n`;
        text += `KDV (10.000'de 7): ${totals.kdv.toLocaleString('tr-TR')} TL\n`;
        text += `GENEL TOPLAM: ${totals.grandTotal.toLocaleString('tr-TR')} TL`;

        navigator.clipboard.writeText(text);
    };

    return (
        <div className="card" style={{ padding: '24px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text)' }}>
                    <ShoppingCart size={20} color="var(--blue)" /> SEPET (CART)
                </h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {selectedCustomer && (
                        <button className="btn-ghost" onClick={() => setShowHistory(!showHistory)} style={{ padding: '6px', borderRadius: '6px', background: showHistory ? '#eef2ff' : 'transparent' }}>
                            <History size={18} color={showHistory ? 'var(--blue)' : 'var(--text-secondary)'} />
                        </button>
                    )}
                    <button className="btn-ghost" onClick={() => setShowCustomerModal(true)} style={{ padding: '6px', borderRadius: '6px' }}>
                        <UserSearch size={18} color="var(--blue)" />
                    </button>
                </div>
            </div>

            <CustomerSelector
                selectedCustomer={selectedCustomer}
                onSelect={setSelectedCustomer}
                onEdit={() => setShowCustomerModal(true)}
                onAdd={() => { setSelectedCustomer(null); setShowCustomerModal(true); }}
            />

            {showHistory && selectedCustomer && (
                <HistoryView customerId={selectedCustomer.id} />
            )}

            <div style={{ height: '16px' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 42px', gap: '8px', marginBottom: '20px' }}>
                <select
                    className="input"
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    style={{ height: '38px', fontSize: '13px', background: 'var(--bg)', border: '1px solid var(--border)' }}
                >
                    <option value="">Ürün Seç...</option>
                    {allProducts.map((p, idx) => (
                        <option key={idx} value={p.urun}>{p.urun} ({p.satis})</option>
                    ))}
                </select>
                <input
                    className="input"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    style={{ height: '38px', textAlign: 'center', background: 'var(--bg)' }}
                />
                <button className="btn btn-primary" onClick={addItem} style={{ height: '38px', padding: 0 }}>
                    <Plus size={20} />
                </button>
            </div>

            <div style={{
                maxHeight: '300px',
                overflowY: 'auto',
                marginBottom: '20px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '4px',
                background: '#fafafa'
            }}>
                {items.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 10px', fontSize: '12px' }}>
                        Henüz ürün eklenmedi.
                    </div>
                ) : (
                    items.map(item => (
                        <div key={item.id} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '10px 12px', background: '#fff', borderRadius: '8px', marginBottom: '4px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #efeff4'
                        }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '13px', fontWeight: '700' }}>{item.name}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.quantity} adet x {item.price.toLocaleString('tr-TR')} TL</div>
                            </div>
                            <div style={{ fontWeight: '800', fontSize: '14px', marginRight: '10px', color: 'var(--text)' }}>
                                {item.total.toLocaleString('tr-TR')}
                            </div>
                            <button className="btn-ghost" onClick={() => removeItem(item.id)} style={{ padding: '4px', borderRadius: '4px' }}>
                                <Trash2 size={15} color="var(--red)" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div style={{ background: '#f8f8fa', borderRadius: '12px', padding: '16px', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Ara Toplam:</span>
                    <span style={{ fontWeight: '600' }}>{totals.subtotal.toLocaleString('tr-TR')} TL</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>KDV (%0.007):</span>
                    <span style={{ fontWeight: '600' }}>{totals.kdv.toLocaleString('tr-TR')} TL</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '18px', borderTop: '1px dashed #ddd', paddingTop: '10px' }}>
                    <span style={{ fontWeight: '800', letterSpacing: '-0.5px' }}>TOPLAM:</span>
                    <span style={{ fontWeight: '800', color: 'var(--blue)' }}>{totals.grandTotal.toLocaleString('tr-TR')} TL</span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-primary" onClick={copySummary} style={{ flex: 1, height: '42px', fontSize: '13px' }}>
                        <Copy size={16} /> Kopyala
                    </button>
                    <button
                        className="btn"
                        onClick={saveOrder}
                        disabled={!selectedCustomer || items.length === 0}
                        style={{
                            background: isSaved ? 'var(--green)' : '#fff',
                            color: isSaved ? '#fff' : 'var(--text)',
                            border: '1px solid ' + (isSaved ? 'var(--green)' : 'var(--border)'),
                            width: '110px',
                            height: '42px',
                            fontSize: '13px'
                        }}
                    >
                        {isSaved ? <Check size={18} /> : <Save size={18} />} {isSaved ? 'OK' : 'Kaydet'}
                    </button>
                </div>
            </div>

            <CustomerModal
                isOpen={showCustomerModal}
                onClose={() => setShowCustomerModal(false)}
                customer={selectedCustomer}
                onSave={(c) => {
                    setSelectedCustomer(c);
                    setShowCustomerModal(false);
                }}
            />
        </div>
    );
};

export default CartSystem;
