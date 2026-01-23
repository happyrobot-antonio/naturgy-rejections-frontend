'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload, RefreshCw } from 'lucide-react';
import Modal from './Modal';
import ExcelUpload from './ExcelUpload';
import ViewSwitcher from './ViewSwitcher';
import { useCases } from '@/lib/CasesContext';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface HeaderProps {
  currentView: 'monitor' | 'analyze';
  onViewChange: (view: 'monitor' | 'analyze') => void;
}

export default function Header({ currentView, onViewChange }: HeaderProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const { lastUpdated, isRefreshing, hasRecentActivity, refreshCases } = useCases();

  const handleManualRefresh = async () => {
    setIsManualRefreshing(true);
    await refreshCases();
    setTimeout(() => setIsManualRefreshing(false), 1000);
  };

  const getTimeSinceUpdate = () => {
    if (!lastUpdated) return 'nunca';
    return formatDistanceToNow(lastUpdated, { addSuffix: true, locale: es });
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-200">
        <div className="grid grid-cols-3 items-center h-16 px-6 max-w-7xl mx-auto">
          {/* Left Section - Logos and Status */}
          <div className="flex items-center gap-6">
            {/* Logos Section */}
            <div className="flex items-center gap-4">
              {/* Naturgy Logo */}
              <Image
                src="/naturgy-logo-cuad.png"
                alt="Naturgy"
                width={32}
                height={32}
                className="h-8 w-8"
                priority
              />
              <span className="text-gray-300 text-2xl font-light">|</span>
              {/* HappyRobot Logo */}
              <Image
                src="/happyrobot-logo.svg"
                alt="HappyRobot"
                width={100}
                height={16}
                className="h-4 w-auto"
                priority
              />
            </div>
            
            {/* Status Indicators */}
            <div className="flex items-center gap-4 ml-4">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-orange-500 animate-pulse' : 'bg-green-500 animate-pulse-slow'}`} />
                <span>{isRefreshing ? 'Actualizando...' : `En vivo · ${getTimeSinceUpdate()}`}</span>
              </div>
              
              {hasRecentActivity && (
                <div className="flex items-center gap-2 text-xs text-orange-600 font-medium">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                  </span>
                  <span>Actividad reciente</span>
                </div>
              )}
            </div>
          </div>

          {/* Center Section - View Switcher */}
          <div className="flex justify-center">
            <ViewSwitcher currentView={currentView} onViewChange={onViewChange} />
          </div>

          {/* Right Section - Action Buttons */}
          <div className="flex justify-end items-center gap-3">
            {/* Refresh Button */}
            <button
              onClick={handleManualRefresh}
              disabled={isManualRefreshing}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
              title="Actualizar datos"
            >
              <RefreshCw className={`w-4 h-4 ${isManualRefreshing ? 'animate-spin' : ''}`} />
            </button>

            {/* Upload Button */}
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-naturgy-orange text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors duration-200 shadow-sm"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Subir Excel</span>
            </button>
          </div>
        </div>
      </header>

      <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)}>
        <ExcelUpload onClose={() => setIsUploadModalOpen(false)} />
      </Modal>
    </>
  );
}
