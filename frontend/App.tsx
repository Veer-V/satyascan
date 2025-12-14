
import React, { useState, useEffect, useCallback } from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import Hero from './components/Hero';
import Scanner from './components/Scanner';
import AnalysisResult from './components/AnalysisResult';
import Dashboard from './components/Dashboard';
import ScanHistory from './components/ScanHistory';
import ChatBot from './components/ChatBot';
import SatyaLogo from './components/SatyaLogo';
import Toast, { ToastMessage } from './components/Toast';
import { ViewState, AnalysisResult as AnalysisResultType, ScanHistoryItem, ScanStatus } from './types';
import { saveScanToDatabase, fetchScansFromDatabase } from './services/apiService';

function App() {
  const [view, setView] = useState<ViewState>('HOME');
  const [scanResult, setScanResult] = useState<AnalysisResultType | null>(null);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // Initialize history with some mock data so the dashboard feels alive immediately
  const [history, setHistory] = useState<ScanHistoryItem[]>([
    {
      id: 'mock-1',
      date: new Date(Date.now() - 86400000 * 2).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
      thumbnail: 'https://images.unsplash.com/photo-1522335789203-abd7fe01d1d5?auto=format&fit=crop&q=80&w=200',
      result: {
        productName: 'Midnight Recovery Concentrate',
        brand: 'Kiehl\'s',
        status: ScanStatus.AUTHENTIC,
        confidenceScore: 98,
        reasoning: ['Perfect font kerning', 'Valid batch code'],
        extractedText: ['Kiehls', 'Since 1851']
      }
    },
    {
      id: 'mock-2',
      date: new Date(Date.now() - 86400000 * 1).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
      thumbnail: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=200',
      result: {
        productName: 'Advanced Night Repair',
        brand: 'Estée Lauder',
        status: ScanStatus.FAKE,
        confidenceScore: 85,
        reasoning: ['Typo in "Synchronized"', 'Wrong bottle shade'],
        extractedText: ['Estee Laude', 'Syncronized']
      }
    }
  ]);
  
  // State for potential app-wide errors
  const [appError, setAppError] = useState<string | undefined>(undefined);

  // Toast management
  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'info', duration?: number) => {
    const id = Date.now().toString() + Math.random().toString(36);
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Fetch scan history from database on component mount
  useEffect(() => {
    const loadHistory = async () => {
      const response = await fetchScansFromDatabase();
      if (response.data && response.data.length > 0) {
        setHistory(response.data);
      } else if (response.error) {
        console.error('Failed to load history:', response.error);
        // Keep mock data if database fetch fails
      }
    };
    loadHistory();
  }, []);

  const navigate = (newView: ViewState) => setView(newView);

  const handleScanComplete = async (result: AnalysisResultType, imageSrc: string) => {
    setScanResult(result);
    setCurrentImage(imageSrc);
    
    // Create new scan item
    const newItem: ScanHistoryItem = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      thumbnail: imageSrc,
      result: result
    };
    
    // Save to database
    const saveResponse = await saveScanToDatabase(newItem);
    if (saveResponse.error) {
      console.error('Failed to save scan to database:', saveResponse.error);
      addToast('Scan completed but failed to save to database', 'warning');
      // Still add to local state even if save fails
    } else {
      console.log('✅ Scan saved to database successfully');
      addToast('Scan saved successfully!', 'success', 3000);
    }
    
    // Add to local state immediately for instant UI update
    setHistory(prev => [newItem, ...prev]);
    
    setView('RESULTS');
  };

  const handleHistorySelect = (item: ScanHistoryItem) => {
    setScanResult(item.result);
    setCurrentImage(item.thumbnail);
    setView('RESULTS');
  };

  const handleReset = () => {
    setScanResult(null);
    setCurrentImage('');
    setView('SCAN');
  };

  const handleDelete = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    addToast('Scan deleted successfully', 'info', 3000);
  };

  const navItems = [
    { id: 'HOME', label: 'Home', icon: '⚡' },
    { id: 'DASHBOARD', label: 'Dashboard', icon: '📊' },
    { id: 'HISTORY', label: 'History', icon: '📂' },
  ];

  return (
    <div className="min-h-screen bg-darkbg text-white font-sans selection:bg-cyber selection:text-black flex flex-col">
      {/* --- CONTROL CENTER HEADER --- */}
      <header className="sticky top-0 left-0 w-full z-50 border-b border-white/5 bg-darkbg/85 backdrop-blur-xl transition-all duration-300 shadow-md shadow-black/20 h-16 md:h-24">
        <div className="w-full h-full px-3 sm:px-4 md:px-8 max-w-[1920px] mx-auto flex items-center justify-between relative">
          
          {/* LEFT: Branding */}
          {/* Flex-shrink-0 ensures logo never shrinks below defined size */}
          <div 
            className="flex items-center gap-3 cursor-pointer group select-none z-20 flex-shrink-0" 
            onClick={() => navigate('HOME')}
          >
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 transition-transform duration-500 group-hover:rotate-180 flex-shrink-0">
              <SatyaLogo className="w-full h-full drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]" />
              <div className="absolute inset-0 bg-cyber/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            {/* Text hidden on small screens (<640px) to make room for nav */}
            <div className="hidden sm:flex flex-col justify-center">
              <span className="font-mono font-bold tracking-widest text-base md:text-2xl leading-none flex items-center gap-1 text-white">
                SATYA<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber to-neon">SCAN</span>
              </span>
              {/* Subtitle hidden on medium screens (<1024px) */}
              <span className="hidden lg:block text-[10px] text-gray-500 font-mono tracking-[0.3em] uppercase group-hover:text-cyber transition-colors mt-1">
                Authenticity Grid
              </span>
            </div>
          </div>

          {/* CENTER: Navigation Bar */}
          {/* Mobile/Tablet: Relative in flex flow. Desktop: Absolute centered. */}
          <nav className="flex-grow flex justify-center md:flex-grow-0 md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-10 px-2 md:px-0">
            <LayoutGroup>
              <ul className="flex items-center gap-1 md:gap-2 p-1 md:p-2 bg-black/40 border border-white/10 rounded-full backdrop-blur-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                {navItems.map((item) => {
                  const isActive = view === item.id;
                  return (
                    <li key={item.id} className="relative z-0">
                      {isActive && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute inset-0 bg-gradient-to-r from-cyber/20 via-blue-500/20 to-neon/20 border border-cyber/50 rounded-full shadow-[0_0_20px_rgba(0,229,255,0.25)]"
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        />
                      )}
                      <button
                        onClick={() => navigate(item.id as ViewState)}
                        className={`relative z-10 px-3 py-2 md:px-8 md:py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                          isActive 
                            ? 'text-white scale-105' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span className={`text-base md:text-xl ${isActive ? 'text-cyber drop-shadow-md' : ''}`}>{item.icon}</span>
                        {/* Label visible only on Large screens to avoid crowding */}
                        <span className={`hidden lg:block font-mono text-xs md:text-sm font-bold tracking-wide uppercase ${isActive ? 'text-shadow-glow' : ''}`}>
                          {item.label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </LayoutGroup>
          </nav>

          {/* RIGHT: Action & Status */}
          <div className="flex items-center gap-2 md:gap-6 z-20 flex-shrink-0">
            <button 
              onClick={() => navigate('SCAN')}
              className="group relative px-3 py-2 md:px-7 md:py-3 bg-cyber/10 border border-cyber/40 rounded-xl overflow-hidden transition-all duration-300 hover:bg-cyber/20 hover:border-cyber/80 hover:shadow-[0_0_25px_rgba(0,229,255,0.25)] active:scale-95 flex items-center justify-center"
            >
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="relative flex items-center gap-2 font-mono text-xs md:text-sm font-bold text-cyber group-hover:text-white transition-colors">
                {/* Text hidden on mobile (<640px) */}
                <span className="hidden sm:inline tracking-wider">NEW SCAN</span>
                <span className="sm:hidden text-lg">📸</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow pt-4 pb-20 md:pb-10 px-4 md:px-6 w-full">
        {view === 'HOME' && (
          <Hero 
            onStartScan={() => navigate('SCAN')} 
            onViewDashboard={() => navigate('DASHBOARD')} 
          />
        )}

        {view === 'SCAN' && (
          <Scanner 
            onScanComplete={handleScanComplete}
            onCancel={() => navigate('HOME')}
          />
        )}

        {view === 'RESULTS' && scanResult && (
          <AnalysisResult 
            result={scanResult} 
            imageSrc={currentImage} 
            onReset={handleReset} 
          />
        )}

        {view === 'DASHBOARD' && (
          <Dashboard 
            onBack={() => navigate('HOME')} 
            onViewHistory={() => navigate('HISTORY')}
            history={history}
            error={appError}
          />
        )}

        {view === 'HISTORY' && (
          <ScanHistory 
            history={history} 
            onBack={() => navigate('DASHBOARD')} 
            onSelect={handleHistorySelect}
            onDelete={handleDelete}
            error={appError}
          />
        )}
      </main>
      
      {/* Chat Bot Widget */}
      <ChatBot />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onRemove={removeToast} />      

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full py-2 bg-darkbg/90 backdrop-blur-md border-t border-white/5 md:bg-transparent md:border-none md:bottom-4 md:left-6 md:w-auto text-[10px] md:text-xs text-center md:text-left text-white/20 font-mono z-40 pointer-events-none">
        SATYASCAN SECURE // v2.4.0
      </footer>
    </div>
  );
}

export default App;
