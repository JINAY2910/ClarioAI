import { useState } from 'react'
import { Layout } from './components/Layout'
import { Homepage } from './components/Homepage'
import { AnalysisChat } from './components/AnalysisChat';
import { type AnalysisData } from './components/AnalysisResult';
import { HistoryView } from './components/HistoryView';
import { historyService } from './services/history';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const handleAnalysisComplete = (data: AnalysisData) => {
    historyService.save(data);
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
          <HistoryView
            onSelect={(data) => {
              setAnalysisData(data);
              setActiveTab('results');
            }}
            onBack={() => setActiveTab('home')}
          />
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
