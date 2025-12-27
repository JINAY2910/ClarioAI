import { useState } from 'react'
import { Home } from './screens/Home'
import { Insight } from './screens/Insight'
import { Login } from './screens/Login'
import { History } from './screens/History'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { ResponsiveLayout } from './components/ResponsiveLayout'

const AppContent = () => {
  const { user } = useAuth();
  // Tabs: 'home' (dashboard), 'history', 'settings'
  // Sub-states: 'insight' is a view within 'home' tab
  const [activeTab, setActiveTab] = useState('home');
  const [view, setView] = useState<'scan' | 'insight'>('scan');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) {
    return <Login />;
  }

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') setView('scan'); // Reset home to scan view
  };

  const renderContent = () => {
    if (activeTab === 'history') return <History />;
    if (activeTab === 'settings') return <div style={{ padding: '24px' }}>Settings Coming Soon</div>;

    // Home Tab
    return view === 'scan'
      ? <Home onScan={() => setView('insight')} />
      : <Insight onReset={() => setView('scan')} onBack={() => setView('scan')} />;
  };

  return (
    <ResponsiveLayout
      activeTab={activeTab}
      onNavigate={handleNavigate}
      isMobileMenuOpen={mobileMenuOpen}
      onCloseMobileMenu={() => setMobileMenuOpen(false)}
      onOpenMobileMenu={() => setMobileMenuOpen(true)}
    >
      {renderContent()}
    </ResponsiveLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  )
}

export default App
