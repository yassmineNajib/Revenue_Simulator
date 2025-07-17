import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, ComposedChart } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Users } from 'lucide-react';
import { CLVResults, CLVInputs, Language, Theme, CustomerSegment } from '../types';
import { translations } from '../data/translations';
import { formatCurrency, generateRevenueOverTime } from '../utils/clvCalculations';

interface CLVChartsProps {
  results: CLVResults;
  inputs: CLVInputs;
  segments: CustomerSegment[];
  language: Language;
  theme: Theme;
}

export const CLVCharts: React.FC<CLVChartsProps> = ({ results, inputs, segments, language, theme }) => {
  const t = translations[language];
  const isDark = theme === 'dark';

  // Generate revenue over time data
  const revenueData = generateRevenueOverTime(inputs, 24);

  // CLV vs CAC comparison data
  const comparisonData = [
    {
      name: t.charts.clv,
      value: results.churnAdjustedCLV,
      color: '#3B82F6'
    },
    {
      name: t.charts.cac,
      value: inputs.customerAcquisitionCost,
      color: '#EF4444'
    },
    {
      name: t.charts.profit,
      value: results.netChurnAdjustedCLV > 0 ? results.netChurnAdjustedCLV : 0,
      color: '#10B981'
    }
  ];

  // Segment comparison data
  const segmentData = segments.map(segment => ({
    name: segment.name,
    clv: segment.results.churnAdjustedCLV,
    cac: segment.inputs.customerAcquisitionCost,
    netClv: segment.results.netChurnAdjustedCLV,
    color: segment.color
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`${
          isDark ? 'bg-slate-800 border-slate-600' : 'bg-white border-blue-200'
        } p-4 border rounded-lg shadow-lg`}>
          <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="font-medium">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`${
      isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
    } rounded-3xl shadow-2xl p-10 border`}>
      <div className="text-center mb-10">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 rounded-2xl shadow-xl">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h3 className={`text-4xl font-bold bg-gradient-to-r ${
            isDark ? 'from-white to-blue-200' : 'from-slate-800 to-blue-800'
          } bg-clip-text text-transparent`}>
            {language === 'en' ? 'CLV Analytics' : 'Analyse CLV'}
          </h3>
        </div>
        <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} text-lg`}>
          {language === 'en' ? 'Visual insights into customer lifetime value' : 'Aperçus visuels de la valeur vie client'}
        </p>
      </div>

      <div className="space-y-12">
        {/* Revenue Over Time Chart */}
        <div className={`${
          isDark ? 'bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600' : 'bg-gradient-to-br from-blue-50 to-slate-50 border-blue-100'
        } rounded-2xl p-8 border`}>
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <h4 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {t.charts.revenueOverTime}
            </h4>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#475569' : '#E2E8F0'} />
                <XAxis 
                  dataKey="month" 
                  stroke={isDark ? '#94A3B8' : '#64748B'}
                  fontSize={12}
                  fontWeight={500}
                />
                <YAxis 
                  stroke={isDark ? '#94A3B8' : '#64748B'}
                  fontSize={12}
                  fontWeight={500}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="monthlyRevenue" 
                  fill="#3B82F6"
                  name={t.charts.revenue}
                  radius={[4, 4, 0, 0]}
                  opacity={0.7}
                />
                <Line 
                  type="monotone" 
                  dataKey="cumulativeRevenue" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  name={t.charts.cumulativeRevenue}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CLV vs CAC Comparison */}
        <div className={`${
          isDark ? 'bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600' : 'bg-gradient-to-br from-green-50 to-slate-50 border-green-100'
        } rounded-2xl p-8 border`}>
          <div className="flex items-center space-x-3 mb-6">
            <BarChart3 className="w-8 h-8 text-green-600" />
            <h4 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {t.charts.clvVsCac}
            </h4>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#475569' : '#E2E8F0'} />
                <XAxis 
                  dataKey="name" 
                  stroke={isDark ? '#94A3B8' : '#64748B'}
                  fontSize={12}
                  fontWeight={500}
                />
                <YAxis 
                  stroke={isDark ? '#94A3B8' : '#64748B'}
                  fontSize={12}
                  fontWeight={500}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  radius={[8, 8, 0, 0]}
                >
                  {comparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Segments Comparison */}
        {segments.length > 0 && (
          <div className={`${
            isDark ? 'bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600' : 'bg-gradient-to-br from-purple-50 to-slate-50 border-purple-100'
          } rounded-2xl p-8 border`}>
            <div className="flex items-center space-x-3 mb-6">
              <Users className="w-8 h-8 text-purple-600" />
              <h4 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {t.charts.segmentComparison}
              </h4>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={segmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#475569' : '#E2E8F0'} />
                  <XAxis 
                    dataKey="name" 
                    stroke={isDark ? '#94A3B8' : '#64748B'}
                    fontSize={12}
                    fontWeight={500}
                  />
                  <YAxis 
                    stroke={isDark ? '#94A3B8' : '#64748B'}
                    fontSize={12}
                    fontWeight={500}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="clv" 
                    fill="#8B5CF6"
                    name="CLV"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="cac" 
                    fill="#EF4444"
                    name="CAC"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-500 text-white p-6 rounded-2xl shadow-xl">
            <h5 className="text-lg font-bold mb-2">
              {language === 'en' ? 'Customer Value Score' : 'Score Valeur Client'}
            </h5>
            <p className="text-3xl font-bold">
              {results.churnAdjustedCLV > inputs.customerAcquisitionCost * 3 ? 'A+' : 
               results.churnAdjustedCLV > inputs.customerAcquisitionCost * 2 ? 'A' :
               results.churnAdjustedCLV > inputs.customerAcquisitionCost ? 'B' : 'C'}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-500 text-white p-6 rounded-2xl shadow-xl">
            <h5 className="text-lg font-bold mb-2">
              {language === 'en' ? 'Acquisition Efficiency' : 'Efficacité Acquisition'}
            </h5>
            <p className="text-3xl font-bold">
              {results.roi > 200 ? 'Excellent' : 
               results.roi > 100 ? 'Good' :
               results.roi > 0 ? 'Fair' : 'Poor'}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-500 text-white p-6 rounded-2xl shadow-xl">
            <h5 className="text-lg font-bold mb-2">
              {language === 'en' ? 'Retention Impact' : 'Impact Rétention'}
            </h5>
            <p className="text-3xl font-bold">
              {inputs.churnRate < 5 ? 'High' : 
               inputs.churnRate < 10 ? 'Medium' : 'Low'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};