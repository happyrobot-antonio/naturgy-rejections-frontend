'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Loader2, ArrowRight } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface LoginScreenProps {
  onSuccess: () => void;
}

export default function LoginScreen({ onSuccess }: LoginScreenProps) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        localStorage.setItem('dashboard_auth', password);
        onSuccess();
      } else {
        setError('Contraseña incorrecta');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Orange accent line */}
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-naturgy-orange via-orange-500 to-transparent" />
        
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div>
            <Image
              src="/naturgy-logo.png"
              alt="Naturgy"
              width={140}
              height={48}
              className="h-10 w-auto brightness-0 invert"
            />
          </div>
          
          {/* Center content */}
          <div className="space-y-6">
            <h1 className="text-4xl font-light text-white tracking-tight">
              Gestión de<br />
              <span className="font-semibold">Rechazos</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              Monitorización y análisis de casos de rechazo en tiempo real.
            </p>
          </div>
          
          {/* Footer */}
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-xs uppercase tracking-wider">Powered by</span>
            <Image
              src="/happyrobot-logo.svg"
              alt="HappyRobot"
              width={100}
              height={20}
              className="h-4 w-auto brightness-0 invert opacity-60"
            />
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
            <Image
              src="/naturgy-logo.png"
              alt="Naturgy"
              width={100}
              height={32}
              className="h-8 w-auto"
            />
            <span className="text-gray-200 text-2xl font-extralight">|</span>
            <Image
              src="/happyrobot-logo.svg"
              alt="HappyRobot"
              width={100}
              height={20}
              className="h-5 w-auto"
            />
          </div>

          {/* Form header */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">
              Acceder
            </h2>
            <p className="text-gray-500 text-sm">
              Introduce tu contraseña para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-0 py-3 border-0 border-b-2 border-gray-200 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-naturgy-orange transition-colors bg-transparent text-lg"
                placeholder="••••••••••"
                required
                autoFocus
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 flex items-center gap-2">
                <span className="w-1 h-1 bg-red-500 rounded-full" />
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || !password}
              className="group w-full py-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verificando</span>
                </>
              ) : (
                <>
                  <span>Continuar</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Desktop footer */}
          <p className="hidden lg:block mt-12 text-xs text-gray-300 text-center">
            Naturgy × HappyRobot
          </p>
        </div>
      </div>
    </div>
  );
}
