'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload, RefreshCw, RotateCcw, AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import ExcelUpload from './ExcelUpload';
import ViewSwitcher from './ViewSwitcher';
import { useCases } from '@/lib/CasesContext';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface HeaderProps {
  currentView: 'monitor' | 'analyze';
  onViewChange: (view: 'monitor' | 'analyze') => void;
}

export default function Header({ currentView, onViewChange }: HeaderProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const { lastUpdated, isRefreshing, hasRecentActivity, refreshCases } = useCases();

  const handleManualRefresh = async () => {
    setIsManualRefreshing(true);
    await refreshCases();
    setTimeout(() => setIsManualRefreshing(false), 1000);
  };

  const handleResetDatabase = async () => {
    setIsResetting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/reset-db`, {
        method: 'POST',
      });
      if (response.ok) {
        await refreshCases();
        setIsResetModalOpen(false);
      } else {
        alert('Error al reiniciar la base de datos');
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setIsResetting(false);
    }
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
            {/* Reset DB Button */}
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title="Reiniciar base de datos"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

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

      {/* Upload Modal */}
      <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)}>
        <ExcelUpload onClose={() => setIsUploadModalOpen(false)} />
      </Modal>

      {/* Reset DB Confirmation Modal */}
      <Modal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)}>
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Reiniciar Base de Datos
          </h3>
          <p className="text-gray-500 mb-6">
            Esta acción eliminará <strong>todos los casos y eventos</strong> de la base de datos. 
            Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setIsResetModalOpen(false)}
              className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleResetDatabase}
              disabled={isResetting}
              className="px-5 py-2.5 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isResetting ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  Reiniciando...
                </>
              ) : (
                'Sí, reiniciar'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
