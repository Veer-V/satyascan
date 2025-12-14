import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = false
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] flex items-center justify-center p-4"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="glass-panel rounded-2xl border border-white/10 p-6 md:p-8 max-w-md w-full pointer-events-auto shadow-2xl"
            >
              {/* Icon */}
              <div className={`
                w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl
                ${isDestructive 
                  ? 'bg-red-500/10 border border-red-500/30' 
                  : 'bg-blue-500/10 border border-blue-500/30'
                }
              `}>
                {isDestructive ? '⚠️' : 'ℹ️'}
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-mono font-bold text-white text-center mb-3">
                {title}
              </h3>

              {/* Message */}
              <p className="text-sm md:text-base text-gray-300 text-center leading-relaxed mb-8">
                {message}
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 px-6 py-3 border border-white/20 rounded-xl hover:bg-white/5 transition-colors font-mono text-sm text-gray-300 hover:text-white"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className={`
                    flex-1 px-6 py-3 rounded-xl transition-all font-mono text-sm font-bold
                    ${isDestructive
                      ? 'bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                      : 'bg-blue-500/20 border border-blue-500/50 text-blue-400 hover:bg-blue-500/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                    }
                  `}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
