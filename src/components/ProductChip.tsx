import React from 'react';

interface ProductChipProps {
    name: string;
    image?: string; // URL or placeholder color
}

export const ProductChip: React.FC<ProductChipProps> = ({ name, image }) => {
    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 16px 8px 8px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--color-card-border)'
        }}>
            <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: image ? `url(${image})` : '#333',
                backgroundSize: 'cover',
                border: '1px solid rgba(255,255,255,0.2)'
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '12px', color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scanned</span>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{name}</span>
            </div>
        </div>
    );
};
