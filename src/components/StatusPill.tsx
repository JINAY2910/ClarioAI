import React from 'react';

export const StatusPill: React.FC = () => {
    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--radius-full)',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--color-text)',
            border: '1px solid var(--color-card-border)'
        }}>
            <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-prime)',
                boxShadow: '0 0 8px var(--color-prime)'
            }} />
            AI Co-Pilot Active
        </div>
    );
};
