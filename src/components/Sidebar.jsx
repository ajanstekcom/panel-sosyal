import React from 'react';
import { LogOut, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import CardCommission from './Calculators/CardCommission.jsx';
import VATCalculator from './Calculators/VATCalculator.jsx';
import GramCalculator from './Calculators/GramCalculator.jsx';
import CurrencyToTL from './Calculators/CurrencyToTL.jsx';
import TLToCurrency from './Calculators/TLToCurrency.jsx';
import ECommerceExchange from './Calculators/ECommerceExchange.jsx';

const Sidebar = ({ user, onLogout }) => {
    return (
        <aside className="left-panel" style={{
            display: 'flex',
            flexDirection: 'column',
            width: '380px',
            background: 'var(--card)',
            borderRight: '1px solid var(--border)',
            height: '100%'
        }}>
            <div className="panel-title" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 16px 8px',
                fontSize: '11px',
                fontWeight: '700',
                color: 'var(--text-secondary)',
                letterSpacing: '1px',
                textTransform: 'uppercase'
            }}>
                <span>TOPALOĞLU ALTIN</span>
                <button onClick={onLogout} className="btn-ghost" style={{ padding: '4px', borderRadius: '4px' }} title="Çıkış Yap">
                    <LogOut size={16} color="var(--red)" />
                </button>
            </div>

            <div className="user-info" style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '8px'
            }}>
                <div style={{
                    background: 'var(--accent-light)',
                    color: 'var(--accent)',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '14px'
                }}>
                    {user?.username?.[0]?.toUpperCase()}
                </div>
                <div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{user?.username}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Operasyon Sorumlusu</div>
                </div>
            </div>

            {user?.role === 'admin' && (
                <>
                    <Link to="/users" style={{
                        margin: '0 16px 12px', padding: '10px 14px', borderRadius: '10px',
                        background: 'var(--bg)', color: 'var(--blue)', textDecoration: 'none',
                        display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', fontWeight: '700',
                        border: '1px solid var(--border)'
                    }}>
                        <Shield size={16} /> Kullanıcı Yönetimi
                    </Link>
                    <Link to="/customers" style={{
                        margin: '0 16px 12px', padding: '10px 14px', borderRadius: '10px',
                        background: 'var(--bg)', color: 'var(--blue)', textDecoration: 'none',
                        display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', fontWeight: '700',
                        border: '1px solid var(--border)'
                    }}>
                        <Users size={16} /> Müşteri Yönetimi
                    </Link>
                </>
            )}

            <div style={{ overflowY: 'auto', flex: 1, paddingBottom: '20px' }}>
                <div className="panel-title" style={{ padding: '12px 16px 4px', fontSize: '10px', color: 'var(--text-secondary)', fontWeight: '700' }}>Kasa İşlemleri</div>
                <CardCommission />
                <VATCalculator />
                <GramCalculator />
                <TLToCurrency />
                <CurrencyToTL />
                <ECommerceExchange />
            </div>
        </aside>
    );
};

export default Sidebar;
