import React from 'react';

interface SuggestionChipProps {
    text: string;
    onClick?: () => void;
}

export const SuggestionChip: React.FC<SuggestionChipProps> = ({ text, onClick }) => {
    return (
        <button onClick={onClick} style={{
            padding: '10px 18px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '99px',
            color: 'var(--color-text-dim)',
            fontSize: '0.9rem',
            textAlign: 'left',
            transition: 'all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)',
            cursor: 'pointer',
            fontWeight: 500,
            backdropFilter: 'blur(5px)'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(74, 222, 128, 0.05)';
                e.currentTarget.style.borderColor = 'var(--color-prime)';
                e.currentTarget.style.color = 'var(--color-prime)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 222, 128, 0.1)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = 'var(--color-text-dim)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            {text}
        </button>
    );
};
