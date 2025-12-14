import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { checkApiHealth } from '../services/apiService';

interface DatabaseStatusProps {
  onStatusChange?: (isConnected: boolean) => void;
}

const DatabaseStatus: React.FC<DatabaseStatusProps> = ({ onStatusChange }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkConnection = async () => {
    setIsChecking(true);
    const healthy = await checkApiHealth();
    setIsConnected(healthy);
    setLastChecked(new Date());
    setIsChecking(false);
    
    if (onStatusChange) {
      onStatusChange(healthy);
    }
  };

  useEffect(() => {
    // Initial check
    checkConnection();

    // Auto-check every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    if (isChecking) {
      return {
        color: 'yellow',
        text: 'CHECKING',
        icon: '⟳',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/40',
        textColor: 'text-yellow-400',
        dotColor: 'bg-yellow-400',
        glow: 'shadow-[0_0_15px_rgba(234,179,8,0.3)]'
      };
    }
    
    if (isConnected === null) {
      return {
        color: 'gray',
        text: 'UNKNOWN',
        icon: '?',
        bgColor: 'bg-gray-500/10',
        borderColor: 'border-gray-500/40',
        textColor: 'text-gray-400',
        dotColor: 'bg-gray-400',
        glow: ''
      };
    }
    
    if (isConnected) {
      return {
        color: 'green',
        text: 'CONNECTED',
        icon: '✓',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/40',
        textColor: 'text-green-400',
        dotColor: 'bg-green-400',
        glow: 'shadow-[0_0_15px_rgba(34,197,94,0.3)]'
      };
    }
    
    return {
      color: 'red',
      text: 'DISCONNECTED',
      icon: '✕',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/40',
      textColor: 'text-red-400',
      dotColor: 'bg-red-400',
      glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]'
    };
  };

  const status = getStatusConfig();

  return (
    <button
      onClick={checkConnection}
      disabled={isChecking}
      className={`
        ${status.bgColor} ${status.borderColor} ${status.glow}
        border rounded-lg px-3 py-1.5
        flex items-center gap-2
        transition-all duration-300
        hover:bg-white/5
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      title={`Last checked: ${lastChecked ? lastChecked.toLocaleTimeString() : 'Never'}. Click to refresh.`}
    >
      {/* Status dot with pulse animation */}
      <div className="relative flex items-center justify-center">
        <motion.div
          className={`w-2 h-2 rounded-full ${status.dotColor}`}
          animate={
            isChecking 
              ? { scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }
              : isConnected 
              ? { scale: 1 }
              : {}
          }
          transition={
            isChecking 
              ? { duration: 1, repeat: Infinity }
              : {}
          }
        />
        {isConnected && !isChecking && (
          <motion.div
            className={`absolute w-2 h-2 rounded-full ${status.dotColor} opacity-50`}
            animate={{ scale: [1, 2, 2], opacity: [0.5, 0, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>

      {/* Status text */}
      <span className={`font-mono text-[10px] font-bold tracking-wider ${status.textColor}`}>
        {status.text}
      </span>

      {/* Icon */}
      <span className={`text-xs ${status.textColor}`}>
        <motion.span
          animate={isChecking ? { rotate: 360 } : {}}
          transition={isChecking ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
          className="inline-block"
        >
          {status.icon}
        </motion.span>
      </span>
    </button>
  );
};

export default DatabaseStatus;
