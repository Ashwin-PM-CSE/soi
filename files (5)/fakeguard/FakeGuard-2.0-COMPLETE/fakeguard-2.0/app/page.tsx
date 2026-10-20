'use client';

import { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import AnalysisPanel from './components/AnalysisPanel';
import Dashboard from './components/Dashboard';
import ChatWidget from './components/ChatWidget';
import LoginPage from './components/LoginPage';

type Tab = 'home' | 'analyze' | 'dashboard' | 'login';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  return (
    <div
      className="cyber-grid"
      style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0f1c 0%, #111827 50%, #0d1424 100%)' }}
    >
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Page content */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        {activeTab === 'home' && (
          <>
            <HeroSection setActiveTab={setActiveTab} />
            <FeaturesSection />
          </>
        )}

        {activeTab === 'analyze' && (
          <AnalysisPanel
            analysisResult={analysisResult}
            setAnalysisResult={setAnalysisResult}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard />
        )}

        {activeTab === 'login' && (
          <LoginPage setActiveTab={setActiveTab} />
        )}
      </main>

      {/* Floating chat widget always visible */}
      <ChatWidget analysisResult={analysisResult} />

      {/* Footer */}
      {activeTab === 'home' && (
        <footer style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          padding: '24px 2rem',
          textAlign: 'center',
          color: '#374151',
          fontSize: 13,
          position: 'relative',
          zIndex: 1,
        }}>
          <span>© 2026 FakeGuard 2.0 — </span>
          <span className="gradient-text" style={{ fontWeight: 600 }}>AI-Powered Truth Engine</span>
          <span> · Built with ❤️ for a misinformation-free world</span>
        </footer>
      )}
    </div>
  );
}
