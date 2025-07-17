import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { SimulationResults, Language } from '../types';
import { translations } from '../data/translations';
import { formatCurrency, generateRevenueProjection } from '../utils/calculations';

interface RevenueChartProps {
  results: SimulationResults;
  language: Language;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ results, language }) => {
  const t = translations[language];

  // Generate 12 months of projected data
  const monthlyData = generateRevenueProjection(results, 12);

  // Profitability breakdown data
  const profitabilityData = [
    {
      name: language === 'en' ? 'Revenue' : 'Revenus',
      value: results.grossRevenue,
      color: '#3B82F6'
    },
    {
      name: language === 'en' ? 'Costs' : 'Coûts',
      value: results.grossRevenue - results.netRevenue,
      color: '#EF4444'
    },
    {
      name: language === 'en' ? 'Profit' : 'Bénéfice',
      value: results.monthlyProfit > 0 ? results.monthlyProfit : 0,
      color: '#10B981'
    }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-blue-200 rounded-lg shadow-lg">
          <p className="font-semibold text-slate-800 text-sm">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="font-medium text-xs">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-200">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-3 rounded-2xl shadow-xl">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
            {language === 'en' ? 'Revenue Analytics' : 'Analyse des Revenus'}
          </h3>
        </div>
        <p className="text-slate-600">
          {language === 'en' ? 'Visual insights into your business performance' : 'Aperçus visuels de la performance de votre entreprise'}
        </p>
      </div>

      {/* Compact Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        
        {/* Revenue Growth Chart */}
        <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h4 className="text-lg font-bold text-slate-800">
              {language === 'en' ? '12-Month Projection' : 'Projection 12 Mois'}
            </h4>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748B"
                  fontSize={10}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  stroke="#64748B"
                  fontSize={10}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="grossRevenue" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name={language === 'en' ? 'Gross Revenue' : 'Revenus Bruts'}
                  dot={{ fill: '#3B82F6', strokeWidth: 1, r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="netRevenue" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name={language === 'en' ? 'Net Revenue' : 'Revenus Nets'}
                  dot={{ fill: '#10B981', strokeWidth: 1, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Profit Bar Chart */}
        <div className="bg-gradient-to-br from-green-50 to-slate-50 rounded-2xl p-6 border border-green-100">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-6 h-6 text-green-600" />
            <h4 className="text-lg font-bold text-slate-800">
              {language === 'en' ? 'Monthly Profit' : 'Bénéfice Mensuel'}
            </h4>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData.slice(0, 6)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748B"
                  fontSize={10}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  stroke="#64748B"
                  fontSize={10}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="profit" 
                  fill="#10B981"
                  name={language === 'en' ? 'Monthly Profit' : 'Bénéfice Mensuel'}
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Breakdown Pie Chart */}
        <div className="bg-gradient-to-br from-purple-50 to-slate-50 rounded-2xl p-6 border border-purple-100">
          <div className="flex items-center space-x-2 mb-4">
            <PieChartIcon className="w-6 h-6 text-purple-600" />
            <h4 className="text-lg font-bold text-slate-800">
              {language === 'en' ? 'Revenue Breakdown' : 'Répartition Revenus'}
            </h4>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={profitabilityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={false}
                >
                  {profitabilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {profitabilityData.map((entry, index) => (
              <div key={index} className="flex items-center space-x-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-xs text-slate-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compact Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-500 text-white p-4 rounded-2xl shadow-lg">
          <h5 className="text-sm font-bold mb-1">
            {language === 'en' ? 'Annual Revenue Projection' : 'Projection Annuelle'}
          </h5>
          <p className="text-2xl font-bold">
            {formatCurrency(results.grossRevenue * 12 * 1.3)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-500 text-white p-4 rounded-2xl shadow-lg">
          <h5 className="text-sm font-bold mb-1">
            {language === 'en' ? 'Break-even Status' : 'Seuil de Rentabilité'}
          </h5>
          <p className="text-2xl font-bold">
            {results.monthlyProfit > 0 ? 
              (language === 'en' ? 'Achieved' : 'Atteint') : 
              (language === 'en' ? 'Not Reached' : 'Non Atteint')
            }
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-purple-500 text-white p-4 rounded-2xl shadow-lg">
          <h5 className="text-sm font-bold mb-1">
            {language === 'en' ? 'ROI Potential' : 'Potentiel ROI'}
          </h5>
          <p className="text-2xl font-bold">
            {results.profitMargin > 0 ? `${results.profitMargin.toFixed(1)}%` : '0%'}
          </p>
        </div>
      </div>
    </div>
  );
};