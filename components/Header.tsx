'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload, Database } from 'lucide-react';
import Modal from './Modal';
import ExcelUpload from './ExcelUpload';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function Header() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleResetDatabase = async () => {
    const confirmed = window.confirm(
      '⚠️ ¿Estás seguro de que quieres REINICIAR la base de datos?\n\n' +
      'Esto eliminará TODOS los casos y eventos.\n\n' +
      'Esta acción NO se puede deshacer.'
    );

    if (!confirmed) return;

    // Double confirmation
    const doubleConfirm = window.confirm(
      '⚠️⚠️ ÚLTIMA CONFIRMACIÓN ⚠️⚠️\n\n' +
      'Se eliminarán TODOS los datos.\n\n' +
      '¿Realmente deseas continuar?'
    );

    if (!doubleConfirm) return;

    setIsResetting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/reset-db`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to reset database');
      }

      const data = await response.json();
      
      alert('✅ Base de datos reiniciada exitosamente!\n\nRecargando página...');
      
      // Reload page to refresh data
      window.location.reload();
    } catch (error) {
      console.error('Error resetting database:', error);
      alert('❌ Error al reiniciar la base de datos. Ver consola para detalles.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <header className="bg-white border-b-4 border-naturgy-orange shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Image
                src="/naturgy-logo.png"
                alt="Naturgy"
                width={150}
                height={50}
                className="h-14 w-auto"
                priority
              />
              <div className="hidden sm:block h-10 w-px bg-gray-300" />
              <h1 className="hidden sm:block text-xl font-bold text-naturgy-blue">
                Gestión de Rechazos
              </h1>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {/* Reset DB Button */}
              <button
                onClick={handleResetDatabase}
                disabled={isResetting}
                className="flex items-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm hover:shadow-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                title="Reiniciar Base de Datos"
              >
                <Database className="w-5 h-5" />
                <span className="hidden lg:inline">
                  {isResetting ? 'Reiniciando...' : 'Reset DB'}
                </span>
              </button>

              {/* Upload Button */}
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-naturgy-orange text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm hover:shadow-md font-semibold"
              >
                <Upload className="w-5 h-5" />
                <span className="hidden sm:inline">Cargar Excel</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Excel Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Cargar Casos desde Excel"
        size="large"
      >
        <ExcelUpload onSuccess={() => setIsUploadModalOpen(false)} />
      </Modal>
    </>
  );
}
