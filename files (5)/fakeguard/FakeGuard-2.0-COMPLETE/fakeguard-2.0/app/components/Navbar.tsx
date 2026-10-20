'use client';

import { Shield, BarChart2, Search, Menu, X, Zap, LogIn } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
    activeTab: 'home' | 'analyze' | 'dashboard' | 'login';
    setActiveTab: (tab: 'home' | 'analyze' | 'dashboard' | 'login') => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = [
        { id: 'home' as const, label: 'Home', icon: Shield },
        { id: 'analyze' as const, label: 'Analyze', icon: Search },
        { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart2 },
    ];

    return (
        <nav className="navbar" style={{ position: 'sticky', top: 0, zIndex: 200 }}>
            <div style={{
                maxWidth: 1400,
                margin: '0 auto',
                padding: '0 2rem',
                height: 68,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                {/* Logo */}
                <button
                    onClick={() => setActiveTab('home')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                    }}
                >
                    <div style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(138,43,226,0.15))',
                        border: '1px solid rgba(0,245,255,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 15px rgba(0,245,255,0.2)',
                    }}>
                        <Shield size={20} color="#00f5ff" />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: 17, fontWeight: 800, color: '#e2e8f0', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                            FakeGuard
                            <span style={{ color: '#00f5ff' }}> 2.0</span>
                        </div>
                        <div style={{ fontSize: 10, color: '#475569', letterSpacing: '0.15em', textTransform: 'uppercase', lineHeight: 1 }}>
                            AI Defence System
                        </div>
                    </div>
                </button>

                {/* Center nav items (desktop) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hide-mobile">
                    {navItems.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`nav-link ${activeTab === id ? 'active' : ''}`}
                            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px' }}
                        >
                            <Icon size={15} />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Right side */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {/* Live indicator */}
                    <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#475569' }}>
                        <div style={{
                            width: 7, height: 7, borderRadius: '50%',
                            background: '#00ff88',
                            boxShadow: '0 0 8px rgba(0,255,136,0.8)',
                            animation: 'pulseGlow 2s ease-in-out infinite',
                        }} />
                        <span style={{ color: '#64748b' }}>AI Engine Online</span>
                    </div>

                    {/* CTA button */}
                    <button
                        onClick={() => setActiveTab('analyze')}
                        className="hide-mobile"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '8px 18px',
                            borderRadius: 10,
                            background: 'linear-gradient(135deg, rgba(0,245,255,0.12), rgba(138,43,226,0.12))',
                            border: '1px solid rgba(0,245,255,0.3)',
                            color: '#00f5ff',
                            fontSize: 13,
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontFamily: 'inherit',
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(0,245,255,0.3)';
                            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,245,255,0.6)';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,245,255,0.3)';
                        }}
                    >
                        <Zap size={14} />
                        Analyze Now
                    </button>

                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        style={{
                            display: 'none',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 8,
                            padding: '6px',
                            cursor: 'pointer',
                            color: '#94a3b8',
                        }}
                        className="show-mobile"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div style={{
                    background: 'rgba(10,15,28,0.95)',
                    backdropFilter: 'blur(20px)',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    padding: '12px 2rem 20px',
                }}>
                    {navItems.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => { setActiveTab(id); setMobileOpen(false); }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: 10,
                                background: activeTab === id ? 'rgba(0,245,255,0.08)' : 'none',
                                border: 'none',
                                color: activeTab === id ? '#00f5ff' : '#64748b',
                                fontSize: 15,
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                textAlign: 'left',
                                marginBottom: 4,
                            }}
                        >
                            <Icon size={18} />
                            {label}
                        </button>
                    ))}
                </div>
            )}
        </nav>
    );
}
