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
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-zinc-950/70 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 md:px-6 transition-all duration-300">
        {/* Logo / Home Link */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1.5 group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <img src="/logo.png" alt="ClarioAI" className="w-8 h-8 object-contain relative z-10" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            ClarioAI
          </span>
        </button>

        <div className="flex items-center gap-2">
          {(activeTab === 'results' || activeTab === 'history') && (
            <button
              onClick={() => onNavigate('home')}
              className="p-2.5 rounded-full hover:bg-white/10 active:bg-white/20 text-white/70 hover:text-white transition-all flex items-center gap-2 backdrop-blur-md"
              title="Back to Dashboard"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          )}
          {/* History Button - Only show on home or results (not history tab itself) */}
          {activeTab !== 'history' && (
            <button
              onClick={() => onNavigate('history')}
              className="p-2.5 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 active:bg-white/10 active:scale-95 text-white/70 hover:text-emerald-400 transition-all backdrop-blur-md group shadow-sm shadow-black/20"
              title="History"
            >
              <Clock className="w-5 h-5 transition-transform group-hover:rotate-12" />
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative w-full pt-16">
        {children}
      </main>

    </div>
  );
};
