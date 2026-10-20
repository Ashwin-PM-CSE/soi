'use client';

import { FileText, TrendingUp, TrendingDown, Download, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const pieData = [
    { name: 'Real News', value: 62, color: '#00ff88' },
    { name: 'Fake News', value: 38, color: '#ff3366' },
];

const trendData = [
    { day: 'Mon', analyzed: 12, fake: 4, real: 8 },
    { day: 'Tue', analyzed: 19, fake: 7, real: 12 },
    { day: 'Wed', analyzed: 8, fake: 3, real: 5 },
    { day: 'Thu', analyzed: 24, fake: 10, real: 14 },
    { day: 'Fri', analyzed: 17, fake: 6, real: 11 },
    { day: 'Sat', analyzed: 9, fake: 2, real: 7 },
    { day: 'Sun', analyzed: 21, fake: 8, real: 13 },
];

const savedReports = [
    { title: 'COVID-19 vaccine causes autism claim', verdict: 'FAKE', confidence: 97.2, time: '2h ago' },
    { title: 'UN climate report findings on emissions', verdict: 'REAL', confidence: 91.4, time: '5h ago' },
    { title: 'Celebrity death hoax spreading on social media', verdict: 'FAKE', confidence: 95.8, time: '1d ago' },
    { title: 'NASA Mars exploration mission update', verdict: 'REAL', confidence: 88.6, time: '1d ago' },
];

const stats = [
    { label: 'Total Analyzed', value: '110', delta: '+24 this week', icon: FileText, color: '#00f5ff', positive: true },
    { label: 'Avg. Credibility', value: '67.4%', delta: '+2.3% vs last week', icon: TrendingUp, color: '#00ff88', positive: true },
    { label: 'Fake Detected', value: '38', delta: '-5 vs last week', icon: TrendingDown, color: '#ff3366', positive: false },
    { label: 'Real Verified', value: '72', delta: '+18 this week', icon: TrendingUp, color: '#8a2be2', positive: true },
];

export default function Dashboard() {
    return (
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h2 style={{ fontSize: 30, fontWeight: 800, color: '#e2e8f0', letterSpacing: '-0.02em' }}>
                        <span className="gradient-text">Intelligence</span> Dashboard
                    </h2>
                    <p style={{ color: '#64748b', marginTop: 4, fontSize: 14 }}>Real-time overview of your analysis activity</p>
                </div>
                <button
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '10px 20px', borderRadius: 10,
                        background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.25)',
                        color: '#00f5ff', fontSize: 14, cursor: 'pointer', fontWeight: 600,
                    }}
                >
                    <Download size={16} />
                    Export PDF
                </button>
            </div>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 28 }}>
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={i}
                            className="glass stat-card card-hover"
                            style={{ borderRadius: 16, padding: '22px' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>{stat.label}</p>
                                    <p style={{ fontSize: 34, fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</p>
                                    <p style={{ fontSize: 12, color: stat.positive ? '#00ff8899' : '#ff336699', marginTop: 8 }}>{stat.delta}</p>
                                </div>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 12,
                                    background: `${stat.color}15`, border: `1px solid ${stat.color}30`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Icon size={20} color={stat.color} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, marginBottom: 28 }}>
                {/* Pie chart */}
                <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#94a3b8', marginBottom: 20 }}>Fake vs Real Distribution</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                                {pieData.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} stroke="transparent"
                                        style={{ filter: `drop-shadow(0 0 8px ${entry.color}80)` }}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ background: '#111827', border: '1px solid rgba(0,245,255,0.2)', borderRadius: 8, fontSize: 12 }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 12 }}>
                        {pieData.map(d => (
                            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, boxShadow: `0 0 6px ${d.color}` }} />
                                <span style={{ color: '#64748b' }}>{d.name}: <strong style={{ color: d.color }}>{d.value}%</strong></span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Line trend chart */}
                <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#94a3b8', marginBottom: 20 }}>Weekly Analysis Trend</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={trendData} margin={{ left: 0, right: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(0,245,255,0.2)', borderRadius: 8, fontSize: 12 }} />
                            <Line type="monotone" dataKey="real" stroke="#00ff88" strokeWidth={2} dot={{ fill: '#00ff88', r: 3 }} name="Real" />
                            <Line type="monotone" dataKey="fake" stroke="#ff3366" strokeWidth={2} dot={{ fill: '#ff3366', r: 3 }} name="Fake" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Saved reports */}
            <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#94a3b8', marginBottom: 20 }}>📁 Saved Reports</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {savedReports.map((report, i) => (
                        <div
                            key={i}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '14px 16px', borderRadius: 10,
                                background: 'rgba(255,255,255,0.03)',
                                border: `1px solid ${report.verdict === 'REAL' ? 'rgba(0,255,136,0.1)' : 'rgba(255,51,102,0.1)'}`,
                                flexWrap: 'wrap', gap: 12,
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: report.verdict === 'REAL' ? '#00ff88' : '#ff3366', flexShrink: 0 }} />
                                <span style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500 }}>{report.title}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <span style={{
                                    padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700,
                                    background: report.verdict === 'REAL' ? 'rgba(0,255,136,0.1)' : 'rgba(255,51,102,0.1)',
                                    color: report.verdict === 'REAL' ? '#00ff88' : '#ff3366',
                                }}>
                                    {report.verdict}
                                </span>
                                <span style={{ fontSize: 13, color: '#00f5ff', fontWeight: 600 }}>{report.confidence}%</span>
                                <span style={{ fontSize: 12, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Clock size={12} /> {report.time}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
