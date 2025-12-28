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
    <div className="flex h-screen w-full overflow-hidden bg-background text-primary selection:bg-surface selection:text-white">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 md:hidden bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          {/* Mobile Logo Placeholder */}
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <span className="text-black font-bold text-xs">CA</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">ClarioAI</span>
        </div>
        <button onClick={() => setMobileMenuOpen(true)}>
          <Menu className="w-6 h-6 text-secondary" />
        </button>
      </div>

      {/* Sidebar (Desktop) & Mobile Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-sidebar-bg border-r border-white/5 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 bg-surface/50 backdrop-blur-xl
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-8 md:justify-center">
            {/* Desktop Logo */}
            <div className="hidden md:flex items-center gap-2">
              {/* Using IMG if available, else text */}
              <img src="/clarioAI.png" alt="ClarioAI" className="w-8 h-8 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
              <span className="text-xl font-bold tracking-tighter hidden md:block">ClarioAI</span>
            </div>

            <button onClick={() => setMobileMenuOpen(false)} className="md:hidden">
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

          <div className="mt-auto pt-4 border-t border-white/5">
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-purple-500" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">User</span>
                <span className="text-xs text-secondary">Pro Plan</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative pt-16 md:pt-0">
        {children}
      </main>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};
