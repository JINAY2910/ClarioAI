import React from 'react';
import { useData } from '../context/DataContext';

export const History: React.FC = () => {
    const { recentScans } = useData();

    if (recentScans.length === 0) {
        return (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-dim)' }}>
                <p>No scans yet. Start exploring!</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>Recent Scans</h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px'
            }}>
                {recentScans.map((product, index) => (
                    <div key={index} style={{
                        background: 'var(--color-card-bg)',
                        border: '1px solid var(--color-card-border)',
                        borderRadius: '24px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        transition: 'transform 0.2s',
                        cursor: 'pointer'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#333' }} />
                            <div>
                                <h3 style={{ fontSize: '1rem' }}>{product.name}</h3>
                                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>Today</span>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-dim)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {product.summary}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
