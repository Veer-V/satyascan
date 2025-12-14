
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { ScanHistoryItem, ScanStatus } from '../types';

interface DashboardProps {
  onBack: () => void;
  onViewHistory: () => void;
  history: ScanHistoryItem[];
  error?: string; // Optional error message
}

const Dashboard: React.FC<DashboardProps> = ({ onBack, onViewHistory, history, error }) => {
  
  // Calculate analytics dynamically from history
  const { totalScans, interceptedFakes, weeklyData, brandRisks, valueSaved } = useMemo(() => {
    const total = history.length;
    const fakes = history.filter(item => 
      item.result.status === ScanStatus.FAKE || item.result.status === ScanStatus.SUSPICIOUS
    ).length;

    // Estimate value saved (Mock calculation: avg luxury cosmetic price $85)
    const saved = (fakes * 85).toLocaleString(undefined, { maximumFractionDigits: 1 });

    // Generate Weekly Data (Last 7 days aggregation based on day name)
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chartData = daysOfWeek.map(day => ({ name: day, authentic: 0, fake: 0 }));

    history.forEach(item => {
      const date = new Date(item.date);
      if (!isNaN(date.getTime())) {
        const dayIndex = date.getDay();
        const dayData = chartData[dayIndex];
        if (item.result.status === ScanStatus.AUTHENTIC) {
          dayData.authentic += 1;
        } else {
          dayData.fake += 1;
        }
      }
    });

    // Generate Brand Risks Heatmap
    const brandMap: Record<string, { total: number, risky: number }> = {};
    
    history.forEach(item => {
      const brand = item.result.brand || 'Unknown';
      if (!brandMap[brand]) {
        brandMap[brand] = { total: 0, risky: 0 };
      }
      brandMap[brand].total += 1;
      if (item.result.status === ScanStatus.FAKE || item.result.status === ScanStatus.SUSPICIOUS) {
        brandMap[brand].risky += 1;
      }
    });

    // Sort brands by risk count (descending) and take top 5
    const riskData = Object.keys(brandMap)
      .map(brand => ({
        name: brand,
        risk: Math.round((brandMap[brand].risky / brandMap[brand].total) * 100)
      }))
      .filter(b => b.risk > 0 || brandMap[b.name].total > 2) // Filter interesting data
      .sort((a, b) => b.risk - a.risk)
      .slice(0, 5);
      
    // If no specific risk data, provide a placeholder or empty
    const finalRiskData = riskData.length > 0 ? riskData : [{ name: 'No High Risks', risk: 0 }];

    return { 
      totalScans: total, 
      interceptedFakes: fakes, 
      weeklyData: chartData, 
      brandRisks: finalRiskData,
      valueSaved: saved
    };
  }, [history]);

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-[1800px] mx-auto p-4 min-h-[60vh] flex flex-col items-center justify-center text-center"
      >
        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
          <span className="text-5xl opacity-50">🌩️</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-mono font-bold text-white mb-2">Connection Error</h2>
        <p className="text-gray-400 max-w-md mb-8">{error}</p>
        <button 
          onClick={onBack}
          className="px-8 py-3 bg-white/10 border border-white/10 rounded-xl hover:bg-white/20 transition-all font-mono text-sm"
        >
          RETURN HOME
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-[1800px] mx-auto p-0 md:p-4"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-4xl font-mono font-bold text-white">Global Insights</h2>
          <p className="text-sm md:text-base text-gray-400 mt-1">Real-time counterfeit tracking network</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={onViewHistory} 
            className="flex-1 md:flex-none justify-center px-6 py-3 bg-gradient-to-r from-cyber/10 to-neon/10 border border-cyber/30 text-cyber font-mono text-sm rounded-xl hover:shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all flex items-center gap-2"
          >
            <span>📜</span> VIEW HISTORY
          </button>
          <button 
            onClick={onBack} 
            className="flex-1 md:flex-none justify-center text-gray-400 hover:text-white transition-colors text-sm font-mono px-6 py-3 border border-white/10 rounded-xl hover:bg-white/5"
          >
            ← BACK
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {/* Stat Cards */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl border-l-4 border-cyber">
          <h3 className="text-gray-400 text-xs uppercase tracking-wider">Total Scans</h3>
          <p className="text-4xl md:text-5xl font-mono font-bold mt-2">{totalScans}</p>
          <p className="text-cyber text-sm mt-2">Active Session</p>
        </div>
        <div className="glass-panel p-6 md:p-8 rounded-2xl border-l-4 border-red-500">
          <h3 className="text-gray-400 text-xs uppercase tracking-wider">Detected Counterfeits</h3>
          <p className="text-4xl md:text-5xl font-mono font-bold mt-2">{interceptedFakes}</p>
          <p className="text-red-400 text-sm mt-2">
            {totalScans > 0 ? ((interceptedFakes / totalScans) * 100).toFixed(1) : 0}% rate
          </p>
        </div>
        <div className="glass-panel p-6 md:p-8 rounded-2xl border-l-4 border-neon sm:col-span-2 lg:col-span-1">
          <h3 className="text-gray-400 text-xs uppercase tracking-wider">Est. Value Saved</h3>
          <p className="text-4xl md:text-5xl font-mono font-bold mt-2">${valueSaved}</p>
          <p className="text-neon text-sm mt-2">Consumer Protection</p>
        </div>
         <div className="glass-panel p-6 md:p-8 rounded-2xl border-l-4 border-yellow-500 hidden xl:block">
          <h3 className="text-gray-400 text-xs uppercase tracking-wider">System Status</h3>
          <p className="text-4xl md:text-5xl font-mono font-bold mt-2">ON</p>
          <p className="text-yellow-500 text-sm mt-2">Analysis Engine Ready</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Weekly Activity Chart */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl h-[400px]">
          <h3 className="font-mono text-lg mb-6">Scan Activity (Weekly)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorAuth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} dy={10} />
                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} dx={-10} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#081028', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="authentic" name="Authentic" stroke="#00E5FF" fillOpacity={1} fill="url(#colorAuth)" strokeWidth={2} />
                <Area type="monotone" dataKey="fake" name="Suspicious/Fake" stroke="#EF4444" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* High Risk Brands */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl h-[400px]">
          <h3 className="font-mono text-lg mb-6">High Risk Brands (Heatmap)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={brandRisks} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" stroke="#6B7280" fontSize={12} hide />
                <YAxis dataKey="name" type="category" stroke="#fff" fontSize={12} width={100} tickLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#081028', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="risk" name="Fake/Suspicious %" fill="#7C4DFF" radius={[0, 6, 6, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
