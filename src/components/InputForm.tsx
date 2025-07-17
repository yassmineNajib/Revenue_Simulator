import React from 'react';
import { Calculator, RotateCcw, ChevronDown, Zap } from 'lucide-react';
import { SimulationInputs, Language } from '../types';
import { translations } from '../data/translations';
import { storeinoPlans } from '../data/plans';

interface InputFormProps {
  inputs: SimulationInputs;
  onInputChange: (field: keyof SimulationInputs, value: number) => void;
  onCalculate: () => void;
  onReset: () => void;
  language: Language;
}

export const InputForm: React.FC<InputFormProps> = ({
  inputs,
  onInputChange,
  onCalculate,
  onReset,
  language
}) => {
  const t = translations[language];

  const inputFields = [
    {
      key: 'monthlyVisitors' as keyof SimulationInputs,
      label: t.form.monthlyVisitors,
      placeholder: t.placeholders.monthlyVisitors,
      required: true
    },
    {
      key: 'conversionRate' as keyof SimulationInputs,
      label: t.form.conversionRate,
      placeholder: t.placeholders.conversionRate,
      required: true,
      step: 0.1
    },
    {
      key: 'averageCartValue' as keyof SimulationInputs,
      label: t.form.averageCartValue,
      placeholder: t.placeholders.averageCartValue,
      required: true
    },
    {
      key: 'storeinoFees' as keyof SimulationInputs,
      label: t.form.storeinoFees,
      placeholder: 'Select a plan',
      required: true,
      isSelect: true
    },
    {
      key: 'otherCosts' as keyof SimulationInputs,
      label: t.form.otherCosts,
      placeholder: t.placeholders.otherCosts,
      required: false
    }
  ];

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-10 border border-slate-200 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full -translate-y-20 translate-x-20 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-50 to-blue-100 rounded-full translate-y-16 -translate-x-16 opacity-50"></div>
      
      <div className="relative z-10">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-3 rounded-xl">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
              {language === 'en' ? 'Revenue Calculator' : 'Calculateur de Revenus'}
            </h3>
          </div>
          <p className="text-slate-600 text-lg">
            {language === 'en' ? 'Enter your business metrics to calculate potential revenue' : 'Entrez vos métriques business pour calculer vos revenus potentiels'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {inputFields.map((field) => (
            <div key={field.key} className="space-y-3 group">
              <label className="block text-sm font-bold text-slate-700 group-hover:text-blue-700 transition-colors duration-200">
                {field.label}
                {field.required && <span className="text-blue-500 ml-1">*</span>}
              </label>
              {field.isSelect ? (
                <div className="relative">
                  <select
                    value={inputs[field.key] || ''}
                    onChange={(e) => onInputChange(field.key, parseFloat(e.target.value) || 0)}
                    className="w-full px-6 py-4 border-2 border-slate-300 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-slate-50 hover:bg-white hover:border-blue-400 text-slate-800 appearance-none cursor-pointer font-medium shadow-sm hover:shadow-md"
                  >
                    <option value="">{field.placeholder}</option>
                    {Object.entries(storeinoPlans).map(([key, plan]) => (
                      <option key={key} value={plan.price}>
                        {plan.name} - {plan.price} MAD/month
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-500 pointer-events-none" />
                </div>
              ) : (
                <input
                  type="number"
                  value={inputs[field.key] || ''}
                  onChange={(e) => onInputChange(field.key, parseFloat(e.target.value) || 0)}
                  placeholder={field.placeholder}
                  step={field.step || 1}
                  className="w-full px-6 py-4 border-2 border-slate-300 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-slate-50 hover:bg-white hover:border-blue-400 text-slate-800 placeholder-slate-500 font-medium shadow-sm hover:shadow-md"
                />
              )}
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
            onClick={onReset}
            className="flex-1 sm:flex-none bg-gradient-to-r from-slate-200 to-slate-300 hover:from-slate-300 hover:to-slate-400 text-slate-700 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-4 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
          >
            <RotateCcw className="w-7 h-7" />
            <span>{t.form.reset}</span>
          </button>
        </div>
      </div>
    </div>
  );
};