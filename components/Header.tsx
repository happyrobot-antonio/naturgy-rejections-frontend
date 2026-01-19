'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload } from 'lucide-react';
import Modal from './Modal';
import ExcelUpload from './ExcelUpload';

export default function Header() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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
