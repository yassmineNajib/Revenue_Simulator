import React, { useState } from 'react';
import { Users, DollarSign, Calendar, TrendingUp, Calculator, RotateCcw } from 'lucide-react';
import { Language, MerchantData } from '../types';

interface CLVInputs {
  averageOrderValue: number;
  purchaseFrequency: number;
  customerLifespan: number;
  acquisitionCost: number;
  retentionRate: number;
}

interface CLVResults {
  customerLifetimeValue: number;
  customerEquity: number;
  returnOnInvestment: number;
  breakEvenPoint: number;
  annualValue: number;
}

interface CLVCalculatorProps {
  language: Language;
  merchant: MerchantData;
  onBack: () => void;
}

export const CLVCalculator: React.FC<CLVCalculatorProps> = ({
  language,
  merchant,
  onBack
}) => {
  const [inputs, setInputs] = useState<CLVInputs>({
    averageOrderValue: merchant.metrics.averageCartValue || 350,
    purchaseFrequency: merchant.metrics.averageOrderFrequency || 2.5,
    customerLifespan: merchant.metrics.customerLifespan || 18,
    acquisitionCost: 50,
    retentionRate: 75
  });

  const [results, setResults] = useState<CLVResults | null>(null);

  const calculateCLV = () => {
    const clv = inputs.averageOrderValue * inputs.purchaseFrequency * inputs.customerLifespan;
    const customerEquity = clv - inputs.acquisitionCost;
    const roi = ((customerEquity / inputs.acquisitionCost) * 100);
    const breakEven = inputs.acquisitionCost / (inputs.averageOrderValue * inputs.purchaseFrequency);
    const annualValue = inputs.averageOrderValue * inputs.purchaseFrequency * 12;

    setResults({
      customerLifetimeValue: clv,
      customerEquity: customerEquity,
      returnOnInvestment: roi,
      breakEvenPoint: breakEven,
      annualValue: annualValue
    });
  };

  const handleInputChange = (field: keyof CLVInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setInputs({
      averageOrderValue: merchant.metrics.averageCartValue || 350,
      purchaseFrequency: merchant.metrics.averageOrderFrequency || 2.5,
      customerLifespan: merchant.metrics.customerLifespan || 18,
      acquisitionCost: 50,
      retentionRate: 75
    });
    setResults(null);
  };

  const formatCurrency = (amount: number) => {
    return `${Math.round(amount).toLocaleString()} MAD`;
  };

  const inputFields = [
    {
      key: 'averageOrderValue' as keyof CLVInputs,
      label: language === 'en' ? 'Average Order Value (MAD)' : 'Valeur Moyenne Commande (MAD)',
      placeholder: '350'
    },
    {
      key: 'purchaseFrequency' as keyof CLVInputs,
      label: language === 'en' ? 'Purchase Frequency (per year)' : 'Fréquence d\'Achat (par an)',
      placeholder: '2.5',
      step: 0.1
    },
    {
      key: 'customerLifespan' as keyof CLVInputs,
      label: language === 'en' ? 'Customer Lifespan (months)' : 'Durée de Vie Client (mois)',
      placeholder: '18'
    },
    {
      key: 'acquisitionCost' as keyof CLVInputs,
      label: language === 'en' ? 'Customer Acquisition Cost (MAD)' : 'Coût d\'Acquisition Client (MAD)',
      placeholder: '50'
    },
    {
      key: 'retentionRate' as keyof CLVInputs,
      label: language === 'en' ? 'Customer Retention Rate (%)' : 'Taux de Rétention Client (%)',
      placeholder: '75'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <button
            onClick={onBack}
            className="mb-6 bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
          >
            ← {language === 'en' ? 'Back to Calculator Selection' : 'Retour à la Sélection'}
          </button>
          
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-purple-500 p-4 rounded-2xl shadow-xl">
              <Users className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-purple-800 bg-clip-text text-transparent">
              {language === 'en' ? 'Customer Lifetime Value' : 'Valeur Vie Client'}
            </h1>
          </div>
          <p className="text-xl text-slate-600">
            {language === 'en' 
              ? 'Calculate the total value each customer brings to your business'
              : 'Calculez la valeur totale que chaque client apporte à votre entreprise'
            }
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 mb-12 border border-slate-200">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-slate-800 mb-4">
              {language === 'en' ? 'Customer Metrics' : 'Métriques Client'}
            </h3>
            <p className="text-slate-600">
              {language === 'en' 
                ? 'Enter your customer behavior data (pre-filled from your store)'
                : 'Entrez vos données de comportement client (pré-remplies depuis votre magasin)'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {inputFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="block text-sm font-bold text-slate-700">
                  {field.label}
                </label>
                <input
                  type="number"
                  value={inputs[field.key] || ''}
                  onChange={(e) => handleInputChange(field.key, parseFloat(e.target.value) || 0)}
                  placeholder={field.placeholder}
                  step={field.step || 1}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-300"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={calculateCLV}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <Calculator className="w-6 h-6" />
              <span>{language === 'en' ? 'Calculate CLV' : 'Calculer CLV'}</span>
            </button>
            <button
              onClick={handleReset}
              className="flex-1 sm:flex-none bg-slate-200 hover:bg-slate-300 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3"
            >
              <RotateCcw className="w-6 h-6" />
              <span>{language === 'en' ? 'Reset' : 'Réinitialiser'}</span>
            </button>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-slate-200">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-slate-800 mb-4">
                {language === 'en' ? 'CLV Analysis Results' : 'Résultats Analyse CLV'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-8 h-8 text-purple-600" />
                  <span className="text-2xl font-bold text-purple-600">
                    {formatCurrency(results.customerLifetimeValue)}
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 mb-2">
                  {language === 'en' ? 'Customer Lifetime Value' : 'Valeur Vie Client'}
                </h4>
                <p className="text-slate-600 text-sm">
                  {language === 'en' 
                    ? 'Total revenue expected from a customer'
                    : 'Revenus totaux attendus d\'un client'
                  }
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(results.customerEquity)}
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 mb-2">
                  {language === 'en' ? 'Customer Equity' : 'Équité Client'}
                </h4>
                <p className="text-slate-600 text-sm">
                  {language === 'en' 
                    ? 'CLV minus acquisition cost'
                    : 'CLV moins le coût d\'acquisition'
                  }
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <Calendar className="w-8 h-8 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-600">
                    {results.returnOnInvestment.toFixed(1)}%
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 mb-2">
                  {language === 'en' ? 'ROI on Acquisition' : 'ROI sur Acquisition'}
                </h4>
                <p className="text-slate-600 text-sm">
                  {language === 'en' 
                    ? 'Return on customer acquisition investment'
                    : 'Retour sur investissement d\'acquisition client'
                  }
                </p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl border border-yellow-200">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="w-8 h-8 text-yellow-600" />
                  <span className="text-2xl font-bold text-yellow-600">
                    {results.breakEvenPoint.toFixed(1)} {language === 'en' ? 'months' : 'mois'}
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 mb-2">
                  {language === 'en' ? 'Break-Even Point' : 'Seuil de Rentabilité'}
                </h4>
                <p className="text-slate-600 text-sm">
                  {language === 'en' 
                    ? 'Time to recover acquisition cost'
                    : 'Temps pour récupérer le coût d\'acquisition'
                  }
                </p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl border border-indigo-200">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 text-indigo-600" />
                  <span className="text-2xl font-bold text-indigo-600">
                    {formatCurrency(results.annualValue)}
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 mb-2">
                  {language === 'en' ? 'Annual Customer Value' : 'Valeur Client Annuelle'}
                </h4>
                <p className="text-slate-600 text-sm">
                  {language === 'en' 
                    ? 'Expected revenue per customer per year'
                    : 'Revenus attendus par client par an'
                  }
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border border-red-200">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-red-600" />
                  <span className="text-2xl font-bold text-red-600">
                    {inputs.retentionRate}%
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 mb-2">
                  {language === 'en' ? 'Retention Rate' : 'Taux de Rétention'}
                </h4>
                <p className="text-slate-600 text-sm">
                  {language === 'en' 
                    ? 'Percentage of customers retained'
                    : 'Pourcentage de clients retenus'
                  }
                </p>
              </div>
            </div>

            {/* Insights */}
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200">
              <h4 className="font-bold text-slate-800 mb-4">
                {language === 'en' ? '💡 Key Insights' : '💡 Insights Clés'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-700">
                    <strong>{language === 'en' ? 'Acquisition Budget:' : 'Budget d\'Acquisition:'}</strong> {' '}
                    {language === 'en' 
                      ? `You can spend up to ${formatCurrency(results.customerEquity * 0.3)} per customer acquisition while maintaining profitability.`
                      : `Vous pouvez dépenser jusqu'à ${formatCurrency(results.customerEquity * 0.3)} par acquisition client tout en maintenant la rentabilité.`
                    }
                  </p>
                </div>
                <div>
                  <p className="text-slate-700">
                    <strong>{language === 'en' ? 'Growth Opportunity:' : 'Opportunité de Croissance:'}</strong> {' '}
                    {results.returnOnInvestment > 200 
                      ? (language === 'en' ? 'Excellent ROI! Consider increasing marketing spend.' : 'Excellent ROI! Considérez augmenter les dépenses marketing.')
                      : (language === 'en' ? 'Focus on improving retention and order frequency.' : 'Concentrez-vous sur l\'amélioration de la rétention et de la fréquence des commandes.')
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};