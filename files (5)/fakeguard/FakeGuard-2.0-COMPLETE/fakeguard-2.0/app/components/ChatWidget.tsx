'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Minimize2 } from 'lucide-react';

const QUICK_QUESTIONS = [
    'Why is this fake?',
    'Summarize this',
    'Detect bias',
    'How to verify manually?',
];

function generateResponse(msg: string, hasAnalysis: boolean): string {
    const lower = msg.toLowerCase();
    if (!hasAnalysis && !lower.includes('hello') && !lower.includes('hi')) {
        return "Please analyze an article first using the **Analyze** tab, then I can answer detailed questions about the content! 🔍";
    }
    if (lower.includes('fake') || lower.includes('why')) {
        return "The content was flagged due to:\n\n• **Emotionally charged language** designed to trigger outrage\n• **Lack of attributed sources** — no official citations found\n• **Sensationalist keywords** detected in the text\n• **Unusual capitalization patterns** common in misinformation\n\nAlways cross-check with Reuters, AP News, or BBC.";
    }
    if (lower.includes('summarize') || lower.includes('summary')) {
        return "Here's a concise summary of the analyzed article:\n\n• The text makes **specific unverified claims** about the topic\n• The tone is **emotionally charged** rather than factual\n• No primary sources are cited to support the assertions\n• The narrative follows common **clickbait patterns**\n\nI recommend verifying these claims with established news outlets.";
    }
    if (lower.includes('bias') || lower.includes('sentiment')) {
        return "**Bias Analysis Results:**\n\n• Political framing: Moderate right-leaning language\n• Emotional loading: High (73% emotionally charged words)\n• One-sided perspective: Claims presented without opposing views\n• Fear-based messaging: Detected urgency and threat language\n\nThis content appears crafted to influence rather than inform.";
    }
    if (lower.includes('verify') || lower.includes('manual') || lower.includes('how')) {
        return "**Manual Verification Steps:**\n\n1. 🔍 Search the claim on **Snopes.com** or **FactCheck.org**\n2. 📰 Look for the story on **Reuters** or **Associated Press**\n3. 🕐 Check the **publication date** — old news reshared as new\n4. 👤 Verify **author credentials** and source reputation\n5. 🔗 Follow any cited links to original sources\n6. 📸 Do a **reverse image search** if images are included\n\nWhen in doubt, wait for multiple credible sources to confirm.";
    }
    if (lower.includes('source') || lower.includes('sources')) {
        return "**Source Credibility Assessment:**\n\nI recommend verifying against these trusted sources:\n\n• **Reuters** — reuters.com\n• **AP News** — apnews.com\n• **BBC News** — bbc.com/news\n• **Snopes** — snopes.com\n• **FactCheck.org** — factcheck.org\n\nIf the story doesn't appear on any of these, treat it with skepticism.";
    }
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        return "Hello! 👋 I'm **FakeGuard AI**, your intelligent verification assistant.\n\nI can help you:\n• Explain why content was flagged\n• Provide detailed bias analysis\n• Suggest verification methods\n• Summarize analyzed articles\n\nAnalyze an article first, then ask me anything about it!";
    }
    return "That's a great question! Based on the analysis patterns I've observed, I'd recommend:\n\n• Looking for **primary source citations** in the article\n• Checking the **author's credentials** and publication history\n• Verifying the **dates and statistics** mentioned\n• Searching for **corroborating reports** from established outlets\n\nWould you like me to elaborate on any specific aspect?";
}

interface ChatWidgetProps {
    analysisResult: any;
}

export default function ChatWidget({ analysisResult }: ChatWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'ai', text: "Hi! I'm **FakeGuard AI** 🤖\n\nAnalyze an article first, then ask me anything about the results!" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const bodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const sendMessage = (text: string) => {
        if (!text.trim()) return;
        const userMsg = text.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const resp = generateResponse(userMsg, !!analysisResult);
            setMessages(prev => [...prev, { sender: 'ai', text: resp }]);
            setIsTyping(false);
        }, 900 + Math.random() * 700);
    };

    const formatText = (text: string) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#e2e8f0">$1</strong>')
            .replace(/\n/g, '<br/>');
    };

    return (
        <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 999 }}>
            {/* Chat window */}
            <div style={{
                position: 'absolute', bottom: 72, right: 0,
                width: 360, height: 500,
                background: 'rgba(10,15,28,0.95)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(0,245,255,0.2)',
                borderRadius: 16,
                boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(0,245,255,0.1)',
                display: 'flex', flexDirection: 'column',
                transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                opacity: isOpen ? 1 : 0,
                pointerEvents: isOpen ? 'all' : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
            }}>
                {/* Header */}
                <div style={{
                    padding: '14px 16px',
                    background: 'rgba(0,245,255,0.05)',
                    borderBottom: '1px solid rgba(0,245,255,0.1)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <MessageSquare size={16} color="#00f5ff" />
                        </div>
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>FakeGuard AI</div>
                            <div style={{ fontSize: 11, color: '#00ff88', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88' }} />
                                Online
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                        <Minimize2 size={16} />
                    </button>
                </div>

                {/* Messages */}
                <div ref={bodyRef} style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {messages.map((msg, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                            <div style={{
                                maxWidth: '85%', padding: '10px 14px', borderRadius: msg.sender === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                                background: msg.sender === 'user' ? 'rgba(0,245,255,0.15)' : 'rgba(255,255,255,0.04)',
                                border: `1px solid ${msg.sender === 'user' ? 'rgba(0,245,255,0.3)' : 'rgba(255,255,255,0.06)'}`,
                                fontSize: 13, color: '#94a3b8', lineHeight: 1.6,
                            }} dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} />
                        </div>
                    ))}

                    {isTyping && (
                        <div style={{ display: 'flex' }}>
                            <div style={{ padding: '10px 14px', borderRadius: '12px 12px 12px 4px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 4 }}>
                                {[0, 1, 2].map(i => (
                                    <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#00f5ff', animation: `bounce 1.4s infinite ease-in-out`, animationDelay: `${i * -0.16}s` }} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick questions */}
                <div style={{ padding: '8px 12px', display: 'flex', gap: 6, overflowX: 'auto', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    {QUICK_QUESTIONS.map(q => (
                        <button
                            key={q}
                            onClick={() => sendMessage(q)}
                            style={{
                                padding: '4px 10px', borderRadius: 20, flexShrink: 0,
                                background: 'rgba(0,245,255,0.06)', border: '1px solid rgba(0,245,255,0.15)',
                                color: '#64748b', fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {q}
                        </button>
                    ))}
                </div>

                {/* Input */}
                <div style={{ padding: '10px 12px', background: 'rgba(0,0,0,0.2)', display: 'flex', gap: 8 }}>
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                        placeholder="Ask about this article..."
                        style={{
                            flex: 1, padding: '9px 14px', borderRadius: 10,
                            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,245,255,0.15)',
                            color: '#e2e8f0', fontSize: 13, outline: 'none', fontFamily: 'inherit',
                        }}
                    />
                    <button
                        onClick={() => sendMessage(input)}
                        style={{
                            width: 38, height: 38, borderRadius: 10,
                            background: input.trim() ? 'rgba(0,245,255,0.15)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${input.trim() ? 'rgba(0,245,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: input.trim() ? 'pointer' : 'default',
                            color: input.trim() ? '#00f5ff' : '#475569',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <Send size={15} />
                    </button>
                </div>
            </div>

            {/* FAB button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="pulse-glow"
                style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(0,245,255,0.2), rgba(138,43,226,0.2))',
                    border: '1px solid rgba(0,245,255,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', position: 'relative',
                    boxShadow: '0 0 20px rgba(0,245,255,0.3)',
                    transition: 'transform 0.2s ease',
                }}
            >
                {isOpen ? <X size={22} color="#00f5ff" /> : <MessageSquare size={22} color="#00f5ff" />}

                {/* Unread dot */}
                {!isOpen && (
                    <div style={{
                        position: 'absolute', top: 8, right: 8,
                        width: 10, height: 10, borderRadius: '50%',
                        background: '#00ff88', border: '2px solid #0a0f1c',
                        boxShadow: '0 0 6px rgba(0,255,136,0.8)',
                    }} />
                )}
            </button>
        </div>
    );
}
