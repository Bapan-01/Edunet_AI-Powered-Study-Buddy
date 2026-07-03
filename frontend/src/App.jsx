import React, { useState, useEffect } from 'react';
import { Sparkles, GraduationCap, AlertCircle, FileText, Lightbulb, RotateCw, HelpCircle } from 'lucide-react';
import StudyInput from './components/StudyInput';
import SummaryView from './components/SummaryView';
import ConceptsView from './components/ConceptsView';
import QuizView from './components/QuizView';
import FlashcardsView from './components/FlashcardsView';

const BACKEND_URL = 'https://study-buddy-backend-fiej.onrender.com';

function App() {
  const [studyData, setStudyData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [backendHealth, setBackendHealth] = useState({ online: false, keyConfigured: false });
  const [checkingHealth, setCheckingHealth] = useState(true);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      setCheckingHealth(true);
      const res = await fetch(`${BACKEND_URL}/api/health`);
      if (res.ok) {
        const data = await res.json();
        setBackendHealth({ online: true, keyConfigured: data.gemini_api_key_configured });
      } else {
        setBackendHealth({ online: false, keyConfigured: false });
      }
    } catch (err) {
      setBackendHealth({ online: false, keyConfigured: false });
    } finally {
      setCheckingHealth(false);
    }
  };

  const handleStudySubmit = async ({ type, data }) => {
    setIsLoading(true);
    setError(null);
    setStudyData(null);

    try {
      let response;
      if (type === 'text') {
        response = await fetch(`${BACKEND_URL}/api/study-text`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: data })
        });
      } else {
        const formData = new FormData();
        formData.append('file', data);
        response = await fetch(`${BACKEND_URL}/api/study-pdf`, {
          method: 'POST',
          body: formData
        });
      }

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'An error occurred while generating study materials.');
      }

      const result = await response.json();
      setStudyData(result);
      setActiveTab('summary');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to connect to the backend server. Make sure FastAPI is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-section">
          <div className="logo-icon">
            <GraduationCap size={24} />
          </div>
          <h1 className="app-title">AI Study Buddy</h1>
        </div>
        
        <div className="api-status" onClick={checkHealth} style={{ cursor: 'pointer' }} title="Click to refresh status">
          <span className={`status-dot ${backendHealth.online && backendHealth.keyConfigured ? 'active' : ''}`}></span>
          <span>
            {checkingHealth 
              ? 'Checking status...' 
              : !backendHealth.online 
                ? 'Backend Offline' 
                : !backendHealth.keyConfigured 
                  ? 'API Key Missing' 
                  : 'Ready'}
          </span>
        </div>
      </header>

      {/* Warning banner for missing configuration */}
      {backendHealth.online && !backendHealth.keyConfigured && (
        <div className="error-message">
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Missing Gemini API Key:</strong> Please create a file named <code>.env</code> in the <code>backend/</code> directory and add your key:
            <pre style={{ marginTop: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>
              GEMINI_API_KEY=your_actual_key_here
            </pre>
            After adding the key, restart your FastAPI server and refresh this page.
          </div>
        </div>
      )}

      <main className="main-grid">
        {/* Left Input Section */}
        <StudyInput onSubmit={handleStudySubmit} isLoading={isLoading} />

        {/* Right Dashboard/Results Section */}
        <div className="dashboard-panel">
          {isLoading ? (
            <div className="loading-card">
              <div className="spinner"></div>
              <p className="loading-text">Generating Study Materials...</p>
              <p className="loading-subtext">Gemini is summarizing, simplifying concepts, writing quiz questions, and building flashcards.</p>
            </div>
          ) : error ? (
            <div className="welcome-card" style={{ border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <div className="welcome-icon-wrapper" style={{ color: 'var(--accent-error)', background: 'rgba(239, 68, 68, 0.05)' }}>
                <AlertCircle size={32} />
              </div>
              <h3 className="welcome-title" style={{ color: '#fca5a5' }}>Something went wrong</h3>
              <p className="welcome-desc">{error}</p>
              <button 
                className="restart-quiz-btn" 
                onClick={() => { setError(null); checkHealth(); }}
                style={{ marginTop: '1rem' }}
              >
                Try Again
              </button>
            </div>
          ) : studyData ? (
            <>
              {/* Tab Navigation */}
              <nav className="dashboard-nav">
                <button
                  className={`nav-btn ${activeTab === 'summary' ? 'active' : ''}`}
                  onClick={() => setActiveTab('summary')}
                >
                  <FileText size={16} />
                  Summary
                </button>
                <button
                  className={`nav-btn ${activeTab === 'concepts' ? 'active' : ''}`}
                  onClick={() => setActiveTab('concepts')}
                >
                  <Lightbulb size={16} />
                  Key Concepts
                </button>
                <button
                  className={`nav-btn ${activeTab === 'flashcards' ? 'active' : ''}`}
                  onClick={() => setActiveTab('flashcards')}
                >
                  <RotateCw size={16} />
                  Flashcards
                </button>
                <button
                  className={`nav-btn ${activeTab === 'quiz' ? 'active' : ''}`}
                  onClick={() => setActiveTab('quiz')}
                >
                  <HelpCircle size={16} />
                  Practice Quiz
                </button>
              </nav>

              {/* Tab Contents */}
              <div className="tab-content">
                {activeTab === 'summary' && (
                  <SummaryView summary={studyData.summary} />
                )}
                {activeTab === 'concepts' && (
                  <ConceptsView concepts={studyData.difficult_concepts} />
                )}
                {activeTab === 'flashcards' && (
                  <FlashcardsView flashcards={studyData.flashcards} />
                )}
                {activeTab === 'quiz' && (
                  <QuizView quiz={studyData.quiz} />
                )}
              </div>
            </>
          ) : (
            <div className="welcome-card">
              <div className="welcome-icon-wrapper">
                <GraduationCap size={32} />
              </div>
              <h3 className="welcome-title">Your AI Study Workspace</h3>
              <p className="welcome-desc">
                Paste your lecture notes or upload a PDF textbook chapter on the left. The AI Study Buddy will use Gemini to instantly extract a summary, define tricky vocabulary, build flippable flashcards, and set up a custom practice test for you.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
