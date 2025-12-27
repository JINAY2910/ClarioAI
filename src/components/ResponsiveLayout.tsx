import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { useAuth } from '../context/AuthContext';

interface ResponsiveLayoutProps {
    children: React.ReactNode;
    activeTab: string;
    onNavigate: (tab: string) => void;
    isMobileMenuOpen?: boolean;
    onCloseMobileMenu?: () => void;
    onOpenMobileMenu?: () => void;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
    children,
    activeTab,
    onNavigate,
    isMobileMenuOpen,
    onCloseMobileMenu,
    onOpenMobileMenu
}) => {
    const { user, logout } = useAuth();
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth > 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Desktop Layout
    if (isDesktop) {
        return (
            <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
                <Sidebar activeTab={activeTab} onNavigate={onNavigate} onLogout={logout} user={user || { name: 'User' }} />
                <main style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
                    {children}
                </main>
            </div>
        );
    }

    // Mobile Layout
    return (
        <>
            {/* Mobile Header - ALWAYS VISIBLE */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '70px', // Slightly taller for better touch targets
                padding: '0 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between', // Push items to edges
                zIndex: 200, // Header stays ON TOP of the sidebar overlay (z=100)
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(0,0,0,0.8), transparent)',
                pointerEvents: 'none'
            }}>
                {/* Hamburger / Close Button (Left) */}
                <button
                    onClick={isMobileMenuOpen ? onCloseMobileMenu : onOpenMobileMenu}
                    style={{
                        pointerEvents: 'auto',
                        background: isMobileMenuOpen ? 'var(--color-prime)' : 'rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(10px)',
                        border: isMobileMenuOpen ? 'none' : '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        padding: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: isMobileMenuOpen ? 'var(--color-bg)' : 'var(--color-text)',
                        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                >
                    {isMobileMenuOpen ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    )}
                </button>

                {/* Brand Logo (Right) - Static Icon */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'auto',
                    width: '46px',
                    height: '46px'
                }}>
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
            </div>

            {/* Content Padding for Header - Fix cut off content */}
            <div style={{ paddingTop: '90px' }}>
                {children}
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 100,
                    display: 'flex'
                }}>
                    {/* Backdrop */}
                    <div
                        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}
                        onClick={onCloseMobileMenu}
                    />

                    {/* Sidebar */}
                    <div style={{
                        position: 'relative',
                        width: '80%',
                        maxWidth: '300px',
                        height: '100%',
                        background: 'var(--color-bg)',
                        borderRight: '1px solid var(--color-card-border)',
                        animation: 'slideRight 0.3s ease-out'
                    }}>
                        <Sidebar
                            activeTab={activeTab}
                            onNavigate={(tab) => {
                                onNavigate(tab);
                                onCloseMobileMenu?.();
                            }}
                            onLogout={logout}
                            user={user || { name: 'User' }}
                            hideLogo={true} // Hide redundant logo in mobile sidebar
                        />
                    </div>
                </div>
            )}
            <style>{`
                @keyframes slideRight { from { transform: translateX(-100%); } to { transform: translateX(0); } }
            `}</style>
        </>
    );
};
