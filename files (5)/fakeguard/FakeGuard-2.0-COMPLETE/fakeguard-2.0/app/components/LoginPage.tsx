'use client';

import { useState } from 'react';
import { Shield, Eye, EyeOff, ArrowRight, Zap, Lock, Mail, User } from 'lucide-react';

interface LoginPageProps {
    setActiveTab: (tab: 'home' | 'analyze' | 'dashboard' | 'login') => void;
}

function NeonInput({
    type, placeholder, icon: Icon, value, onChange, id,
}: {
    type: string;
    placeholder: string;
    icon: typeof Mail;
    value: string;
    onChange: (v: string) => void;
    id: string;
}) {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            borderRadius: 12,
            background: focused ? 'rgba(0,245,255,0.03)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${focused ? 'rgba(0,245,255,0.45)' : 'rgba(255,255,255,0.08)'}`,
            boxShadow: focused ? '0 0 0 3px rgba(0,245,255,0.07), 0 0 20px rgba(0,245,255,0.08)' : 'none',
            transition: 'all 0.3s ease',
        }}>
            <Icon size={17} color={focused ? '#00f5ff' : '#475569'} style={{ flexShrink: 0, transition: 'color 0.3s ease' }} />
            <input
                id={id}
                type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                placeholder={placeholder}
                value={value}
                onChange={e => onChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: '#e2e8f0',
                    fontSize: 14,
                    fontFamily: 'inherit',
                }}
            />
            {type === 'password' && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 0 }}
                >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            )}
        </div>
    );
}

export default function LoginPage({ setActiveTab }: LoginPageProps) {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setActiveTab('dashboard');
        }, 1800);
    };

    return (
        <div style={{
            minHeight: 'calc(100vh - 68px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem 2rem',
            position: 'relative',
            zIndex: 1,
        }}>
            <div style={{
                width: '100%',
                maxWidth: 1000,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 0,
                borderRadius: 28,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 60px rgba(0,245,255,0.05)',
            }}>
                {/* LEFT — animated illustration panel */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(0,245,255,0.06) 0%, rgba(138,43,226,0.1) 100%)',
                    padding: '60px 48px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRight: '1px solid rgba(255,255,255,0.06)',
                }}
                    className="hide-mobile"
                >
                    {/* Decorative circles */}
                    {[180, 260, 340].map((size, i) => (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                top: '50%', left: '50%',
                                width: size, height: size,
                                transform: 'translate(-50%, -50%)',
                                borderRadius: '50%',
                                border: `1px solid rgba(0,245,255,${0.06 - i * 0.015})`,
                                animation: `floatUp ${4 + i}s ease-in-out infinite`,
                                animationDelay: `${i * -1.5}s`,
                            }}
                        />
                    ))}

                    {/* Animated shield icon */}
                    <div style={{
                        position: 'absolute',
                        top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                    }}>
                        <div className="animate-float" style={{
                            width: 120, height: 120,
                            borderRadius: 30,
                            background: 'linear-gradient(135deg, rgba(0,245,255,0.1), rgba(138,43,226,0.15))',
                            border: '1px solid rgba(0,245,255,0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 40px rgba(0,245,255,0.15)',
                            margin: '0 auto',
                        }}>
                            <Shield size={56} color="#00f5ff" style={{ filter: 'drop-shadow(0 0 10px rgba(0,245,255,0.6))' }} />
                        </div>
                        <div style={{ marginTop: 24, textAlign: 'center' }}>
                            <div style={{ fontSize: 22, fontWeight: 800, color: '#e2e8f0', letterSpacing: '-0.02em' }}>FakeGuard 2.0</div>
                            <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>AI Defence Platform</div>
                        </div>
                    </div>

                    {/* Bottom features */}
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        {[
                            { icon: '🔐', text: 'Enterprise-grade encryption' },
                            { icon: '🤖', text: 'Powered by transformer AI' },
                            { icon: '⚡', text: 'Real-time analysis in 2.2s' },
                        ].map(({ icon, text }) => (
                            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, color: '#64748b', fontSize: 13 }}>
                                <span style={{ fontSize: 16 }}>{icon}</span>
                                {text}
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT — form panel */}
                <div style={{
                    background: 'rgba(10,15,28,0.9)',
                    backdropFilter: 'blur(30px)',
                    padding: '60px 48px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}>
                    {/* Header */}
                    <div style={{ marginBottom: 36 }}>
                        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#e2e8f0', letterSpacing: '-0.02em', marginBottom: 8 }}>
                            {mode === 'login' ? 'Welcome back' : 'Create account'}
                            <span className="gradient-text"> 👋</span>
                        </h2>
                        <p style={{ color: '#475569', fontSize: 14 }}>
                            {mode === 'login'
                                ? 'Sign in to access your AI dashboard'
                                : 'Join the fight against misinformation'}
                        </p>
                    </div>

                    {/* Toggle */}
                    <div style={{
                        display: 'flex',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: 12,
                        padding: 4,
                        marginBottom: 32,
                        border: '1px solid rgba(255,255,255,0.06)',
                    }}>
                        {(['login', 'register'] as const).map(m => (
                            <button
                                key={m}
                                onClick={() => setMode(m)}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    borderRadius: 9,
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                    fontSize: 14,
                                    fontWeight: 600,
                                    transition: 'all 0.3s ease',
                                    background: mode === m ? 'rgba(0,245,255,0.1)' : 'none',
                                    color: mode === m ? '#00f5ff' : '#475569',
                                    boxShadow: mode === m ? '0 0 15px rgba(0,245,255,0.15)' : 'none',
                                }}
                            >
                                {m === 'login' ? 'Sign In' : 'Register'}
                            </button>
                        ))}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {mode === 'register' && (
                            <NeonInput
                                id="auth-name"
                                type="text"
                                placeholder="Full name"
                                icon={User}
                                value={name}
                                onChange={setName}
                            />
                        )}
                        <NeonInput
                            id="auth-email"
                            type="email"
                            placeholder="Email address"
                            icon={Mail}
                            value={email}
                            onChange={setEmail}
                        />
                        <NeonInput
                            id="auth-password"
                            type="password"
                            placeholder="Password"
                            icon={Lock}
                            value={password}
                            onChange={setPassword}
                        />

                        {mode === 'login' && (
                            <div style={{ textAlign: 'right', marginTop: -8 }}>
                                <button type="button" style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: '#475569', fontSize: 13, fontFamily: 'inherit',
                                }}>
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <button
                            id="auth-submit-btn"
                            type="submit"
                            className="neon-btn pulse-glow"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 10,
                                padding: '15px',
                                borderRadius: 12,
                                fontSize: 15,
                                fontWeight: 700,
                                marginTop: 8,
                                width: '100%',
                            }}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div style={{ width: 18, height: 18, border: '2px solid rgba(0,245,255,0.3)', borderTopColor: '#00f5ff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    <Zap size={18} />
                                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0' }}>
                        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
                        <span style={{ fontSize: 12, color: '#374151' }}>or continue as guest</span>
                        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
                    </div>

                    {/* Guest button */}
                    <button
                        onClick={() => setActiveTab('analyze')}
                        style={{
                            padding: '13px',
                            borderRadius: 12,
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: '#64748b',
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8';
                            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.color = '#64748b';
                            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)';
                        }}
                    >
                        Continue as Guest
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
