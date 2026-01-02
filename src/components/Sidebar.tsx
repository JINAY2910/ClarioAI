import React from 'react';

interface SidebarProps {
    activeTab: string;
    onNavigate: (tab: string) => void;
    hideLogo?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onNavigate, hideLogo }) => {
    const menuItems = [
        { id: 'home', label: 'Dashboard', icon: '🏠' },
        { id: 'history', label: 'History', icon: 'clock' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <div style={{
            width: '280px',
            height: '100vh',
            background: 'var(--color-sidebar-bg)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid var(--color-card-border)',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
            position: 'sticky',
            top: 0
        }}>
            {/* Brand - Conditionally Hidden */}
            {!hideLogo && (
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <img src="/logo.png" alt="Encode Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                </div>
            )}

            {/* Spacer if logo hidden to align menu */}
            {hideLogo && <div style={{ height: '80px' }} />}

            {/* Menu */}
            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        style={{
                            padding: '12px 16px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            background: activeTab === item.id ? 'var(--color-card-bg)' : 'transparent',
                            color: activeTab === item.id ? 'var(--color-text)' : 'var(--color-text-dim)',
                            border: activeTab === item.id ? '1px solid var(--color-card-border)' : '1px solid transparent',
                            textAlign: 'left',
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                        }}
                    >
                        {/* Simple icon logic */}
                        {item.id === 'home' && (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
                        )}
                        {item.id === 'history' && (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        )}
                        {item.id === 'settings' && (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" /></svg>
                        )}
                        <span style={{ fontWeight: 500 }}>{item.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};
