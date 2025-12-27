import React from 'react';

interface SidebarProps {
    activeTab: string;
    onNavigate: (tab: string) => void;
    onLogout: () => void;
    user?: { name: string; avatar?: string };
    hideLogo?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onNavigate, onLogout, user, hideLogo }) => {
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
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                        )}
                        <span style={{ fontWeight: 500 }}>{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* User Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--color-card-border)' }}>
                <img src={user?.avatar} alt="User" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
                    <button onClick={onLogout} style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', textAlign: 'left' }}>Sign Out</button>
                </div>
            </div>
        </div>
    );
};
