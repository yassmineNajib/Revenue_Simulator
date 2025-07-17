import React from 'react';
import { Calculator, RotateCcw, Users, Plus } from 'lucide-react';
import { CLVInputs, Language, Theme } from '../types';
import { translations } from '../data/translations';

interface CLVInputFormProps {
  inputs: CLVInputs;
  onInputChange: (field: keyof CLVInputs, value: number) => void;
  onCalculate: () => void;
  onReset: () => void;
  onAddSegment: () => void;
  language: Language;
  theme: Theme;
}

export const CLVInputForm: React.FC<CLVInputFormProps> = ({
  inputs,
  onInputChange,
  onCalculate,
  onReset,
  onAddSegment,
  language,
  theme
}) => {
  const t = translations[language];
  const isDark = theme === 'dark';

  const inputFields = [
    {
      key: 'averageOrderValue' as keyof CLVInputs,
      label: t.form.averageOrderValue,
      placeholder: t.placeholders.averageOrderValue,
      required: true,
      step: 1
    },
    {
      key: 'purchaseFrequency' as keyof CLVInputs,
      label: t.form.purchaseFrequency,
      placeholder: t.placeholders.purchaseFrequency,
      required: true,
      step: 0.1
    },
    {
      key: 'customerLifespan' as keyof CLVInputs,
      label: t.form.customerLifespan,
      placeholder: t.placeholders.customerLifespan,
      required: true,
      step: 1
    },
    {
      key: 'customerAcquisitionCost' as keyof CLVInputs,
      label: t.form.customerAcquisitionCost,
      placeholder: t.placeholders.customerAcquisitionCost,
      required: true,
      step: 1
    },
    {
      key: 'churnRate' as keyof CLVInputs,
      label: t.form.churnRate,
      placeholder: t.placeholders.churnRate,
      required: false,
      step: 0.1
    }
  ];

  return (
    <div className={`${
      isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
    } rounded-3xl shadow-2xl p-10 border relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full -translate-y-20 translate-x-20 opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-50 to-blue-100 rounded-full translate-y-16 -translate-x-16 opacity-30"></div>
      
      <div className="relative z-10">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-3 rounded-xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className={`text-4xl font-bold bg-gradient-to-r ${
              isDark ? 'from-white to-blue-200' : 'from-slate-800 to-blue-800'
            } bg-clip-text text-transparent`}>
              {language === 'en' ? 'CLV Calculator' : 'Calculateur CLV'}
            </h3>
          </div>
          <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} text-lg`}>
            {language === 'en' 
              ? 'Enter your customer metrics to calculate lifetime value' 
              : 'Entrez vos métriques clients pour calculer la valeur vie'
            }
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {inputFields.map((field) => (
            <div key={field.key} className="space-y-3 group">
              <label className={`block text-sm font-bold ${
                isDark ? 'text-slate-300 group-hover:text-blue-400' : 'text-slate-700 group-hover:text-blue-700'
              } transition-colors duration-200`}>
                {field.label}
                {field.required && <span className="text-blue-500 ml-1">*</span>}
              </label>
              <input
                type="number"
                value={inputs[field.key] || ''}
                onChange={(e) => onInputChange(field.key, parseFloat(e.target.value) || 0)}
                placeholder={field.placeholder}
                step={field.step || 1}
                className={`w-full px-6 py-4 border-2 ${
                  isDark 
                    ? 'border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:border-blue-400 hover:border-slate-500' 
                    : 'border-slate-300 bg-slate-50 text-slate-800 placeholder-slate-500 focus:border-blue-500 hover:border-blue-400'
                } rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all duration-300 hover:bg-opacity-80 font-medium shadow-sm hover:shadow-md`}
              />
            </div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 mt-12">
          <button
            onClick={onCalculate}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-4 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 border border-blue-400"
          >
            <Calculator className="w-7 h-7" />
            <span>{t.form.calculate}</span>
          </button>
          <button
            onClick={onAddSegment}
            className="flex-1 sm:flex-none bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-4 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-7 h-7" />
            <span>{t.form.addSegment}</span>
          </button>
          <button
            onClick={onReset}
            className={`flex-1 sm:flex-none bg-gradient-to-r ${
              isDark 
                ? 'from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white' 
                : 'from-slate-200 to-slate-300 hover:from-slate-300 hover:to-slate-400 text-slate-700'
            } px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-4 transform hover:-translate-y-1 shadow-lg hover:shadow-xl`}
          >
            <RotateCcw className="w-7 h-7" />
            <span>{t.form.reset}</span>
          </button>
        </div>
      </div>
    </div>
  );
};