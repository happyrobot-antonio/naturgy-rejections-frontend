'use client';

import { useState, useEffect } from 'react';
import { Clock, Mail, Phone, FileCheck, TrendingUp, MapPin } from 'lucide-react';
import TimePeriodSelector from './TimePeriodSelector';
import CaseTrendChart from './charts/CaseTrendChart';
import StatusDistributionChart from './charts/StatusDistributionChart';
import EventTypeBarChart from './charts/EventTypeBarChart';
import GeographicChart from './charts/GeographicChart';
import { analyticsApi, AnalyticsOverview, TrendData, DistributionData } from '@/lib/api';

export default function AnalyzeDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [distribution, setDistribution] = useState<DistributionData | null>(null);
  const [timePeriod, setTimePeriod] = useState<'7d' | '30d' | '90d'>('30d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, [timePeriod]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const [overviewData, trendsData, distributionData] = await Promise.all([
        analyticsApi.getOverview(),
        analyticsApi.getTrends(timePeriod),
        analyticsApi.getDistribution(),
      ]);
      setAnalytics(overviewData);
      setTrends(trendsData);
      setDistribution(distributionData);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Error al cargar las métricas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-naturgy-orange mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando métricas...</p>
        </div>
      </div>
    );
  }

  if (error || !analytics || !distribution) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600">{error || 'Error al cargar datos'}</p>
          <button
            onClick={loadAnalytics}
            className="mt-4 px-4 py-2 bg-naturgy-orange text-white rounded-lg hover:bg-orange-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <TimePeriodSelector value={timePeriod} onChange={setTimePeriod} />

      {/* Hero Metrics - 4 in a row - Corporate Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Horas Ahorradas */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:border-naturgy-orange transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Clock className="w-4 h-4 text-naturgy-orange" />
            </div>
            <div className="px-2 py-1 bg-orange-50 rounded text-xs font-medium text-naturgy-orange">
              {analytics.automation.automationRate}%
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-gray-600 text-xs font-medium uppercase tracking-wider">Tiempo Ahorrado</p>
            <p className="text-3xl font-bold text-gray-900">{analytics.automation.hoursSaved}h</p>
            <p className="text-xs text-gray-500">{analytics.automation.costSavings}€ estimados</p>
          </div>
        </div>

        {/* Casos Resueltos */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:border-naturgy-blue transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileCheck className="w-4 h-4 text-naturgy-blue" />
            </div>
            <div className="px-2 py-1 bg-blue-50 rounded text-xs font-medium text-naturgy-blue">
              {analytics.cases.resolutionRate}%
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-gray-600 text-xs font-medium uppercase tracking-wider">Casos Resueltos</p>
            <p className="text-3xl font-bold text-gray-900">{analytics.cases.total}</p>
            <p className="text-xs text-gray-500">{analytics.cases.resolved} completados</p>
          </div>
        </div>

        {/* Emails Enviados */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:border-gray-400 transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              <Mail className="w-4 h-4 text-gray-700" />
            </div>
            <div className="px-2 py-1 bg-gray-50 rounded text-xs font-medium text-gray-700">
              {analytics.communication.avgResponseTime}h
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-gray-600 text-xs font-medium uppercase tracking-wider">Emails Enviados</p>
            <p className="text-3xl font-bold text-gray-900">{analytics.communication.totalEmails.sent}</p>
            <p className="text-xs text-gray-500">{analytics.communication.totalEmails.received} recibidos</p>
          </div>
        </div>

        {/* Llamadas Totales */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:border-naturgy-orange transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Phone className="w-4 h-4 text-naturgy-orange" />
            </div>
            <div className="px-2 py-1 bg-orange-50 rounded text-xs font-medium text-naturgy-orange">
              {analytics.communication.callSuccessRate}%
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-gray-600 text-xs font-medium uppercase tracking-wider">Llamadas Totales</p>
            <p className="text-3xl font-bold text-gray-900">{analytics.communication.totalCalls.total}</p>
            <p className="text-xs text-gray-500">{analytics.communication.totalCalls.reached} contactados</p>
          </div>
        </div>
      </div>

      {/* Charts Section - Corporate Style */}
      <div className="grid grid-cols-2 gap-4">
        {/* Case Trend Chart */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-orange-50 rounded-lg">
              <TrendingUp className="w-4 h-4 text-naturgy-orange" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Tendencia de Casos</h3>
          </div>
          {trends.length > 0 ? (
            <CaseTrendChart data={trends} />
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
              No hay datos disponibles
            </div>
          )}
        </div>

        {/* Status Distribution Chart (Donut Chart) */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileCheck className="w-4 h-4 text-naturgy-blue" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Distribución de Estados</h3>
          </div>
          {analytics.cases.byStatus.length > 0 ? (
            <StatusDistributionChart data={analytics.cases.byStatus} />
          ) : (
            <div className="h-[380px] flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
              No hay datos disponibles
            </div>
          )}
        </div>

        {/* Event Types Bar Chart */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-gray-50 rounded-lg">
              <Mail className="w-4 h-4 text-gray-700" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Tipos de Eventos</h3>
          </div>
          {distribution.eventTypes.length > 0 ? (
            <EventTypeBarChart data={distribution.eventTypes} />
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
              No hay datos disponibles
            </div>
          )}
        </div>

        {/* Geographic Distribution Chart */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <MapPin className="w-4 h-4 text-naturgy-blue" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Distribución Geográfica</h3>
          </div>
          {distribution.geographic.length > 0 ? (
            <GeographicChart data={distribution.geographic} />
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
              No hay datos disponibles
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
