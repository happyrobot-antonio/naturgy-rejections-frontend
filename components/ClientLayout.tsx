'use client';

import { CasesProvider } from '@/lib/CasesContext';
import AuthWrapper from './AuthWrapper';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthWrapper>
      <CasesProvider>
        <div className="min-h-screen flex flex-col">
          {/* Main content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <p className="text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Naturgy. Todos los derechos reservados.
              </p>
            </div>
          </footer>
        </div>
      </CasesProvider>
    </AuthWrapper>
  );
}
