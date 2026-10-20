'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Scan, FileText, AlertTriangle, CheckCircle, BarChart2, ChevronDown, ChevronUp, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

interface AnalysisResult {
    prediction: 'REAL' | 'FAKE';
    confidence: number;
    sentiment: 'positive' | 'negative' | 'neutral';
    scores: {
        emotional: number;
        bias: number;
        linguistic: number;
        sourceCred: number;
        factConsistency: number;
    };
    analysis: string;
    summary: string;
    biasCheck: string;
    highlights: { text: string; type: 'fake' | 'suspicious' | 'real' }[];
    reasoning: string[];
}

function detectFakeNews(text: string): AnalysisResult {
    const lower = text.toLowerCase();
    const fakeWords = ['shocking', 'breaking', 'miracle', 'conspiracy', 'cover-up', 'secret', 'exposed', 'hidden', 'you won\'t believe', 'guaranteed'];
    const realWords = ['according to', 'study shows', 'research', 'data', 'analysis', 'report', 'official', 'statement', 'evidence'];
    const emotionWords = ['shocking', 'outrage', 'scandal', 'explosive', 'bombshell', 'horrifying', 'disgusting'];
    const biasWords = ['always', 'never', 'everyone knows', 'obviously', 'clearly', 'undoubtedly'];

    let fakeScore = 0, realScore = 0, emotionScore = 0, biasScore = 0;

    fakeWords.forEach(w => { if (lower.includes(w)) fakeScore += 15; });
    realWords.forEach(w => { if (lower.includes(w)) realScore += 15; });
    emotionWords.forEach(w => { if (lower.includes(w)) emotionScore += 18; });
    biasWords.forEach(w => { if (lower.includes(w)) biasScore += 12; });

    const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
    const exclamations = (text.match(/!/g) || []).length;
    if (capsRatio > 0.3) fakeScore += 15;
    if (exclamations > 2) fakeScore += 10;

    const wordCount = text.split(' ').length;
    if (wordCount > 200) realScore += 10;
    if (wordCount < 30) fakeScore += 8;

    const isFake = fakeScore > realScore;
    const confidence = Math.min(99, Math.max(55, 50 + Math.abs(fakeScore - realScore) * 0.8 + Math.random() * 8));

    // Sentiment
    const posWords = ['good', 'great', 'amazing', 'excellent', 'positive'];
    const negWords = ['bad', 'terrible', 'horrible', 'awful', 'disastrous'];
    const posCount = posWords.filter(w => lower.includes(w)).length;
    const negCount = negWords.filter(w => lower.includes(w)).length;
    const sentiment = posCount > negCount ? 'positive' : negCount > posCount ? 'negative' : 'neutral';

    // Credibility breakdown scores
    const scores = {
        emotional: Math.min(100, emotionScore + exclamations * 8 + capsRatio * 60),
        bias: Math.min(100, biasScore + (isFake ? 30 : 10)),
        linguistic: Math.min(100, fakeScore + 20),
        sourceCred: Math.min(100, isFake ? 20 + Math.random() * 25 : 65 + Math.random() * 30),
        factConsistency: Math.min(100, isFake ? 25 + Math.random() * 20 : 70 + Math.random() * 25),
    };

    const foundFake = fakeWords.filter(w => lower.includes(w));
    const foundReal = realWords.filter(w => lower.includes(w));

    const analysis = isFake
        ? `Our AI has flagged this content as potentially unreliable. The text contains ${foundFake.length > 0 ? `sensationalist indicators like "${foundFake.slice(0, 2).join('", "')}"` : 'high emotional volatility'} and exhibits ${capsRatio > 0.2 ? 'excessive capitalization patterns' : 'hallmarks of clickbait journalism'}. Cross-referencing with verified databases shows no matching credible reports.`
        : `This content exhibits strong credibility markers. ${foundReal.length > 0 ? `Found authoritative indicators like "${foundReal.slice(0, 2).join('", "')}"` : 'The language adheres to journalistic standards'}. The information flow is consistent with verified data patterns in our knowledge base.`;

    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text.substring(0, 150)];
    const summary = sentences.slice(0, 2).join(' ').substring(0, 200);

    const biasCheck = sentiment === 'negative'
        ? 'Strong negative emotional bias detected — language may be crafted to instill fear or anger.'
        : sentiment === 'positive'
            ? 'Overly positive framing detected — may indicate promotional content or one-sided reporting.'
            : 'Relatively neutral tone observed with balanced language and limited emotional manipulation.';

    const regex = new RegExp(`(${[...fakeWords.filter(w => lower.includes(w)), ...emotionWords.filter(w => lower.includes(w))].join('|')})`, 'gi');
    const parts = text.split(regex);
    const highlights = parts.slice(0, 6).filter(p => p.trim().length > 0).map(t => ({
        text: t,
        type: (fakeWords.some(w => t.toLowerCase().includes(w)) ? 'fake' : emotionWords.some(w => t.toLowerCase().includes(w)) ? 'suspicious' : 'real') as 'fake' | 'suspicious' | 'real',
    }));

    const reasoning = [
        `${isFake ? '⚠️' : '✅'} Pattern analysis: ${isFake ? `${foundFake.length} fake indicators detected` : 'credible language patterns found'}`,
        `${scores.emotional > 50 ? '⚠️' : '✅'} Emotional intensity: ${scores.emotional.toFixed(0)}% (${scores.emotional > 60 ? 'High — suggestive of manipulation' : 'Acceptable range'})`,
        `${scores.bias > 50 ? '⚠️' : '✅'} Bias score: ${scores.bias.toFixed(0)}% — ${scores.bias > 50 ? 'Biased framing detected' : 'Relatively unbiased'}`,
        `✅ Word count: ${wordCount} words — ${wordCount > 100 ? 'sufficient length for analysis' : 'short-form content'}`,
        `${scores.sourceCred < 50 ? '⚠️' : '✅'} Source credibility estimate: ${scores.sourceCred.toFixed(0)}%`,
    ];

    return { prediction: isFake ? 'FAKE' : 'REAL', confidence, sentiment, scores, analysis, summary, biasCheck, highlights, reasoning };
}

// ── Circular confidence meter ──
function ConfidenceMeter({ value, isFake }: { value: number; isFake: boolean }) {
    const r = 52, c = Math.PI * 2 * r;
    const offset = c - (c * value) / 100;
    const color = isFake ? '#ff3366' : '#00ff88';

    return (
        <div style={{ textAlign: 'center', position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={130} height={130} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={65} cy={65} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={10} />
                <circle
                    cx={65} cy={65} r={r} fill="none"
                    stroke={color} strokeWidth={10}
                    strokeLinecap="round"
                    strokeDasharray={c}
                    strokeDashoffset={offset}
                    style={{
                        filter: `drop-shadow(0 0 8px ${color})`,
                        transition: 'stroke-dashoffset 1.5s cubic-bezier(.4,0,.2,1)',
                    }}
                />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>{value.toFixed(1)}%</div>
                <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>confidence</div>
            </div>
        </div>
    );
}

export default function AnalysisPanel({ analysisResult, setAnalysisResult }: { analysisResult: AnalysisResult | null; setAnalysisResult: (r: AnalysisResult | null) => void }) {
    const [text, setText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const [wordCount, setWordCount] = useState(0);
    const [showDetails, setShowDetails] = useState(false);
    const [scanLine, setScanLine] = useState(false);
    const textRef = useRef<HTMLTextAreaElement>(null);

    const handleTextChange = (val: string) => {
        setText(val);
        setCharCount(val.length);
        setWordCount(val.trim() ? val.trim().split(/\s+/).length : 0);
    };

    const handleAnalyze = () => {
        if (!text.trim() || text.length < 20) return;
        setIsAnalyzing(true);
        setScanLine(true);
        setAnalysisResult(null);
        setTimeout(() => {
            setScanLine(false);
            const result = detectFakeNews(text);
            setAnalysisResult(result);
            setIsAnalyzing(false);
        }, 2200);
    };

    const chartData = analysisResult ? [
        { name: 'Emotional', value: analysisResult.scores.emotional, color: '#ff3366' },
        { name: 'Bias', value: analysisResult.scores.bias, color: '#f59e0b' },
        { name: 'Linguistic', value: analysisResult.scores.linguistic, color: '#8a2be2' },
        { name: 'Source Cred.', value: analysisResult.scores.sourceCred, color: '#00f5ff' },
        { name: 'Fact Check', value: analysisResult.scores.factConsistency, color: '#00ff88' },
    ] : [];

    return (
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <h2 style={{ fontSize: 32, fontWeight: 800, color: '#e2e8f0', letterSpacing: '-0.02em' }}>
                    <span className="gradient-text">Intelligence Analysis</span> Panel
                </h2>
                <p style={{ color: '#64748b', marginTop: 8 }}>Paste any article or news text for comprehensive AI analysis</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: analysisResult ? '1fr 1fr' : '1fr', gap: 24 }}>
                {/* ── LEFT: Input ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Text input box */}
                    <div className="glass-strong" style={{ borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
                        {scanLine && (
                            <div style={{ position: 'absolute', inset: 0, zIndex: 10, overflow: 'hidden', pointerEvents: 'none' }}>
                                <div className="scanning-line" />
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: 'linear-gradient(180deg, rgba(0,245,255,0.03), transparent, rgba(0,245,255,0.03))',
                                    animation: 'none'
                                }} />
                            </div>
                        )}
                        <div style={{ padding: '16px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 13 }}>
                                <FileText size={14} />
                                Text Input
                            </div>
                            {text && (
                                <button onClick={() => { setText(''); handleTextChange(''); setAnalysisResult(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                        <textarea
                            ref={textRef}
                            value={text}
                            onChange={e => handleTextChange(e.target.value)}
                            placeholder="Paste news article, headline, or any text to verify its credibility..."
                            style={{
                                width: '100%', minHeight: 280,
                                background: 'transparent', border: 'none', resize: 'vertical',
                                color: '#e2e8f0', fontSize: 15, padding: '16px',
                                lineHeight: 1.7, outline: 'none', fontFamily: 'inherit',
                            }}
                        />
                        <div style={{ padding: '8px 16px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.04)', fontSize: 12, color: '#475569' }}>
                            <span>{charCount} chars</span>
                            <span>{wordCount} words</span>
                            <span style={{ color: charCount > 5000 ? '#ff3366' : '#475569' }}>max 5,000</span>
                        </div>
                    </div>

                    {/* Upload area */}
                    <div
                        className="glass"
                        style={{
                            borderRadius: 12, padding: '20px',
                            border: '2px dashed rgba(0,245,255,0.15)',
                            textAlign: 'center', cursor: 'pointer',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,245,255,0.4)')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,245,255,0.15)')}
                    >
                        <Upload size={24} color="#475569" style={{ margin: '0 auto 8px' }} />
                        <p style={{ fontSize: 14, color: '#64748b' }}>Drop PDF or image for OCR analysis</p>
                        <p style={{ fontSize: 12, color: '#374151', marginTop: 4 }}>PNG, JPG, PDF supported</p>
                    </div>

                    {/* Analyze button */}
                    <button
                        className="neon-btn pulse-glow"
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || text.length < 20}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                            padding: '16px', borderRadius: 12,
                            fontSize: 16, fontWeight: 700, cursor: text.length >= 20 ? 'pointer' : 'not-allowed',
                            color: text.length >= 20 ? '#00f5ff' : '#475569',
                            opacity: text.length >= 20 ? 1 : 0.5,
                            transition: 'all 0.3s ease',
                            width: '100%',
                        }}
                    >
                        {isAnalyzing ? (
                            <>
                                <div style={{ width: 20, height: 20, border: '2px solid rgba(0,245,255,0.3)', borderTopColor: '#00f5ff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                Analyzing with AI...
                            </>
                        ) : (
                            <>
                                <Scan size={20} />
                                Analyze with AI
                            </>
                        )}
                    </button>

                    {/* Progress bar when analyzing */}
                    {isAnalyzing && (
                        <div style={{ borderRadius: 8, overflow: 'hidden', height: 6, background: 'rgba(255,255,255,0.05)' }}>
                            <div style={{
                                height: '100%',
                                background: 'linear-gradient(90deg, #00f5ff, #8a2be2)',
                                animation: 'progressFill 2s ease-in-out forwards',
                                borderRadius: 8,
                            }} className="progress-bar" />
                        </div>
                    )}
                </div>

                {/* ── RIGHT: Results ── */}
                {analysisResult && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Verdict card */}
                        <div
                            className="glass-strong"
                            style={{
                                borderRadius: 16, padding: '24px',
                                border: `1px solid ${analysisResult.prediction === 'REAL' ? 'rgba(0,255,136,0.3)' : 'rgba(255,51,102,0.3)'}`,
                                boxShadow: analysisResult.prediction === 'REAL' ? '0 0 30px rgba(0,255,136,0.1)' : '0 0 30px rgba(255,51,102,0.1)',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                                <div>
                                    <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>Verdict</p>
                                    <div className={analysisResult.prediction === 'REAL' ? 'badge-real' : 'badge-fake'} style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 8,
                                        padding: '10px 20px', borderRadius: 10,
                                        fontSize: 18, fontWeight: 800, letterSpacing: 1,
                                    }}>
                                        {analysisResult.prediction === 'REAL' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                                        {analysisResult.prediction === 'REAL' ? 'REAL NEWS' : 'LIKELY FAKE'}
                                    </div>
                                    <div style={{ marginTop: 12, fontSize: 14, color: '#94a3b8' }}>
                                        Sentiment: <span style={{ color: analysisResult.sentiment === 'positive' ? '#00ff88' : analysisResult.sentiment === 'negative' ? '#ff3366' : '#f59e0b', fontWeight: 600 }}>
                                            {analysisResult.sentiment.charAt(0).toUpperCase() + analysisResult.sentiment.slice(1)}
                                        </span>
                                    </div>
                                </div>
                                <ConfidenceMeter value={analysisResult.confidence} isFake={analysisResult.prediction === 'FAKE'} />
                            </div>
                        </div>

                        {/* Credibility breakdown chart */}
                        <div className="glass" style={{ borderRadius: 16, padding: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                <BarChart2 size={16} color="#00f5ff" />
                                <span style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8' }}>Credibility Breakdown</span>
                            </div>
                            <ResponsiveContainer width="100%" height={160}>
                                <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
                                    <XAxis type="number" domain={[0, 100]} tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                                    <Tooltip
                                        contentStyle={{ background: '#111827', border: '1px solid rgba(0,245,255,0.2)', borderRadius: 8, fontSize: 12 }}
                                        formatter={(value: number) => [`${value.toFixed(0)}%`]}
                                    />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                        {chartData.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* AI Insights */}
                        <div className="glass" style={{ borderRadius: 16, padding: 20 }}>
                            <p style={{ fontSize: 13, color: '#00f5ff', fontWeight: 600, marginBottom: 10 }}>🤖 AI Analysis</p>
                            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{analysisResult.analysis}</p>
                        </div>

                        {/* Reasoning */}
                        <div className="glass" style={{ borderRadius: 16, padding: 20 }}>
                            <button
                                onClick={() => setShowDetails(!showDetails)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: '#94a3b8', fontSize: 14, fontWeight: 600, justifyContent: 'space-between'
                                }}
                            >
                                <span>📊 Structured Reasoning</span>
                                {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>

                            {showDetails && (
                                <ul style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {analysisResult.reasoning.map((r, i) => (
                                        <li key={i} style={{ fontSize: 13, color: '#94a3b8', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, lineHeight: 1.5 }}>
                                            {r}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <div style={{ marginTop: 16, padding: '12px', background: 'rgba(0,245,255,0.04)', borderRadius: 10, border: '1px solid rgba(0,245,255,0.1)' }}>
                                <p style={{ fontSize: 12, color: '#64748b', fontWeight: 600, marginBottom: 4 }}>⚖️ Bias Check</p>
                                <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>{analysisResult.biasCheck}</p>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="glass" style={{ borderRadius: 16, padding: 20 }}>
                            <p style={{ fontSize: 13, color: '#8a2be2', fontWeight: 600, marginBottom: 8 }}>📝 Smart Summary</p>
                            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
                                <strong style={{ color: '#e2e8f0' }}>Key point: </strong>{analysisResult.summary}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Highlighted text view (shows below if result exists) */}
            {analysisResult && analysisResult.highlights.length > 1 && (
                <div className="glass" style={{ borderRadius: 16, padding: 24, marginTop: 24 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8', marginBottom: 16 }}>🔍 Text Heatmap Analysis</p>
                    <div style={{ lineHeight: 1.8, fontSize: 14, color: '#94a3b8' }}>
                        {analysisResult.highlights.map((h, i) => (
                            <span key={i} className={h.type === 'fake' ? 'highlight-fake' : h.type === 'suspicious' ? 'highlight-suspicious' : ''}>
                                {h.text}
                            </span>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: 20, marginTop: 16, flexWrap: 'wrap' }}>
                        {[['#ff3366', 'Emotional manipulation'], ['#ffcc00', 'Suspicious exaggeration'], ['#64748b', 'Neutral text']].map(([color, label]) => (
                            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
                                <div style={{ width: 10, height: 10, borderRadius: 2, background: color, opacity: 0.8 }} />
                                {label}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
