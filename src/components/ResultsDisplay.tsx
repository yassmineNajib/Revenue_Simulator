import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent, Sparkles, Target } from 'lucide-react';
import { SimulationResults, Language } from '../types';
import { translations } from '../data/translations';
import { formatCurrency, formatPercentage } from '../utils/calculations';

interface ResultsDisplayProps {
  results: SimulationResults;
  language: Language;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, language }) => {
  const t = translations[language];

  const resultItems = [
    {
      label: t.results.grossRevenue,
      value: formatCurrency(results.grossRevenue),
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      shadowColor: 'hover:shadow-blue-200'
    },
    {
      label: t.results.netRevenue,
      value: formatCurrency(results.netRevenue),
      icon: results.netRevenue >= 0 ? TrendingUp : TrendingDown,
      color: results.netRevenue >= 0 ? 'text-emerald-600' : 'text-red-600',
      bgColor: results.netRevenue >= 0 ? 'bg-gradient-to-br from-emerald-50 to-green-100' : 'bg-gradient-to-br from-red-50 to-pink-100',
      borderColor: results.netRevenue >= 0 ? 'border-emerald-200' : 'border-red-200',
      shadowColor: results.netRevenue >= 0 ? 'hover:shadow-emerald-200' : 'hover:shadow-red-200'
    },
    {
      label: t.results.profitMargin,
      value: formatPercentage(results.profitMargin),
      icon: Percent,
      color: results.profitMargin >= 20 ? 'text-emerald-600' : results.profitMargin >= 10 ? 'text-yellow-600' : 'text-red-600',
      bgColor: results.profitMargin >= 20 ? 'bg-gradient-to-br from-emerald-50 to-green-100' : results.profitMargin >= 10 ? 'bg-gradient-to-br from-yellow-50 to-amber-100' : 'bg-gradient-to-br from-red-50 to-pink-100',
      borderColor: results.profitMargin >= 20 ? 'border-emerald-200' : results.profitMargin >= 10 ? 'border-yellow-200' : 'border-red-200',
      shadowColor: results.profitMargin >= 20 ? 'hover:shadow-emerald-200' : results.profitMargin >= 10 ? 'hover:shadow-yellow-200' : 'hover:shadow-red-200'
    },
    {
      label: t.results.monthlyProfit,
      value: formatCurrency(results.monthlyProfit),
      icon: results.monthlyProfit >= 0 ? Target : TrendingDown,
      color: results.monthlyProfit >= 0 ? 'text-emerald-600' : 'text-red-600',
      bgColor: results.monthlyProfit >= 0 ? 'bg-gradient-to-br from-emerald-50 to-green-100' : 'bg-gradient-to-br from-red-50 to-pink-100',
      borderColor: results.monthlyProfit >= 0 ? 'border-emerald-200' : 'border-red-200',
      shadowColor: results.monthlyProfit >= 0 ? 'hover:shadow-emerald-200' : 'hover:shadow-red-200'
    }
  ];

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-10 border border-slate-200 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full -translate-y-24 -translate-x-24 opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-blue-50 to-blue-100 rounded-full translate-y-20 translate-x-20 opacity-30"></div>
      
      <div className="relative z-10">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 rounded-2xl shadow-xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
              {t.results.title}
            </h3>
          </div>
          <p className="text-slate-600 text-lg">
            {language === 'en' ? 'Your personalized revenue analysis' : 'Votre analyse de revenus personnalisée'}
          </p>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resultItems.map((item, index) => (
            <div
              key={index}
              className={`p-8 rounded-3xl border-2 ${item.borderColor} ${item.bgColor} ${item.shadowColor} transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-3 hover:scale-105 cursor-pointer group`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-600 mb-3 group-hover:text-slate-700 transition-colors">
                    {item.label}
                  </p>
                  <p className={`text-4xl font-bold ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                    {item.value}
                  </p>
                </div>
                <div className={`p-4 rounded-2xl bg-white bg-opacity-70 group-hover:bg-opacity-100 transition-all duration-300 group-hover:scale-110`}>
                  <item.icon className={`w-10 h-10 ${item.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {results.netRevenue < 0 && (
          <div className="mt-10 p-8 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-3xl">
            <p className="text-red-700 text-lg font-semibold">
              ⚠️ {language === 'en' 
                ? 'Your current configuration shows a loss. Consider optimizing your conversion rate, increasing your average cart value, or reducing costs.'
                : 'Votre configuration actuelle montre une perte. Considérez optimiser votre taux de conversion, augmenter votre panier moyen, ou réduire les coûts.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};