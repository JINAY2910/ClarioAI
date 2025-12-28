import { useState } from 'react'
import { Layout } from './components/Layout'
import { Hero } from './components/Hero'
import { AnalysisChat } from './components/AnalysisChat';
import { type AnalysisData } from './components/AnalysisResult';
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const handleAnalysisComplete = (data: AnalysisData) => {
    setAnalysisData(data);
    setActiveTab('results');
  };

  const handleBackToHome = () => {
    setAnalysisData(null);
    setActiveTab('home');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Hero onAnalysisComplete={handleAnalysisComplete} />;
      case 'results':
        return analysisData ? (
          <AnalysisChat data={analysisData} onReset={handleBackToHome} />
        ) : (
          <div className="flex items-center justify-center h-full text-secondary">No analysis data</div>
        );
      case 'history':
        return <div className="flex items-center justify-center h-full text-secondary">History Limit Reached</div>;
      case 'settings':
        return <div className="flex items-center justify-center h-full text-secondary">Settings Unavailable</div>;
      default:
        return <Hero onAnalysisComplete={handleAnalysisComplete} />;
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
