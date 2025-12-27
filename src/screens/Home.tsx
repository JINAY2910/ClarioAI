import React from 'react';
import { Layout } from '../components/Layout';
import { ScanButton } from '../components/ScanButton';
import { Input } from '../components/Input';

interface HomeProps {
    onScan: () => void;
}

export const Home: React.FC<HomeProps> = ({ onScan }) => {
    return (
        <Layout disableScroll>

            {/* Main Content */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between', // Distribute space evenly
                padding: '20px 0', // Vertical breathing room within strict limits
                textAlign: 'center',
                width: '100%',
                maxWidth: '600px',
                margin: '0 auto',
                zIndex: 1,
                height: '100%' // Take full height of parent
            }}>

                {/* Hero Typography */}
                <div style={{ animation: 'fadeIn 0.8s ease-out', position: 'relative', width: '100%', marginTop: 'auto' }}>
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 7vw, 5rem)', // Slightly smaller min for mobile safety
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        lineHeight: 1,
                        background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '8px', // Reduced margin
                        whiteSpace: 'nowrap',
                        filter: 'drop-shadow(0 0 30px rgba(255,255,255,0.1))'
                    }}>
                        Decide Better.
                    </h1>
                    <p style={{
                        fontSize: 'clamp(0.9rem, 2vw, 1.25rem)',
                        color: '#A1A1AA',
                        letterSpacing: '-0.02em',
                        fontWeight: 500,
                        whiteSpace: 'nowrap'
                    }}>
                        AI that sees what you eat.
                    </p>
                </div>

                {/* The Portal (Scan Orb) */}
                <div style={{ position: 'relative', zIndex: 10, margin: '20px 0' }}>
                    <div style={{
                        position: 'absolute',
                        inset: -30, // Tighter glow
                        background: 'radial-gradient(circle, rgba(74, 222, 128, 0.1) 0%, transparent 70%)',
                        animation: 'pulse-slow 6s ease-in-out infinite',
                        borderRadius: '50%',
                        zIndex: -1
                    }} />
                    <ScanButton onClick={onScan} />
                </div>

                {/* Floating Context Pill */}
                <div style={{
                    animation: 'slideUp 1s ease-out 0.2s backwards',
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'var(--radius-full)',
                    padding: '8px 20px 8px 6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    maxWidth: '90%',
                    marginBottom: 'auto' // Push towards center
                }}>
                    <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem'
                    }}>
                        ☕️
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)' }}>Last: Oat Milk Latte</div>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Low sugar • Good choice</div>
                    </div>
                </div>

                <style>{`
                    @keyframes pulse-slow {
                        0%, 100% { transform: scale(1); opacity: 0.3; }
                        50% { transform: scale(1.3); opacity: 0.6; }
                    }
                    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                `}</style>
            </div>

            {/* Bottom Bar */}
            <Input />
        </Layout >
    );
};
