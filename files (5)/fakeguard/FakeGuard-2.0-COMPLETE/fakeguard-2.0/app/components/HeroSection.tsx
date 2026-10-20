'use client';

import { useState, useEffect } from 'react';
import { Shield, Zap, ArrowRight, ChevronDown, Activity, Lock, Eye } from 'lucide-react';

const TYPING_STRINGS = [
    'AI-Powered Misinformation Detection',
    'Real-Time Credibility Analysis',
    'Intelligent Fact Verification',
    'Bias & Sentiment Detection',
];

function TypewriterText() {
    const [stringIndex, setStringIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const current = TYPING_STRINGS[stringIndex];
        const timeout = setTimeout(() => {
            if (!deleting && charIndex < current.length) {
                setCharIndex(c => c + 1);
            } else if (!deleting && charIndex === current.length) {
                setTimeout(() => setDeleting(true), 1800);
            } else if (deleting && charIndex > 0) {
                setCharIndex(c => c - 1);
            } else if (deleting && charIndex === 0) {
                setDeleting(false);
                setStringIndex(i => (i + 1) % TYPING_STRINGS.length);
            }
        }, deleting ? 35 : 65);
        return () => clearTimeout(timeout);
    }, [charIndex, deleting, stringIndex]);

    return (
        <span className="gradient-text">
            {TYPING_STRINGS[stringIndex].substring(0, charIndex)}
            <span style={{
                display: 'inline-block',
                width: 3,
                height: '0.85em',
                background: '#00f5ff',
                marginLeft: 2,
                verticalAlign: 'text-bottom',
                animation: 'pulseGlow 1s ease-in-out infinite',
                boxShadow: '0 0 8px rgba(0,245,255,0.8)',
            }} />
        </span>
    );
}

// Animated orbiting particle
function FloatingOrb({ x, y, size, color, delay }: { x: string; y: string; size: number; color: string; delay: string }) {
    return (
        <div style={{
            position: 'absolute',
            left: x, top: y,
            width: size, height: size,
            borderRadius: '50%',
            background: color,
            filter: `blur(${size / 2}px)`,
            opacity: 0.4,
            animation: `floatUp ${3 + Math.random() * 2}s ease-in-out infinite`,
            animationDelay: delay,
            pointerEvents: 'none',
        }} />
    );
}

// Live stat counter in hero
function StatBadge({ value, label, color }: { value: string; label: string; color: string }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '16px 24px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16,
            backdropFilter: 'blur(20px)',
        }}>
            <span style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</span>
            <span style={{ fontSize: 12, color: '#475569', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
        </div>
    );
}

interface HeroSectionProps {
    setActiveTab: (tab: 'home' | 'analyze' | 'dashboard' | 'login') => void;
}

export default function HeroSection({ setActiveTab }: HeroSectionProps) {
    return (
        <section style={{
            minHeight: 'calc(100vh - 68px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem 2rem',
            position: 'relative',
            overflow: 'hidden',
            zIndex: 1,
        }}>
            {/* Decorative ambient orbs */}
            <FloatingOrb x="10%" y="20%" size={200} color="rgba(0,245,255,0.15)" delay="0s" />
            <FloatingOrb x="80%" y="15%" size={150} color="rgba(138,43,226,0.2)" delay="-2s" />
            <FloatingOrb x="5%" y="70%" size={120} color="rgba(138,43,226,0.12)" delay="-1s" />
            <FloatingOrb x="85%" y="65%" size={180} color="rgba(0,245,255,0.1)" delay="-3s" />

            {/* Central content */}
            <div style={{ maxWidth: 900, textAlign: 'center', position: 'relative', zIndex: 2 }}>
                {/* Badge */}
                <div className="animate-fade-up" style={{ animationDelay: '0s', marginBottom: 28 }}>
                    <span className="hero-badge">
                        <div style={{
                            width: 7, height: 7, borderRadius: '50%',
                            background: '#00ff88',
                            boxShadow: '0 0 8px rgba(0,255,136,0.8)',
                        }} />
                        🛡️ Next-Generation AI Defence Platform
                    </span>
                </div>

                {/* Main headline */}
                <h1 className="animate-fade-up" style={{
                    fontSize: 'clamp(2.4rem, 6vw, 5rem)',
                    fontWeight: 900,
                    lineHeight: 1.08,
                    letterSpacing: '-0.03em',
                    color: '#e2e8f0',
                    marginBottom: 24,
                    animationDelay: '0.1s',
                }}>
                    <TypewriterText />
                </h1>

                {/* Subtext */}
                <p className="animate-fade-up" style={{
                    fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                    color: '#64748b',
                    lineHeight: 1.7,
                    marginBottom: 44,
                    maxWidth: 680,
                    margin: '0 auto 44px',
                    animationDelay: '0.2s',
                }}>
                    FakeGuard 2.0 uses advanced transformer models and multi-layered analysis to detect misinformation,
                    measure credibility, identify bias, and provide structured AI explanations — in seconds.
                </p>

                {/* CTA Buttons */}
                <div className="animate-fade-up" style={{
                    display: 'flex',
                    gap: 16,
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    marginBottom: 60,
                    animationDelay: '0.3s',
                }}>
                    <button
                        id="hero-analyze-btn"
                        onClick={() => setActiveTab('analyze')}
                        className="pulse-glow"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '16px 36px',
                            borderRadius: 14,
                            background: 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(138,43,226,0.15))',
                            border: '1px solid rgba(0,245,255,0.4)',
                            color: '#00f5ff',
                            fontSize: 16,
                            fontWeight: 800,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            letterSpacing: '0.02em',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px)';
                            (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(0,245,255,0.25), rgba(138,43,226,0.25))';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                            (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(138,43,226,0.15))';
                        }}
                    >
                        <Zap size={20} />
                        Start Analyzing
                        <ArrowRight size={18} />
                    </button>

                    <button
                        onClick={() => setActiveTab('dashboard')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '16px 32px',
                            borderRadius: 14,
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#94a3b8',
                            fontSize: 16,
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px)';
                            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)';
                            (e.currentTarget as HTMLButtonElement).style.color = '#e2e8f0';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)';
                            (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8';
                        }}
                    >
                        <Activity size={18} />
                        View Dashboard
                    </button>
                </div>

                {/* Stats row */}
                <div className="animate-fade-up" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 16,
                    flexWrap: 'wrap',
                    animationDelay: '0.4s',
                }}>
                    <StatBadge value="99.4%" label="Detection Accuracy" color="#00f5ff" />
                    <StatBadge value="2.2s" label="Avg Analysis Time" color="#00ff88" />
                    <StatBadge value="12K+" label="Articles Analyzed" color="#8a2be2" />
                    <StatBadge value="8" label="AI Models Used" color="#f59e0b" />
                </div>
            </div>

            {/* Trust line */}
            <div style={{
                position: 'absolute',
                bottom: 36,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                opacity: 0.5,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 12, color: '#475569' }}>
                    {[
                        { icon: Shield, text: 'End-to-End Encrypted' },
                        { icon: Lock, text: 'Privacy First' },
                        { icon: Eye, text: 'No Data Stored' },
                    ].map(({ icon: Icon, text }) => (
                        <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Icon size={12} />
                            <span>{text}</span>
                        </div>
                    ))}
                </div>
                <ChevronDown size={20} color="#475569" style={{ animation: 'floatUp 2s ease-in-out infinite' }} />
            </div>
        </section>
    );
}
