'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'default' | 'large';
  showHeader?: boolean;
}

export default function Modal({ isOpen, onClose, title, children, size = 'default', showHeader = true }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-start justify-center p-4 pt-12">
        <div
          className={`relative w-full transform rounded-2xl bg-white shadow-2xl transition-all flex flex-col ${
            size === 'large' ? 'max-w-4xl max-h-[90vh]' : 'max-w-2xl max-h-[85vh]'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button - Always visible, floating */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 rounded-full p-2 bg-white/90 hover:bg-gray-100 transition-colors shadow-sm"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Header - Optional */}
          {showHeader && title && (
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-white rounded-t-2xl flex-shrink-0">
              <h3 className="text-xl font-bold text-gray-900">
                {title}
              </h3>
            </div>
          )}

          {/* Content */}
          <div className={`flex-1 overflow-y-auto ${!showHeader || !title ? 'rounded-t-2xl' : ''}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
