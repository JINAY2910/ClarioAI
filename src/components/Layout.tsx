import React from 'react';
import { Clock, LayoutGrid } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onNavigate }) => {

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background text-primary selection:bg-surface selection:text-white relative flex-col">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 md:px-6">
        {/* Logo / Home Link */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <img src="/logo.png" alt="ClarioAI" className="w-8 h-8 object-contain" />
          <span className="text-lg font-semibold tracking-tight text-white">ClarioAI</span>
        </button>

        <div className="flex items-center gap-2">
          {activeTab === 'results' && (
            <button
              onClick={() => onNavigate('home')}
              className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors flex items-center gap-2"
              title="Back to Dashboard"
            >
              <LayoutGrid className="w-6 h-6" />
            </button>
          )}
          {/* History Button */}
          <button
            onClick={() => onNavigate('history')}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            title="History"
          >
            <Clock className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative w-full pt-16">
        {children}
      </main>

    </div>
  );
};
