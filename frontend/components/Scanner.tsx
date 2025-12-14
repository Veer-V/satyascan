
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeImageWithML } from '../services/mlService';
import { AnalysisResult } from '../types';

interface ScannerProps {
  onScanComplete: (result: AnalysisResult, imageSrc: string) => void;
  onCancel: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScanComplete, onCancel }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanStage, setScanStage] = useState<'uploading' | 'analyzing' | 'processing' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      
      setIsScanning(true);
      
      try {
        // Stage 1: Uploading
        setScanStage('uploading');
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Stage 2: Analyzing
        setScanStage('analyzing');
        const result = await analyzeImageWithML(file);
        
        // Stage 3: Processing
        setScanStage('processing');
        await new Promise(resolve => setTimeout(resolve, 700));
        
        onScanComplete(result, objectUrl);
        setIsScanning(false);
        setScanStage(null);
      } catch (err: any) {
        console.error("Scan failed:", err);
        setError(err.message || "Connection interrupted. Please try again.");
        setIsScanning(false);
        setScanStage(null);
      }
    }
  };

  const triggerInput = () => {
    setError(null);
    fileInputRef.current?.click();
  };

  const handleRetry = () => {
    setError(null);
    setPreview(null);
    setScanStage(null);
    triggerInput();
  };

  const getScanStageText = () => {
    switch(scanStage) {
      case 'uploading': return 'UPLOADING IMAGE...';
      case 'analyzing': return 'ANALYZING VECTORS...';
      case 'processing': return 'PROCESSING RESULTS...';
      default: return 'ANALYZING VECTORS...';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-[1400px] mx-auto min-h-[calc(100vh-120px)] flex flex-col items-center py-6 md:py-10 px-4"
    >
      <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
        
        {/* Top: Scanner Interface */}
        <div className="w-full flex flex-col">
          <div className={`glass-panel rounded-3xl p-1 relative overflow-hidden flex flex-col shadow-2xl transition-all duration-300 ${error ? 'border-red-500/50 shadow-red-900/20' : 'neon-glow'}`}>
            <div className="bg-[#0b1636] rounded-[22px] p-4 sm:p-6 md:p-8 text-center flex flex-col items-center justify-center relative min-h-[300px] md:min-h-[400px]">
              
              <AnimatePresence mode="wait">
                {/* Error State */}
                {error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full max-w-md mx-auto"
                  >
                    <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6 text-4xl shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                      ⚠️
                    </div>
                    <h3 className="text-xl md:text-2xl font-mono font-bold text-red-400 mb-2">SCAN FAILED</h3>
                    <p className="text-sm md:text-base text-gray-300 mb-8 leading-relaxed">
                      {error}
                    </p>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => { setError(null); setPreview(null); }}
                        className="px-6 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-colors font-mono text-sm"
                      >
                        CANCEL
                      </button>
                      <button 
                        onClick={handleRetry}
                        className="px-6 py-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors font-mono text-sm font-bold flex items-center gap-2"
                      >
                        <span>↻</span> RETRY
                      </button>
                    </div>
                  </motion.div>
                ) : !preview ? (
                  // Upload State
                  <motion.div 
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center w-full justify-center h-full py-8"
                  >
                    <div 
                      onClick={triggerInput}
                      className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full border-2 border-dashed border-cyber/40 flex items-center justify-center cursor-pointer hover:bg-cyber/5 hover:border-cyber transition-all group active:scale-95 mb-3 md:mb-6"
                    >
                      <div className="text-2xl sm:text-3xl md:text-5xl group-hover:scale-110 transition-transform">📸</div>
                    </div>
                    <h3 className="text-base sm:text-lg md:text-2xl font-mono text-white">Upload Product Image</h3>
                    <p className="text-[10px] md:text-sm text-blue-300 mt-1 md:mt-2 max-w-xs md:max-w-md">Ensure good lighting and clearly visible text/logos.</p>
                    <button 
                      onClick={triggerInput}
                      className="mt-3 md:mt-6 px-5 py-2 md:px-8 md:py-3 bg-cyber/10 border border-cyber text-cyber rounded-xl hover:bg-cyber/20 transition-colors font-mono text-xs sm:text-sm md:text-base"
                    >
                      SELECT FILE
                    </button>
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                  </motion.div>
                ) : (
                  // Scanning State
                  <motion.div 
                    key="scanning"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden flex items-center justify-center bg-black border border-white/10 shadow-inner"
                  >
                    <img src={preview} alt="Scan Target" className="w-full h-full object-contain" />
                    
                    {isScanning && (
                      <>
                        <div className="absolute inset-0 bg-cyber/10 backdrop-blur-[2px] transition-all duration-500"></div>
                        <div className="scan-line z-20"></div>
                        
                        {/* Rotating Loading Animation */}
                        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 flex items-center justify-center">
                            {/* Outer Ring */}
                            <motion.div 
                              className="absolute inset-0 border-4 border-transparent border-t-cyber border-b-cyber rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                            {/* Inner Ring */}
                            <motion.div 
                              className="absolute inset-4 border-4 border-transparent border-l-neon border-r-neon rounded-full"
                              animate={{ rotate: -360 }}
                              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />
                            {/* Center Dot */}
                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] animate-pulse" />
                          </div>
                        </div>

                        <div className="absolute bottom-4 sm:bottom-6 left-0 w-full text-center z-40">
                          <span className="font-mono text-[10px] sm:text-xs md:text-sm bg-black/80 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-cyber/30 text-cyber animate-pulse shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                            {getScanStageText()}
                          </span>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Decorative elements */}
              <div className="absolute top-4 right-4 flex gap-1.5">
                 <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 animate-pulse"></div>
                 <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-500"></div>
                 <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Scanning Guide (Stacked below) */}
        <div className="w-full">
          <div className="glass-panel p-5 md:p-8 rounded-3xl border border-white/5">
            <div className="mb-4 md:mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg md:text-xl font-bold font-mono text-white mb-2">SCANNING GUIDE</h2>
                <div className="h-0.5 w-12 bg-cyber rounded-full"></div>
              </div>
               <button 
                onClick={onCancel}
                className="py-2 px-4 text-xs md:text-sm text-gray-400 hover:text-white hover:bg-white/5 border border-white/10 rounded-xl transition-all font-mono"
               >
                 CANCEL
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex gap-3 md:gap-4 items-start">
                 <div className="w-10 h-10 rounded-lg bg-white/5 flex-shrink-0 flex items-center justify-center text-lg border border-white/10">💡</div>
                 <div>
                   <h4 className="font-bold text-white text-sm mb-1">Good Lighting</h4>
                   <p className="text-xs text-gray-400 leading-relaxed">Avoid harsh shadows or glare on the packaging text.</p>
                 </div>
              </div>

              <div className="flex gap-3 md:gap-4 items-start">
                 <div className="w-10 h-10 rounded-lg bg-white/5 flex-shrink-0 flex items-center justify-center text-lg border border-white/10">📦</div>
                 <div>
                   <h4 className="font-bold text-white text-sm mb-1">Packaging Details</h4>
                   <p className="text-xs text-gray-400 leading-relaxed">Capture the front logo, ingredient list, and batch codes clearly.</p>
                 </div>
              </div>

              <div className="flex gap-3 md:gap-4 items-start">
                 <div className="w-10 h-10 rounded-lg bg-white/5 flex-shrink-0 flex items-center justify-center text-lg border border-white/10">📸</div>
                 <div>
                   <h4 className="font-bold text-white text-sm mb-1">Focus & Stability</h4>
                   <p className="text-xs text-gray-400 leading-relaxed">Keep the camera steady. Blurry text cannot be analyzed.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Scanner;
