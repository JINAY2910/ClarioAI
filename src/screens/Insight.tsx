import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
// import { ProductChip } from '../components/ProductChip'; // Removing standard chip for new header
import { ReasoningCard } from '../components/ReasoningCard';
import { SuggestionChip } from '../components/SuggestionChip';
import { DetailTile } from '../components/DetailTile';

interface InsightProps {
    onReset: () => void;
    onBack?: () => void; // Explicit back handler
}

export const Insight: React.FC<InsightProps> = ({ onReset, onBack }) => {
    const [analyzing, setAnalyzing] = useState(true);

    useEffect(() => {
        // Simulate thinking time
        const timer = setTimeout(() => setAnalyzing(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (analyzing) {
        return (
            <Layout>
                <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: '16px'
                }}>
                    <div className="pulse-scan" style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '24px',
                        background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.2), rgba(74, 222, 128, 0.05))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(74, 222, 128, 0.3)'
                    }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-prime)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                    </div>
                    <p style={{ color: 'var(--color-prime)', fontSize: '1rem', marginTop: '24px', textAlign: 'center', opacity: 0.9 }}>
                        Analyzing nutrition profile...
                    </p>
                    <style>{`
            @keyframes spin { 100% { transform: rotate(360deg); } }
            .pulse-scan svg { animation: spin 2s linear infinite; }
          `}</style>
                </div>
            </Layout>
        );
    }

    return (
        <Layout disableScroll={false} style={{ paddingTop: '12px' }}>

            {/* Simple Top Left Back Button - Moved Outside Main Container to avoid Gap issues */}
            <div className="mobile-back-container">
                <button
                    onClick={onBack || onReset}
                    className="insight-back-btn"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5" />
                        <path d="M12 19l-7-7 7-7" />
                    </svg>
                    Back to Dashboard
                </button>
            </div>

            {/* Main Content Scrollable Area */}
            <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '40px' }}>

                {/* Section 1: Header & Score Hero */}
                <div style={{ animation: 'slideUp 0.6s ease-out' }}>
                    {/* Header Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                                {/* Placeholder Product Image */}
                                <div style={{ width: '100%', height: '100%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🍫</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#A1A1AA', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scanned</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#FFF' }}>Organic Granola Bar</div>
                            </div>
                        </div>
                    </div>

                    {/* Score Card */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'var(--color-card-bg)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '24px',
                        padding: '24px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Background Spline Glow */}
                        <div style={{
                            position: 'absolute',
                            top: '-50%',
                            right: '-20%',
                            width: '200px',
                            height: '200px',
                            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, transparent 70%)',
                            filter: 'blur(30px)',
                            zIndex: 0
                        }} />

                        <div style={{ position: 'relative', zIndex: 1, maxWidth: '65%' }}>
                            <h1 style={{
                                fontSize: '1.75rem',
                                fontWeight: 800,
                                lineHeight: '1.2',
                                marginBottom: '8px',
                                color: '#FFF'
                            }}>
                                Occasional Snack
                            </h1>
                            <p style={{ fontSize: '0.95rem', color: '#A1A1AA' }}>
                                Respectable ingredients, but high in sugar. Good for energy bursts.
                            </p>
                        </div>

                        {/* Visual Grade */}
                        <div style={{
                            position: 'relative',
                            zIndex: 1,
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            border: '4px solid rgba(251, 191, 36, 0.3)', // Color Warn
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(0,0,0,0.2)'
                        }}>
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: 800,
                                color: 'var(--color-warn)'
                            }}>
                                B
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Nutrition Grid (The Details) */}
                <div style={{ animation: 'slideUp 0.6s ease-out 0.1s backwards' }}>
                    <h3 style={{ fontSize: '1rem', color: '#FFF', marginBottom: '16px', opacity: 0.9 }}>Key Metrics</h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '12px'
                    }}>
                        <DetailTile label="Sugar" value="12g" subtext="High (24% DV)" color="var(--color-warn)" />
                        <DetailTile label="Protein" value="4g" subtext="Moderate" color="var(--color-prime)" />
                        <DetailTile label="Processing" value="65%" subtext="Ultra-processed" color="#A1A1AA" />
                        <DetailTile label="Calories" value="180" subtext="Per serving" />
                    </div>
                </div>

                {/* Section 3: Reasoning Cards */}
                <div style={{ animation: 'slideUp 0.6s ease-out 0.2s backwards' }}>
                    <h3 style={{ fontSize: '1rem', color: '#FFF', marginBottom: '16px', opacity: 0.9 }}>Analysis</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <ReasoningCard
                            type="warning"
                            title="High Added Sugar"
                            description="2nd ingredient is Cane Sugar."
                            icon={<span style={{ fontSize: '18px' }}>⚠️</span>}
                        />
                        <ReasoningCard
                            type="positive"
                            title="No Palm Oil"
                            description="Uses Sunflower Oil instead."
                            icon={<span style={{ fontSize: '18px' }}>✅</span>}
                        />
                    </div>
                </div>

                {/* Section 4: Follow-up Prompts */}
                <div style={{ animation: 'slideUp 0.6s ease-out 0.3s backwards' }}>
                    <h3 style={{ fontSize: '1rem', color: '#FFF', marginBottom: '16px', opacity: 0.9 }}>Ask AI</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        <SuggestionChip text="Is this safe for kids?" />
                        <SuggestionChip text="Healthier alternatives?" />
                        <SuggestionChip text="Ask something else?" />
                    </div>
                </div>

            </div>

            <style>{`
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </Layout>
    );
};
