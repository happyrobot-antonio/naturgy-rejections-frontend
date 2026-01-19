'use client';

import { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { parseExcel } from '@/lib/excelParser';
import { useCases } from '@/lib/CasesContext';
import { RejectionCase } from '@/types/case';
import ExcelPreview from './ExcelPreview';

interface ExcelUploadProps {
  onSuccess?: () => void;
}

export default function ExcelUpload({ onSuccess }: ExcelUploadProps) {
  const { cases, addCase, refreshCases } = useCases();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [parsedCases, setParsedCases] = useState<RejectionCase[] | null>(null);
  const [duplicateCodigoSCs, setDuplicateCodigoSCs] = useState<Set<string>>(new Set());
  const [isImporting, setIsImporting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setUploadStatus({
        type: 'error',
        message: 'Por favor, selecciona un archivo Excel válido (.xlsx o .xls)',
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);
    setParsedCases(null);
    setDuplicateCodigoSCs(new Set());

    try {
      const result = await parseExcel(file);

      if (result.success && result.data) {
        // Check for duplicates against existing cases
        const existingCodigoSCs = new Set(cases.map(c => c.codigoSC));
        const duplicates = new Set<string>();
        
        result.data.forEach(parsedCase => {
          if (existingCodigoSCs.has(parsedCase.codigoSC)) {
            duplicates.add(parsedCase.codigoSC);
          }
        });

        setDuplicateCodigoSCs(duplicates);
        setParsedCases(result.data);
      } else if (result.errors) {
        setUploadStatus({
          type: 'error',
          message: `Errores en el Excel:\n${result.errors.slice(0, 5).join('\n')}${
            result.errors.length > 5 ? '\n...' : ''
          }`,
        });
      }
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: `Error al procesar el archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      });
    } finally {
      setIsUploading(false);
    }
  }, [cases]);

  const handleConfirmImport = useCallback(async (selectedCases: RejectionCase[]) => {
    setIsImporting(true);
    setUploadStatus(null);

    try {
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      for (const caseItem of selectedCases) {
        try {
          await addCase(caseItem);
          successCount++;
        } catch (error) {
          errorCount++;
          errors.push(`${caseItem.codigoSC}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
      }

      // Refresh the cases list
      await refreshCases();

      if (errorCount === 0) {
        setUploadStatus({
          type: 'success',
          message: `${successCount} casos importados correctamente`,
        });
        setParsedCases(null);
        setDuplicateCodigoSCs(new Set());
        // Call onSuccess callback after a short delay to show the success message
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 2000);
        }
      } else {
        setUploadStatus({
          type: 'error',
          message: `${successCount} casos importados, ${errorCount} errores:\n${errors.slice(0, 5).join('\n')}${
            errors.length > 5 ? '\n...' : ''
          }`,
        });
        setParsedCases(null);
        setDuplicateCodigoSCs(new Set());
      }
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: `Error al importar casos: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      });
    } finally {
      setIsImporting(false);
    }
  }, [addCase, refreshCases, onSuccess]);

  const handleCancelImport = useCallback(() => {
    setParsedCases(null);
    setDuplicateCodigoSCs(new Set());
    setUploadStatus(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  // Show preview if we have parsed cases
  if (parsedCases) {
    return (
      <ExcelPreview
        cases={parsedCases}
        duplicateCodigoSCs={duplicateCodigoSCs}
        onConfirm={handleConfirmImport}
        onCancel={handleCancelImport}
        isImporting={isImporting}
      />
    );
  }

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${isDragging
            ? 'border-naturgy-orange bg-orange-50 scale-105'
            : 'border-gray-300 bg-white hover:border-naturgy-orange hover:bg-orange-50'
          }
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />

        <div className="flex flex-col items-center space-y-4">
          <div className={`p-4 rounded-full ${isDragging ? 'bg-naturgy-orange' : 'bg-gray-100'}`}>
            {isUploading ? (
              <div className="w-12 h-12 border-4 border-naturgy-orange border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className={`w-12 h-12 ${isDragging ? 'text-white' : 'text-naturgy-orange'}`} />
            )}
          </div>

          <div>
            <p className="text-lg font-semibold text-gray-700">
              {isUploading ? 'Procesando archivo...' : 'Arrastra un archivo Excel aquí'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              o haz clic para seleccionar un archivo
            </p>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <FileText className="w-4 h-4" />
            <span>Solo archivos .xlsx o .xls</span>
          </div>
        </div>
      </div>

      {uploadStatus && (
        <div
          className={`
            mt-4 p-4 rounded-lg border flex items-start space-x-3
            ${uploadStatus.type === 'success'
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
            }
          `}
        >
          {uploadStatus.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className={`font-medium ${uploadStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {uploadStatus.type === 'success' ? '¡Éxito!' : 'Error'}
            </p>
            <p className={`text-sm mt-1 whitespace-pre-line ${uploadStatus.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
              {uploadStatus.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
