import React from 'react';

interface DetailTileProps {
    label: string;
    value: string;
    subtext?: string;
    color?: string;
}

export const DetailTile: React.FC<DetailTileProps> = ({ label, value, subtext, color = 'var(--color-text)' }) => {
    return (
        <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            transition: 'transform 0.2s',
            cursor: 'default'
        }}>
            <span style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--color-text-dim)',
                marginBottom: '4px'
            }}>
                {label}
            </span>
            <div style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: color,
                marginBottom: subtext ? '2px' : '0'
            }}>
                {value}
            </div>
            {subtext && (
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
                    {subtext}
                </span>
            )}
        </div>
    );
};
