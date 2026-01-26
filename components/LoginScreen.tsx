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
    <>
      <style jsx global>{`
        @font-face {
          font-family: 'Suisse Intl';
          src: url('/fonts/SuisseIntl-Light.woff2') format('woff2');
          font-weight: 300;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Suisse Intl';
          src: url('/fonts/SuisseIntl-Regular.woff2') format('woff2');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Suisse Intl';
          src: url('/fonts/SuisseIntl-Semibold.woff2') format('woff2');
          font-weight: 600;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: 'Tobias';
          src: url('/fonts/Tobias-Regular.woff2') format('woff2');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
        .login-suisse {
          font-family: 'Suisse Intl', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .login-tobias {
          font-family: 'Tobias', Georgia, serif;
        }
      `}</style>

      <div className="login-suisse min-h-screen bg-white flex">
        {/* Left Panel - Black Background */}
        <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden">
          {/* Subtle grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}
          />
          
          {/* Orange accent line */}
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-naturgy-orange via-orange-500/50 to-transparent" />
          
          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between p-10 w-full">
            {/* Logo */}
            <div>
              <Image
                src="/naturgy-logo.png"
                alt="Naturgy"
                width={140}
                height={48}
                className="h-9 w-auto brightness-0 invert"
              />
            </div>
            
            {/* Center content */}
            <div className="space-y-4">
              <h1 className="login-tobias text-5xl text-white tracking-tight leading-tight">
                Gestión de<br />
                <span className="text-naturgy-orange">Rechazos</span>
              </h1>
              <p className="text-white/60 text-sm max-w-sm leading-relaxed">
                Monitorización y análisis de casos de rechazo en tiempo real
              </p>
            </div>
            
            {/* Footer */}
            <div className="flex items-center gap-3">
              <span className="text-white/40 text-xs uppercase tracking-widest">Powered by</span>
              <Image
                src="/happyrobot-logo.svg"
                alt="HappyRobot"
                width={90}
                height={18}
                className="h-3.5 w-auto brightness-0 invert opacity-60"
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
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

            {/* Form card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              {/* Form header */}
              <div className="mb-8 text-center">
                <h2 className="login-tobias text-3xl text-gray-900 mb-2">
                  Bienvenido
                </h2>
                <p className="text-gray-500 text-sm">
                  Introduce tu contraseña para continuar
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-naturgy-orange/20 focus:border-naturgy-orange transition-all bg-gray-50"
                    placeholder="••••••••••"
                    required
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-lg">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !password}
                  className="group w-full py-4 bg-naturgy-orange text-white font-semibold rounded-xl hover:bg-orange-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Verificando</span>
                    </>
                  ) : (
                    <>
                      <span>Acceder</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Desktop footer */}
            <p className="hidden lg:block mt-8 text-xs text-gray-400 text-center tracking-wide">
              Naturgy × HappyRobot
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
