import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastItemProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠'
  };

  const colors = {
    success: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/50',
      text: 'text-green-400',
      icon: 'bg-green-500/20',
      glow: 'shadow-[0_0_20px_rgba(34,197,94,0.3)]'
    },
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/50',
      text: 'text-red-400',
      icon: 'bg-red-500/20',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]'
    },
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/50',
      text: 'text-blue-400',
      icon: 'bg-blue-500/20',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]'
    },
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/50',
      text: 'text-yellow-400',
      icon: 'bg-yellow-500/20',
      glow: 'shadow-[0_0_20px_rgba(234,179,8,0.3)]'
    }
  };

  const style = colors[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`
        ${style.bg} ${style.border} ${style.glow}
        border backdrop-blur-xl rounded-xl p-4 pr-12
        min-w-[300px] max-w-[400px]
        pointer-events-auto
        relative overflow-hidden
      `}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className={`h-full w-full bg-gradient-to-r ${
            toast.type === 'success' ? 'from-green-500/30 to-transparent' :
            toast.type === 'error' ? 'from-red-500/30 to-transparent' :
            toast.type === 'info' ? 'from-blue-500/30 to-transparent' :
            'from-yellow-500/30 to-transparent'
          }`}
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative flex items-start gap-3">
        {/* Icon */}
        <div className={`
          ${style.icon} ${style.text}
          w-8 h-8 rounded-lg flex items-center justify-center
          flex-shrink-0 font-bold text-lg
        `}>
          {icons[toast.type]}
        </div>

        {/* Message */}
        <div className="flex-1">
          <p className={`${style.text} font-mono text-sm leading-relaxed`}>
            {toast.message}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={() => onRemove(toast.id)}
          className={`
            absolute top-2 right-2
            ${style.text} hover:text-white
            w-6 h-6 rounded-lg
            flex items-center justify-center
            transition-colors duration-200
            hover:bg-white/10
          `}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* Progress bar */}
      <motion.div
        className={`absolute bottom-0 left-0 h-0.5 ${
          toast.type === 'success' ? 'bg-green-500' :
          toast.type === 'error' ? 'bg-red-500' :
          toast.type === 'info' ? 'bg-blue-500' :
          'bg-yellow-500'
        }`}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: (toast.duration || 5000) / 1000, ease: 'linear' }}
      />
    </motion.div>
  );
};

export default Toast;
