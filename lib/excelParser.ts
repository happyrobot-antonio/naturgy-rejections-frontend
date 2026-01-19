import * as XLSX from 'xlsx';
import { RejectionCase, CSV_COLUMN_MAPPING } from '@/types/case';

export interface ParseResult {
  success: boolean;
  data?: RejectionCase[];
  errors?: string[];
}

export function parseExcel(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          resolve({
            success: false,
            errors: ['No se pudo leer el archivo'],
          });
          return;
        }

        // Parse Excel file
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // Get first sheet
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          resolve({
            success: false,
            errors: ['El archivo Excel está vacío'],
          });
          return;
        }

        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON with header row
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (jsonData.length === 0) {
          resolve({
            success: false,
            errors: ['El archivo no contiene datos'],
          });
          return;
        }

        const errors: string[] = [];
        const cases: RejectionCase[] = [];

        jsonData.forEach((row: any, index: number) => {
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

        if (errors.length > 0 && cases.length === 0) {
          resolve({
            success: false,
            errors,
          });
        } else {
          resolve({
            success: true,
            data: cases,
            errors: errors.length > 0 ? errors : undefined,
          });
        }
      } catch (error) {
        resolve({
          success: false,
          errors: [`Error al procesar Excel: ${error instanceof Error ? error.message : 'Error desconocido'}`],
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        errors: ['Error al leer el archivo'],
      });
    };

    reader.readAsBinaryString(file);
  });
}

function mapRowToCase(row: Record<string, string>): RejectionCase {
  const mapped: any = {
    events: [], // Initialize empty events array
  };

  // Map Excel columns to RejectionCase properties
  Object.entries(CSV_COLUMN_MAPPING).forEach(([excelColumn, propertyName]) => {
    const value = row[excelColumn];
    
    if (value !== undefined && value !== null && value !== '') {
      mapped[propertyName] = String(value).trim();
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

export function exportToExcel(cases: RejectionCase[]): Blob {
  const headers = Object.keys(CSV_COLUMN_MAPPING);
  
  const rows = cases.map((caseItem) => {
    const row: Record<string, any> = {};
    Object.entries(CSV_COLUMN_MAPPING).forEach(([excelColumn, propertyName]) => {
      const value = (caseItem as any)[propertyName];
      row[excelColumn] = value || '';
    });
    return row;
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers });
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Casos Rechazo');

  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}
