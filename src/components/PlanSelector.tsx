import React from 'react';
import { Check, Star } from 'lucide-react';
import { storeinoPlans } from '../data/plans';
import { Language } from '../types';
import { translations } from '../data/translations';

interface PlanSelectorProps {
  selectedPlan: string;
  onPlanSelect: (planKey: string, price: number) => void;
  language: Language;
}

export const PlanSelector: React.FC<PlanSelectorProps> = ({
  selectedPlan,
  onPlanSelect,
  language
}) => {
  const t = translations[language];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-stone-200">
      <h3 className="text-2xl font-bold text-stone-800 mb-6 text-center">
        {t.plans.title}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(storeinoPlans).map(([key, plan]) => (
          <div
            key={key}
            className={`relative p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer transform hover:-translate-y-1 ${
              selectedPlan === key
                ? 'border-stone-800 bg-stone-50 shadow-lg'
                : 'border-stone-200 hover:border-stone-400 hover:shadow-md'
            }`}
            onClick={() => onPlanSelect(key, plan.price)}
          >
            {key === 'professional' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-stone-800 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                  <Star className="w-3 h-3" />
                  <span>Popular</span>
                </div>
              </div>
            )}
            
            <div className="text-center mb-4">
              <h4 className="text-xl font-bold text-stone-800 mb-2">{plan.name}</h4>
              <div className="text-3xl font-bold text-stone-800">
                {plan.price} <span className="text-sm font-normal text-stone-600">MAD/mois</span>
              </div>
            </div>
            
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2 text-sm text-stone-600">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <button
              className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
                selectedPlan === key
                  ? 'bg-stone-800 text-white'
                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
              }`}
            >
              {selectedPlan === key ? '✓ Selected' : t.plans.selectPlan}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};