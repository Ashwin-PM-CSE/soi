'use client';

import { useState } from 'react';
import {
    Brain, Target, BarChart2, MessageSquare,
    Globe, Camera, Sparkles, Shield,
} from 'lucide-react';

const FEATURES = [
    {
        icon: Brain,
        title: 'AI Detection Engine',
        description: 'Transformer-based NLP model trained on 500K+ articles. Detects sensationalism, clickbait, and fabrication patterns.',
        color: '#00f5ff',
        glow: 'rgba(0,245,255,0.12)',
        badge: 'Core',
    },
    {
        icon: Target,
        title: 'Confidence Scoring',
        description: 'Precision confidence meter with multi-dimensional scoring across credibility vectors and linguistic patterns.',
        color: '#8a2be2',
        glow: 'rgba(138,43,226,0.12)',
        badge: 'ML',
    },
    {
        icon: BarChart2,
        title: 'Bias & Sentiment Analyzer',
        description: 'Deep sentiment analysis detects emotional manipulation, political framing, and one-sided reporting.',
        color: '#f59e0b',
        glow: 'rgba(245,158,11,0.12)',
        badge: 'NLP',
    },
    {
        icon: MessageSquare,
        title: 'Intelligent Chat Assistant',
        description: 'Context-aware AI assistant that explains verdicts, answers questions, and guides manual verification.',
        color: '#00ff88',
        glow: 'rgba(0,255,136,0.12)',
        badge: 'GenAI',
    },
    {
        icon: Globe,
        title: 'Source Verification',
        description: 'Cross-reference claims against verified news databases and assess the credibility of cited sources.',
        color: '#ff3366',
        glow: 'rgba(255,51,102,0.12)',
        badge: 'Intel',
    },
    {
        icon: Camera,
        title: 'OCR Image Analysis',
        description: 'Extract text from images and PDFs using advanced OCR, then run the full fake news detection pipeline.',
        color: '#06b6d4',
        glow: 'rgba(6,182,212,0.12)',
        badge: 'Vision',
    },
    {
        icon: Sparkles,
        title: 'Smart Summarization',
        description: 'Instant AI-generated summaries highlighting key claims, red flags, and factual anchors within the content.',
        color: '#a855f7',
        glow: 'rgba(168,85,247,0.12)',
        badge: 'GenAI',
    },
    {
        icon: Shield,
        title: 'Text Heatmap',
        description: 'Visual overlay highlighting emotional manipulation (red), suspicious exaggerations (yellow), and factual language (green).',
        color: '#22d3ee',
        glow: 'rgba(34,211,238,0.12)',
        badge: 'Visual',
    },
];

function FeatureCard({
    icon: Icon, title, description, color, glow, badge,
}: {
    icon: typeof Brain;
    title: string;
    description: string;
    color: string;
    glow: string;
    badge: string;
}) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="feature-card glass-card"
            style={{
                padding: '28px',
                cursor: 'default',
                border: hovered ? `1px solid ${color}40` : '1px solid rgba(255,255,255,0.07)',
                boxShadow: hovered ? `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${glow}` : '0 4px 20px rgba(0,0,0,0.2)',
                transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Icon + Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div
                    className="feature-icon"
                    style={{
                        background: hovered ? glow : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${hovered ? color + '50' : 'rgba(255,255,255,0.08)'}`,
                        transition: 'all 0.35s ease',
                        boxShadow: hovered ? `0 0 20px ${glow}` : 'none',
                    }}
                >
                    <Icon size={24} color={hovered ? color : '#64748b'} style={{ transition: 'color 0.3s ease' }} />
                </div>
                <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 9px',
                    borderRadius: 100,
                    background: `${color}15`,
                    border: `1px solid ${color}30`,
                    color,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase' as const,
                }}>
                    {badge}
                </span>
            </div>

            {/* Title */}
            <h3 style={{
                fontSize: 16,
                fontWeight: 700,
                color: hovered ? '#e2e8f0' : '#94a3b8',
                marginBottom: 10,
                lineHeight: 1.3,
                transition: 'color 0.3s ease',
                letterSpacing: '-0.01em',
            }}>
                {title}
            </h3>

            {/* Description */}
            <p style={{
                fontSize: 13.5,
                color: '#475569',
                lineHeight: 1.65,
                transition: 'color 0.3s ease',
            }}>
                {description}
            </p>

            {/* Glow line at bottom */}
            {hovered && (
                <div style={{
                    position: 'absolute',
                    bottom: 0, left: 0, right: 0,
                    height: 2,
                    background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                    borderRadius: '0 0 20px 20px',
                    boxShadow: `0 0 10px ${color}`,
                }} />
            )}
        </div>
    );
}

export default function FeaturesSection() {
    return (
        <section style={{ padding: '6rem 2rem', position: 'relative', zIndex: 1 }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                {/* Section header */}
                <div style={{ textAlign: 'center', marginBottom: 64 }}>
                    <div className="hero-badge" style={{ marginBottom: 20, display: 'inline-flex' }}>
                        <Sparkles size={14} />
                        Feature Arsenal
                    </div>
                    <h2 style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: 900,
                        color: '#e2e8f0',
                        letterSpacing: '-0.03em',
                        lineHeight: 1.1,
                        marginBottom: 16,
                    }}>
                        Everything You Need to
                        <br />
                        <span className="gradient-text">Fight Misinformation</span>
                    </h2>
                    <p style={{
                        fontSize: 16,
                        color: '#475569',
                        maxWidth: 600,
                        margin: '0 auto',
                        lineHeight: 1.7,
                    }}>
                        A complete intelligence suite designed for journalists, researchers, and
                        anyone who values truth in the digital age.
                    </p>
                </div>

                {/* Feature grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 20,
                }}>
                    {FEATURES.map(feature => (
                        <FeatureCard key={feature.title} {...feature} />
                    ))}
                </div>

                {/* Bottom CTA strip */}
                <div style={{
                    marginTop: 64,
                    padding: '32px 40px',
                    borderRadius: 24,
                    background: 'linear-gradient(135deg, rgba(0,245,255,0.06), rgba(138,43,226,0.06))',
                    border: '1px solid rgba(0,245,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 24,
                }}>
                    <div>
                        <p style={{ fontSize: 11, color: '#00f5ff', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                            Powered by Advanced AI
                        </p>
                        <h3 style={{ fontSize: 22, fontWeight: 800, color: '#e2e8f0', letterSpacing: '-0.02em' }}>
                            Ready to detect the truth?
                        </h3>
                        <p style={{ fontSize: 14, color: '#475569', marginTop: 4 }}>
                            Analyze any article in under 3 seconds with enterprise-grade AI.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        {['🔬 Analyze Article', '📊 View Reports'].map((label, i) => (
                            <button key={i} style={{
                                padding: '12px 24px',
                                borderRadius: 12,
                                background: i === 0
                                    ? 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(138,43,226,0.15))'
                                    : 'rgba(255,255,255,0.04)',
                                border: i === 0
                                    ? '1px solid rgba(0,245,255,0.35)'
                                    : '1px solid rgba(255,255,255,0.08)',
                                color: i === 0 ? '#00f5ff' : '#64748b',
                                fontSize: 14,
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                fontFamily: 'inherit',
                            }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                                    (e.currentTarget as HTMLButtonElement).style.boxShadow = i === 0
                                        ? '0 8px 30px rgba(0,245,255,0.2)' : '0 8px 20px rgba(0,0,0,0.2)';
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                                    (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
