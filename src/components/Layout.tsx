import React, { useState } from 'react';
import { Home, Clock, Settings, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'history', icon: Clock, label: 'History' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background text-primary selection:bg-surface selection:text-white">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4 md:hidden bg-background border-b border-white/5">
        <div className="flex items-center gap-2">
          {/* Mobile Logo */}
          <img src="/logo.png" alt="ClarioAI" className="w-8 h-8 object-contain" />
          <span className="text-lg font-semibold tracking-tight">ClarioAI</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        >
          <Menu className="w-6 h-6 text-secondary" />
        </button>
      </div>

      {/* Sidebar (Desktop) & Mobile Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 bg-surface border-r border-white/5
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-4 relative z-10">
          <div className="flex items-center justify-between mb-8">
            {/* Desktop Logo */}
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="ClarioAI" className="w-8 h-8 object-contain" />
              <span className="text-xl font-bold tracking-tighter hidden md:block">ClarioAI</span>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-all"
            >
              <X className="w-6 h-6 text-secondary" />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`
                  flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200
                  ${activeTab === item.id
                    ? 'bg-white/10 text-white shadow-lg shadow-white/5'
                    : 'text-secondary hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative pt-16 md:pt-0">
        {children}
      </main>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden cursor-pointer animate-in fade-in duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};
