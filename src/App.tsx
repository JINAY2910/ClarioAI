import { useState } from 'react'
import { Layout } from './components/Layout'
import { Homepage } from './components/Homepage'
import { AnalysisChat } from './components/AnalysisChat';
import { type AnalysisData } from './components/AnalysisResult';

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
        return <Homepage onAnalysisComplete={handleAnalysisComplete} />;
      case 'results':
        return analysisData ? (
          <AnalysisChat data={analysisData} onReset={handleBackToHome} />
        ) : (
          <div className="flex items-center justify-center h-full text-secondary">No analysis data</div>
        );
      case 'history':
        return (
          <div className="flex flex-col items-center justify-center h-full text-secondary gap-4">
            <span>History Limit Reached</span>
            <button
              onClick={() => setActiveTab('home')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors text-sm"
            >
              Back to Home
            </button>
          </div>
        );
      case 'settings':
        return <div className="flex items-center justify-center h-full text-secondary">Settings Unavailable</div>;
      default:
        return <Homepage onAnalysisComplete={handleAnalysisComplete} />;
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
    <AppContent />
  )
}

export default App
