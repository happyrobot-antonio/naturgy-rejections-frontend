import Papa from 'papaparse';
import { RejectionCase, CSV_COLUMN_MAPPING } from '@/types/case';

export interface ParseResult {
  success: boolean;
  data?: RejectionCase[];
  errors?: string[];
}

export function parseCSV(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const errors: string[] = [];
          const cases: RejectionCase[] = [];

          results.data.forEach((row: any, index: number) => {
            try {
              const rejectionCase = mapRowToCase(row);
              
              // Validate required fields
              if (!rejectionCase.codigoSC) {
                errors.push(`Fila ${index + 2}: Código SC es requerido`);
                return;
              }
              
              cases.push(rejectionCase);
            } catch (error) {
              errors.push(`Fila ${index + 2}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
            }
          });

          if (errors.length > 0) {
            resolve({
              success: false,
              errors,
            });
          } else {
            resolve({
              success: true,
              data: cases,
            });
          }
        } catch (error) {
          resolve({
            success: false,
            errors: [`Error al procesar CSV: ${error instanceof Error ? error.message : 'Error desconocido'}`],
          });
        }
      },
      error: (error) => {
        resolve({
          success: false,
          errors: [`Error al leer el archivo: ${error.message}`],
        });
      },
    });
  });
}

function mapRowToCase(row: Record<string, string>): RejectionCase {
  const mapped: any = {
    events: [], // Initialize empty events array
  };

  // Map CSV columns to RejectionCase properties
  Object.entries(CSV_COLUMN_MAPPING).forEach(([csvColumn, propertyName]) => {
    const value = row[csvColumn];
    
    if (value !== undefined && value !== null && value.trim() !== '') {
      mapped[propertyName] = value.trim();
    } else {
      // Set default empty values for required fields
      if (propertyName === 'status') {
        mapped[propertyName] = 'In progress';
      } else if (propertyName === 'fechaPrimerContacto') {
        // Use current date if fechaPrimerContacto is empty
        mapped[propertyName] = new Date().toISOString();
      } else {
        mapped[propertyName] = '';
      }
    }
  });

  // Validate and normalize status
  const validStatuses = ['In progress', 'Revisar gestor', 'Cancelar SC'];
  if (mapped.status && !validStatuses.includes(mapped.status)) {
    mapped.status = 'In progress';
  }

  // Validate fechaPrimerContacto is a valid date
  if (mapped.fechaPrimerContacto) {
    const date = new Date(mapped.fechaPrimerContacto);
    if (isNaN(date.getTime())) {
      // If invalid date, use current date
      mapped.fechaPrimerContacto = new Date().toISOString();
    } else {
      // Ensure it's in ISO format
      mapped.fechaPrimerContacto = date.toISOString();
    }
  } else {
    mapped.fechaPrimerContacto = new Date().toISOString();
  }

  return mapped as RejectionCase;
}

export function exportToCSV(cases: RejectionCase[]): string {
  const headers = Object.keys(CSV_COLUMN_MAPPING);
  
  const rows = cases.map((caseItem) => {
    const row: string[] = [];
    Object.entries(CSV_COLUMN_MAPPING).forEach(([csvColumn, propertyName]) => {
      const value = (caseItem as any)[propertyName];
      row.push(value ? String(value) : '');
    });
    return row;
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}
