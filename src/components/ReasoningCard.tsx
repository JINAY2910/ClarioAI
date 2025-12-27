import React from 'react';

export type ReasoningType = 'warning' | 'positive' | 'neutral';

interface ReasoningCardProps {
    type: ReasoningType;
    title: string;
    description: string;
    icon: React.ReactNode;
}

export const ReasoningCard: React.FC<ReasoningCardProps> = ({ type, title, description, icon }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    let color = 'var(--color-text-dim)';
    if (type === 'positive') color = 'var(--color-prime)';
    if (type === 'warning') color = 'var(--color-warn)';

    return (
        <div style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px',
            padding: '20px',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: isOpen ? `0 8px 32px -8px ${color === 'var(--color-prime)' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(0,0,0,0.3)'}` : 'none'
        }}
            onClick={() => setIsOpen(!isOpen)}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
            }}
        >
            {/* Colored Glow Edge (Left) */}
            <div style={{
                position: 'absolute',
                top: 0, bottom: 0, left: 0,
                width: '4px',
                background: color,
                opacity: 0.8
            }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    {/* Icon Container with Glow */}
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: color,
                        background: type === 'positive' ? 'rgba(74, 222, 128, 0.1)' :
                            type === 'warning' ? 'rgba(251, 191, 36, 0.1)' :
                                'rgba(255,255,255,0.05)',
                        flexShrink: 0
                    }}>
                        {icon}
                    </div>

                    <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '6px', color: 'var(--color-text)' }}>{title}</h3>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.4', color: 'var(--color-text-dim)' }}>
                            {description}
                        </p>
                    </div>
                </div>

                {/* Chevron */}
                <div style={{
                    paddingTop: '8px',
                    color: 'var(--color-text-dim)',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </div>
            </div>

            {/* Expandable Content */}
            <div style={{
                maxHeight: isOpen ? '150px' : '0',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: isOpen ? 1 : 0
            }}>
                <div style={{
                    marginTop: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                    color: '#D4D4D8'
                }}>
                    This analysis is based on the ingredient list and nutritional values.
                    {type === 'warning' ? ' Moderation is advised.' : ' This fits well within a balanced diet.'}
                </div>
            </div>
        </div>
    );
};
