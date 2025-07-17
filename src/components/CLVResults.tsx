import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent, Target, Clock, Sparkles } from 'lucide-react';
import { CLVResults as CLVResultsType, Language, Theme } from '../types';
import { translations } from '../data/translations';
import { formatCurrency, formatPercentage, formatNumber } from '../utils/clvCalculations';

interface CLVResultsProps {
  results: CLVResultsType;
  language: Language;
  theme: Theme;
}

export const CLVResults: React.FC<CLVResultsProps> = ({ results, language, theme }) => {
  const t = translations[language];
  const isDark = theme === 'dark';

  const resultItems = [
    {
      label: t.results.churnAdjustedCLV,
      value: formatCurrency(results.churnAdjustedCLV),
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: isDark ? 'bg-gradient-to-br from-blue-900 to-blue-800' : 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      shadowColor: 'hover:shadow-blue-200'
    },
    {
      label: t.results.netChurnAdjustedCLV,
      value: formatCurrency(results.netChurnAdjustedCLV),
      icon: results.netChurnAdjustedCLV >= 0 ? TrendingUp : TrendingDown,
      color: results.netChurnAdjustedCLV >= 0 ? 'text-emerald-600' : 'text-red-600',
      bgColor: results.netChurnAdjustedCLV >= 0 
        ? (isDark ? 'bg-gradient-to-br from-emerald-900 to-green-800' : 'bg-gradient-to-br from-emerald-50 to-green-100')
        : (isDark ? 'bg-gradient-to-br from-red-900 to-pink-800' : 'bg-gradient-to-br from-red-50 to-pink-100'),
      borderColor: results.netChurnAdjustedCLV >= 0 ? 'border-emerald-200' : 'border-red-200',
      shadowColor: results.netChurnAdjustedCLV >= 0 ? 'hover:shadow-emerald-200' : 'hover:shadow-red-200'
    },
    {
      label: t.results.roi,
      value: formatPercentage(results.roi),
      icon: Percent,
      color: results.roi >= 100 ? 'text-emerald-600' : results.roi >= 50 ? 'text-yellow-600' : 'text-red-600',
      bgColor: results.roi >= 100 
        ? (isDark ? 'bg-gradient-to-br from-emerald-900 to-green-800' : 'bg-gradient-to-br from-emerald-50 to-green-100')
        : results.roi >= 50 
          ? (isDark ? 'bg-gradient-to-br from-yellow-900 to-amber-800' : 'bg-gradient-to-br from-yellow-50 to-amber-100')
          : (isDark ? 'bg-gradient-to-br from-red-900 to-pink-800' : 'bg-gradient-to-br from-red-50 to-pink-100'),
      borderColor: results.roi >= 100 ? 'border-emerald-200' : results.roi >= 50 ? 'border-yellow-200' : 'border-red-200',
      shadowColor: results.roi >= 100 ? 'hover:shadow-emerald-200' : results.roi >= 50 ? 'hover:shadow-yellow-200' : 'hover:shadow-red-200'
    },
    {
      label: t.results.paybackPeriod,
      value: `${formatNumber(results.paybackPeriod)} ${t.results.months}`,
      icon: Clock,
      color: results.paybackPeriod <= 3 ? 'text-emerald-600' : results.paybackPeriod <= 6 ? 'text-yellow-600' : 'text-red-600',
      bgColor: results.paybackPeriod <= 3 
        ? (isDark ? 'bg-gradient-to-br from-emerald-900 to-green-800' : 'bg-gradient-to-br from-emerald-50 to-green-100')
        : results.paybackPeriod <= 6 
          ? (isDark ? 'bg-gradient-to-br from-yellow-900 to-amber-800' : 'bg-gradient-to-br from-yellow-50 to-amber-100')
          : (isDark ? 'bg-gradient-to-br from-red-900 to-pink-800' : 'bg-gradient-to-br from-red-50 to-pink-100'),
      borderColor: results.paybackPeriod <= 3 ? 'border-emerald-200' : results.paybackPeriod <= 6 ? 'border-yellow-200' : 'border-red-200',
      shadowColor: results.paybackPeriod <= 3 ? 'hover:shadow-emerald-200' : results.paybackPeriod <= 6 ? 'hover:shadow-yellow-200' : 'hover:shadow-red-200'
    }
  ];

  return (
    <div className={`${
      isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
    } rounded-3xl shadow-2xl p-10 border relative overflow-hidden`}>
      <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full -translate-y-24 -translate-x-24 opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-blue-50 to-blue-100 rounded-full translate-y-20 translate-x-20 opacity-20"></div>
      
      <div className="relative z-10">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 rounded-2xl shadow-xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className={`text-4xl font-bold bg-gradient-to-r ${
              isDark ? 'from-white to-blue-200' : 'from-slate-800 to-blue-800'
            } bg-clip-text text-transparent`}>
              {t.results.title}
            </h3>
          </div>
          <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} text-lg`}>
            {language === 'en' ? 'Your customer lifetime value analysis' : 'Votre analyse de valeur vie client'}
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
                  <p className={`text-sm font-bold ${
                    isDark ? 'text-slate-300 group-hover:text-slate-200' : 'text-slate-600 group-hover:text-slate-700'
                  } mb-3 transition-colors`}>
                    {item.label}
                  </p>
                  <p className={`text-4xl font-bold ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                    {item.value}
                  </p>
                </div>
                <div className={`p-4 rounded-2xl ${
                  isDark ? 'bg-slate-700 bg-opacity-70 group-hover:bg-opacity-100' : 'bg-white bg-opacity-70 group-hover:bg-opacity-100'
                } transition-all duration-300 group-hover:scale-110`}>
                  <item.icon className={`w-10 h-10 ${item.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Business Insights */}
        <div className={`mt-10 p-8 ${
          results.netChurnAdjustedCLV > 0 
            ? (isDark ? 'bg-gradient-to-r from-emerald-900 to-green-800 border-emerald-700' : 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200')
            : (isDark ? 'bg-gradient-to-r from-red-900 to-pink-800 border-red-700' : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200')
        } border-2 rounded-3xl`}>
          <h4 className={`text-xl font-bold mb-4 ${
            results.netChurnAdjustedCLV > 0 ? 'text-emerald-700' : 'text-red-700'
          }`}>
            {t.insights.title}
          </h4>
          <p className={`text-lg font-semibold ${
            results.netChurnAdjustedCLV > 0 ? 'text-emerald-700' : 'text-red-700'
          }`}>
            {results.netChurnAdjustedCLV > 1000 
              ? t.insights.profitable
              : results.netChurnAdjustedCLV > 0 
                ? t.insights.marginal 
                : t.insights.unprofitable
            }
          </p>
        </div>
      </div>
    </div>
  );
};