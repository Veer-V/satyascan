
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnalysisResult as ResultType, ScanStatus } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface Props {
  result: ResultType;
  imageSrc: string;
  onReset: () => void;
}

const AnalysisResult: React.FC<Props> = ({ result, imageSrc, onReset }) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [showSavedIndicator, setShowSavedIndicator] = useState(true);

  const getStatusColor = (status: ScanStatus) => {
    switch(status) {
      case ScanStatus.AUTHENTIC: return '#10B981'; // Green
      case ScanStatus.FAKE: return '#EF4444'; // Red
      case ScanStatus.SUSPICIOUS: return '#F59E0B'; // Orange
      default: return '#6B7280';
    }
  };

  const color = getStatusColor(result.status);
  
  const chartData = [
    { name: 'Confidence', value: result.confidenceScore },
    { name: 'Uncertainty', value: 100 - result.confidenceScore }
  ];

  const handleFeedback = (helpful: boolean) => {
    console.log(`User feedback: ${helpful ? 'Helpful' : 'Not Helpful'}`);
    setFeedbackGiven(true);
  };

  const handleRedirect = () => {
    // 1. AUTHENTIC
    if (result.status === ScanStatus.AUTHENTIC) {
      if (result.officialWebsite) {
        window.open(result.officialWebsite, '_blank');
      } else {
        const query = `${result.brand} ${result.productName} official site`;
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
      }
      return;
    }

    // 2. FAKE OR SUSPICIOUS (Reporting Logic)
    if (result.status === ScanStatus.FAKE || result.status === ScanStatus.SUSPICIOUS) {
      if (result.reportingUrl) {
        window.open(result.reportingUrl, '_blank');
      } else {
        const query = `Report fake ${result.brand} products`;
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
      }
      return;
    }

    // 3. UNKNOWN / Fallback
    const query = `${result.brand} ${result.productName}`;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
  };

  const copyToClipboard = () => {
    if (result.extractedText) {
      navigator.clipboard.writeText(result.extractedText.join('\n'));
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-[1800px] mx-auto p-0 md:p-4 mb-20 md:mb-0"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 h-full min-h-[calc(100vh-140px)]">
        
        {/* Left Column: Image & Quick Stats */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 order-1">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 h-[400px] lg:h-full lg:max-h-[600px] group shadow-2xl bg-black">
            <img src={imageSrc} alt="Analyzed" className="w-full h-full object-contain p-4" />
            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent">
              <h3 className="text-2xl md:text-3xl font-bold text-white truncate">{result.productName}</h3>
              <p className="text-base md:text-lg text-gray-300">{result.brand}</p>
            </div>
            {/* Status Badge Overlay */}
            <div 
              className="absolute top-6 left-6 px-4 py-2 rounded-full text-sm md:text-base font-bold tracking-wider text-black backdrop-blur-md shadow-lg flex items-center gap-2"
              style={{ backgroundColor: color }}
            >
              <span>{result.status}</span>
            </div>
          </div>

          <div className="glass-panel p-6 md:p-8 rounded-3xl flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1 uppercase tracking-wider">AI Confidence Score</p>
              <p className="text-4xl md:text-5xl font-mono font-bold text-white">{result.confidenceScore}%</p>
            </div>
            <div className="w-20 h-20 md:w-28 md:h-28">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={chartData}
                     innerRadius={30}
                     outerRadius={42}
                     paddingAngle={5}
                     dataKey="value"
                     startAngle={90}
                     endAngle={-270}
                     stroke="none"
                   >
                     <Cell fill={color} />
                     <Cell fill="#ffffff10" />
                   </Pie>
                 </PieChart>
               </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Analysis */}
        <div className="lg:col-span-7 xl:col-span-8 glass-panel p-6 md:p-10 rounded-3xl flex flex-col h-full border-t-4 order-2 shadow-2xl" style={{ borderColor: color }}>
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl md:text-4xl font-mono font-bold flex items-center gap-4">
                 <span className="text-3xl md:text-5xl">{result.status === ScanStatus.AUTHENTIC ? '✅' : result.status === ScanStatus.FAKE ? '⛔' : '⚠️'}</span>
                 ANALYSIS REPORT
              </h2>
              {showSavedIndicator && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-lg text-xs font-mono text-green-400"
                >
                  <span className="animate-pulse">✓</span>
                  <span>Saved to Database</span>
                </motion.div>
              )}
            </div>
            {result.batchCode && (
               <div className="hidden md:block text-right">
                  <h4 className="text-[10px] md:text-xs uppercase tracking-widest text-cyber mb-1">Batch Code</h4>
                  <p className="font-mono text-lg text-white bg-white/5 px-3 py-1 rounded border border-white/10">{result.batchCode}</p>
               </div>
            )}
          </div>

          <div className="space-y-6 md:space-y-8 flex-grow">
            {/* Action Buttons based on Status */}
            <div>
              {result.status === ScanStatus.AUTHENTIC && (
                <button 
                  onClick={handleRedirect}
                  className="w-full py-4 md:py-5 px-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 hover:bg-green-500/30 text-green-300 rounded-2xl transition-all flex items-center justify-center gap-3 group font-mono text-base md:text-lg shadow-lg shadow-green-900/20"
                >
                  <span className="text-xl">{result.officialWebsite ? '🛍️' : '🔍'}</span> 
                  {result.officialWebsite ? 'Visit Official Website' : 'Find Product Online'}
                  <span className="group-hover:translate-x-1 transition-transform text-xl">→</span>
                </button>
              )}

              {(result.status === ScanStatus.FAKE || result.status === ScanStatus.SUSPICIOUS) && (
                <button 
                  onClick={handleRedirect}
                  className="w-full py-4 md:py-5 px-6 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/50 hover:bg-red-500/30 text-red-300 rounded-2xl transition-all flex items-center justify-center gap-3 group font-mono text-base md:text-lg shadow-lg shadow-red-900/20"
                >
                  <span className="text-xl">🚨</span> 
                  {result.reportingUrl ? `Report Counterfeit to ${result.brand}` : `Report Fake ${result.brand} Products`}
                  <span className="group-hover:translate-x-1 transition-transform text-xl">→</span>
                </button>
              )}

              {result.status === ScanStatus.UNKNOWN && (
                 <button 
                  onClick={handleRedirect}
                  className="w-full py-4 md:py-5 px-6 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 rounded-2xl transition-all flex items-center justify-center gap-3 group font-mono text-base md:text-lg"
                >
                  <span className="text-xl">🔍</span> 
                  Search Product Online
                  <span className="group-hover:translate-x-1 transition-transform text-xl">→</span>
                </button>
              )}
            </div>

            <div>
              <h4 className="text-xs md:text-sm uppercase tracking-widest text-cyber mb-4">Key Observations & Reasoning</h4>
              <ul className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {result.reasoning.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4 text-sm md:text-base text-gray-300 bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                    <span className="text-cyber mt-0.5 text-xl">▹</span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Extracted Text Section (OCR Verification) */}
            {result.extractedText && result.extractedText.length > 0 && (
               <div className="relative group/ocr">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs md:text-sm uppercase tracking-widest text-cyber flex items-center gap-2">
                      <span>👁️‍🗨️</span> Digital Text Inspection (OCR)
                    </h4>
                    <button 
                      onClick={copyToClipboard}
                      className="text-[10px] md:text-xs text-gray-400 hover:text-white border border-white/10 px-2 py-1 rounded bg-white/5 transition-colors"
                    >
                      {copiedText ? 'COPIED ✓' : 'COPY TEXT'}
                    </button>
                  </div>
                  
                  <div className="bg-[#0b1221] p-4 rounded-xl border border-white/10 max-h-48 overflow-y-auto font-mono text-xs md:text-sm text-gray-300 leading-relaxed scrollbar-thin scrollbar-thumb-cyber/20 shadow-inner relative">
                    <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
                      <span className="text-4xl">📄</span>
                    </div>
                    {result.extractedText.map((line, idx) => (
                      <div key={idx} className="mb-1.5 border-b border-white/5 pb-1 last:border-0 last:pb-0 flex gap-3">
                        <span className="text-white/20 select-none text-[10px] pt-0.5">{(idx + 1).toString().padStart(2, '0')}</span>
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2 italic">
                    * AI analyzed this text for spelling errors, font inconsistencies, and missing regulatory marks.
                  </p>
               </div>
            )}
            
            {/* Mobile Batch Code (if visible) */}
            {result.batchCode && (
               <div className="md:hidden">
                  <h4 className="text-[10px] uppercase tracking-widest text-cyber mb-2">Batch Code</h4>
                  <p className="font-mono text-base text-white bg-white/5 p-2 rounded border border-white/10 inline-block">{result.batchCode}</p>
               </div>
            )}
          </div>

          {/* Feedback Mechanism & Reset */}
          <div className="mt-10 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="w-full md:w-auto">
              {!feedbackGiven ? (
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <p className="text-sm text-gray-400 font-mono whitespace-nowrap">Was this result helpful?</p>
                  <div className="flex gap-3 w-full md:w-auto">
                    <button 
                      onClick={() => handleFeedback(true)}
                      className="flex-1 md:flex-none px-6 py-2 rounded-lg border border-white/10 hover:bg-white/5 hover:border-cyber/50 hover:text-cyber transition-all text-xs font-mono"
                    >
                      YES 👍
                    </button>
                    <button 
                      onClick={() => handleFeedback(false)}
                      className="flex-1 md:flex-none px-6 py-2 rounded-lg border border-white/10 hover:bg-white/5 hover:border-red-400/50 hover:text-red-400 transition-all text-xs font-mono"
                    >
                      NO 👎
                    </button>
                  </div>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-2 bg-white/5 rounded-lg border border-white/5"
                >
                  <p className="text-cyber text-sm font-mono">✅ Feedback submitted. Thanks!</p>
                </motion.div>
              )}
            </div>

            <button 
              onClick={onReset}
              className="w-full md:w-auto px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all font-mono text-xs md:text-sm tracking-wider uppercase active:scale-[0.98] text-white/70 hover:text-white"
            >
              Scan New Product
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default AnalysisResult;
