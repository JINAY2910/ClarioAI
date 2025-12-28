import { useState } from 'react'
import { Layout } from './components/Layout'
import { Hero } from './components/Hero'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Hero />;
      case 'history':
        return <div className="flex items-center justify-center h-full text-secondary">History Limit Reached</div>;
      case 'settings':
        return <div className="flex items-center justify-center h-full text-secondary">Settings Unavailable</div>;
      default:
        return <Hero />;
    }
  };

  return (
    <Layout activeTab={activeTab} onNavigate={setActiveTab}>
      {renderContent()}
    </Layout>
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
