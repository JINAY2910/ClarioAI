import React from 'react';

interface ScanButtonProps {
    onClick: () => void;
}

export const ScanButton: React.FC<ScanButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 0 60px rgba(74, 222, 128, 0.1), inset 0 0 20px rgba(255,255,255,0.05)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 0 80px rgba(74, 222, 128, 0.2), inset 0 0 30px rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.5)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 0 60px rgba(74, 222, 128, 0.1), inset 0 0 20px rgba(255,255,255,0.05)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
            }}
        >
            {/* Inner Core */}
            <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #4ade80, transparent)',
                opacity: 0.8,
                filter: 'blur(15px)',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                animation: 'orb-breathe 4s infinite ease-in-out'
            }} />

            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ zIndex: 1, opacity: 0.9 }}>
                <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
            </svg>

            <style>{`
        @keyframes orb-breathe {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
            50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
        }
      `}</style>
        </button>
    );
};
