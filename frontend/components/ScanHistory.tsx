
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanHistoryItem, ScanStatus } from '../types';
import ConfirmModal from './ConfirmModal';
import { deleteScanFromDatabase } from '../services/apiService';

interface ScanHistoryProps {
  history: ScanHistoryItem[];
  onBack: () => void;
  onSelect: (item: ScanHistoryItem) => void;
  onDelete?: (id: string) => void;
  error?: string; // Optional error message
}

const ScanHistory: React.FC<ScanHistoryProps> = ({ history, onBack, onSelect, onDelete, error }) => {
  const [statusFilter, setStatusFilter] = useState<ScanStatus | 'ALL'>('ALL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const getStatusColor = (status: ScanStatus) => {
    switch(status) {
      case ScanStatus.AUTHENTIC: return 'text-green-400 border-green-400/30 bg-green-400/10';
      case ScanStatus.FAKE: return 'text-red-400 border-red-400/30 bg-red-400/10';
      case ScanStatus.SUSPICIOUS: return 'text-orange-400 border-orange-400/30 bg-orange-400/10';
      default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteScanFromDatabase(id);
      if (onDelete) {
        onDelete(id);
      }
    } catch (error) {
      console.error('Failed to delete scan:', error);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      // 1. Status Filter
      if (statusFilter !== 'ALL' && item.result.status !== statusFilter) {
        return false;
      }

      // 2. Date Filter
      if (startDate || endDate) {
        const itemDate = new Date(item.date);
        
        if (startDate) {
          const start = new Date(startDate);
          // Reset time to start of day for accurate comparison
          start.setHours(0, 0, 0, 0);
          if (itemDate < start) return false;
        }

        if (endDate) {
          const end = new Date(endDate);
          // Set to end of day
          end.setHours(23, 59, 59, 999);
          if (itemDate > end) return false;
        }
      }

      return true;
    });
  }, [history, statusFilter, startDate, endDate]);

  const clearFilters = () => {
    setStatusFilter('ALL');
    setStartDate('');
    setEndDate('');
  };

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-[1800px] mx-auto p-4 min-h-[60vh] flex flex-col items-center justify-center text-center"
      >
        <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6">
          <span className="text-5xl">⚠️</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-mono font-bold text-white mb-2">Error Loading History</h2>
        <p className="text-gray-400 max-w-md mb-8">{error}</p>
        <button 
          onClick={onBack}
          className="px-8 py-3 bg-white/10 border border-white/10 rounded-xl hover:bg-white/20 transition-all font-mono text-sm"
        >
          RETURN TO DASHBOARD
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-[1800px] mx-auto p-0 md:p-4"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl md:text-4xl font-mono font-bold text-white">Scan History</h2>
          <p className="text-sm md:text-base text-gray-400 mt-1">Archive of previous verifications</p>
        </div>
        <button 
          onClick={onBack} 
          className="w-full md:w-auto text-cyber hover:text-white transition-colors text-sm font-mono border border-cyber/30 px-6 py-3 rounded-xl hover:bg-cyber/10 flex items-center justify-center gap-2"
        >
          <span>←</span> BACK TO DASHBOARD
        </button>
      </header>

      {/* FILTER CONTROL PANEL */}
      <div className="glass-panel p-4 md:p-6 rounded-2xl mb-8 flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between">
        
        {/* Status Filters */}
        <div className="flex flex-col gap-2 w-full xl:w-auto">
          <label className="text-xs text-gray-500 font-mono uppercase tracking-wider">Filter by Status</label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'ALL', value: 'ALL' },
              { label: 'AUTHENTIC', value: ScanStatus.AUTHENTIC },
              { label: 'FAKE', value: ScanStatus.FAKE },
              { label: 'SUSPICIOUS', value: ScanStatus.SUSPICIOUS }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value as ScanStatus | 'ALL')}
                className={`px-4 py-2 rounded-lg text-xs md:text-sm font-mono border transition-all ${
                  statusFilter === filter.value 
                    ? 'bg-cyber/20 border-cyber text-cyber shadow-[0_0_10px_rgba(0,229,255,0.2)]' 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date Filters & Clear */}
        <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto items-end">
          <div className="flex flex-col gap-2 flex-1 w-full md:w-auto">
             <label className="text-xs text-gray-500 font-mono uppercase tracking-wider">From Date</label>
             <input 
               type="date" 
               value={startDate}
               onChange={(e) => setStartDate(e.target.value)}
               className="bg-[#0b1221] border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:border-cyber outline-none font-mono"
             />
          </div>
          <div className="flex flex-col gap-2 flex-1 w-full md:w-auto">
             <label className="text-xs text-gray-500 font-mono uppercase tracking-wider">To Date</label>
             <input 
               type="date" 
               value={endDate}
               onChange={(e) => setEndDate(e.target.value)}
               className="bg-[#0b1221] border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:border-cyber outline-none font-mono"
             />
          </div>
          
          {(statusFilter !== 'ALL' || startDate || endDate) && (
            <button 
              onClick={clearFilters}
              className="px-4 py-2 text-red-400 hover:text-red-300 text-xs font-mono border border-red-500/30 hover:bg-red-500/10 rounded-lg transition-colors h-[38px]"
            >
              CLEAR ✕
            </button>
          )}
        </div>
      </div>

      {/* RESULT GRID */}
      {history.length === 0 ? (
        <div className="text-center py-32 text-gray-500 glass-panel rounded-3xl border border-dashed border-white/10 flex flex-col items-center mx-2 md:mx-0">
          <div className="text-5xl mb-6 opacity-50">📂</div>
          <p className="text-xl md:text-2xl font-mono">No scans recorded yet</p>
          <p className="text-sm mt-3 text-gray-400">Start a new scan to build your history.</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-center py-24 text-gray-500 glass-panel rounded-3xl border border-dashed border-white/10 flex flex-col items-center">
          <div className="text-5xl mb-6 opacity-50">🔍</div>
          <p className="text-xl md:text-2xl font-mono">No matching results</p>
          <p className="text-sm mt-3 text-gray-400">Try adjusting your filters.</p>
          <button onClick={clearFilters} className="mt-4 text-cyber underline text-sm hover:text-white transition-colors">Clear all filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          <AnimatePresence>
            {filteredHistory.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => onSelect(item)}
                className="glass-panel rounded-2xl overflow-hidden border border-white/5 hover:border-cyber/50 transition-all duration-300 group cursor-pointer flex flex-col"
              >
                <div className="h-48 md:h-56 overflow-hidden relative">
                  <img src={item.thumbnail} alt={item.result.productName} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-darkbg via-transparent to-transparent opacity-80" />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded text-[10px] font-mono border backdrop-blur-md ${getStatusColor(item.result.status)}`}>
                      {item.result.status}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[1px]">
                    <span className="px-4 py-2 bg-cyber/20 border border-cyber text-cyber text-xs font-mono rounded-full">
                      VIEW ANALYSIS
                    </span>
                  </div>
                </div>
                
                <div className="p-5 bg-white/5 flex-grow flex flex-col justify-between">
                  <div className="mb-4">
                     <p className="text-xs text-cyber font-mono mb-1 truncate">{item.result.brand}</p>
                     <h3 className="font-bold text-white truncate text-lg leading-tight">{item.result.productName}</h3>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-gray-400 border-t border-white/5 pt-3">
                    <span className="flex items-center gap-1">
                      <span>📅</span> {typeof item.date === 'string' ? item.date.substring(0, 10) : new Date(item.date).toLocaleDateString()}
                    </span>
                    <span className="font-mono">
                      Score: <span className="text-white">{item.result.confidenceScore}%</span>
                    </span>
                  </div>

                  {/* Delete button */}
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(item.id);
                      }}
                      className="mt-3 w-full py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg text-xs font-mono transition-colors group/delete"
                      disabled={isDeleting}
                    >
                      <span className="group-hover/delete:hidden">🗑️ Delete</span>
                      <span className="hidden group-hover/delete:inline">⚠️ Confirm Delete</span>
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        title="Delete Scan"
        message="Are you sure you want to delete this scan from your history? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => deleteConfirmId && handleDelete(deleteConfirmId)}
        onCancel={() => setDeleteConfirmId(null)}
        isDestructive={true}
      />
    </motion.div>
  );
};

export default ScanHistory;
