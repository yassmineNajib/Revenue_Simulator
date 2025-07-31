import React from 'react';
import { TrendingUp, Users, Calculator, BarChart3 } from 'lucide-react';
import { Language } from '../types';

interface CalculatorSelectorProps {
  language: Language;
  onSelectCalculator: (type: 'revenue' | 'clv') => void;
}

export const CalculatorSelector: React.FC<CalculatorSelectorProps> = ({
  language,
  onSelectCalculator
}) => {
  const calculators = [
    {
      type: 'revenue' as const,
      title: language === 'en' ? 'Revenue Calculator' : 'Calculateur de Revenus',
      description: language === 'en' 
        ? 'Calculate monthly revenue based on visitors, conversion rates, and cart values'
        : 'Calculez les revenus mensuels basés sur les visiteurs, taux de conversion et valeur du panier',
      icon: TrendingUp,
      color: 'from-blue-600 to-blue-500',
      features: [
        language === 'en' ? 'Monthly revenue projection' : 'Projection de revenus mensuels',
        language === 'en' ? 'Profit margin analysis' : 'Analyse de marge bénéficiaire',
        language === 'en' ? 'Cost breakdown' : 'Répartition des coûts',
        language === 'en' ? 'Visual charts & reports' : 'Graphiques et rapports visuels'
      ]
    },
    {
      type: 'clv' as const,
      title: language === 'en' ? 'Customer Lifetime Value' : 'Valeur Vie Client (CLV)',
      description: language === 'en'
        ? 'Calculate the total value a customer brings to your business over their lifetime'
        : 'Calculez la valeur totale qu\'un client apporte à votre entreprise sur sa durée de vie',
      icon: Users,
      color: 'from-purple-600 to-purple-500',
      features: [
        language === 'en' ? 'Customer lifetime value' : 'Valeur vie client',
        language === 'en' ? 'Customer acquisition cost' : 'Coût d\'acquisition client',
        language === 'en' ? 'Retention analysis' : 'Analyse de rétention',
        language === 'en' ? 'ROI calculations' : 'Calculs de ROI'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="bg-gradient-to-r from-amber-600 to-amber-500 p-4 rounded-2xl shadow-xl">
              <Calculator className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-stone-800 to-amber-800 bg-clip-text text-transparent">
              Storeino Analytics
            </h1>
          </div>
          <h2 className="text-3xl font-bold text-stone-800 mb-4">
            {language === 'en' ? 'Choose Your Calculator' : 'Choisissez Votre Calculateur'}
          </h2>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            {language === 'en' 
              ? 'Select the type of analysis you want to perform with your store data'
              : 'Sélectionnez le type d\'analyse que vous souhaitez effectuer avec vos données de magasin'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {calculators.map((calc) => (
            <div
              key={calc.type}
              className="bg-white rounded-3xl shadow-2xl p-10 border border-stone-200 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer group"
              onClick={() => onSelectCalculator(calc.type)}
            >
              <div className="text-center mb-8">
                <div className={`bg-gradient-to-r ${calc.color} p-6 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <calc.icon className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-stone-800 mb-4">
                  {calc.title}
                </h3>
                <p className="text-stone-600 text-lg leading-relaxed">
                  {calc.description}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {calc.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${calc.color}`}></div>
                    <span className="text-stone-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full bg-gradient-to-r ${calc.color} hover:shadow-2xl text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 transform group-hover:scale-105`}>
                <BarChart3 className="w-6 h-6" />
                <span>
                  {language === 'en' ? 'Start Analysis' : 'Commencer l\'Analyse'}
                </span>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-stone-200 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-stone-800 mb-4">
              {language === 'en' ? 'Why Use Our Calculators?' : 'Pourquoi Utiliser Nos Calculateurs?'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-bold text-stone-700 mb-2">
                  {language === 'en' ? '📊 Data-Driven Insights' : '📊 Insights Basés sur les Données'}
                </h4>
                <p className="text-stone-600 text-sm">
                  {language === 'en' 
                    ? 'Make informed decisions based on your actual store performance'
                    : 'Prenez des décisions éclairées basées sur les performances réelles de votre magasin'
                  }
                </p>
              </div>
              <div>
                <h4 className="font-bold text-stone-700 mb-2">
                  {language === 'en' ? '🎯 Optimize Growth' : '🎯 Optimiser la Croissance'}
                </h4>
                <p className="text-stone-600 text-sm">
                  {language === 'en' 
                    ? 'Identify opportunities to increase revenue and customer value'
                    : 'Identifiez les opportunités d\'augmenter les revenus et la valeur client'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};